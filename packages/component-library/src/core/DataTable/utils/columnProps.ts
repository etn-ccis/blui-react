import * as BLUIColors from '@brightlayer-ui/colors';
import { DataTableColumnDef, DataTableData } from '../types';

/**
 * Returns a resolver function for `muiTableBodyCellProps` that merges:
 * - right-alignment for numeric columns
 * - default padding / height / background
 * - any `sx` the consumer supplied via `muiTableBodyCellProps`
 * - the column's optional `cellStyle` override (highest priority)
 */
export const resolveBodyCellProps =
    <TData extends DataTableData>(column: DataTableColumnDef<TData>): ((cellParams: any) => any) =>
    (cellParams: any): any => {
        const isNumber = column.cellType === 'number';

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

        const mergedSx = ((): ((t: any) => any) => {
            const defaultSx = (t: any): Record<string, unknown> => ({
                px: 2,
                height: 52,
                backgroundColor: `${t.vars?.palette?.background?.default ?? t.palette.background.default} !important`,
                ...(t.applyStyles?.('dark', {
                    backgroundColor: `${BLUIColors.black[800]} !important`,
                }) ?? {}),
                borderRight: `1px solid ${t.vars?.palette?.divider ?? t.palette.divider}`,
                borderBottom: `1px solid ${t.vars?.palette?.divider ?? t.palette.divider}`,
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
            });
            if (typeof originalProps.sx === 'function') {
                return (t: any): Record<string, unknown> => ({
                    ...defaultSx(t),
                    ...(originalProps.sx as (t: any) => any)(t),
                    ...(customSx ?? {}),
                });
            }
            return (t: any): Record<string, unknown> => ({
                ...defaultSx(t),
                ...(originalProps.sx ?? {}),
                ...(customSx ?? {}),
            });
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
    <TData extends DataTableData>(column: DataTableColumnDef<TData>): ((headParams: any) => any) =>
    (headParams: any): any => {
        const originalProps =
            typeof column.muiTableHeadCellProps === 'function'
                ? (column.muiTableHeadCellProps as (params: any) => any)(headParams)
                : (column.muiTableHeadCellProps ?? {});

        const headerAlign = column.headerAlign ?? (column.cellType === 'number' ? 'right' : 'left');

        return {
            ...originalProps,
            sx: (t: any): Record<string, unknown> => ({
                px: 2,
                backgroundColor: `${t.vars?.palette?.background?.paper ?? t.palette.background.paper} !important`,
                borderTop: `1px solid ${t.vars?.palette?.divider ?? t.palette.divider}`,
                borderRight: `1px solid ${t.vars?.palette?.divider ?? t.palette.divider}`,
                borderBottom: `1px solid ${BLUIColors.gray[500]}`,
                ...(t.applyStyles?.('dark', {
                    borderBottom: `1px solid ${BLUIColors.black[200]}`,
                }) ?? {}),
                fontFamily: '"Open Sans"',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                '& .Mui-TableHeadCell-Content': {
                    justifyContent:
                        headerAlign === 'right' ? 'flex-end' : headerAlign === 'left' ? 'flex-start' : 'center',
                },
                '& .Mui-TableHeadCell-Content-Labels': {
                    justifyContent:
                        headerAlign === 'right' ? 'flex-end' : headerAlign === 'left' ? 'flex-start' : 'center',
                    flex: 1,
                },
                ...(typeof originalProps.sx === 'function' ? originalProps.sx(t) : (originalProps.sx ?? {})),
            }),
        };
    };
