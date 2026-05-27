import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { alpha, Box, Button, IconButton, Tooltip } from '@mui/material';
import * as BLUIColors from '@brightlayer-ui/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { DataTableProps, DataTableData } from './types';
import { useDataTableHandlers } from './hooks/useDataTableHandlers';
import { useEnhancedColumns } from './hooks/useEnhancedColumns';

const MAX_VISIBLE_ROWS = 10;
const ROW_HEIGHT_PX = 52;
const HEADER_HEIGHT_PX = 57;

/**
 * DataTable is a reusable table component built on material-react-table
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
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   onCreate={handleCreate}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 *   onValidate={validateRow}
 * />
 * ```
 */
export const DataTable = (<TData extends DataTableData>(props: DataTableProps<TData>): React.ReactElement => {
    const {
        columns,
        data = [],
        enableCreate = true,
        editable = true,
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
        minHeight = `${HEADER_HEIGHT_PX + ROW_HEIGHT_PX}px`,
        enableUndoRedo = false,
        enableSorting = false,
        enableColumnFilters = false,
        enableColumnActions = false,
        onStateChange,
    } = props;

    const {
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
    } = useDataTableHandlers({
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
    // Holds the MRT table instance so stableReset can close any active editing cell.
    const tableRef = useRef<any>(null);
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
    const stableSave = useCallback((): Promise<void> => {
        // Close any active editing cell so its value is committed before saving.
        tableRef.current?.setEditingCell(null);
        return handleSaveRowsRef.current();
    }, []);
    const stableReset = useCallback((): void => {
        // Close any active editing cell first so its Edit component unmounts
        // and re-renders with the restored value after the reset.
        tableRef.current?.setEditingCell(null);
        handleResetRowsRef.current();
    }, []);

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

    const hasPendingChanges = Object.entries(editedRows).some(([rowId, row]) => {
        // Existing rows and duplicates of existing rows (prefixed __dup__) are always pending.
        if (!rowId.startsWith('__new__')) return true;
        // A freshly-added empty row (all fields '' or false) should not enable the save button
        // until the user has actually typed something into at least one field.
        return Object.entries(row as Record<string, unknown>).some(
            ([key, val]) => key !== 'id' && val !== '' && val !== false && val !== null && val !== undefined
        );
    });
    const hasValidationErrors = Object.values(validationErrors).some(Boolean);

    // canSave is recomputed after every edit by running onValidate against every pending row.
    // It is true only when there is at least one meaningful pending row and all of them pass
    // validation — i.e. all required fields are present and error-free.
    const canSave = useMemo(() => {
        const entries = Object.entries(editedRows);
        if (entries.length === 0) return false;

        // Run onValidate on ALL rows in editedRows — including empty new rows.
        // An empty new row that fails validation (required fields missing) will block Save
        // even when other already-edited rows are valid.
        if (onValidate) {
            const allValid = entries.every(([, row]) => {
                const errors = onValidate(row as TData);
                return !Object.values(errors).some(Boolean);
            });
            if (!allValid) return false;
        }

        // Only enable Save if at least one row represents a meaningful change.
        // A freshly-added empty row (no fields filled) is excluded so that simply
        // clicking "Add row" without typing anything doesn't enable the Save button.
        return entries.some(([rowId, row]) => {
            if (!rowId.startsWith('__new__')) return true;
            return Object.entries(row as Record<string, unknown>).some(
                ([key, val]) => key !== 'id' && val !== '' && val !== false && val !== null && val !== undefined
            );
        });
    }, [editedRows, onValidate]);

    useEffect(() => {
        if (!onStateChangeRef.current) return;
        onStateChangeRef.current({
            canUndo,
            canRedo,
            hasPendingChanges,
            hasValidationErrors,
            canSave,
            undo: stableUndo,
            redo: stableRedo,
            save: stableSave,
            reset: stableReset,
            tableData,
        });
    }, [
        canUndo,
        canRedo,
        hasPendingChanges,
        hasValidationErrors,
        canSave,
        stableUndo,
        stableRedo,
        stableSave,
        stableReset,
        tableData,
    ]);

    const originalDataMap = useMemo(() => new Map(data.map((row) => [getRowId(row), row])), [data, getRowId]);

    const enhancedColumns = useEnhancedColumns({
        columns,
        editDisplayMode,
        validationErrors,
        handleSaveCell,
        editedRows,
        originalDataMap,
    });

    // Keep tableRef in sync so stableReset can access setEditingCell.
    // Configure the table
    const table = useMaterialReactTable({
        columns: enhancedColumns,
        data: tableData,
        createDisplayMode,
        editDisplayMode,
        enableCellActions,
        enableClickToCopy,
        enableColumnPinning,
        enableEditing: editable,
        enableRowActions,
        enableTopToolbar: enableColumnFilters,
        enableSorting,
        enableColumnFilters,
        enableColumnActions,
        enableStickyHeader: true,
        getRowId,
        muiTablePaperProps: {
            sx: (t: any): any => ({
                backgroundColor: t.vars?.palette?.background?.paper ?? t.palette.background.paper,
            }),
        },
        muiTopToolbarProps: {
            sx: (t: any): any => ({
                backgroundColor: t.vars?.palette?.background?.paper ?? t.palette.background.paper,
            }),
        },
        muiBottomToolbarProps: {
            sx: (t: any): any => ({
                backgroundColor: t.vars?.palette?.background?.paper ?? t.palette.background.paper,
            }),
        },
        muiTableBodyRowProps: {
            hover: false,
            sx: (t: any): any => ({
                '& td[data-pinned="true"]:before': {
                    backgroundColor: `${t.vars?.palette?.background?.paper ?? t.palette.background.paper} !important`,
                },
            }),
        },
        displayColumnDefOptions: {
            'mrt-row-actions': {
                muiTableHeadCellProps: {
                    align: 'center',
                    sx: (t: any): any => ({
                        opacity: 1,
                        backgroundColor: `${
                            t.vars?.palette?.background?.paper ?? t.palette.background.paper
                        } !important`,
                        borderTop: `1px solid ${t.vars?.palette?.divider ?? t.palette.divider}`,
                        borderBottom: `1px solid ${BLUIColors.gray[500]}`,
                        borderLeft: `1px solid ${BLUIColors.gray[500]}`,
                        ...(t.applyStyles?.('dark', {
                            borderBottom: `1px solid ${BLUIColors.black[200]}`,
                            borderLeft: `1px solid ${BLUIColors.black[200]}`,
                        }) ?? {}),
                        boxShadow: 'none',
                        fontFamily: '"Open Sans"',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: 'normal',
                        '&[data-pinned="true"]:before': {
                            backgroundColor: `${t.vars?.palette?.background?.paper ?? t.palette.background.paper} !important`,
                            boxShadow: 'none',
                        },
                    }),
                },
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: (t: any): any => ({
                        pl: 0,
                        pr: 2,
                        height: 52,
                        cursor: 'cell',
                        opacity: 1,
                        backgroundColor: `${t.vars?.palette?.background?.paper ?? t.palette.background.paper} !important`,
                        borderLeft: `1px solid ${BLUIColors.gray[500]}`,
                        ...(t.applyStyles?.('dark', {
                            borderLeft: `1px solid ${BLUIColors.black[200]}`,
                        }) ?? {}),
                        boxShadow: 'none',
                        '&[data-pinned="true"]:before': {
                            backgroundColor: `${t.vars?.palette?.background?.paper ?? t.palette.background.paper} !important`,
                            boxShadow: 'none',
                        },
                    }),
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
                maxHeight: `${MAX_VISIBLE_ROWS * ROW_HEIGHT_PX + HEADER_HEIGHT_PX}px`,
                overflowY: 'auto',
                ...(minHeight !== undefined ? { minHeight } : {}),
                // Remove the right border on the last data column that sits directly
                // before the pinned actions column so there is no double-border.
                '& thead tr > th:has(+ th[data-pinned="true"])': { borderRight: 'none !important' },
                '& tbody tr > td:has(+ td[data-pinned="true"])': { borderRight: 'none !important' },
            },
        },
        onCreatingRowCancel: (): void => clearValidationErrors(),
        onCreatingRowSave: undefined,
        renderRowActions: enableRowActions
            ? ({ row, table: actionTable }): React.ReactElement => (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                      {editable && editDisplayMode === 'row' && (
                          <Tooltip title="Edit" placement="top" followCursor>
                              <IconButton
                                  size="small"
                                  onClick={(): void => actionTable.setEditingRow(row)}
                                  sx={(t: any): any => ({
                                      '&:hover': {
                                          backgroundColor: (t.vars as any)?.palette?.primary?.darkChannel
                                              ? `rgba(${(t.vars as any).palette.primary.darkChannel} / 0.2)`
                                              : alpha(t.palette.primary.dark, 0.2),
                                          color: t.vars?.palette?.primary?.main ?? t.palette.primary.main,
                                      },
                                  })}
                              >
                                  <EditIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                      {enableDuplicate && (
                          <Tooltip title="Duplicate" placement="top" followCursor>
                              <IconButton
                                  size="small"
                                  onClick={(): void => {
                                      void handleDuplicateRow(row);
                                  }}
                                  sx={(t: any): any => ({
                                      '&:hover': {
                                          backgroundColor: (t.vars as any)?.palette?.primary?.darkChannel
                                              ? `rgba(${(t.vars as any).palette.primary.darkChannel} / 0.2)`
                                              : alpha(t.palette.primary.dark, 0.2),
                                          color: t.vars?.palette?.primary?.main ?? t.palette.primary.main,
                                      },
                                  })}
                              >
                                  <ContentCopyIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                      {enableDelete && (
                          <Tooltip title="Delete" placement="top" followCursor>
                              <IconButton
                                  size="small"
                                  onClick={(): void => handleDeleteRow(row)}
                                  sx={(t: any): any => ({
                                      '&:hover': {
                                          backgroundColor: (t.vars as any)?.palette?.error?.darkChannel
                                              ? `rgba(${(t.vars as any).palette.error.darkChannel} / 0.2)`
                                              : alpha(t.palette.error.dark, 0.2),
                                          color: t.vars?.palette?.error?.main ?? t.palette.error.main,
                                      },
                                  })}
                              >
                                  <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                      )}
                  </Box>
              )
            : undefined,
        renderBottomToolbarCustomActions: (): React.ReactElement => {
            const emptyRow = columns.reduce(
                (acc, col) => {
                    if (!col.accessorKey) return acc;
                    const key = col.accessorKey as string;
                    if (col.cellType === 'binary') acc[key] = false;
                    else acc[key] = '';
                    return acc;
                },
                {} as Record<string, any>
            ) as TData;

            return (
                <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {enableCreate && (
                        <Button
                            variant="text"
                            startIcon={<AddIcon />}
                            onClick={(): void => handleAddEmptyRow(emptyRow)}
                            sx={{ textTransform: 'none' }}
                        >
                            {createButtonText}
                        </Button>
                    )}
                </Box>
            );
        },
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

    tableRef.current = table;

    return (
        <Box
            onBlur={(e: React.FocusEvent<HTMLDivElement>): void => {
                // Clear editing cell when focus moves outside the table container
                // so the blue outline doesn't persist after clicking away.
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    tableRef.current?.setEditingCell(null);
                }
            }}
        >
            <MaterialReactTable table={table} />
        </Box>
    );
}) as <TData extends DataTableData>(props: DataTableProps<TData>) => React.ReactElement;

export type DataTableComponentProps<TData extends DataTableData> = DataTableProps<TData>;
