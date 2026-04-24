// @ts-nocheck
/**
 * DataPointsTable - A props-driven editable table component
 * with support for tabs, inline editing, undo/redo, and row operations.
 */
import {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    useTransition,
    ReactNode,
} from 'react';
import {
    MaterialReactTable,
    MRT_ColumnDef,
    MRT_Row,
    MRT_TableInstance,
    MRT_RowData,
    useMaterialReactTable,
} from 'material-react-table';
import {
    Box,
    Tab,
    Tabs,
    Badge,
    Button,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Add,
    ContentCopy,
    Delete,
    DragIndicator,
} from '@mui/icons-material';
import { EmptyState } from '../EmptyState';
import {
    DataPointsTableProps,
    DataPointsColumnDef,
    DataPointsFormState,
    RowChangeEvent,
    DataPointsTab,
} from './DataPointsTableTypes';

// ---------------------------------------------------------------------------
// Internal Types
// ---------------------------------------------------------------------------

type InternalRow<T extends MRT_RowData> = T & {
    _internalId: string;
    _originalData: T;
    _errors: Record<string, string>;
    _isDirty: boolean;
};

type HistoryEntry<T extends MRT_RowData> = {
    type: 'edit' | 'add' | 'delete' | 'move';
    data: T[];
    tabId?: string;
};

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

const getNestedValue = <T extends MRT_RowData>(obj: T, path: string): unknown => {
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = (current as Record<string, unknown>)[part];
    }
    return current;
};

const setNestedValue = <T extends MRT_RowData>(obj: T, path: string, value: unknown): T => {
    const parts = path.split('.');
    if (parts.length === 1) {
        return { ...obj, [path]: value };
    }
    
    const [first, ...rest] = parts;
    const nested = (obj as Record<string, unknown>)[first] as Record<string, unknown> || {};
    return {
        ...obj,
        [first]: setNestedValue(nested as T, rest.join('.'), value),
    };
};

const formatTabLabel = (id: string): string =>
    id
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type DefaultTopToolbarProps<T extends MRT_RowData> = {
    table: MRT_TableInstance<InternalRow<T>>;
    currentTab?: string;
    tabs?: DataPointsTab[];
    onTabChange: (tabId: string) => void;
    tabErrorCounts: Map<string, number>;
    tabDirtyFlags: Set<string>;
};

function DefaultTopToolbar<T extends MRT_RowData>({
    currentTab,
    tabs,
    onTabChange,
    tabErrorCounts,
    tabDirtyFlags,
}: DefaultTopToolbarProps<T>): JSX.Element | null {
    if (!tabs || tabs.length === 0) return null;

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={currentTab}
                onChange={(_, value) => onTabChange(value)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 2 }}
            >
                {tabs.map((tab) => {
                    const errorCount = tabErrorCounts.get(tab.id) ?? 0;
                    const isDirty = tabDirtyFlags.has(tab.id);

                    return (
                        <Tab
                            key={tab.id}
                            value={tab.id}
                            label={
                                <Badge
                                    color={errorCount > 0 ? 'error' : 'primary'}
                                    variant={errorCount > 0 ? 'standard' : 'dot'}
                                    badgeContent={errorCount > 0 ? errorCount : undefined}
                                    invisible={!errorCount && !isDirty}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </Box>
                                </Badge>
                            }
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
}

type DefaultBottomToolbarProps = {
    onAdd: () => void;
    addButtonLabel: string;
    enableAdd: boolean;
};

function DefaultBottomToolbar({ onAdd, addButtonLabel, enableAdd }: DefaultBottomToolbarProps): JSX.Element | null {
    if (!enableAdd) return null;

    return (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
                variant="text"
                color="primary"
                startIcon={<Add />}
                onClick={onAdd}
            >
                {addButtonLabel}
            </Button>
        </Box>
    );
}

type DefaultRowActionsProps<T extends MRT_RowData> = {
    row: MRT_Row<InternalRow<T>>;
    enableDelete: boolean;
    enableDuplicate: boolean;
    enableRowReordering: boolean;
    onDelete: () => void;
    onDuplicate: () => void;
    dragHandleProps?: Record<string, unknown>;
};

function DefaultRowActions<T extends MRT_RowData>({
    enableDelete,
    enableDuplicate,
    enableRowReordering,
    onDelete,
    onDuplicate,
    dragHandleProps,
}: DefaultRowActionsProps<T>): JSX.Element {
    return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {enableRowReordering && (
                <IconButton
                    size="small"
                    sx={{ cursor: 'grab' }}
                    {...dragHandleProps}
                >
                    <DragIndicator fontSize="small" />
                </IconButton>
            )}
            {enableDuplicate && (
                <Tooltip title="Duplicate">
                    <IconButton size="small" onClick={onDuplicate}>
                        <ContentCopy fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            {enableDelete && (
                <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={onDelete}>
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
}

type DefaultEmptyStateProps = {
    onAdd: () => void;
    emptyStateText: string;
    emptyStateDescription?: string;
    enableAdd: boolean;
    addButtonLabel: string;
};

function DefaultEmptyState({
    onAdd,
    emptyStateText,
    emptyStateDescription,
    enableAdd,
    addButtonLabel,
}: DefaultEmptyStateProps): JSX.Element {
    return (
        <EmptyState
            icon={<Add sx={{ fontSize: 64 }} />}
            title={emptyStateText}
            description={emptyStateDescription}
            actions={
                enableAdd ? (
                    <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
                        {addButtonLabel}
                    </Button>
                ) : undefined
            }
        />
    );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DataPointsTable<T extends MRT_RowData>({
    data,
    columns,
    tabs,
    tabField = 'category',
    onChange,
    onAdd,
    onDelete,
    onDuplicate,
    onReorder,
    onFormStateChange,
    validateRow,
    enableUndoRedo = true,
    enableRowReordering = true,
    enableAdd = true,
    enableDelete = true,
    enableDuplicate = true,
    enableRowActions = true,
    addButtonLabel = 'Add Row',
    emptyStateText = 'No data points',
    emptyStateDescription,
    renderRowActions,
    renderEmptyState,
    renderTopToolbar,
    renderBottomToolbar,
    tableOptions,
    initialTab,
    loading = false,
    rowIdField = 'id',
    height = 'auto',
    maxHeight,
    minHeight = 400,
}: DataPointsTableProps<T>): JSX.Element {
    const theme = useTheme();
    const [isPending, startTransition] = useTransition();
    const tableRef = useRef<MRT_TableInstance<InternalRow<T>> | null>(null);

    // ---------------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------------

    // Determine available tabs from data if not provided
    const availableTabs = useMemo<DataPointsTab[]>(() => {
        if (tabs && tabs.length > 0) return tabs;
        
        const uniqueCategories = new Set<string>();
        data.forEach((row) => {
            const category = getNestedValue(row, tabField);
            if (typeof category === 'string' && category) {
                uniqueCategories.add(category);
            }
        });
        
        return Array.from(uniqueCategories).sort().map((id) => ({
            id,
            label: formatTabLabel(id),
        }));
    }, [tabs, data, tabField]);

    // Current tab state
    const [currentTab, setCurrentTab] = useState<string>(() => {
        if (initialTab) return initialTab;
        if (availableTabs.length > 0) return availableTabs[0].id;
        return '';
    });

    // Internal data with tracking metadata
    const [internalData, setInternalData] = useState<InternalRow<T>[]>(() =>
        data.map((row) => ({
            ...row,
            _internalId: String((row as Record<string, unknown>)[rowIdField as string] ?? generateId()),
            _originalData: row,
            _errors: validateRow?.(row) ?? {},
            _isDirty: false,
        }))
    );

    // History for undo/redo
    const [history, setHistory] = useState<HistoryEntry<T>[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // ---------------------------------------------------------------------------
    // Derived State
    // ---------------------------------------------------------------------------

    // Filter data by current tab
    const filteredData = useMemo(() => {
        if (!currentTab || availableTabs.length === 0) return internalData;
        return internalData.filter((row) => getNestedValue(row, tabField) === currentTab);
    }, [internalData, currentTab, tabField, availableTabs.length]);

    // Calculate tab error counts and dirty flags
    const [tabErrorCounts, tabDirtyFlags] = useMemo(() => {
        const errorCounts = new Map<string, number>();
        const dirtyFlags = new Set<string>();

        internalData.forEach((row) => {
            const tabId = String(getNestedValue(row, tabField) ?? '');
            if (!tabId) return;

            const errorCount = Object.keys(row._errors).length;
            if (errorCount > 0) {
                errorCounts.set(tabId, (errorCounts.get(tabId) ?? 0) + errorCount);
            }
            if (row._isDirty) {
                dirtyFlags.add(tabId);
            }
        });

        return [errorCounts, dirtyFlags];
    }, [internalData, tabField]);

    // Form state
    const formState = useMemo<DataPointsFormState<T>>(() => ({
        isDirty: internalData.some((row) => row._isDirty),
        isValid: internalData.every((row) => Object.keys(row._errors).length === 0),
        canUndo: enableUndoRedo && historyIndex >= 0,
        canRedo: enableUndoRedo && historyIndex < history.length - 1,
        undo: () => handleUndo(),
        redo: () => handleRedo(),
        reset: (newData) => handleReset(newData),
        getValues: () => internalData.map(stripInternalFields),
    }), [internalData, history, historyIndex, enableUndoRedo]);

    // ---------------------------------------------------------------------------
    // Effects
    // ---------------------------------------------------------------------------

    // Sync with external data changes
    useEffect(() => {
        setInternalData(
            data.map((row) => ({
                ...row,
                _internalId: String((row as Record<string, unknown>)[rowIdField as string] ?? generateId()),
                _originalData: row,
                _errors: validateRow?.(row) ?? {},
                _isDirty: false,
            }))
        );
    }, [data, rowIdField, validateRow]);

    // Update tab if current tab becomes invalid
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find((t) => t.id === currentTab)) {
            setCurrentTab(availableTabs[0].id);
        }
    }, [availableTabs, currentTab]);

    // Notify parent of form state changes
    useEffect(() => {
        onFormStateChange?.(formState);
    }, [formState, onFormStateChange]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        if (!enableUndoRedo) return;

        const handleKeyDown = (e: KeyboardEvent): void => {
            if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ') {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableUndoRedo, historyIndex, history.length]);

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    const stripInternalFields = useCallback((row: InternalRow<T>): T => {
        const { _internalId, _originalData, _errors, _isDirty, ...rest } = row;
        return rest as T;
    }, []);

    const pushHistory = useCallback((entry: HistoryEntry<T>) => {
        if (!enableUndoRedo) return;
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), entry]);
        setHistoryIndex((prev) => prev + 1);
    }, [enableUndoRedo, historyIndex]);

    const handleUndo = useCallback(() => {
        if (historyIndex < 0) return;
        const entry = history[historyIndex];
        setInternalData(
            entry.data.map((row) => ({
                ...row,
                _internalId: String((row as Record<string, unknown>)[rowIdField as string] ?? generateId()),
                _originalData: row,
                _errors: validateRow?.(row) ?? {},
                _isDirty: false,
            }))
        );
        setHistoryIndex((prev) => prev - 1);
        if (entry.tabId && entry.tabId !== currentTab) {
            setCurrentTab(entry.tabId);
        }
    }, [history, historyIndex, rowIdField, validateRow, currentTab]);

    const handleRedo = useCallback(() => {
        if (historyIndex >= history.length - 1) return;
        const entry = history[historyIndex + 1];
        setInternalData(
            entry.data.map((row) => ({
                ...row,
                _internalId: String((row as Record<string, unknown>)[rowIdField as string] ?? generateId()),
                _originalData: row,
                _errors: validateRow?.(row) ?? {},
                _isDirty: false,
            }))
        );
        setHistoryIndex((prev) => prev + 1);
        if (entry.tabId && entry.tabId !== currentTab) {
            setCurrentTab(entry.tabId);
        }
    }, [history, historyIndex, rowIdField, validateRow, currentTab]);

    const handleReset = useCallback((newData?: T[]) => {
        const resetData = newData ?? data;
        setInternalData(
            resetData.map((row) => ({
                ...row,
                _internalId: String((row as Record<string, unknown>)[rowIdField as string] ?? generateId()),
                _originalData: row,
                _errors: validateRow?.(row) ?? {},
                _isDirty: false,
            }))
        );
        setHistory([]);
        setHistoryIndex(-1);
    }, [data, rowIdField, validateRow]);

    // ---------------------------------------------------------------------------
    // Event Handlers
    // ---------------------------------------------------------------------------

    const handleTabChange = useCallback((tabId: string) => {
        if (tabId === currentTab) return;
        startTransition(() => setCurrentTab(tabId));
    }, [currentTab]);

    const handleCellEdit = useCallback((rowIndex: number, field: string, value: unknown) => {
        setInternalData((prev) => {
            const newData = [...prev];
            const row = newData[rowIndex];
            const previousValue = getNestedValue(row, field);
            
            const updatedRow = setNestedValue(row, field, value) as InternalRow<T>;
            updatedRow._isDirty = true;
            updatedRow._errors = validateRow?.(stripInternalFields(updatedRow)) ?? {};
            newData[rowIndex] = updatedRow;

            // Notify parent
            const event: RowChangeEvent<T> = {
                row: stripInternalFields(updatedRow),
                rowIndex,
                field,
                previousValue,
                newValue: value,
                type: 'edit',
            };
            onChange?.(newData.map(stripInternalFields), event);

            // Push to history
            pushHistory({
                type: 'edit',
                data: prev.map(stripInternalFields),
                tabId: currentTab,
            });

            return newData;
        });
    }, [onChange, validateRow, stripInternalFields, pushHistory, currentTab]);

    const handleAddRow = useCallback(() => {
        const newRow = onAdd?.(currentTab);
        if (!newRow) return;

        setInternalData((prev) => {
            const internalRow: InternalRow<T> = {
                ...newRow,
                _internalId: generateId(),
                _originalData: newRow,
                _errors: validateRow?.(newRow) ?? {},
                _isDirty: true,
            };
            const newData = [...prev, internalRow];

            // Notify parent
            const event: RowChangeEvent<T> = {
                row: newRow,
                rowIndex: newData.length - 1,
                type: 'add',
            };
            onChange?.(newData.map(stripInternalFields), event);

            // Push to history
            pushHistory({
                type: 'add',
                data: prev.map(stripInternalFields),
                tabId: currentTab,
            });

            return newData;
        });
    }, [onAdd, currentTab, onChange, validateRow, stripInternalFields, pushHistory]);

    const handleDeleteRow = useCallback((rowIndex: number) => {
        const row = internalData[rowIndex];
        if (onDelete?.(stripInternalFields(row), rowIndex) === false) return;

        setInternalData((prev) => {
            const newData = prev.filter((_, i) => i !== rowIndex);

            // Notify parent
            const event: RowChangeEvent<T> = {
                row: stripInternalFields(row),
                rowIndex,
                type: 'delete',
            };
            onChange?.(newData.map(stripInternalFields), event);

            // Push to history
            pushHistory({
                type: 'delete',
                data: prev.map(stripInternalFields),
                tabId: currentTab,
            });

            return newData;
        });
    }, [internalData, onDelete, onChange, stripInternalFields, pushHistory, currentTab]);

    const handleDuplicateRow = useCallback((rowIndex: number) => {
        const row = internalData[rowIndex];
        const duplicated = onDuplicate?.(stripInternalFields(row));
        if (!duplicated) return;

        setInternalData((prev) => {
            const internalRow: InternalRow<T> = {
                ...duplicated,
                _internalId: generateId(),
                _originalData: duplicated,
                _errors: validateRow?.(duplicated) ?? {},
                _isDirty: true,
            };
            const newData = [...prev.slice(0, rowIndex + 1), internalRow, ...prev.slice(rowIndex + 1)];

            // Notify parent
            const event: RowChangeEvent<T> = {
                row: duplicated,
                rowIndex: rowIndex + 1,
                type: 'duplicate',
            };
            onChange?.(newData.map(stripInternalFields), event);

            // Push to history
            pushHistory({
                type: 'add',
                data: prev.map(stripInternalFields),
                tabId: currentTab,
            });

            return newData;
        });
    }, [internalData, onDuplicate, onChange, validateRow, stripInternalFields, pushHistory, currentTab]);

    const handleMoveRow = useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        onReorder?.(fromIndex, toIndex);

        setInternalData((prev) => {
            const newData = [...prev];
            const [removed] = newData.splice(fromIndex, 1);
            newData.splice(toIndex, 0, removed);

            // Notify parent
            const event: RowChangeEvent<T> = {
                row: stripInternalFields(removed),
                rowIndex: toIndex,
                type: 'move',
            };
            onChange?.(newData.map(stripInternalFields), event);

            // Push to history
            pushHistory({
                type: 'move',
                data: prev.map(stripInternalFields),
                tabId: currentTab,
            });

            return newData;
        });
    }, [onReorder, onChange, stripInternalFields, pushHistory, currentTab]);

    // ---------------------------------------------------------------------------
    // MRT Column Definitions
    // ---------------------------------------------------------------------------

    const mrtColumns = useMemo<MRT_ColumnDef<InternalRow<T>>[]>(() => 
        columns.map((col) => ({
            ...col,
            accessorFn: col.fieldPath 
                ? (row: InternalRow<T>) => getNestedValue(row, col.fieldPath!)
                : col.accessorFn,
            muiEditTextFieldProps: col.editable !== false ? ({ row, column }) => ({
                error: !!row.original._errors[col.fieldPath ?? column.id],
                helperText: row.original._errors[col.fieldPath ?? column.id],
                onBlur: (e) => {
                    const field = col.fieldPath ?? column.id;
                    const rowIndex = internalData.findIndex((r) => r._internalId === row.original._internalId);
                    if (rowIndex >= 0) {
                        handleCellEdit(rowIndex, field, e.target.value);
                    }
                },
            }) : undefined,
            enableEditing: col.editable !== false,
        })) as MRT_ColumnDef<InternalRow<T>>[],
    [columns, internalData, handleCellEdit]);

    // ---------------------------------------------------------------------------
    // MRT Table Configuration
    // ---------------------------------------------------------------------------

    const table = useMaterialReactTable({
        columns: mrtColumns,
        data: filteredData,
        enableEditing: true,
        editDisplayMode: 'cell',
        enableRowActions: enableRowActions,
        positionActionsColumn: 'last',
        enableRowOrdering: enableRowReordering,
        enableSorting: false,
        enablePagination: false,
        enableBottomToolbar: enableAdd,
        enableTopToolbar: availableTabs.length > 0,
        getRowId: (row) => row._internalId,
        state: {
            isLoading: loading,
            showProgressBars: isPending,
        },
        muiTableContainerProps: {
            sx: {
                height,
                maxHeight,
                minHeight,
            },
        },
        renderTopToolbar: ({ table }) => 
            renderTopToolbar?.({ currentTab, tabs: availableTabs }) ?? (
                <DefaultTopToolbar
                    table={table}
                    currentTab={currentTab}
                    tabs={availableTabs}
                    onTabChange={handleTabChange}
                    tabErrorCounts={tabErrorCounts}
                    tabDirtyFlags={tabDirtyFlags}
                />
            ),
        renderBottomToolbarCustomActions: () =>
            renderBottomToolbar?.({ onAdd: handleAddRow }) ?? (
                <DefaultBottomToolbar
                    onAdd={handleAddRow}
                    addButtonLabel={addButtonLabel}
                    enableAdd={enableAdd}
                />
            ),
        renderRowActions: ({ row }) => {
            const rowIndex = internalData.findIndex((r) => r._internalId === row.original._internalId);
            return renderRowActions?.({
                row: stripInternalFields(row.original),
                rowIndex,
                onDelete: () => handleDeleteRow(rowIndex),
                onDuplicate: () => handleDuplicateRow(rowIndex),
            }) ?? (
                <DefaultRowActions
                    row={row}
                    enableDelete={enableDelete}
                    enableDuplicate={enableDuplicate}
                    enableRowReordering={enableRowReordering}
                    onDelete={() => handleDeleteRow(rowIndex)}
                    onDuplicate={() => handleDuplicateRow(rowIndex)}
                />
            );
        },
        renderEmptyRowsFallback: () =>
            renderEmptyState?.({ onAdd: handleAddRow }) ?? (
                <DefaultEmptyState
                    onAdd={handleAddRow}
                    emptyStateText={emptyStateText}
                    emptyStateDescription={emptyStateDescription}
                    enableAdd={enableAdd}
                    addButtonLabel={addButtonLabel}
                />
            ),
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (draggingRow && hoveredRow) {
                    const fromIndex = internalData.findIndex((r) => r._internalId === draggingRow.original._internalId);
                    const toIndex = internalData.findIndex((r) => r._internalId === (hoveredRow as MRT_Row<InternalRow<T>>).original._internalId);
                    handleMoveRow(fromIndex, toIndex);
                }
            },
        }),
        ...tableOptions,
    });

    tableRef.current = table;

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return <MaterialReactTable table={table} />;
}

export default DataPointsTable;
