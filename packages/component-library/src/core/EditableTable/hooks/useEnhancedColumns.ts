import React, { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { Box, Tooltip } from '@mui/material';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';
import { EditableTableColumnDef, EditableTableData, ValidationErrors } from '../types';
import { resolveBodyCellProps, resolveHeadCellProps } from '../utils/columnProps';

const CELL_HOVER_BG = Color(BLUIColors.black[500]).alpha(0.05).string();

type UseEnhancedColumnsProps<TData extends EditableTableData> = {
    columns: Array<EditableTableColumnDef<TData>>;
    editDisplayMode: 'modal' | 'row' | 'cell' | 'table';
    validationErrors: ValidationErrors<TData>;
    handleSaveCell: (cell: any, value: any) => void;
    tableData: TData[];
    editedRows: Record<string, TData>;
    originalDataMap: Map<string, TData>;
};

/**
 * Enhances raw column definitions with:
 * - Resolved muiTableBodyCellProps (alignment, padding, background, cellStyle)
 * - Resolved muiTableHeadCellProps (alignment, padding, background)
 * - muiEditTextFieldProps with validation error binding and onBlur save handler
 *   (only applied when editDisplayMode is 'cell' or 'table')
 */
export const useEnhancedColumns = <TData extends EditableTableData>({
    columns,
    editDisplayMode,
    validationErrors,
    handleSaveCell,
    tableData,
    editedRows,
    originalDataMap,
}: UseEnhancedColumnsProps<TData>): Array<MRT_ColumnDef<TData>> =>
    useMemo<Array<MRT_ColumnDef<TData>>>(() => {
        if (editDisplayMode !== 'cell' && editDisplayMode !== 'table') {
            return columns.map((column) => ({
                ...column,
                muiTableBodyCellProps: resolveBodyCellProps(column, tableData),
                muiTableHeadCellProps: resolveHeadCellProps(column),
            }));
        }

        return columns.map((column) => ({
            ...column,
            muiTableBodyCellProps: (cellParams: any): any => {
                const cellKey = `${cellParams.row.id}_${cellParams.cell.column.id}` as keyof TData;
                const hasError = !!validationErrors?.[cellKey];
                const baseProps = resolveBodyCellProps(column, tableData)(cellParams);
                const baseSx = baseProps.sx;

                const additionalSx = {
                    py: 0,
                    px: 0,
                    '&:hover': { backgroundColor: 'transparent' },
                    ...(hasError ? { outline: '2px solid', outlineColor: 'error.main', outlineOffset: '-2px' } : {}),
                };

                return {
                    ...baseProps,
                    sx:
                        typeof baseSx === 'function'
                            ? (t: any): any => ({ ...baseSx(t), ...additionalSx })
                            : { ...baseSx, ...additionalSx },
                };
            },
            muiTableHeadCellProps: resolveHeadCellProps(column),
            Cell: ({ cell, row, column: col, table: innerTable, renderedCellValue }: any): React.ReactElement => {
                const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
                const errorMessage = validationErrors?.[cellKey] as string | undefined;

                const isCellEdited =
                    editedRows[row.id] !== undefined &&
                    editedRows[row.id][cell.column.id] !== originalDataMap.get(row.id)?.[cell.column.id];

                const content = column.Cell
                    ? column.Cell({ cell, row, column: col, table: innerTable, renderedCellValue })
                    : renderedCellValue;

                const cellChildren: React.ReactNode[] = [];
                if (isCellEdited) {
                    cellChildren.push(
                        React.createElement(Box, {
                            key: 'dot',
                            sx: {
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                pointerEvents: 'none',
                            },
                        })
                    );
                }
                cellChildren.push(React.createElement(Box, { key: 'content', sx: { flex: 1, minWidth: 0 } }, content));

                const hoverBox = React.createElement(
                    Box,
                    {
                        sx: {
                            position: 'relative',
                            width: '100%',
                            minHeight: 52,
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            '&:hover': { backgroundColor: CELL_HOVER_BG },
                        },
                    },
                    ...cellChildren
                );

                if (errorMessage) {
                    return React.createElement(
                        Tooltip,
                        { title: errorMessage, arrow: true, placement: 'top' } as any,
                        hoverBox
                    );
                }

                return hoverBox;
            },
            muiEditTextFieldProps: ({ cell, row, column: col, table: innerTable }: any): any => {
                const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
                const isNumber =
                    column.accessorKey &&
                    tableData.length > 0 &&
                    typeof tableData[0][column.accessorKey as keyof TData] === 'number';
                const originalProps =
                    typeof column.muiEditTextFieldProps === 'function'
                        ? column.muiEditTextFieldProps({ cell, row, column: col, table: innerTable })
                        : column.muiEditTextFieldProps || {};

                return {
                    ...originalProps,
                    error: !!validationErrors?.[cellKey],
                    inputProps: {
                        ...originalProps.inputProps,
                        ...(isNumber ? { style: { textAlign: 'right', ...originalProps.inputProps?.style } } : {}),
                    },
                    onChange: (event: React.ChangeEvent<HTMLInputElement>): void => {
                        // For select columns, save on change (event.target.value has the selected
                        // value here, whereas onBlur fires with an empty currentTarget.value).
                        if (column.editVariant === 'select') {
                            handleSaveCell(cell, event.target.value);
                        }
                        originalProps.onChange?.(event);
                    },
                    onBlur: (event: React.FocusEvent<HTMLInputElement>): void => {
                        // Select fields are saved via onChange above — skip here to avoid
                        // overwriting with the empty string that onBlur reports.
                        if (column.editVariant !== 'select') {
                            handleSaveCell(cell, event.currentTarget.value);
                        }
                        originalProps.onBlur?.(event);
                    },
                };
            },
        }));
    }, [columns, editDisplayMode, validationErrors, handleSaveCell, tableData, editedRows, originalDataMap]);
