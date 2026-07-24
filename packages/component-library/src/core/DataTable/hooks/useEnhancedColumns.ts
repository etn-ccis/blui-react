import React, { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import { useTheme, Box } from '@mui/material';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';
import { DataTableColumnDef, DataTableData, ValidationErrors } from '../types';
import { resolveBodyCellProps, resolveHeadCellProps } from '../utils/columnProps';
import {
    TextNumberCell,
    SelectCell,
    BinaryCell,
    SimpleTextInput,
    SimpleSelectInput,
    SimpleBinaryInput,
} from '../cells';

// Pre-mixed solid colors: red[500] blended with the known cell backgrounds.
// This avoids transparency bleed-through from elements behind the cell.
// Light: red[500] at 5% over white[50] (#ffffff)
// Dark:  red[500] at 20% over black[800] (#2b353a)
const ERROR_BG_LIGHT = Color(BLUIColors.red[500]).mix(Color(BLUIColors.white[50]), 0.95).hex();
const ERROR_BG_DARK = Color(BLUIColors.red[500]).mix(Color(BLUIColors.black[800]), 0.8).hex();

type UseEnhancedColumnsProps<TData extends DataTableData> = {
    columns: Array<DataTableColumnDef<TData>>;
    editDisplayMode: 'modal' | 'row' | 'cell' | 'table';
    validationErrors: ValidationErrors<TData>;
    handleSaveCell: (cell: any, value: any) => void;
    editedRows: Record<string, TData>;
    originalDataMap: Map<string, TData>;
};

/**
 * Enhances raw column definitions with:
 * - Resolved muiTableBodyCellProps (alignment, padding, background, cellStyle)
 * - Resolved muiTableHeadCellProps (alignment, padding, background)
 * - Custom cell components (TextNumberCell, SelectCell, BinaryCell) for 'cell' and 'table' modes
 * - Custom edit components (SimpleTextInput, SimpleSelectInput, SimpleBinaryInput) for 'cell' and 'table' modes
 *
 * Note: muiEditTextFieldProps is only used in 'row' and 'modal' edit modes.
 * For 'cell' and 'table' modes, use cellType and editSelectOptions instead.
 */
export const useEnhancedColumns = <TData extends DataTableData>({
    columns,
    editDisplayMode,
    validationErrors,
    handleSaveCell,
    editedRows,
    originalDataMap,
}: UseEnhancedColumnsProps<TData>): Array<MRT_ColumnDef<TData>> => {
    const theme = useTheme();

    return useMemo<Array<MRT_ColumnDef<TData>>>(() => {
        if (editDisplayMode !== 'cell' && editDisplayMode !== 'table') {
            return columns.map((column) => ({
                ...column,
                ...(column.required && { header: `${column.header as string}*` }),
                muiTableBodyCellProps: resolveBodyCellProps(column),
                muiTableHeadCellProps: resolveHeadCellProps(column),
            })) as Array<MRT_ColumnDef<TData>>;
        }

        return columns.map((column) => ({
            ...column,
            ...(column.required && { header: `${column.header as string}*` }),
            muiTableBodyCellProps: (cellParams: any): any => {
                const cellKey = `${cellParams.row.id}_${cellParams.cell.column.id}` as keyof TData;
                const hasError = !!validationErrors?.[cellKey];
                const baseProps = resolveBodyCellProps(column)(cellParams);
                const baseSx = baseProps.sx;

                const editingCell = cellParams.table.getState().editingCell;
                const isEditing =
                    editingCell?.row.id === cellParams.row.id && editingCell?.column.id === cellParams.cell.column.id;

                const additionalSx = {
                    py: 0,
                    px: 0,
                    '&:hover': {
                        backgroundColor: 'transparent',
                        // Only show the hover border when the cell is not already in an active/error state
                        ...(!hasError &&
                            !isEditing && {
                                outline: `1px solid ${(theme.vars as any)?.palette?.action?.active ?? theme.palette.action.active} !important`,
                                outlineOffset: '-1px',
                            }),
                    },
                    outline: hasError
                        ? `1px solid ${BLUIColors.red[500]} !important`
                        : isEditing
                          ? `2px solid ${BLUIColors.blue[500]} !important`
                          : 'none',
                    outlineOffset: '-2px',
                    ...(hasError && {
                        color: (theme.vars as any)?.palette?.error?.main ?? theme.palette.error.main,
                        backgroundColor: `${ERROR_BG_LIGHT} !important`,
                    }),
                };

                return {
                    ...baseProps,
                    onClick: (e: React.MouseEvent<HTMLElement>): void => {
                        if (column.enableEditing === false || !cellParams.table.options.enableEditing) return;
                        if (column.cellType === 'binary') {
                            // When already in edit mode, SimpleBinaryInput handles all interactions
                            if (isEditing) return;
                            // Use data attribute to detect which half was clicked — avoids
                            // coordinate math that breaks in jsdom (getBoundingClientRect → all zeros)
                            const isLeftHalf = !!(e.target as HTMLElement).closest('[data-binary-half="left"]');
                            if (isLeftHalf) {
                                // One-click toggle on the checkbox side
                                handleSaveCell(cellParams.cell, !(cellParams.cell.getValue() as boolean));
                            } else {
                                // Enter edit mode on the text side — text input will auto-focus
                                cellParams.table.setEditingCell(cellParams.cell);
                            }
                            return;
                        }
                        // Enable single-click editing for all other cell types
                        cellParams.table.setEditingCell(cellParams.cell);
                    },
                    sx:
                        typeof baseSx === 'function'
                            ? (t: any): any => ({
                                  ...baseSx(t),
                                  ...additionalSx,
                                  // Binary cells: use 'default' so the inner halves' cursors (pointer/text) show through
                                  cursor:
                                      column.cellType === 'binary'
                                          ? 'default'
                                          : column.enableEditing !== false
                                            ? isEditing
                                                ? 'pointer'
                                                : 'cell'
                                            : 'cell',
                                  ...(hasError && {
                                      color: (t.vars as any)?.palette?.error?.main ?? t.palette.error.main,
                                      backgroundColor: `${ERROR_BG_LIGHT} !important`,
                                      ...(t.applyStyles?.('dark', {
                                          backgroundColor: `${ERROR_BG_DARK} !important`,
                                      }) ?? {}),
                                  }),
                              })
                            : {
                                  ...baseSx,
                                  ...additionalSx,
                                  cursor:
                                      column.cellType === 'binary'
                                          ? 'default'
                                          : column.enableEditing !== false
                                            ? isEditing
                                                ? 'pointer'
                                                : 'cell'
                                            : 'cell',
                              },
                };
            },
            muiTableHeadCellProps: resolveHeadCellProps(column),
            Cell: ({ cell, row, column: col, table: innerTable, renderedCellValue }: any): React.ReactElement => {
                // If the column has a custom Cell renderer, use it to get the content
                const content = column.Cell
                    ? column.Cell({ cell, row, column: col, table: innerTable, renderedCellValue })
                    : renderedCellValue;

                const cellProps = {
                    cell,
                    row,
                    renderedCellValue: content,
                    validationErrors,
                    editedRows,
                    originalDataMap,
                    theme,
                };

                const cellType = column.cellType ?? 'text';

                // Render appropriate component based on cellType
                if (cellType === 'select') {
                    return React.createElement(SelectCell, cellProps);
                }

                if (cellType === 'binary') {
                    return React.createElement(BinaryCell, cellProps);
                }

                // Handle text and number types
                return React.createElement(TextNumberCell, cellProps);
            },
            Edit: ({ cell, row, column: col, table: innerTable }: any): React.ReactElement => {
                const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
                const hasError = !!validationErrors?.[cellKey];
                const cellType = column.cellType ?? 'text';

                const [localValue, setLocalValue] = React.useState(cell.getValue());

                // Handle select/dropdown fields
                if (cellType === 'select') {
                    // Get options from editSelectOptions
                    const selectOptions =
                        typeof column.editSelectOptions === 'function'
                            ? column.editSelectOptions({ cell, row, column: col, table: innerTable })
                            : (column.editSelectOptions ?? []);

                    const options: Array<{ value: any; label: string }> = selectOptions.map((opt: any) =>
                        typeof opt === 'string' ? { value: opt, label: opt } : opt
                    );

                    const origDataSelect = originalDataMap.get(row.id);
                    const isNewRowSelect = !originalDataMap.has(row.id);
                    const showDotSelect =
                        isNewRowSelect || localValue !== origDataSelect?.[cell.column.id as keyof TData];
                    return React.createElement(
                        Box,
                        { sx: { position: 'relative', width: '100%' } },
                        showDotSelect &&
                            React.createElement(Box, {
                                sx: {
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: BLUIColors.blue[500],
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                },
                            }),
                        React.createElement(SimpleSelectInput, {
                            value: localValue,
                            onChange: (newValue: any) => {
                                setLocalValue(newValue);
                                handleSaveCell(cell, newValue);
                            },
                            onBlur: () => {
                                handleSaveCell(cell, localValue);
                            },
                            options,
                            hasError,
                        })
                    );
                }

                // Handle binary/boolean fields
                if (cellType === 'binary') {
                    const origDataBinary = originalDataMap.get(row.id);
                    const isNewRowBinary = !originalDataMap.has(row.id);
                    const showDotBinary =
                        isNewRowBinary || localValue !== origDataBinary?.[cell.column.id as keyof TData];
                    return React.createElement(
                        Box,
                        { sx: { position: 'relative', width: '100%' } },
                        showDotBinary &&
                            React.createElement(Box, {
                                sx: {
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: BLUIColors.blue[500],
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                },
                            }),
                        React.createElement(SimpleBinaryInput, {
                            value: localValue,
                            onChange: (newValue: boolean) => {
                                setLocalValue(newValue);
                                handleSaveCell(cell, newValue);
                            },
                        })
                    );
                }

                // Handle text/number fields
                const isNumber = cellType === 'number';
                const originalData = originalDataMap.get(row.id);
                const isNewRow = !originalDataMap.has(row.id);
                const showDot = isNewRow || localValue !== originalData?.[cell.column.id as keyof TData];
                return React.createElement(
                    Box,
                    { sx: { position: 'relative', width: '100%' } },
                    showDot &&
                        React.createElement(Box, {
                            sx: {
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: BLUIColors.blue[500],
                                pointerEvents: 'none',
                                zIndex: 1,
                            },
                        }),
                    React.createElement(SimpleTextInput, {
                        value: localValue,
                        onChange: (newValue: any) => {
                            setLocalValue(newValue);
                        },
                        onBlur: () => {
                            handleSaveCell(cell, localValue);
                        },
                        hasError,
                        isNumber,
                        type: isNumber ? 'number' : 'text',
                    })
                );
            },
        }));
    }, [columns, editDisplayMode, validationErrors, handleSaveCell, editedRows, originalDataMap, theme]);
};
