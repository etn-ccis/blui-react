import { useMemo, useCallback } from 'react';
import { MRT_Cell, MRT_Column, MRT_Row, MRT_TableInstance, MRT_TableOptions } from 'material-react-table';
import { Theme } from '@mui/material';
import { black } from '@brightlayer-ui/colors';
import { FormDeviceResource } from './useDataPointsForm';
import { FieldErrors } from 'react-hook-form';

type UseTableConfigProps = {
    columns: Array<MRT_Column<FormDeviceResource>>;
    filteredResources: FormDeviceResource[];
    theme: Theme;
    errors: FieldErrors;
    trigger: () => void;
    minHeight?: number;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    renderTopToolbar: ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => React.JSX.Element;
    renderBottomToolbarCustomActions: ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => React.JSX.Element;
    renderRowActions: ({ row }: { row: MRT_Row<FormDeviceResource> }) => React.JSX.Element;
    renderEmptyRowsFallback: () => React.JSX.Element;
    isPending: boolean;
    move: (from: number, to: number) => void;
    recordMove: (fromIndex: number, toIndex: number) => void;
};

const defaultInitialState = {
    columnPinning: { left: ['mrt-row-drag', 'realtime-value', 'name'], right: ['description', 'mrt-row-actions'] },
    density: 'compact' as const,
    columnVisibility: { 'mrt-row-drag': true },
};

const displayColumnDefOptions = {
    'mrt-row-actions': {
        header: 'Actions',
        visibleInShowHideMenu: false,
        size: 176,
        grow: false,
    },
    'mrt-row-drag': {
        enableHiding: true,
        visibleInShowHideMenu: false,
    },
};

export const useTableConfig = ({
    columns,
    filteredResources,
    theme,
    errors,
    trigger,
    minHeight,
    tableContainerRef,
    renderTopToolbar,
    renderBottomToolbarCustomActions,
    renderRowActions,
    renderEmptyRowsFallback,
    isPending,
    move,
    recordMove,
}: UseTableConfigProps): MRT_TableOptions<FormDeviceResource> => {
    const muiTableContainerProps = useMemo(
        () => ({
            ref: tableContainerRef,
            sx: {
                maxHeight: 'clamp(350px, calc(100vh - 350px), 9999px)',
                minHeight: minHeight ? `${minHeight}px` : undefined,
                transition: 'min-height 0.2s ease-out',
            },
        }),
        [minHeight, tableContainerRef]
    );

    const muiTableHeadCellProps = useMemo(
        () => ({
            sx: {
                backgroundColor: theme.palette.background.paper,
                borderRight: `1px solid ${theme.palette.TableCell.border}`,
            },
        }),
        [theme]
    );

    const handleDraggingRowChange = useCallback(
        (row: MRT_Row<FormDeviceResource> | null) => {
            if (!row) return;
            const draggingRow = row;
            const hoveringRow = draggingRow; // Will be set by MRT when dropped
            // The actual reordering happens in muiRowDragHandleProps
        },
        []
    );

    const muiRowDragHandleProps = useCallback(
        ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow && hoveredRow.id !== draggingRow.id) {
                    const fromIndex = draggingRow.original.formIndex;
                    const toIndex = hoveredRow.original.formIndex;
                    move(fromIndex, toIndex);
                    recordMove(fromIndex, toIndex);
                }
            },
        }),
        [move, recordMove]
    );

    const muiTableBodyCellProps = useCallback(
        ({
            cell,
            column,
            table,
            row,
        }: {
            cell: MRT_Cell<FormDeviceResource>;
            column: MRT_Column<FormDeviceResource>;
            table: MRT_TableInstance<FormDeviceResource>;
            row: MRT_Row<FormDeviceResource>;
        }) => {
            const isEditingThisCell = table.getState().editingCell?.id === cell.id;
            const fieldIndex = row.original.formIndex;

            let fieldPath: string;
            if (column.id === 'name') {
                fieldPath = `deviceResources.${fieldIndex}.name`;
            } else if (column.id === 'description') {
                fieldPath = `deviceResources.${fieldIndex}.description`;
            } else if (
                column.id === 'realtime-value' ||
                column.id === 'mrt-row-actions' ||
                column.id === 'mrt-row-drag'
            ) {
                return {
                    sx: {
                        backgroundColor: black[800],
                        borderRight: `1px solid ${theme.palette.TableCell.border}`,
                    },
                };
            } else if (column.id === 'readWrite' || column.id === 'valueType') {
                fieldPath = `deviceResources.${fieldIndex}.properties.${column.id}`;
            } else {
                fieldPath = `deviceResources.${fieldIndex}.attributes.${column.id}`;
            }

            const hasError = !!fieldPath.split('.').reduce((obj: any, key) => obj?.[key], errors);

            const outlineWidth = isEditingThisCell ? '2px' : '1px';
            const outlineColor = hasError
                ? theme.palette.error.dark
                : isEditingThisCell
                  ? theme.palette.primary.dark
                  : 'transparent';
            const hasOutline = isEditingThisCell || hasError;

            return {
                sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.TableCell.border}`,
                    outline: hasOutline ? `${outlineWidth} solid ${outlineColor} !important` : 'none',
                    outlineOffset: '-2px',
                    // The box-shadow in the design is incredibly subtle while being very difficult to implement due to layout constraints.
                    // This is a compromise to make the editing cell more visible without impacting layout.
                    ...(isEditingThisCell && {
                        boxShadow: `inset 0px 0px 6px ${outlineColor}`,
                    }),
                },
                onFocus: (): void => {
                    table.setEditingCell(cell);
                    queueMicrotask(() => {
                        const input = table.refs.editInputRefs.current?.[column.id];
                        if (input && input.type !== 'checkbox') {
                            input.focus();
                            input.select?.();
                        }
                    });
                },
            };
        },
        [theme, errors, trigger]
    );

    return useMemo(
        () => ({
            columns: columns as any,
            columnFilterDisplayMode: 'popover',
            data: filteredResources,
            displayColumnDefOptions,
            editDisplayMode: 'table',
            enableBottomToolbar: true,
            enableCellActions: true,
            enableClickToCopy: 'context-menu',
            enableColumnPinning: true,
            // Note: There is currently a bug with column resizing in MRT.
            // This causes remounts of cells when resizing columns. See https://github.com/KevinVandy/material-react-table/issues/1477.
            enableColumnResizing: true,
            enableEditing: true,
            enableFacetedValues: true,
            enablePagination: false,
            enableRowActions: true,
            enableRowOrdering: true,
            enableSorting: false,
            enableRowVirtualization: true,
            enableStickyFooter: false,
            enableStickyHeader: true,
            enableTopToolbar: true,
            getRowId: (originalRow) => originalRow.id,
            muiRowDragHandleProps,
            initialState: defaultInitialState,
            state: {
                showSkeletons: isPending,
                // This is important to prevent columns from having a seemingly random order when changing between tabs.
                columnOrder: columns.map((col) => col.id),
            },
            layoutMode: 'grid-no-grow',
            muiTableBodyProps: {
                sx: {
                    // Make the tbody fill available space when empty
                    ...(filteredResources.length === 0 && {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }),
                },
            },
            muiTableBodyCellProps,
            muiTableContainerProps,
            muiTableHeadCellProps,
            positionActionsColumn: 'last',
            renderRowActions,
            renderBottomToolbarCustomActions,
            renderTopToolbar,
            renderEmptyRowsFallback,
            rowVirtualizerOptions: { overscan: 5 },
        }),
        [
            columns,
            filteredResources,
            isPending,
            muiTableBodyCellProps,
            muiTableContainerProps,
            muiTableHeadCellProps,
            muiRowDragHandleProps,
            renderRowActions,
            renderBottomToolbarCustomActions,
            renderTopToolbar,
            renderEmptyRowsFallback,
        ]
    );
};
