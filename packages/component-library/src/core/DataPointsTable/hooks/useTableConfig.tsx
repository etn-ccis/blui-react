// @ts-nocheck
import { useMemo, useCallback, useRef, type DragEvent } from 'react';
import { MRT_Cell, MRT_Column, MRT_Row, MRT_TableInstance, MRT_TableOptions } from 'material-react-table';
import { Theme } from '@mui/material';
import { black } from '@brightlayer-ui/colors';
import { FormDeviceResource, DataPointsStore, toFieldKey } from './useDataPointsStore';

type UseTableConfigProps = {
    columns: Array<MRT_Column<FormDeviceResource>>;
    filteredResources: FormDeviceResource[];
    theme: Theme;
    store: DataPointsStore;
    minHeight?: number;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    renderTopToolbar: ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => JSX.Element;
    renderBottomToolbarCustomActions: ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => JSX.Element;
    renderRowActions: ({ row }: { row: MRT_Row<FormDeviceResource> }) => JSX.Element;
    renderEmptyRowsFallback: () => JSX.Element;
    isPending: boolean;
    onMoveRow: (fromIndex: number, toIndex: number) => void;
    dragFromIndexRef: React.RefObject<number | null>;
};

const defaultInitialState = {
    columnPinning: { left: ['realtime-value', 'name'], right: ['description', 'mrt-row-actions'] },
    density: 'compact' as const,
    columnVisibility: { 'mrt-row-drag': false },
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
    store,
    minHeight,
    tableContainerRef,
    renderTopToolbar,
    renderBottomToolbarCustomActions,
    renderRowActions,
    renderEmptyRowsFallback,
    isPending,
    onMoveRow,
    dragFromIndexRef,
}: UseTableConfigProps): MRT_TableOptions<FormDeviceResource> => {
    const muiTableContainerProps = useMemo(
        () => ({
            ref: tableContainerRef,
            sx: {
                maxHeight: 'clamp(350px, calc(100vh - 350px), 9999px)',
                ...(minHeight && { minHeight: `${minHeight}px` }),
                transition: 'min-height 0.2s ease-out',
                position: 'relative' as const, // Anchor for insertion-line overlay
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

    // Stable ref so callback identity doesn't change across re-renders
    const storeRef = useRef(store);
    storeRef.current = store;

    // Stable ref for move callback
    const moveRowRef = useRef(onMoveRow);
    moveRowRef.current = onMoveRow;

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

            if (column.id === 'realtime-value' || column.id === 'mrt-row-actions' || column.id === 'mrt-row-drag') {
                return {
                    sx: {
                        backgroundColor: black[800],
                        borderRight: `1px solid ${theme.palette.TableCell.border}`,
                    },
                };
            }

            const fieldKey = toFieldKey(column.id);
            const cellState = storeRef.current.getCellState(fieldIndex, fieldKey);
            const hasError = !!cellState.error;

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
                    // The box-shadow is a compromise to make the editing cell
                    // more visible without impacting layout.
                    ...(isEditingThisCell && {
                        boxShadow: `inset 0px 0px 6px ${outlineColor}`,
                    }),
                },
                onFocus: (): void => {
                    table.setEditingCell(cell);
                    // editDisplayMode: 'cell' mounts the Edit component lazily.
                    // rAF waits for the next paint so the input ref is available.
                    requestAnimationFrame(() => {
                        const input = table.refs.editInputRefs.current?.[column.id];
                        if (input && input.type !== 'checkbox') {
                            input.focus();
                            input.select?.();
                        }
                    });
                },
            };
        },
        [theme]
    );

    // ---- Row drag-and-drop ----
    // Absolutely-positioned overlay inside the table container,
    // avoiding z-index issues with sticky columns.
    const insertionLineRef = useRef<HTMLDivElement | null>(null);
    const primaryColor = theme.palette.primary.main;

    /** Get or lazily create the insertion-line overlay element */
    const getInsertionLine = useCallback((): HTMLDivElement => {
        if (insertionLineRef.current) return insertionLineRef.current;
        const line = document.createElement('div');
        Object.assign(line.style, {
            position: 'absolute',
            left: '0',
            right: '0',
            height: '2px',
            backgroundColor: primaryColor,
            pointerEvents: 'none',
            zIndex: '10',
            transition: 'top 60ms ease-out',
        });
        line.dataset.insertionLine = 'true';
        insertionLineRef.current = line;
        return line;
    }, [primaryColor]);

    /** Position the insertion line at the top or bottom edge of a row */
    const showInsertionLine = useCallback(
        (tr: HTMLElement, edge: 'top' | 'bottom') => {
            const container = tableContainerRef.current;
            if (!container) return;
            const line = getInsertionLine();
            if (!line.parentElement) container.appendChild(line);

            const containerRect = container.getBoundingClientRect();
            const trRect = tr.getBoundingClientRect();
            const y =
                edge === 'top'
                    ? trRect.top - containerRect.top + container.scrollTop
                    : trRect.bottom - containerRect.top + container.scrollTop;

            line.style.top = `${y - 1}px`;
            line.style.display = '';
        },
        [tableContainerRef, getInsertionLine]
    );

    /** Hide the insertion line */
    const hideInsertionLine = useCallback(() => {
        if (insertionLineRef.current) {
            insertionLineRef.current.style.display = 'none';
        }
    }, []);

    const prevDropTarget = useRef<HTMLElement | null>(null);
    const prevEdge = useRef<'top' | 'bottom'>('bottom');
    const dropEdgeRef = useRef<'top' | 'bottom'>('bottom');

    const muiTableBodyRowProps = useCallback(
        ({ row }: { row: MRT_Row<FormDeviceResource> }) => ({
            onDragOver: (e: DragEvent<HTMLTableRowElement>): void => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';

                const fromIndex = dragFromIndexRef.current;
                const targetIndex = row.original.formIndex;

                // Skip highlighting the row being dragged
                if (fromIndex === targetIndex) {
                    hideInsertionLine();
                    prevDropTarget.current = null;
                    return;
                }

                // Determine if cursor is in the top or bottom half
                const tr = e.currentTarget as HTMLElement;
                const rect = tr.getBoundingClientRect();
                const edge: 'top' | 'bottom' = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';

                // Only update DOM if the target row or edge changed
                if (prevDropTarget.current !== tr || prevEdge.current !== edge) {
                    showInsertionLine(tr, edge);
                    prevDropTarget.current = tr;
                    prevEdge.current = edge;
                    dropEdgeRef.current = edge;
                }
            },
            onDragLeave: (e: DragEvent<HTMLTableRowElement>): void => {
                const tr = e.currentTarget as HTMLElement;
                if (!tr.contains(e.relatedTarget as Node)) {
                    if (prevDropTarget.current === tr) {
                        hideInsertionLine();
                        prevDropTarget.current = null;
                    }
                }
            },
            onDrop: (e: DragEvent<HTMLTableRowElement>): void => {
                e.preventDefault();
                hideInsertionLine();
                prevDropTarget.current = null;

                const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const targetIndex = row.original.formIndex;
                if (isNaN(from) || from === targetIndex) return;

                // Compute the insertion index based on edge position.
                const insertBefore = dropEdgeRef.current === 'top' ? targetIndex : targetIndex + 1;
                const to = from < insertBefore ? insertBefore - 1 : insertBefore;

                if (to !== from) {
                    moveRowRef.current(from, to);
                }
            },
        }),
        [dragFromIndexRef, showInsertionLine, hideInsertionLine]
    );

    return useMemo(
        () => ({
            columns: columns as any,
            columnFilterDisplayMode: 'popover',
            data: filteredResources,
            displayColumnDefOptions,
            editDisplayMode: 'cell',
            enableBottomToolbar: true,
            enableCellActions: true,
            enableClickToCopy: 'context-menu',
            enableColumnPinning: true,
            // Note: MRT has a column resizing bug causing cell remounts.
            // See https://github.com/KevinVandy/material-react-table/issues/1477.
            enableColumnResizing: true,
            enableEditing: true,
            enableFacetedValues: true,
            enablePagination: false,
            enableRowActions: true,
            enableSorting: false,
            enableRowVirtualization: true,
            enableStickyFooter: false,
            enableStickyHeader: true,
            enableTopToolbar: true,
            getRowId: (originalRow) => originalRow.id,
            initialState: defaultInitialState,
            state: {
                showSkeletons: isPending,
                // Prevent random column ordering when switching tabs
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
            muiTableBodyRowProps,
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
            muiTableBodyRowProps,
            muiTableContainerProps,
            muiTableHeadCellProps,
            renderRowActions,
            renderBottomToolbarCustomActions,
            renderTopToolbar,
            renderEmptyRowsFallback,
        ]
    );
};
