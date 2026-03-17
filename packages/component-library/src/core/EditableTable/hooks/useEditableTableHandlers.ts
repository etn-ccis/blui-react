import { useState, useCallback, useEffect, useRef } from 'react';
import { type MRT_TableOptions, type MRT_Row } from 'material-react-table';
import { EditableTableData, ValidationErrors } from '../types';
import { useTableHistory } from './useTableHistory';

type UseEditableTableHandlersProps<TData extends EditableTableData> = {
    data: TData[];
    onCreate?: (row: TData) => Promise<void> | void;
    onValidate?: (row: TData) => Partial<Record<keyof TData, string | undefined>>;
    onUpdate?: (row: TData) => Promise<void> | void;
    onDelete?: (id: string | number) => Promise<void> | void;
    onDuplicate?: (row: TData) => Promise<void> | void;
    getRowId: (row: TData) => string;
    deleteConfirmMessage: string | ((row: TData) => string);
};

type UseEditableTableHandlersReturn<TData extends EditableTableData> = {
    tableData: TData[];
    validationErrors: ValidationErrors<TData>;
    editedRows: Record<string, TData>;
    clearValidationErrors: () => void;
    handleCreateRow: MRT_TableOptions<TData>['onCreatingRowSave'];
    handleSaveCell: (cell: any, value: any) => void;
    handleSaveRows: () => Promise<void>;
    handleResetRows: () => void;
    handleDeleteRow: (row: MRT_Row<TData>) => void;
    handleDuplicateRow: (row: MRT_Row<TData>) => Promise<void>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};

export const useEditableTableHandlers = <TData extends EditableTableData>({
    data,
    onCreate,
    onValidate,
    onUpdate,
    onDelete,
    onDuplicate,
    getRowId,
    deleteConfirmMessage,
}: UseEditableTableHandlersProps<TData>): UseEditableTableHandlersReturn<TData> => {
    const [tableData, setTableData] = useState<TData[]>(data);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<TData>>({});
    const [editedRows, setEditedRows] = useState<Record<string, TData>>({});

    // Stable refs so callbacks always see the latest state without needing to
    // include the full state arrays/objects in their dependency arrays.
    const tableDataRef = useRef<TData[]>(data);
    const editedRowsRef = useRef<Record<string, TData>>({});
    const validationErrorsRef = useRef<ValidationErrors<TData>>({});

    useEffect(() => {
        tableDataRef.current = tableData;
    }, [tableData]);
    useEffect(() => {
        editedRowsRef.current = editedRows;
    }, [editedRows]);
    useEffect(() => {
        validationErrorsRef.current = validationErrors;
    }, [validationErrors]);

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
    } = useTableHistory<TData>({ setTableData, setEditedRows, getRowId });

    // Sync tableData when the data prop changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleCreateRow: MRT_TableOptions<TData>['onCreatingRowSave'] = useCallback(
        async ({ values, table }) => {
            if (onValidate) {
                const errors = onValidate(values as TData);
                if (Object.values(errors).some((err) => !!err)) {
                    setValidationErrors(errors);
                    return;
                }
            }

            setValidationErrors({});

            if (onCreate) {
                await onCreate(values as TData);
            } else {
                // Record before mutating so insertedIndex is stable
                const insertedIndex = tableDataRef.current.length;
                recordRowAdd(values as TData, insertedIndex);
                setTableData((prev) => [...prev, values as TData]);
            }

            table.setCreatingRow(null);
        },
        [onCreate, onValidate, recordRowAdd]
    );

    const handleSaveCell = useCallback(
        (cell: any, value: any) => {
            const rowId = cell.row.id;
            const columnId = cell.column.id;

            // Capture the value currently shown in the cell (from tableData / row.original)
            // before we overwrite it. This is stored in history so undo can revert tableData.
            const prevValue = cell.row.original[columnId as keyof TData];
            const prevRowEdits = editedRowsRef.current[rowId];
            const updatedRow = {
                ...(prevRowEdits || cell.row.original),
                [columnId]: value,
            };

            if (!isUndoRedoAction.current) {
                recordCellEdit(rowId, columnId, prevValue, value, prevRowEdits, updatedRow);
            }

            // Write the edit into tableData immediately so the cell display updates
            // and custom Cell renderers (which read cell.getValue / row.original) reflect the change.
            setTableData((prev) => prev.map((row) => (getRowId(row) === rowId ? updatedRow : row)));

            setEditedRows((prev) => ({
                ...prev,
                [rowId]: updatedRow,
            }));

            if (onValidate) {
                const errors = onValidate(updatedRow);
                const cellKey = `${rowId}_${columnId}` as keyof TData;
                setValidationErrors((prev) => ({
                    ...prev,
                    [cellKey]: errors[columnId as keyof TData],
                }));
            }
        },
        [onValidate, isUndoRedoAction, recordCellEdit, getRowId]
    );

    const handleSaveRows = useCallback(async (): Promise<void> => {
        if (Object.values(validationErrorsRef.current).some((err) => !!err)) {
            return;
        }

        const currentEditedRows = editedRowsRef.current;

        if (onUpdate) {
            await Promise.all(Object.values(currentEditedRows).map((row) => Promise.resolve(onUpdate(row))));
        } else {
            setTableData((prev) =>
                prev.map((row) => {
                    const rowId = getRowId(row);
                    return currentEditedRows[rowId] || row;
                })
            );
        }

        setEditedRows({});
        // Clear history when the user explicitly commits – the saved state is the new baseline
        clearHistory();
    }, [onUpdate, getRowId, clearHistory]);

    const handleDeleteRow = useCallback(
        (row: MRT_Row<TData>) => {
            const message =
                typeof deleteConfirmMessage === 'function' ? deleteConfirmMessage(row.original) : deleteConfirmMessage;

            // eslint-disable-next-line no-alert
            if (window.confirm(message)) {
                if (onDelete) {
                    void onDelete(getRowId(row.original));
                } else {
                    const deletedIndex = tableDataRef.current.findIndex((r) => getRowId(r) === getRowId(row.original));
                    if (deletedIndex !== -1) {
                        recordRowDelete(row.original, deletedIndex);
                    }
                    setTableData((prev) => prev.filter((r) => getRowId(r) !== getRowId(row.original)));
                }
            }
        },
        [deleteConfirmMessage, onDelete, getRowId, recordRowDelete]
    );

    const handleDuplicateRow = useCallback(
        async (row: MRT_Row<TData>) => {
            const duplicatedRow = { ...row.original };
            delete duplicatedRow.id;

            if (onDuplicate) {
                await onDuplicate(duplicatedRow);
            } else {
                const insertedIndex = tableDataRef.current.length;
                recordRowDuplicate(duplicatedRow, insertedIndex);
                setTableData((prev) => [...prev, duplicatedRow]);
            }
        },
        [onDuplicate, recordRowDuplicate]
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
        handleCreateRow,
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
