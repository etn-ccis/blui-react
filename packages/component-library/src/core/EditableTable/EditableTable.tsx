import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { EditableTableProps, EditableTableData } from './types';
import { useEditableTableHandlers } from './hooks/useEditableTableHandlers';
import { useEnhancedColumns } from './hooks/useEnhancedColumns';

/**
 * EditableTable is a reusable table component built on material-react-table
 * that provides CRUD (Create, Read, Update, Delete) operations with validation.
 *
 * Features:
 * - Cell, row, table, or modal editing modes
 * - Built-in validation support
 * - Create, update, and delete operations
 * - Loading and saving states
 * - Customizable column definitions
 * - Row actions (edit, delete)
 *
 * @example
 * ```tsx
 * <EditableTable
 *   columns={columns}
 *   data={data}
 *   onCreate={handleCreate}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 *   onValidate={validateRow}
 * />
 * ```
 */
export const EditableTable = (<TData extends EditableTableData>(
    props: EditableTableProps<TData>
): React.ReactElement => {
    const {
        columns,
        data = [],
        enableCreate = true,
        enableEdit = true,
        enableDelete = true,
        enableDuplicate = false,
        createDisplayMode = 'row',
        editDisplayMode = 'cell',
        onValidate,
        onCreate,
        onUpdate,
        onDelete,
        onDuplicate,
        getRowId = (row): string => String(row.id),
        isLoading = false,
        isSaving = false,
        error,
        enableColumnPinning = true,
        enableRowActions = true,
        enableCellActions = false,
        enableClickToCopy = false,
        tableOptions = {},
        createButtonText = 'New data point',
        deleteConfirmMessage = 'Are you sure you want to delete this item?',
        minHeight = '500px',
        enableUndoRedo = false,
        onStateChange,
    } = props;

    const {
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
    } = useEditableTableHandlers({
        data,
        onCreate,
        onValidate,
        onUpdate,
        onDelete,
        onDuplicate,
        getRowId,
        deleteConfirmMessage,
    });

    // onStateChange — use a ref so the user can pass an inline function without
    // causing an infinite effect loop.
    const onStateChangeRef = useRef(onStateChange);
    useEffect(() => {
        onStateChangeRef.current = onStateChange;
    });

    // Stable refs for action callbacks — updated every render but never change identity.
    // This means the onStateChange effect only re-fires when the primitive flags change,
    // not every time the internal callbacks are recreated due to state updates.
    const undoRef = useRef(undo);
    const redoRef = useRef(redo);
    const handleSaveRowsRef = useRef(handleSaveRows);
    const handleResetRowsRef = useRef(handleResetRows);
    useEffect(() => {
        undoRef.current = undo;
    });
    useEffect(() => {
        redoRef.current = redo;
    });
    useEffect(() => {
        handleSaveRowsRef.current = handleSaveRows;
    });
    useEffect(() => {
        handleResetRowsRef.current = handleResetRows;
    });

    const stableUndo = useCallback(() => undoRef.current(), []);
    const stableRedo = useCallback(() => redoRef.current(), []);
    const stableSave = useCallback((): Promise<void> => handleSaveRowsRef.current(), []);
    const stableReset = useCallback(() => handleResetRowsRef.current(), []);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        if (!enableUndoRedo) return;

        const handleKeyDown = (e: KeyboardEvent): void => {
            if (!(e.metaKey || e.ctrlKey)) return;
            if (e.code === 'KeyZ') {
                e.preventDefault();
                if (e.shiftKey) {
                    redoRef.current();
                } else {
                    undoRef.current();
                }
            } else if (e.code === 'KeyY') {
                e.preventDefault();
                redoRef.current();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return (): void => window.removeEventListener('keydown', handleKeyDown);
    }, [enableUndoRedo]);

    const hasPendingChanges = Object.keys(editedRows).length > 0;

    useEffect(() => {
        if (!onStateChangeRef.current) return;
        onStateChangeRef.current({
            canUndo,
            canRedo,
            hasPendingChanges,
            undo: stableUndo,
            redo: stableRedo,
            save: stableSave,
            reset: stableReset,
            tableData,
        });
    }, [canUndo, canRedo, hasPendingChanges, stableUndo, stableRedo, stableSave, stableReset, tableData]);

    const originalDataMap = useMemo(() => new Map(data.map((row) => [getRowId(row), row])), [data, getRowId]);

    const enhancedColumns = useEnhancedColumns({
        columns,
        editDisplayMode,
        validationErrors,
        handleSaveCell,
        tableData,
        editedRows,
        originalDataMap,
    });

    // Configure the table
    const table = useMaterialReactTable({
        columns: enhancedColumns,
        data: tableData,
        createDisplayMode,
        editDisplayMode,
        enableCellActions,
        enableClickToCopy,
        enableColumnPinning,
        enableEditing: enableEdit,
        enableRowActions,
        enableTopToolbar: false,
        getRowId,
        muiTablePaperProps: {
            sx: {
                backgroundColor: 'background.paper',
            },
        },
        muiTopToolbarProps: {
            sx: { backgroundColor: 'background.paper' },
        },
        muiBottomToolbarProps: {
            sx: { backgroundColor: 'background.paper' },
        },
        muiTableBodyRowProps: {
            hover: true,
            sx: {
                '& td[data-pinned="true"]:before': { backgroundColor: 'transparent !important' },
            },
        },
        displayColumnDefOptions: {
            'mrt-row-actions': {
                muiTableHeadCellProps: {
                    align: 'center',
                    sx: {
                        px: 1,
                        backgroundColor: 'background.paper',
                        '&[data-pinned="true"]:before': { backgroundColor: 'transparent !important' },
                    },
                },
                muiTableBodyCellProps: {
                    align: 'center',
                    sx: {
                        px: 1,
                        height: 52,
                        backgroundColor: 'background.paper',
                        '&[data-pinned="true"]:before': { backgroundColor: 'transparent !important' },
                    },
                },
            },
        },
        muiToolbarAlertBannerProps: error
            ? {
                  color: 'error',
                  children: error,
              }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight,
            },
        },
        onCreatingRowCancel: (): void => clearValidationErrors(),
        onCreatingRowSave: handleCreateRow,
        renderRowActions: enableRowActions
            ? ({ row, table: actionTable }): React.ReactElement => (
                  <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                      {enableEdit && editDisplayMode === 'row' && (
                          <Tooltip title="Edit">
                              <IconButton size="small" onClick={(): void => actionTable.setEditingRow(row)}>
                                  <EditIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                      {enableDuplicate && (
                          <Tooltip title="Duplicate">
                              <IconButton
                                  size="small"
                                  onClick={(): void => {
                                      void handleDuplicateRow(row);
                                  }}
                              >
                                  <ContentCopyIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                      {enableDelete && (
                          <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={(): void => handleDeleteRow(row)}>
                                  <DeleteIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                  </Box>
              )
            : undefined,
        renderBottomToolbarCustomActions: ({ table: toolbarTable }): React.ReactElement => (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {enableCreate && (
                    <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        onClick={(): void => toolbarTable.setCreatingRow(true)}
                        sx={{ textTransform: 'none' }}
                    >
                        {createButtonText}
                    </Button>
                )}
            </Box>
        ),
        initialState: {
            columnPinning: enableRowActions ? { left: [], right: ['mrt-row-actions'] } : { left: [], right: [] },
            ...tableOptions.initialState,
        },
        state: {
            isLoading,
            isSaving,
            showAlertBanner: !!error,
            ...tableOptions.state,
        },
        ...tableOptions,
    });

    return <MaterialReactTable table={table} />;
}) as <TData extends EditableTableData>(props: EditableTableProps<TData>) => React.ReactElement;

export type EditableTableComponentProps<TData extends EditableTableData> = EditableTableProps<TData>;
