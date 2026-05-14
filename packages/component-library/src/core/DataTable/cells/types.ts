import { type MRT_Cell, type MRT_Row } from 'material-react-table';
import { type Theme } from '@mui/material';
import { DataTableData, ValidationErrors } from '../types';

/**
 * Common parameters passed to all cell components
 */
export type BaseCellProps<TData extends DataTableData> = {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    renderedCellValue: React.ReactNode;
    validationErrors: ValidationErrors<TData>;
    editedRows: Record<string, TData>;
    originalDataMap: Map<string, TData>;
    theme: Theme;
};

/**
 * Props for TextNumberCell (handles both text and number types)
 */
export type TextNumberCellProps<TData extends DataTableData> = BaseCellProps<TData>;

/**
 * Props for SelectCell (dropdown)
 */
export type SelectCellProps<TData extends DataTableData> = BaseCellProps<TData> & {
    /** Additional select-specific props if needed */
};

/**
 * Props for BinaryCell (checkbox)
 */
export type BinaryCellProps<TData extends DataTableData> = BaseCellProps<TData> & {
    /** Additional checkbox-specific props if needed */
};
