import React, { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { alpha, Box, Tooltip, useTheme } from '@mui/material';
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
}: UseEnhancedColumnsProps<TData>): Array<MRT_ColumnDef<TData>> => {
    const theme = useTheme();

    return useMemo<Array<MRT_ColumnDef<TData>>>(() => {
        if (editDisplayMode !== 'cell' && editDisplayMode !== 'table') {
            return columns.map((column) => ({
                ...column,
                muiTableBodyCellProps: resolveBodyCellProps(column, tableData),
                muiTableHeadCellProps: resolveHeadCellProps(column),
            })) as Array<MRT_ColumnDef<TData>>;
        }

        return columns.map((column) => ({
            ...column,
            muiTableBodyCellProps: (cellParams: any): any => {
                const cellKey = `${cellParams.row.id}_${cellParams.cell.column.id}` as keyof TData;
                const hasError = !!validationErrors?.[cellKey];
                const baseProps = resolveBodyCellProps(column, tableData)(cellParams);
                const baseSx = baseProps.sx;

                const editingCell = cellParams.table.getState().editingCell;
                const isEditing =
                    editingCell?.row.id === cellParams.row.id && editingCell?.column.id === cellParams.cell.column.id;

                const outlineColor = hasError
                    ? ((theme.vars as any)?.palette?.error?.main ?? theme.palette.error.main)
                    : isEditing
                      ? ((theme.vars as any)?.palette?.primary?.main ?? theme.palette.primary.main)
                      : 'transparent';
                const outlineWidth = isEditing ? '2px' : '1px';
                const hasOutline = isEditing || hasError;

                const additionalSx = {
                    py: 0,
                    px: 0,
                    '&:hover': { backgroundColor: 'transparent' },
                    outline: hasOutline ? `${outlineWidth} solid ${outlineColor} !important` : 'none',
                    outlineOffset: '-2px',
                    ...(hasError && {
                        color: (theme.vars as any)?.palette?.error?.main ?? theme.palette.error.main,
                        backgroundColor: `${(theme.vars as any)?.palette?.error?.light ?? theme.palette.error.light} !important`,
                    }),
                };

                return {
                    ...baseProps,
                    sx:
                        typeof baseSx === 'function'
                            ? (t: any): any => ({
                                  ...baseSx(t),
                                  ...additionalSx,
                                  ...(hasError && {
                                      color: (t.vars as any)?.palette?.error?.main ?? t.palette.error.main,
                                      backgroundColor: `${(t.vars as any)?.palette?.error?.light ?? t.palette.error.light} !important`,
                                      ...(t.applyStyles?.('dark', {
                                          backgroundColor: `${Color(BLUIColors.black[800]).mix(Color(t.palette.error.dark), 0.2).hex()} !important`,
                                      }) ?? {}),
                                  }),
                              })
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

                const hasEditError = !!validationErrors?.[cellKey];

                return {
                    ...originalProps,
                    variant: 'standard' as const,
                    error: hasEditError,
                    sx: {
                        '& .MuiInput-root': { border: 'none' },
                        '& .MuiInput-underline:before': { borderBottom: 'none' },
                        '& .MuiInput-underline:after': { borderBottom: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                        '& .MuiInputBase-input': {
                            px: 2,
                            fontSize: '14px',
                            fontFamily: (theme.typography as any).fontFamilyMonospace ?? 'monospace',
                            caretColor: (theme.vars as any)?.palette?.primary?.main ?? theme.palette.primary.main,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            ...(hasEditError && {
                                color: (theme.vars as any)?.palette?.error?.main ?? theme.palette.error.main,
                            }),
                            '&:focus': {
                                color: (theme.vars as any)?.palette?.text?.primary ?? theme.palette.text.primary,
                            },
                            '&::selection': {
                                backgroundColor: (theme.vars as any)?.palette?.primary?.mainChannel
                                    ? `rgba(${(theme.vars as any).palette.primary.mainChannel} / 0.36)`
                                    : alpha(theme.palette.primary.main, 0.36),
                            },
                            '&::-moz-selection': {
                                backgroundColor: (theme.vars as any)?.palette?.primary?.mainChannel
                                    ? `rgba(${(theme.vars as any).palette.primary.mainChannel} / 0.36)`
                                    : alpha(theme.palette.primary.main, 0.36),
                            },
                        },
                        ...originalProps.sx,
                    },
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
    }, [columns, editDisplayMode, validationErrors, handleSaveCell, tableData, editedRows, originalDataMap, theme]);
};
