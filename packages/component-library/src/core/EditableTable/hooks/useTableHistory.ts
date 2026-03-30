import { useRef, useCallback, useState } from 'react';
import { EditableTableData } from '../types';

// ─── Entry types ─────────────────────────────────────────────────────────────

type CellEditEntry<TData> = {
    type: 'cell_edit';
    rowId: string;
    /** The column that was edited */
    columnId: string;
    /** Cell value BEFORE the edit – used to revert tableData */
    prevValue: any;
    /** Cell value AFTER the edit – used to redo in tableData */
    nextValue: any;
    /** Snapshot of editedRows[rowId] BEFORE the change (undefined means the row had no pending edits) */
    prevRowEdits: TData | undefined;
    /** Snapshot of editedRows[rowId] AFTER the change */
    nextRowEdits: TData;
    /** Validation error for this cell BEFORE the edit (undefined = no error) */
    prevError: string | undefined;
    /** Validation error for this cell AFTER the edit (undefined = no error) */
    nextError: string | undefined;
};

type RowAddEntry<TData> = {
    type: 'row_add';
    row: TData;
    /** Index at which the row was appended in tableData */
    insertedIndex: number;
};

type RowDeleteEntry<TData> = {
    type: 'row_delete';
    row: TData;
    /** Index from which the row was removed in tableData */
    deletedIndex: number;
};

type RowDuplicateEntry<TData> = {
    type: 'row_duplicate';
    row: TData;
    /** Index at which the duplicate was appended in tableData */
    insertedIndex: number;
};

type HistoryEntry<TData extends EditableTableData> =
    | CellEditEntry<TData>
    | RowAddEntry<TData>
    | RowDeleteEntry<TData>
    | RowDuplicateEntry<TData>;

// ─── Hook types ───────────────────────────────────────────────────────────────

type UseTableHistoryProps<TData extends EditableTableData> = {
    setTableData: React.Dispatch<React.SetStateAction<TData[]>>;
    setEditedRows: React.Dispatch<React.SetStateAction<Record<string, TData>>>;
    setValidationErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof TData, string | undefined>>>>;
    getRowId: (row: TData) => string;
};

export type UseTableHistoryReturn<TData extends EditableTableData> = {
    canUndo: boolean;
    canRedo: boolean;
    /** Ref that is `true` while an undo/redo is being applied; use to skip re-recording in handlers */
    isUndoRedoAction: React.MutableRefObject<boolean>;
    recordCellEdit: (
        rowId: string,
        columnId: string,
        prevValue: any,
        nextValue: any,
        prevRowEdits: TData | undefined,
        nextRowEdits: TData,
        prevError: string | undefined,
        nextError: string | undefined
    ) => void;
    recordRowAdd: (row: TData, insertedIndex: number) => void;
    recordRowDelete: (row: TData, deletedIndex: number) => void;
    recordRowDuplicate: (row: TData, insertedIndex: number) => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
};

const MAX_HISTORY = 100;

/**
 * Delta-based undo/redo history for EditableTable.
 *
 * Tracks four kinds of changes:
 *  - cell_edit       : individual cell edits (stored in editedRows)
 *  - row_add         : a new row appended to tableData (internal mode only)
 *  - row_delete      : a row removed from tableData (internal mode only)
 *  - row_duplicate   : a duplicated row appended to tableData (internal mode only)
 *
 * History is cleared by the caller when "Save Changes" is committed so that
 * post-save undo is scoped to the new baseline.
 */
export const useTableHistory = <TData extends EditableTableData>({
    setTableData,
    setEditedRows,
    setValidationErrors,
    getRowId,
}: UseTableHistoryProps<TData>): UseTableHistoryReturn<TData> => {
    const historyRef = useRef<Array<HistoryEntry<TData>>>([]);
    const historyIndexRef = useRef(-1);
    const isUndoRedoAction = useRef(false);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateCanStates = useCallback((): void => {
        setCanUndo(historyIndexRef.current >= 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }, []);

    const pushHistory = useCallback(
        (entry: HistoryEntry<TData>): void => {
            // Discard any "future" entries that were undone
            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
            }

            historyRef.current.push(entry);
            historyIndexRef.current++;

            // Cap the undo stack
            if (historyRef.current.length > MAX_HISTORY) {
                historyRef.current = historyRef.current.slice(-MAX_HISTORY);
                historyIndexRef.current = historyRef.current.length - 1;
            }

            updateCanStates();
        },
        [updateCanStates]
    );

    // ─── Record helpers ───────────────────────────────────────────────────────

    const recordCellEdit = useCallback(
        (
            rowId: string,
            columnId: string,
            prevValue: any,
            nextValue: any,
            prevRowEdits: TData | undefined,
            nextRowEdits: TData,
            prevError: string | undefined,
            nextError: string | undefined
        ): void => {
            pushHistory({
                type: 'cell_edit',
                rowId,
                columnId,
                prevValue,
                nextValue,
                prevRowEdits,
                nextRowEdits,
                prevError,
                nextError,
            });
        },
        [pushHistory]
    );

    const recordRowAdd = useCallback(
        (row: TData, insertedIndex: number): void => {
            pushHistory({ type: 'row_add', row, insertedIndex });
        },
        [pushHistory]
    );

    const recordRowDelete = useCallback(
        (row: TData, deletedIndex: number): void => {
            pushHistory({ type: 'row_delete', row, deletedIndex });
        },
        [pushHistory]
    );

    const recordRowDuplicate = useCallback(
        (row: TData, insertedIndex: number): void => {
            pushHistory({ type: 'row_duplicate', row, insertedIndex });
        },
        [pushHistory]
    );

    // ─── Undo ────────────────────────────────────────────────────────────────

    const undo = useCallback((): void => {
        if (historyIndexRef.current < 0) return;

        const entry = historyRef.current[historyIndexRef.current];
        isUndoRedoAction.current = true;

        if (entry.type === 'cell_edit') {
            // Revert the cell value in tableData so the display immediately updates
            setTableData((prev) =>
                prev.map((row) => (getRowId(row) === entry.rowId ? { ...row, [entry.columnId]: entry.prevValue } : row))
            );
            // Revert editedRows dirty-tracking
            if (entry.prevRowEdits === undefined) {
                setEditedRows((prev) => {
                    const next = { ...prev };
                    delete next[entry.rowId];
                    return next;
                });
            } else {
                setEditedRows((prev) => ({ ...prev, [entry.rowId]: entry.prevRowEdits! }));
            }
            // Restore the validation error that existed before this edit
            setValidationErrors((prev) => {
                const next: Record<string, string | undefined> = { ...prev } as Record<string, string | undefined>;
                const cellKey = `${entry.rowId}_${entry.columnId}`;
                if (entry.prevError !== undefined) {
                    next[cellKey] = entry.prevError;
                } else {
                    delete next[cellKey];
                }
                return next as Partial<Record<keyof TData, string | undefined>>;
            });
        } else if (entry.type === 'row_add') {
            setTableData((prev) => prev.filter((_, i) => i !== entry.insertedIndex));
        } else if (entry.type === 'row_delete') {
            setTableData((prev) => [
                ...prev.slice(0, entry.deletedIndex),
                entry.row,
                ...prev.slice(entry.deletedIndex),
            ]);
        } else if (entry.type === 'row_duplicate') {
            setTableData((prev) => prev.filter((_, i) => i !== entry.insertedIndex));
        }

        historyIndexRef.current--;

        requestAnimationFrame(() => {
            isUndoRedoAction.current = false;
        });

        updateCanStates();
    }, [setTableData, setEditedRows, updateCanStates]);

    // ─── Redo ────────────────────────────────────────────────────────────────

    const redo = useCallback((): void => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;

        historyIndexRef.current++;
        const entry = historyRef.current[historyIndexRef.current];
        isUndoRedoAction.current = true;

        if (entry.type === 'cell_edit') {
            // Re-apply the cell value in tableData
            setTableData((prev) =>
                prev.map((row) => (getRowId(row) === entry.rowId ? { ...row, [entry.columnId]: entry.nextValue } : row))
            );
            setEditedRows((prev) => ({ ...prev, [entry.rowId]: entry.nextRowEdits }));
            // Restore the validation error that existed after this edit
            setValidationErrors((prev) => {
                const next: Record<string, string | undefined> = { ...prev } as Record<string, string | undefined>;
                const cellKey = `${entry.rowId}_${entry.columnId}`;
                if (entry.nextError !== undefined) {
                    next[cellKey] = entry.nextError;
                } else {
                    delete next[cellKey];
                }
                return next as Partial<Record<keyof TData, string | undefined>>;
            });
        } else if (entry.type === 'row_add') {
            setTableData((prev) => [
                ...prev.slice(0, entry.insertedIndex),
                entry.row,
                ...prev.slice(entry.insertedIndex),
            ]);
        } else if (entry.type === 'row_delete') {
            setTableData((prev) => prev.filter((_, i) => i !== entry.deletedIndex));
        } else if (entry.type === 'row_duplicate') {
            setTableData((prev) => [
                ...prev.slice(0, entry.insertedIndex),
                entry.row,
                ...prev.slice(entry.insertedIndex),
            ]);
        }

        requestAnimationFrame(() => {
            isUndoRedoAction.current = false;
        });

        updateCanStates();
    }, [setTableData, setEditedRows, updateCanStates]);

    // ─── Clear ───────────────────────────────────────────────────────────────

    const clearHistory = useCallback((): void => {
        historyRef.current = [];
        historyIndexRef.current = -1;
        setCanUndo(false);
        setCanRedo(false);
    }, []);

    return {
        canUndo,
        canRedo,
        isUndoRedoAction,
        recordCellEdit,
        recordRowAdd,
        recordRowDelete,
        recordRowDuplicate,
        undo,
        redo,
        clearHistory,
    };
};
