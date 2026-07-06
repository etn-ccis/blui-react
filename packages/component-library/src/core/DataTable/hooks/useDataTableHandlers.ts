import { useState, useCallback, useEffect, useRef } from 'react';
import { type MRT_Row } from 'material-react-table';
import { DataTableData, ValidationErrors } from '../types';
import { useTableHistory } from './useTableHistory';

type UseDataTableHandlersProps<TData extends DataTableData> = {
    data: TData[];
    onCreate?: (row: TData) => Promise<void> | void;
    onValidate?: (row: TData) => Partial<Record<keyof TData, string | undefined>>;
    onUpdate?: (row: TData) => Promise<void> | void;
    onDelete?: (id: string | number) => Promise<void> | void;
    onDuplicate?: (row: TData) => Promise<void> | void;
    getRowId: (row: TData) => string;
    deleteConfirmMessage: string | ((row: TData) => string);
};

type UseDataTableHandlersReturn<TData extends DataTableData> = {
    tableData: TData[];
    validationErrors: ValidationErrors<TData>;
    editedRows: Record<string, TData>;
    clearValidationErrors: () => void;
    handleAddEmptyRow: (emptyRow: TData) => void;
    handleSaveCell: (cell: any, value: any) => void;
    handleSaveRows: () => Promise<void>;
    handleResetRows: () => void;
    handleDeleteRow: (row: MRT_Row<TData>) => void;
    handleDuplicateRow: (row: MRT_Row<TData>) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};

export const useDataTableHandlers = <TData extends DataTableData>({
    data,
    onCreate,
    onValidate,
    onUpdate,
    onDelete,
    onDuplicate,
    getRowId,
    deleteConfirmMessage,
}: UseDataTableHandlersProps<TData>): UseDataTableHandlersReturn<TData> => {
    const [tableData, setTableData] = useState<TData[]>(data);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<TData>>({});
    const [editedRows, setEditedRows] = useState<Record<string, TData>>({});

    // Stable refs so callbacks always see the latest state without needing to
    // include the full state arrays/objects in their dependency arrays.
    const tableDataRef = useRef<TData[]>(data);
    const editedRowsRef = useRef<Record<string, TData>>({});
    const validationErrorsRef = useRef<ValidationErrors<TData>>({});
    const dupCounterRef = useRef(0);
    const newCounterRef = useRef(0);
    // Tracks IDs from the committed data prop — used to distinguish existing rows from new (duplicated) ones during save
    const originalIdsRef = useRef<Set<string>>(new Set(data.map(getRowId)));

    useEffect(() => {
        tableDataRef.current = tableData;
    }, [tableData]);
    useEffect(() => {
        editedRowsRef.current = editedRows;
    }, [editedRows]);
    useEffect(() => {
        validationErrorsRef.current = validationErrors;
    }, [validationErrors]);
    useEffect(() => {
        originalIdsRef.current = new Set(data.map(getRowId));
    }, [data, getRowId]);

    const {
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
    } = useTableHistory<TData>({ setTableData, setEditedRows, setValidationErrors, getRowId });

    // Sync tableData when the data prop changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleSaveCell = useCallback(
        (cell: any, value: any) => {
            const rowId = cell.row.id;
            const columnId = cell.column.id;

            // Capture the value currently shown in the cell (from tableData / row.original)
            // before we overwrite it. This is stored in history so undo can revert tableData.
            const prevValue = cell.row.original[columnId as keyof TData];
            const prevRowEdits = editedRowsRef.current[rowId];
            const prevError = validationErrorsRef.current[`${rowId}_${columnId}`] as string | undefined;
            const coercedValue =
                typeof prevValue === 'number' && typeof value === 'string' && value !== '' ? Number(value) : value;

            // If the value is identical to the original and this row has no other pending edits,
            // nothing has actually changed — skip to avoid a false hasPendingChanges signal.
            if (coercedValue === prevValue && prevRowEdits === undefined) {
                return;
            }

            const updatedRow = {
                ...(prevRowEdits || cell.row.original),
                [columnId]: coercedValue,
            };

            // Write the edit into tableData immediately so the cell display updates
            // and custom Cell renderers (which read cell.getValue / row.original) reflect the change.
            setTableData((prev) => prev.map((row) => (getRowId(row) === rowId ? updatedRow : row)));

            // Update editedRowsRef synchronously so that handleSaveRows reads the correct value
            // even when called in the same event tick (blur fires → handleSaveCell → then click
            // fires → handleSaveRows reads the ref before React has re-rendered and run effects).
            const updatedEditedRows = { ...editedRowsRef.current, [rowId]: updatedRow };
            editedRowsRef.current = updatedEditedRows;
            setEditedRows(updatedEditedRows);

            let nextError: string | undefined;
            if (onValidate) {
                const errors = onValidate(updatedRow);
                const cellKey = `${rowId}_${columnId}` as keyof TData;
                nextError = errors[columnId as keyof TData] as string | undefined;
                // Same sync update for validationErrorsRef so handleSaveRows' error-gate check
                // sees the correct (post-blur) validation state.
                const updatedErrors = { ...validationErrorsRef.current, [cellKey]: nextError };
                validationErrorsRef.current = updatedErrors;
                setValidationErrors(updatedErrors);
            }

            if (!isUndoRedoAction.current) {
                recordCellEdit(rowId, columnId, prevValue, value, prevRowEdits, updatedRow, prevError, nextError);
            }
        },
        [onValidate, isUndoRedoAction, recordCellEdit, getRowId]
    );

    const handleSaveRows = useCallback(async (): Promise<void> => {
        if (Object.values(validationErrorsRef.current).some((err) => !!err)) {
            return;
        }

        const currentEditedRows = editedRowsRef.current;
        const currentOriginalIds = originalIdsRef.current;

        const savePromises: Array<Promise<void>> = [];
        const internalUpdates: Record<string, TData> = {};

        Object.values(currentEditedRows).forEach((row) => {
            const rowId = getRowId(row);
            const isNewRow = rowId.startsWith('__new__');
            const isDupeRow = rowId.startsWith('__dup__');

            if (isNewRow) {
                if (onCreate) {
                    const rowToSave = { ...row };
                    delete (rowToSave as any).id;
                    savePromises.push(Promise.resolve(onCreate(rowToSave as TData)));
                } else {
                    // Internal mode: commit new row so future edits treat it as existing
                    originalIdsRef.current.add(rowId);
                }
            } else if (isDupeRow) {
                if (onDuplicate) {
                    const rowToSave = { ...row };
                    delete (rowToSave as any).id;
                    savePromises.push(Promise.resolve(onDuplicate(rowToSave)));
                } else {
                    // Internal mode: commit duplicate row
                    originalIdsRef.current.add(rowId);
                }
            } else if (!currentOriginalIds.has(rowId)) {
                // Fallback for rows not in original set (shouldn't normally happen)
            } else {
                if (onUpdate) {
                    savePromises.push(Promise.resolve(onUpdate(row)));
                } else {
                    internalUpdates[rowId] = row;
                }
            }
        });

        if (Object.keys(internalUpdates).length > 0) {
            setTableData((prev) =>
                prev.map((row) => {
                    const rowId = getRowId(row);
                    return internalUpdates[rowId] ?? row;
                })
            );
        }

        await Promise.all(savePromises);

        setEditedRows({});
        // Clear history when the user explicitly commits – the saved state is the new baseline
        clearHistory();
    }, [onCreate, onUpdate, onDuplicate, getRowId, clearHistory]);

    const handleAddEmptyRow = useCallback(
        (emptyRow: TData): void => {
            const tempId = `__new__${Date.now()}_${++newCounterRef.current}`;
            const newRow = { ...emptyRow, id: tempId } as TData;
            const insertedIndex = tableDataRef.current.length;
            recordRowAdd(newRow, insertedIndex);
            setTableData((prev) => [...prev, newRow]);
            setEditedRows((prev) => ({ ...prev, [tempId]: newRow }));
        },
        [recordRowAdd]
    );

    const handleDeleteRow = useCallback(
        (row: MRT_Row<TData>) => {
            const rowId = getRowId(row.original);
            const isTempRow = rowId.startsWith('__new__') || rowId.startsWith('__dup__');

            if (!isTempRow) {
                const message =
                    typeof deleteConfirmMessage === 'function'
                        ? deleteConfirmMessage(row.original)
                        : deleteConfirmMessage;
                // eslint-disable-next-line no-alert
                if (!window.confirm(message)) return;
            }

            if (!isTempRow && onDelete) {
                void onDelete(rowId);
            } else {
                const deletedIndex = tableDataRef.current.findIndex((r) => getRowId(r) === rowId);
                if (deletedIndex !== -1) {
                    recordRowDelete(row.original, deletedIndex);
                }
                setTableData((prev) => prev.filter((r) => getRowId(r) !== rowId));
                if (isTempRow) {
                    setEditedRows((prev) => {
                        const next = { ...prev };
                        delete next[rowId];
                        return next;
                    });
                }
            }
        },
        [deleteConfirmMessage, onDelete, getRowId, recordRowDelete]
    );

    const handleDuplicateRow = useCallback(
        (row: MRT_Row<TData>): void => {
            const sourceId = getRowId(row.original);
            const isTempSource = sourceId.startsWith('__new__') || sourceId.startsWith('__dup__');
            // Duplicating an unsaved row produces another new row (not a duplicate of an existing one),
            // so route it through onCreate on save by using the __new__ prefix.
            const tempId = isTempSource
                ? `__new__${Date.now()}_${++newCounterRef.current}`
                : `__dup__${Date.now()}_${++dupCounterRef.current}`;
            const duplicatedRow = { ...row.original, id: tempId } as TData;

            const insertedIndex = tableDataRef.current.length;
            recordRowDuplicate(duplicatedRow, insertedIndex);
            setTableData((prev) => [...prev, duplicatedRow]);
            setEditedRows((prev) => ({ ...prev, [tempId]: duplicatedRow }));
        },
        [recordRowDuplicate, getRowId]
    );

    const clearValidationErrors = useCallback(() => setValidationErrors({}), []);

    const handleResetRows = useCallback((): void => {
        // Restore tableData to the original data prop, discard all pending edits,
        // clear validation errors, and wipe the undo/redo history.
        setTableData(data);
        setEditedRows({});
        setValidationErrors({});
        clearHistory();
    }, [data, clearHistory]);

    return {
        tableData,
        validationErrors,
        editedRows,
        clearValidationErrors,
        handleAddEmptyRow,
        handleSaveCell,
        handleSaveRows,
        handleResetRows,
        handleDeleteRow,
        handleDuplicateRow,
        undo,
        redo,
        canUndo,
        canRedo,
    };
};
