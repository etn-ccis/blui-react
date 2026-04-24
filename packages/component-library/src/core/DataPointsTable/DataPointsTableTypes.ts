/**
 * Types for the DataPointsTable component - a props-driven editable table
 * with support for tabs, inline editing, undo/redo, and row operations.
 */

import { MRT_ColumnDef, MRT_TableOptions, MRT_RowData } from 'material-react-table';
import { ReactNode } from 'react';

/**
 * Configuration for a tab/category in the table
 */
export type DataPointsTab = {
    /** Unique identifier for the tab */
    id: string;
    /** Display label for the tab */
    label: string;
    /** Optional icon to show in the tab */
    icon?: ReactNode;
};

/**
 * Column definition extending MRT's column definition with additional features
 */
export type DataPointsColumnDef<T extends MRT_RowData> = MRT_ColumnDef<T> & {
    /** Field path for nested data (e.g., "attributes.index") */
    fieldPath?: string;
    /** Whether this column is editable */
    editable?: boolean;
    /** Custom validation function */
    validate?: (value: unknown, row: T) => string | undefined;
    /** Default value when creating new rows */
    defaultValue?: unknown;
};

/**
 * Row change event details
 */
export type RowChangeEvent<T extends MRT_RowData> = {
    /** The row that was changed */
    row: T;
    /** The row index */
    rowIndex: number;
    /** The field that was changed (for field edits) */
    field?: string;
    /** The previous value (for field edits) */
    previousValue?: unknown;
    /** The new value (for field edits) */
    newValue?: unknown;
    /** Type of change */
    type: 'add' | 'edit' | 'delete' | 'duplicate' | 'move';
};

/**
 * Form state provided to parent components
 */
export type DataPointsFormState<T extends MRT_RowData> = {
    /** Whether any rows have unsaved changes */
    isDirty: boolean;
    /** Whether all rows pass validation */
    isValid: boolean;
    /** Whether undo is available */
    canUndo: boolean;
    /** Whether redo is available */
    canRedo: boolean;
    /** Perform undo operation */
    undo: () => void;
    /** Perform redo operation */
    redo: () => void;
    /** Reset the form to initial state or new data */
    reset: (data?: T[]) => void;
    /** Get current form values */
    getValues: () => T[];
};

/**
 * Props for the DataPointsTable component
 */
export type DataPointsTableProps<T extends MRT_RowData> = {
    /**
     * Array of data rows to display and edit.
     * Each row should have a unique 'id' field.
     */
    data: T[];

    /**
     * Column definitions for the table.
     * Extends Material React Table's column definitions.
     */
    columns: DataPointsColumnDef<T>[];

    /**
     * Optional tabs/categories for organizing rows.
     * When provided, rows will be filtered by a 'category' or custom field.
     */
    tabs?: DataPointsTab[];

    /**
     * Field name used to determine which tab a row belongs to.
     * Supports nested paths like "attributes.type".
     * @default "category"
     */
    tabField?: string;

    /**
     * Callback when data changes (edit, add, delete, move).
     * Provides the updated data array.
     */
    onChange?: (data: T[], event: RowChangeEvent<T>) => void;

    /**
     * Callback when a row is added.
     * Should return the new row data, or undefined to cancel.
     */
    onAdd?: (currentTab?: string) => T | undefined;

    /**
     * Callback when a row is deleted.
     * Return false to prevent deletion.
     */
    onDelete?: (row: T, rowIndex: number) => boolean | void;

    /**
     * Callback when a row is duplicated.
     * Should return the duplicated row data, or undefined to cancel.
     */
    onDuplicate?: (row: T) => T | undefined;

    /**
     * Callback when rows are reordered.
     */
    onReorder?: (fromIndex: number, toIndex: number) => void;

    /**
     * Callback to receive form state for external control.
     */
    onFormStateChange?: (formState: DataPointsFormState<T>) => void;

    /**
     * Validate a row. Return an object mapping field names to error messages.
     */
    validateRow?: (row: T) => Record<string, string> | undefined;

    /**
     * Enable undo/redo functionality.
     * @default true
     */
    enableUndoRedo?: boolean;

    /**
     * Enable row reordering via drag and drop.
     * @default true
     */
    enableRowReordering?: boolean;

    /**
     * Enable adding new rows.
     * @default true
     */
    enableAdd?: boolean;

    /**
     * Enable deleting rows.
     * @default true
     */
    enableDelete?: boolean;

    /**
     * Enable duplicating rows.
     * @default true
     */
    enableDuplicate?: boolean;

    /**
     * Enable row actions column (delete, duplicate, etc.).
     * @default true
     */
    enableRowActions?: boolean;

    /**
     * Label for the "Add" button.
     * @default "Add Row"
     */
    addButtonLabel?: string;

    /**
     * Text to display when the table is empty.
     * @default "No data points"
     */
    emptyStateText?: string;

    /**
     * Description for the empty state.
     */
    emptyStateDescription?: string;

    /**
     * Custom render function for row actions.
     */
    renderRowActions?: (props: { row: T; rowIndex: number; onDelete: () => void; onDuplicate: () => void }) => ReactNode;

    /**
     * Custom render function for the empty state.
     */
    renderEmptyState?: (props: { onAdd: () => void }) => ReactNode;

    /**
     * Custom render function for the top toolbar.
     */
    renderTopToolbar?: (props: { currentTab?: string; tabs?: DataPointsTab[] }) => ReactNode;

    /**
     * Custom render function for the bottom toolbar.
     */
    renderBottomToolbar?: (props: { onAdd: () => void }) => ReactNode;

    /**
     * Additional MRT table options to pass through.
     */
    tableOptions?: Partial<MRT_TableOptions<T>>;

    /**
     * Initial tab to display (when tabs are provided).
     */
    initialTab?: string;

    /**
     * Whether the table is in a loading state.
     * @default false
     */
    loading?: boolean;

    /**
     * Unique identifier field for rows.
     * @default "id"
     */
    rowIdField?: keyof T | string;

    /**
     * Height of the table container.
     * @default "auto"
     */
    height?: string | number;

    /**
     * Maximum height of the table container.
     */
    maxHeight?: string | number;

    /**
     * Minimum height of the table container.
     * @default 400
     */
    minHeight?: string | number;
};

/**
 * Helper type for extracting row data type from columns
 */
export type InferRowType<C extends DataPointsColumnDef<any>[]> = C extends DataPointsColumnDef<infer T>[] ? T : never;
