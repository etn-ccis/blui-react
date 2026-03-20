import { EditableTableColumnDef, EditableTableData } from '../types';

/**
 * Returns a resolver function for `muiTableBodyCellProps` that merges:
 * - right-alignment for numeric columns
 * - default padding / height / background
 * - any `sx` the consumer supplied via `muiTableBodyCellProps`
 * - the column's optional `cellStyle` override (highest priority)
 */
export const resolveBodyCellProps =
    <TData extends EditableTableData>(
        column: EditableTableColumnDef<TData>,
        tableData: TData[]
    ): ((cellParams: any) => any) =>
    (cellParams: any): any => {
        const isNumber =
            column.accessorKey &&
            tableData.length > 0 &&
            typeof tableData[0][column.accessorKey as keyof TData] === 'number';

        const originalProps =
            typeof column.muiTableBodyCellProps === 'function'
                ? (column.muiTableBodyCellProps as (params: any) => any)(cellParams)
                : (column.muiTableBodyCellProps ?? {});

        const customSx = column.cellStyle
            ? column.cellStyle({
                  cell: cellParams.cell,
                  row: cellParams.row,
                  column: cellParams.column,
                  table: cellParams.table,
              })
            : undefined;

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
 * Returns a resolver function for `muiTableHeadCellProps` that merges
 * center-alignment and default padding with any consumer-supplied props.
 */
export const resolveHeadCellProps =
    <TData extends EditableTableData>(column: EditableTableColumnDef<TData>): ((headParams: any) => any) =>
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
