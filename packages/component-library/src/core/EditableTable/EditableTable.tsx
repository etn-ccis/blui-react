import React, { useMemo, useState, useCallback } from 'react';
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { EditableTableColumnDef, EditableTableProps, EditableTableData, ValidationErrors } from './types';

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
    } = props;

    const [tableData, setTableData] = useState<TData[]>(data);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors<TData>>({});
    const [editedRows, setEditedRows] = useState<Record<string, TData>>({});

    // Update table data when prop changes
    React.useEffect(() => {
        setTableData(data);
    }, [data]);

    // Handle creating a new row
    const handleCreateRow: MRT_TableOptions<TData>['onCreatingRowSave'] = useCallback(
        async ({ values, table }) => {
            // Validate the new row
            if (onValidate) {
                const errors = onValidate(values as TData);
                if (Object.values(errors).some((err) => !!err)) {
                    setValidationErrors(errors);
                    return;
                }
            }

            setValidationErrors({});

            // Call onCreate callback if provided
            if (onCreate) {
                await onCreate(values as TData);
            } else {
                // Default behavior: add to local state
                setTableData((prev) => [...prev, values as TData]);
            }

            table.setCreatingRow(null);
        },
        [onCreate, onValidate]
    );

    // Handle updating a row (for cell/table edit modes)
    const handleSaveCell = useCallback(
        (cell: any, value: any) => {
            const rowId = cell.row.id;
            const columnId = cell.column.id;

            // Update the edited rows state
            const updatedRow = {
                ...(editedRows[rowId] || cell.row.original),
                [columnId]: value,
            };

            setEditedRows((prev) => ({
                ...prev,
                [rowId]: updatedRow,
            }));

            // Validate the cell if validation is provided
            if (onValidate) {
                const errors = onValidate(updatedRow);
                const cellKey = `${rowId}_${columnId}` as keyof TData;
                setValidationErrors((prev) => ({
                    ...prev,
                    [cellKey]: errors[columnId as keyof TData],
                }));
            }
        },
        [editedRows, onValidate]
    );

    // Handle saving all edited rows
    const handleSaveRows = useCallback(async (): Promise<void> => {
        // Check for validation errors
        if (Object.values(validationErrors).some((err) => !!err)) {
            return;
        }

        // Call onUpdate for each edited row
        if (onUpdate) {
            await Promise.all(Object.values(editedRows).map((row) => Promise.resolve(onUpdate(row))));
        } else {
            // Default behavior: update local state
            setTableData((prev) =>
                prev.map((row) => {
                    const rowId = getRowId(row);
                    return editedRows[rowId] || row;
                })
            );
        }

        setEditedRows({});
    }, [editedRows, validationErrors, onUpdate, getRowId]);

    // Handle deleting a row
    const handleDeleteRow = useCallback(
        (row: MRT_Row<TData>) => {
            const message =
                typeof deleteConfirmMessage === 'function' ? deleteConfirmMessage(row.original) : deleteConfirmMessage;

            // eslint-disable-next-line no-alert
            if (window.confirm(message)) {
                if (onDelete) {
                    void onDelete(getRowId(row.original));
                } else {
                    // Default behavior: remove from local state
                    setTableData((prev) => prev.filter((r) => getRowId(r) !== getRowId(row.original)));
                }
            }
        },
        [deleteConfirmMessage, onDelete, getRowId]
    );

    // Handle duplicating a row
    const handleDuplicateRow = useCallback(
        async (row: MRT_Row<TData>) => {
            const duplicatedRow = { ...row.original };
            // Remove the id so the consumer can assign a new one
            delete duplicatedRow.id;

            if (onDuplicate) {
                await onDuplicate(duplicatedRow);
            } else {
                // Default behavior: add to local state
                setTableData((prev) => [...prev, duplicatedRow]);
            }
        },
        [onDuplicate]
    );

    // Enhance columns with edit handlers for cell editing mode
    const enhancedColumns = useMemo<Array<MRT_ColumnDef<TData>>>(() => {
        /**
         * Resolve muiTableBodyCellProps (function or object) and merge with
         * the alignment default and any `cellStyle` the column defines.
         */
        const resolveBodyCellProps =
            (column: EditableTableColumnDef<TData>): ((cellParams: any) => any) =>
            (cellParams: any): any => {
                const isNumber =
                    column.accessorKey &&
                    tableData.length > 0 &&
                    typeof tableData[0][column.accessorKey as keyof TData] === 'number';

                // Handle both function and object forms of muiTableBodyCellProps
                const originalProps =
                    typeof column.muiTableBodyCellProps === 'function'
                        ? (column.muiTableBodyCellProps as (params: any) => any)(cellParams)
                        : (column.muiTableBodyCellProps ?? {});

                // Resolve cellStyle if provided
                const customSx = column.cellStyle
                    ? column.cellStyle({
                          cell: cellParams.cell,
                          row: cellParams.row,
                          column: cellParams.column,
                          table: cellParams.table,
                      })
                    : undefined;

                // Merge sx: default padding → user's sx → cellStyle (highest priority)
                const mergedSx = ((): ((t: any) => any) | Record<string, unknown> => {
                    const defaultSx = { px: 2, height: 52, backgroundColor: 'background.paper' };
                    if (typeof originalProps.sx === 'function') {
                        return (t: any): Record<string, unknown> => ({
                            ...defaultSx,
                            ...(originalProps.sx as (t: any) => any)(t),
                            ...(customSx ?? {}),
                        });
                    }
                    return { ...defaultSx, ...(originalProps.sx ?? {}), ...(customSx ?? {}) };
                })();

                return {
                    align: isNumber ? 'right' : 'left',
                    ...originalProps,
                    sx: mergedSx,
                };
            };

        /**
         * Resolve muiTableHeadCellProps (function or object) and merge alignment.
         */
        const resolveHeadCellProps =
            (column: EditableTableColumnDef<TData>): ((headParams: any) => any) =>
            (headParams: any): any => {
                const originalProps =
                    typeof column.muiTableHeadCellProps === 'function'
                        ? (column.muiTableHeadCellProps as (params: any) => any)(headParams)
                        : (column.muiTableHeadCellProps ?? {});

                return {
                    align: 'center',
                    ...originalProps,
                    sx: { px: 2, backgroundColor: 'background.paper', ...(originalProps.sx ?? {}) },
                };
            };

        if (editDisplayMode !== 'cell' && editDisplayMode !== 'table') {
            return columns.map((column) => ({
                ...column,
                muiTableBodyCellProps: resolveBodyCellProps(column),
                muiTableHeadCellProps: resolveHeadCellProps(column),
            }));
        }

        return columns.map((column) => ({
            ...column,
            muiTableBodyCellProps: resolveBodyCellProps(column),
            muiTableHeadCellProps: resolveHeadCellProps(column),
            muiEditTextFieldProps: ({ cell, row, column: col, table: innerTable }: any): any => {
                const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
                const originalProps =
                    typeof column.muiEditTextFieldProps === 'function'
                        ? column.muiEditTextFieldProps({ cell, row, column: col, table: innerTable })
                        : column.muiEditTextFieldProps || {};

                return {
                    ...originalProps,
                    error: !!validationErrors?.[cellKey],
                    helperText: validationErrors?.[cellKey],
                    onBlur: (event: React.FocusEvent<HTMLInputElement>): void => {
                        handleSaveCell(cell, event.currentTarget.value);
                        originalProps.onBlur?.(event);
                    },
                };
            },
        }));
    }, [columns, editDisplayMode, validationErrors, handleSaveCell, tableData]);

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
        muiTableBodyRowProps: { hover: true },
        displayColumnDefOptions: {
            'mrt-row-actions': {
                muiTableHeadCellProps: { align: 'center', sx: { px: 1, backgroundColor: 'background.paper' } },
                muiTableBodyCellProps: {
                    align: 'center',
                    sx: { px: 1, height: 52, backgroundColor: 'background.paper' },
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
        onCreatingRowCancel: (): void => setValidationErrors({}),
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
                {(editDisplayMode === 'cell' || editDisplayMode === 'table') && Object.keys(editedRows).length > 0 && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={(): void => {
                                void handleSaveRows();
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        {Object.values(validationErrors).some((err) => !!err) && (
                            <Typography color="error">Fix errors before submitting</Typography>
                        )}
                    </>
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
