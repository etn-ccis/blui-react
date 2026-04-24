// @ts-nocheck
import { useState, useCallback, useMemo, useTransition, useEffect, useRef, useSyncExternalStore } from 'react';
import {
    MaterialReactTable,
    MRT_Column,
    MRT_Row,
    MRT_TableInstance,
    useMaterialReactTable,
} from 'material-react-table';
import { useTheme } from '@mui/material';
import { ProtocolRegistry } from '../DeviceProtocolConfiguration/ProtocolRegistry';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';
import { DeviceResource } from './schemas/DeviceProfileSchema';
import { TopToolbar } from './TopToolbar';
import { BottomToolbar } from './BottomToolbar';
import { RowActions } from './RowActions';
import { CommandAlertSnackbar } from './CommandAlertSnackbar';
import { useDataPointCommandDialog } from './contexts/DataPointCommandDialogContext';
import { DataPointCommandDialog } from './DataPointCommandDialog';
import { createColumns } from './AttributeColumn';
import { useCommandAlert } from './hooks/useCommandAlert';
import { FormDeviceResource, DataPointsStoreProvider, useDataPointsStore } from './hooks/useDataPointsStore';
import { useTableConfig } from './hooks/useTableConfig';
import { useTableHeight } from './hooks/useTableHeight';
import { constrainSchemaProperties, getUniquePointTypes as getUniqueResourceTypes } from './SchemaUtils';
import { FormStateManager } from './hooks/useFormStateManager';
import { EmptyRowsFallback } from './EmptyRowsFallback';
import { ProtocolType } from './schemas/ProtocolSchemas';

type DataPointsTableProps = {
    device?: DeviceConfiguration;
    deviceResources?: DeviceResource[];
    newDevice?: boolean;
    protocolType?: ProtocolType; //when no device is provided (creating a profile in the profile page)
    onFormStateReady?: (state: FormStateManager) => void;
};

export const DataPointsTable = ({
    device,
    deviceResources,
    newDevice,
    protocolType,
    onFormStateReady,
}: DataPointsTableProps): JSX.Element => {
    const theme = useTheme();

    // Set up transition hook to allow smooth tab changes
    const [isPending, startTransition] = useTransition();

    // Set up table height management hook to prevent layout shifts
    const { tableContainerRef, minHeight, captureHeight } = useTableHeight(isPending);

    // Set up command alert snackbar hook and command dialog hook
    const { commandAlert, setCommandAlert, closeAlert } = useCommandAlert();
    const [openDialog, closeDialog] = useDataPointCommandDialog();

    // Get protocol schema and unique resource types (e.g. analog inputs, binary outputs, etc.)
    const protocol = useMemo(() => protocolType ?? ProtocolRegistry.getType(device!.protocols), [device, protocolType]);
    const schema = useMemo(() => ProtocolRegistry.getResourceSchema(protocol), [protocol]);
    const propertiesConstraints = useMemo(
        () => ProtocolRegistry.getResourcePropertiesConstraints(protocol),
        [protocol]
    );
    const uniqueResourceTypes = useMemo(() => getUniqueResourceTypes(schema), [schema]);

    // Initialize currentTab with the first resource type
    const [currentTab, setCurrentTab] = useState<string>(() => uniqueResourceTypes[0] || '');

    // Update tab if uniqueResourceTypes changes and current tab is invalid
    useEffect(() => {
        if (uniqueResourceTypes.length > 0 && !uniqueResourceTypes.includes(currentTab)) {
            setCurrentTab(uniqueResourceTypes[0]);
        }
    }, [uniqueResourceTypes, currentTab]);

    // Initialize the data points store
    const store = useDataPointsStore(schema, deviceResources);

    // Subscribe to all store changes for aggregate state (isDirty, dirtyTabs, etc.)
    const storeVersion = useSyncExternalStore(store.subscribe, store.getVersion);

    // Subscribe to structural changes (add/delete/move/reset) for filteredResources.
    // Field edits don't change filteredResources identity, avoiding unnecessary MRT re-renders.
    const structuralVersion = useSyncExternalStore(store.subscribe, store.getStructuralVersion);

    // Reset store when deviceResources prop changes
    const prevDeviceResourcesRef = useRef(deviceResources);
    useEffect(() => {
        if (deviceResources && deviceResources !== prevDeviceResourcesRef.current) {
            prevDeviceResourcesRef.current = deviceResources;
            store.reset({ deviceResources });
        }
    }, [deviceResources, store]);

    // Create a ref to store the table instance
    const tableRef = useRef<MRT_TableInstance<FormDeviceResource> | null>(null);

    // Tracks which formIndex is being dragged (shared with RowActions + useTableConfig)
    const dragFromIndexRef = useRef<number | null>(null);

    // Create cell focus helper that uses the tableRef
    const focusCell = useCallback((rowIndex: number, columnId: string) => {
        if (!tableRef.current) return;

        // Wait for the table to render
        requestAnimationFrame(() => {
            const rows = tableRef.current!.getRowModel().rows;
            const row = rows.find((r) => r.original.formIndex === rowIndex);

            if (!row) return;

            const cell = row.getAllCells().find((c) => c.column.id === columnId);

            if (cell) {
                // Set editing cell
                tableRef.current!.setEditingCell(cell);

                // editDisplayMode: 'cell' mounts the Edit component lazily.
                // rAF waits for the next paint so the input ref is available.
                requestAnimationFrame(() => {
                    const input = tableRef.current!.refs.editInputRefs.current?.[columnId];
                    if (input) {
                        input.focus();
                        if (input.type !== 'checkbox') {
                            input.select?.();
                        }
                    }
                });

                // Scroll to the row
                const rowElement = document.querySelector(`[data-index="${row.index}"]`)!;
                if (rowElement) {
                    rowElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
            }
        });
    }, []);

    // Handle undo/redo with tab switching and cell focus
    const handleUndo = useCallback(() => {
        const result = store.undo();
        if (result?.tabType && result.tabType !== currentTab) {
            setCurrentTab(result.tabType);
        }
        // Focus the cell after potential tab switch
        if (result?.rowIndex !== undefined && result?.columnId) {
            setTimeout(() => {
                focusCell(result.rowIndex!, result.columnId!);
            }, 100);
        }
    }, [store, currentTab, focusCell]);

    const handleRedo = useCallback(() => {
        const result = store.redo();
        if (result?.tabType && result.tabType !== currentTab) {
            setCurrentTab(result.tabType);
        }
        // Focus the cell after potential tab switch
        if (result?.rowIndex !== undefined && result?.columnId) {
            setTimeout(() => {
                focusCell(result.rowIndex!, result.columnId!);
            }, 100);
        }
    }, [store, currentTab, focusCell]);

    // Add keyboard shortcuts
    useEffect(() => {
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
        return (): void => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    // Read aggregate state from the store
    const isDirty = store.isDirty;
    const isValid = store.isValid;
    const canUndo = store.canUndo;
    const canRedo = store.canRedo;

    // Ref to hold latest form state and notify parent only when values change
    const formStateRef = useRef<{ isDirty: boolean; isValid: boolean; canUndo: boolean; canRedo: boolean } | null>(
        null
    );
    useEffect(() => {
        const prev = formStateRef.current;
        const changed =
            prev?.isDirty !== isDirty ||
            prev.isValid !== isValid ||
            prev.canUndo !== canUndo ||
            prev.canRedo !== canRedo;

        formStateRef.current = { isDirty, isValid, canUndo, canRedo };

        if (changed) {
            onFormStateReady?.({
                reset: (values?: any) => store.reset(values),
                getValues: () => store.getFormValues(),
                isDirty,
                isValid,
                undo: handleUndo,
                redo: handleRedo,
                canUndo,
                canRedo,
            });
        }
    }, [store, isDirty, isValid, handleUndo, handleRedo, canUndo, canRedo, onFormStateReady]);

    // Filter resources by current tab.
    // Only recomputed on structural changes or tab switch (not field edits).
    // This means MRT's built-in filtering sees stale row.original values until
    // the next structural change, but cell rendering is unaffected since cells
    // read directly from the store. Recomputing on every field edit would cascade
    // into rebuilding columns and the full table config on every keystroke.
    const filteredResources = useMemo(() => {
        if (!currentTab) return [];
        return store.getFilteredResources(currentTab);
    }, [store, currentTab, structuralVersion]);

    // Compute dirty tabs and error counts from the store
    const dirtyTabs = useMemo(() => store.dirtyTabs, [storeVersion, store]);
    const tabErrorCounts = useMemo(() => store.tabErrorCounts, [storeVersion, store]);

    // Serialize for stable identity
    const dirtyTabsKey = useMemo(() => [...dirtyTabs].sort().join(','), [dirtyTabs]);
    const stableDirtyTabs = useMemo(() => dirtyTabs, [dirtyTabsKey]);

    const tabErrorCountsKey = useMemo(
        () =>
            [...tabErrorCounts.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${k}:${v}`)
                .join(','),
        [tabErrorCounts]
    );
    const stableTabErrorCounts = useMemo(() => tabErrorCounts, [tabErrorCountsKey]);

    // Create columns for the table.
    // filteredResources is included so the name column auto-sizes to the longest name.
    // Recomputed when rows are added/removed or the tab changes (not on every keystroke)
    const columns = useMemo(() => {
        const cols = createColumns(schema, propertiesConstraints, currentTab, device, newDevice);
        if (filteredResources.length > 0) {
            const longestNameLength = filteredResources.reduce(
                (max, field) => Math.max(max, field.name?.length || 0),
                0
            );
            const nameColumn = cols.find((col) => col.id === 'name');
            if (nameColumn) {
                nameColumn.size = longestNameLength * 8.8 + 32;
            }
        }
        return cols;
    }, [schema, propertiesConstraints, currentTab, device, newDevice, filteredResources]);

    // Handle tab changes in the top toolbar
    const handleTabChange = useCallback(
        (_: React.SyntheticEvent, newTab: string) => {
            if (newTab === currentTab) return;
            captureHeight();
            startTransition(() => setCurrentTab(newTab));
        },
        [currentTab, captureHeight]
    );

    // Handle commands on "output" data points
    const handleCommand = useCallback(
        (deviceResource: FormDeviceResource) => {
            if (!device) return;
            openDialog({
                children: (
                    <DataPointCommandDialog
                        device={device}
                        deviceResource={deviceResource}
                        onClose={closeDialog}
                        setCommandAlert={setCommandAlert}
                    />
                ),
                slotProps: { paper: { elevation: 0 } },
            });
        },
        [device, openDialog, closeDialog, setCommandAlert]
    );

    // Handle adding, duplicating and deleting data points
    const handleAdd = useCallback(() => {
        const defaultProperties = constrainSchemaProperties(schema, propertiesConstraints, currentTab);

        // Check which type of attributes we have to get its schema
        const attributesSchema = schema.shape.attributes.options
            .find((opt) => opt.shape.type.value === currentTab)
            ?.partial();

        const newResource = {
            attributes: attributesSchema?.parse({ type: currentTab }) ?? { type: currentTab },
            properties: defaultProperties.shape.properties.parse({}),
        } as DeviceResource;

        const newIndex = store.addRow(newResource);
        store.recordAdd(newIndex, newResource);
        store.validate(newIndex);

        // Use double rAF to ensure all rendering is complete
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                focusCell(newIndex, 'name');
            });
        });
    }, [store, currentTab, schema, propertiesConstraints, focusCell]);

    const handleDuplicate = useCallback(
        (resource: FormDeviceResource) => {
            const duplicatedResource = { ...resource };
            // Remove store-specific fields before duplicating
            delete (duplicatedResource as any).formIndex;
            delete (duplicatedResource as any).id;

            const newIndex = store.addRow(duplicatedResource as DeviceResource);
            store.recordAdd(newIndex, duplicatedResource as DeviceResource);
            store.validate(newIndex);

            // Focus on the name cell of the duplicated row
            setTimeout(() => {
                focusCell(newIndex, 'name');
            }, 100);
        },
        [store, focusCell]
    );

    const handleDelete = useCallback(
        (index: number) => {
            const rowData = store.getResource(index);
            // Record before removing so the row data is captured
            store.recordDelete(index, rowData);
            store.deleteRow(index);
        },
        [store]
    );

    const handleMoveRow = useCallback(
        (fromIndex: number, toIndex: number) => {
            if (fromIndex === toIndex) return;
            store.recordMove(fromIndex, toIndex);
            store.moveRow(fromIndex, toIndex);
        },
        [store]
    );

    // Render the top toolbar containing the tabs and other controls
    const renderTopToolbar = useCallback(
        ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => (
            <TopToolbar
                table={table}
                currentTab={currentTab}
                uniquePointTypes={uniqueResourceTypes}
                dirtyTabs={stableDirtyTabs}
                tabErrorCounts={stableTabErrorCounts}
                onTabChange={handleTabChange}
            />
        ),
        [currentTab, uniqueResourceTypes, stableDirtyTabs, stableTabErrorCounts, handleTabChange]
    );

    // Render the bottom toolbar containing the "Add Data Point" button
    const renderBottomToolbarCustomActions = useCallback(
        () => <BottomToolbar onAddDataPoint={handleAdd} />,
        [handleAdd]
    );

    // Render the actions available for each row, such as command, duplicate, and delete
    const renderRowActions = useCallback(
        ({ row }: { row: MRT_Row<FormDeviceResource> }) => (
            <RowActions
                row={row}
                device={device}
                newDevice={newDevice}
                onCommand={handleCommand}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                dragFromIndexRef={dragFromIndexRef}
            />
        ),
        [device, newDevice, handleCommand, handleDuplicate, handleDelete, dragFromIndexRef]
    );

    // Render an empty state when there are no data points, with an option to add a new one
    const renderEmptyRowsFallback = useCallback(() => <EmptyRowsFallback onAddDataPoint={handleAdd} />, [handleAdd]);

    // Set up table configuration hook
    const tableConfig = useTableConfig({
        columns: columns as Array<MRT_Column<FormDeviceResource>>,
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
        onMoveRow: handleMoveRow,
        dragFromIndexRef,
    });

    // Finally, create the table instance and store it in the ref
    const table = useMaterialReactTable(tableConfig);
    tableRef.current = table;

    // Render table within the store provider
    return (
        <DataPointsStoreProvider value={store}>
            <MaterialReactTable table={table} />
            <CommandAlertSnackbar commandAlert={commandAlert} onClose={closeAlert} />
        </DataPointsStoreProvider>
    );
};
