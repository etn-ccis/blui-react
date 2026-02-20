/**
 * EditableTable - A reusable editable table component with validation, undo/redo, and real-time features
 */

// Main components
export * from './EditableTable';
export * from './DataPointsTable';

// Contexts
export * from './contexts/DataPointCommandDialogContext';
export * from './contexts/RecordChangeContext';

// Hooks
export * from './hooks/useCommandAlert';
export * from './hooks/useDataPointsForm';
export * from './hooks/useFormHistory';
export * from './hooks/useFormStateManager';
export * from './hooks/useTableConfig';
export * from './hooks/useTableHeight';

// Utilities
export * from './SchemaUtils';

// Sub-components (optional - export if needed by consumers)
export { CommandAlertSnackbar } from './CommandAlertSnackbar';
export { EmptyRowsFallback } from './EmptyRowsFallback';
