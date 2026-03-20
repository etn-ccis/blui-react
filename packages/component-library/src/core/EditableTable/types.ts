import {
    type MRT_Cell,
    type MRT_Column,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableInstance,
    type MRT_TableOptions,
} from 'material-react-table';
import { type SxProps, type Theme } from '@mui/material';

export type EditableTableData = Record<string, any>;

/**
 * Parameters passed to per-cell callbacks such as `cellStyle`.
 */
export type CellStyleParams<TData extends EditableTableData> = {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    column: MRT_Column<TData>;
    table: MRT_TableInstance<TData>;
};

/**
 * Extended column definition for `EditableTable`.
 *
 * Extends MRT's `MRT_ColumnDef` with convenience props for styling and custom
 * cell rendering. All standard MRT column options (including `Cell` for fully
 * custom cell components) are still available.
 *
 * @example Custom cell component (e.g. a progress bar)
 * ```tsx
 * {
 *   accessorKey: 'age',
 *   header: 'Age',
 *   Cell: ({ cell }) => (
 *     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
 *       <LinearProgress variant="determinate" value={cell.getValue<number>()} sx={{ flexGrow: 1 }} />
 *       <span>{cell.getValue<number>()}</span>
 *     </Box>
 *   ),
 * }
 * ```
 *
 * @example Conditional cell styling
 * ```tsx
 * {
 *   accessorKey: 'voltage',
 *   header: 'Voltage',
 *   cellStyle: ({ cell }) => ({
 *     backgroundColor: cell.getValue<number>() > 240 ? '#ffcccc' : undefined,
 *     fontWeight: cell.getValue<number>() > 240 ? 'bold' : undefined,
 *   }),
 * }
 * ```
 */
export type EditableTableColumnDef<TData extends EditableTableData> = MRT_ColumnDef<TData> & {
    /**
     * Apply conditional MUI `sx` styles to individual cells based on cell value
     * or row data. Merged on top of any styles provided via `muiTableBodyCellProps`.
     *
     * For column-wide static styling, use `muiTableBodyCellProps: { sx: { ... } }`.
     * For per-row/per-value dynamic styling, use this prop.
     *
     * @example Highlight high voltage readings
     * ```tsx
     * cellStyle: ({ cell }) => ({
     *   backgroundColor: cell.getValue<number>() > 240
     *     ? 'rgba(255, 0, 0, 0.15)'
     *     : undefined,
     * })
     * ```
     *
     * @example Color-code a status column
     * ```tsx
     * cellStyle: ({ row }) => ({
     *   color: row.original.status === 'error' ? 'red' : 'green',
     * })
     * ```
     */
    cellStyle?: (params: CellStyleParams<TData>) => SxProps<Theme>;
};

export type EditableTableProps<TData extends EditableTableData> = {
    /**
     * Column definitions for the table.
     *
     * Use `EditableTableColumnDef<TData>` to access the `cellStyle` convenience
     * prop and `Cell` for fully custom cell rendering. All standard MRT column
     * options are supported.
     */
    columns: Array<EditableTableColumnDef<TData>>;

    /** Initial data for the table */
    data?: TData[];

    /** Whether to enable creating new rows
     *
     * Default: true
     */
    enableCreate?: boolean;

    /** Whether to enable editing rows
     *
     * Default: true
     */
    enableEdit?: boolean;

    /** Whether to enable deleting rows
     *
     * Default: true
     */
    enableDelete?: boolean;

    /** Whether to enable duplicating rows
     *
     * Default: false
     */
    enableDuplicate?: boolean;

    /** Display mode for creating rows
     * - 'modal': Create in a modal dialog
     * - 'row': Create in a new inline row
     *
     * Default: 'row'
     */
    createDisplayMode?: 'modal' | 'row';

    /** Display mode for editing rows
     * - 'modal': Edit in a modal dialog
     * - 'row': Edit the entire row inline
     * - 'cell': Edit individual cells inline
     * - 'table': Edit all cells in the table
     *
     * Default: 'cell'
     */
    editDisplayMode?: 'modal' | 'row' | 'cell' | 'table';

    /** Function to validate a row before saving */
    onValidate?: (row: TData) => Partial<Record<keyof TData, string | undefined>>;

    /** Callback when a row is created */
    onCreate?: (row: TData) => Promise<void> | void;

    /** Callback when a row is updated */
    onUpdate?: (row: TData) => Promise<void> | void;

    /** Callback when a row is deleted */
    onDelete?: (id: string | number) => Promise<void> | void;

    /** Callback when a row is duplicated */
    onDuplicate?: (row: TData) => Promise<void> | void;

    /** Function to get the unique ID for a row
     *
     * Default: (row) => row.id
     */
    getRowId?: (row: TData) => string;

    /** Whether to show loading state
     *
     * Default: false
     */
    isLoading?: boolean;

    /** Whether to show saving state
     *
     * Default: false
     */
    isSaving?: boolean;

    /** Error message to display */
    error?: string;

    /** Whether to enable column pinning
     *
     * Default: true
     */
    enableColumnPinning?: boolean;

    /** Whether to enable row actions
     *
     * Default: true
     */
    enableRowActions?: boolean;

    /** Whether to enable cell actions
     *
     * Default: false
     */
    enableCellActions?: boolean;

    /** Whether to enable click to copy
     *
     * Default: false
     */
    enableClickToCopy?: boolean | 'context-menu';

    /** Additional options to pass to material-react-table */
    tableOptions?: Partial<MRT_TableOptions<TData>>;

    /** Text for the create button
     *
     * Default: 'Create New'
     */
    createButtonText?: string;

    /** Custom confirmation message for delete action */
    deleteConfirmMessage?: string | ((row: TData) => string);

    /** Minimum height for the table container
     *
     * Default: '500px'
     */
    minHeight?: string | number;

    /**
     * Enable undo/redo support for cell edits, row additions, deletions,
     * and duplications. Adds Ctrl/Cmd+Z (undo) and Ctrl/Cmd+Shift+Z (redo)
     * keyboard shortcuts.
     *
     * History is cleared when "Save Changes" is committed so the saved state
     * becomes the new baseline.
     *
     * Default: false
     */
    enableUndoRedo?: boolean;

    /**
     * Called whenever undo/redo availability or pending-changes state changes.
     * Receives reactive flags (`canUndo`, `canRedo`, `hasPendingChanges`) and
     * stable action callbacks (`undo`, `redo`, `save`), so you can render your
     * own controls anywhere outside the table.
     *
     * Keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z) continue to work when
     * `enableUndoRedo={true}` regardless of whether this prop is provided.
     *
     * @example
     * ```tsx
     * const [tableState, setTableState] = useState<EditableTableState | null>(null);
     *
     * <MyToolbar
     *   canUndo={tableState?.canUndo}
     *   onUndo={tableState?.undo}
     *   onSave={tableState?.save}
     * />
     * <EditableTable enableUndoRedo onStateChange={setTableState} ... />
     * ```
     */
    onStateChange?: (state: EditableTableState) => void;
};

export type ValidationErrors<TData extends EditableTableData> = Partial<Record<keyof TData, string | undefined>>;

/**
 * State snapshot passed to `onStateChange`.
 * Contains both reactive flags and stable action callbacks so the parent can
 * render and wire up its own undo/redo/save controls.
 */
export type EditableTableState = {
    /** Whether there is at least one action that can be undone */
    canUndo: boolean;
    /** Whether there is at least one action that can be redone */
    canRedo: boolean;
    /** Whether there are unsaved cell edits, row additions or deletions */
    hasPendingChanges: boolean;
    /** Whether any cell currently has a validation error */
    hasValidationErrors: boolean;
    /** Undo the last recorded action */
    undo: () => void;
    /** Redo the last undone action */
    redo: () => void;
    /** Commit all pending changes (calls onUpdate for each edited row) */
    save: () => Promise<void>;
    /** Discard all pending changes and restore the table to its last saved state */
    reset: () => void;
    /** Current snapshot of all rows in the table (includes any unsaved edits) */
    tableData: unknown[];
};
