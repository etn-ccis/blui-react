import { useState, useCallback, useMemo, useTransition, useEffect, useRef, JSX } from 'react';
import { FieldArrayWithId, FormProvider } from 'react-hook-form';
import {
    MaterialReactTable,
    MRT_Column,
    MRT_ColumnDef,
    MRT_Row,
    MRT_TableInstance,
    useMaterialReactTable,
} from 'material-react-table';
import { useTheme } from '@mui/material';
import { z } from 'zod';
import { TopToolbar } from './TopToolbar';
import { BottomToolbar } from './BottomToolbar';
import { RowActions } from './RowActions';
import { CommandAlertSnackbar } from './CommandAlertSnackbar';
import { useDataPointCommandDialog } from './contexts/DataPointCommandDialogContext';
import { DataPointCommandDialog } from './DataPointCommandDialog';
import { createColumns } from './AttributeColumn';
import { useCommandAlert } from './hooks/useCommandAlert';
import { FormDeviceResource, useDataPointsForm } from './hooks/useDataPointsForm';
import { useTableConfig } from './hooks/useTableConfig';
import { useTableHeight } from './hooks/useTableHeight';
import { constrainSchemaProperties, getUniquePointTypes as getUniqueResourceTypes } from './SchemaUtils';
import { RecordChangeProvider } from './contexts/RecordChangeContext';
import { FormStateManager } from './hooks/useFormStateManager';
import { EmptyRowsFallback } from './EmptyRowsFallback';
import { ResourceSchema, ResourcePropertiesConstraints } from './SchemaUtils';

export type EditableTableProps<T extends Record<string, any> = Record<string, any>> = {
    /** Zod schema for validating resources (optional if columns provided) */
    schema?: ResourceSchema;
    /** Initial data/resources to display */
    data?: T[];
    /** Custom column definitions - if provided, schema-based columns are ignored */
    columns?: Array<MRT_ColumnDef<T>>;
    /** Tab labels - if provided, enables tabbed view */
    tabs?: string[];
    /** Current active tab */
    currentTab?: string;
    /** Callback when tab changes */
    onTabChange?: (tab: string) => void;
    /** Constraints for resource properties per type (only used with schema-based columns) */
    propertiesConstraints?: ResourcePropertiesConstraints;
    /** Whether this is a new device (hides certain features) */
    isNew?: boolean;
    /** Callback when form state manager is ready */
    onFormStateReady?: (state: FormStateManager) => void;
    /** Optional command handler for items */
    onCommand?: (resource: T) => void;
    /** Optional custom device data for commands/real-time features */
    device?: any;
    /** Optional custom command sender function for DataPointCommandDialog */
    onSendCommand?: (device: any, resourceName: string, value: any) => Promise<{ statusCode: number; message?: string }>;
};

export const EditableTable = <T extends Record<string, any> = Record<string, any>>({
    schema,
    data,
    columns: customColumns,
    tabs: customTabs,
    currentTab: controlledCurrentTab,
    onTabChange: onTabChangeCallback,
    propertiesConstraints = {},
    isNew = false,
    onFormStateReady,
    onCommand,
    device,
    onSendCommand,
}: EditableTableProps<T>): JSX.Element => {
    const theme = useTheme();

    // Set up transition hook to allow smooth tab changes
    const [isPending, startTransition] = useTransition();

    // Determine if using custom columns or schema-based
    const isCustomMode = !!customColumns;

    // Create a stable fallback schema for custom mode
    const fallbackSchema = useMemo(() => z.object({}).passthrough(), []);

    // Get unique resource types (for schema-based mode only)
    const uniqueResourceTypes = useMemo(
        () => (isCustomMode ? customTabs || [] : schema ? getUniqueResourceTypes(schema) : []),
        [schema, isCustomMode, customTabs]
    );

    // Initialize currentTab with controlled value or first resource type
    const [internalCurrentTab, setInternalCurrentTab] = useState<string>(() => 
        controlledCurrentTab || uniqueResourceTypes[0] || ''
    );
    
    const currentTab = controlledCurrentTab !== undefined ? controlledCurrentTab : internalCurrentTab;
    const setCurrentTab = useCallback((tab: string): void => {
        if (controlledCurrentTab === undefined) {
            setInternalCurrentTab(tab);
        }
        onTabChangeCallback?.(tab);
    }, [controlledCurrentTab, onTabChangeCallback]);

    // Update tab if uniqueResourceTypes changes and current tab is invalid
    useEffect(() => {
        if (uniqueResourceTypes.length > 0 && !uniqueResourceTypes.includes(currentTab)) {
            if (controlledCurrentTab === undefined) {
                setInternalCurrentTab(uniqueResourceTypes[0]);
            }
            onTabChangeCallback?.(uniqueResourceTypes[0]);
        }
    }, [uniqueResourceTypes]); // Removed currentTab from dependencies to prevent infinite loop

    // Set up table height management hook to prevent layout shifts
    const { tableContainerRef, minHeight, captureHeight } = useTableHeight(isPending);

    // Set up command alert snackbar hook and command dialog hook
    const { commandAlert, setCommandAlert, closeAlert } = useCommandAlert();
    const [openDialog, closeDialog] = useDataPointCommandDialog();

    // Initialize form management hook
    const {
        methods,
        errors,
        fields,
        append,
        remove,
        move,
        getValues,
        trigger,
        reset,
        isDirty,
        isValid,
        undo,
        redo,
        canUndo,
        canRedo,
        recordChange,
        recordAdd,
        recordDelete,
        recordMove,
    } = useDataPointsForm(schema || fallbackSchema, data);

    // Reset form when data prop changes
    useEffect(() => {
        if (data) {
            reset({ deviceResources: data });
        }
    }, [data, reset]);

    // Create a ref to store the table instance
    const tableRef = useRef<MRT_TableInstance<FormDeviceResource> | null>(null);

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

                // Focus the input
                queueMicrotask(() => {
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
        const result = undo();
        if (result?.tabType && result.tabType !== currentTab) {
            setCurrentTab(result.tabType);
        }
        // Focus the cell after potential tab switch
        if (result?.rowIndex !== undefined && result?.columnId) {
            setTimeout(() => {
                focusCell(result.rowIndex!, result.columnId!);
            }, 100);
        }
    }, [undo, currentTab, focusCell]);

    const handleRedo = useCallback(() => {
        const result = redo();
        if (result?.tabType && result.tabType !== currentTab) {
            setCurrentTab(result.tabType);
        }
        // Focus the cell after potential tab switch
        if (result?.rowIndex !== undefined && result?.columnId) {
            setTimeout(() => {
                focusCell(result.rowIndex!, result.columnId!);
            }, 100);
        }
    }, [redo, currentTab, focusCell]);

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

    useEffect(() => {
        onFormStateReady?.({
            reset,
            getValues,
            isDirty,
            isValid,
            undo: handleUndo,
            redo: handleRedo,
            canUndo,
            canRedo,
        });
    }, [reset, getValues, isDirty, isValid, handleUndo, handleRedo, canUndo, canRedo, onFormStateReady]);

    // Filter resources by current tab
    const filteredResources = useMemo(() => {
        if (!fields) return [];

        const mappedFields = fields.map(
            (field: FieldArrayWithId<Record<string, any>>, index: number): FormDeviceResource => {
                const resourceData = getValues(`deviceResources.${index}`);
                return {
                    ...resourceData,
                    formIndex: index,
                    // Use the data's id if it exists, otherwise fall back to React Hook Form's field id
                    id: resourceData.id ?? field.id,
                };
            }
        );

        // Skip filtering when using custom columns (no tab-based filtering needed)
        if (isCustomMode || !currentTab) {
            return mappedFields;
        }

        // Filter by attributes.type for schema-based mode
        return mappedFields.filter((r: FormDeviceResource) => r.attributes?.type === currentTab);
    }, [fields, currentTab, getValues, isCustomMode]);

    // Check which tabs have dirty fields
    const dirtyTabs = useMemo(() => {
        const { dirtyFields } = methods.formState;
        const tabsWithChanges = new Set<string>();

        if (!dirtyFields.deviceResources) return tabsWithChanges;

        const checkDirtyResources = (resources: object | boolean): boolean => {
            if (!resources) return false;
            if (resources === true) return true;
            if (Array.isArray(resources)) return resources.some(checkDirtyResources);
            return Object.values(resources).some(checkDirtyResources);
        };

        dirtyFields.deviceResources.forEach((resource, index: number) => {
            if (!checkDirtyResources(resource)) return;
            const resourceType = getValues(`deviceResources.${index}.attributes.type`);
            if (resourceType) {
                tabsWithChanges.add(resourceType);
            }
        });

        return tabsWithChanges;
    }, [methods.formState, fields, getValues]);

    // Calculate error counts per tab
    const tabErrorCounts = useMemo(() => {
        const errorCounts = new Map<string, number>();

        methods.formState.errors?.deviceResources?.forEach?.((resourceError: any, index) => {
            if (!resourceError) return;

            const resourceType = getValues(`deviceResources.${index}.attributes.type`);
            if (!resourceType) return;

            // Count errors in this resource
            let errorCount = 0;

            // Check for errors in attributes
            if (resourceError.attributes && typeof resourceError.attributes === 'object') {
                errorCount += Object.keys(resourceError.attributes).length;
            }

            // Check for errors in properties
            if (resourceError.properties && typeof resourceError.properties === 'object') {
                errorCount += Object.keys(resourceError.properties).length;
            }

            if (errorCount > 0) {
                errorCounts.set(resourceType, (errorCounts.get(resourceType) ?? 0) + errorCount);
            }
        });

        return errorCounts;
    }, [methods.formState, getValues]);

    // Create columns for the table
    const columns = useMemo(() => {
        // Use custom columns if provided
        if (customColumns) {
            // Wrap custom columns with form field integration
            return customColumns.map((col) => ({
                ...col,
                muiEditTextFieldProps: ({ row }: { row: MRT_Row<FormDeviceResource> }) => {
                    const fieldIndex = row.original.formIndex;
                    const fieldPath = `deviceResources.${fieldIndex}.${col.accessorKey}` as const;
                    
                    const baseProps = typeof col.muiEditTextFieldProps === 'function'
                        ? col.muiEditTextFieldProps({ row } as any)
                        : col.muiEditTextFieldProps || {};
                    
                    return {
                        ...baseProps,
                        value: getValues(fieldPath) ?? '',
                        onChange: (e: any) => {
                            methods.setValue(fieldPath, e.target.value, { shouldDirty: true });
                            void trigger(fieldPath);
                        },
                    };
                },
            }));
        }

        // Fall back to schema-based columns
        if (!schema) {
            return [];
        }

        const cols = createColumns(schema, propertiesConstraints, currentTab, device, isNew);
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
    }, [customColumns, schema, currentTab, device, isNew, filteredResources, propertiesConstraints, methods]);

    // Handle tab changes in the top toolbar
    const handleTabChange = useCallback(
        (_: React.SyntheticEvent, newTab: string) => {
            if (newTab === currentTab) return;
            captureHeight();
            startTransition(() => setCurrentTab(newTab));
        },
        [currentTab, captureHeight, startTransition, setCurrentTab]
    );

    // Handle commands on "output" data points
    const handleCommand = useCallback(
        (deviceResource: FormDeviceResource) => {
            if (onCommand) {
                onCommand(deviceResource as T);
            } else if (device) {
                openDialog({
                    children: (
                        <DataPointCommandDialog
                            device={device}
                            deviceResource={deviceResource}
                            onClose={closeDialog}
                            setCommandAlert={setCommandAlert}
                            onSendCommand={onSendCommand}
                        />
                    ),
                    slotProps: { paper: { elevation: 0 } },
                });
            }
        },
        [onCommand, device, openDialog, closeDialog, setCommandAlert, onSendCommand]
    );

    // Create a ref that always has the current fields length
    const fieldsLengthRef = useRef(fields.length);

    // Keep it updated
    useEffect(() => {
        fieldsLengthRef.current = fields.length;
    }, [fields.length]);

    // Handle adding, duplicating and deleting data points
    const handleAdd = useCallback(() => {
        const newIndex = fieldsLengthRef.current;
        const defaultProperties = constrainSchemaProperties(schema, propertiesConstraints, currentTab);
        const newResource = {
            attributes: { type: currentTab },
            properties: defaultProperties.shape.properties.parse({}),
        } as Record<string, any>;
        append(newResource);

        recordAdd(newIndex, newResource);

        // Trigger validation for the new row
        void trigger(`deviceResources.${newIndex}`);

        // Use double rAF to ensure all rendering is complete
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                focusCell(newIndex, 'name');
            });
        });
    }, [append, currentTab, trigger, focusCell, recordAdd]);

    const handleDuplicate = useCallback(
        (resource: FormDeviceResource) => {
            const newIndex = fieldsLengthRef.current;
            const duplicatedResource = { ...resource };
            // Remove form-specific fields
            delete (duplicatedResource as any).formIndex;
            delete (duplicatedResource as any).id;

            append(duplicatedResource as Record<string, any>);

            // Record the add operation
            recordAdd(newIndex, duplicatedResource);

            // Trigger validation for the duplicated row
            void trigger(`deviceResources.${newIndex}`);

            // Focus on the name cell of the duplicated row
            setTimeout(() => {
                focusCell(newIndex, 'name');
            }, 100);
        },
        [append, trigger, focusCell, recordAdd]
    );

    const handleDelete = useCallback(
        (index: number) => {
            const rowData = getValues(`deviceResources.${index}`);
            // TODO: Figure out how to actually make this work.
            // What effectively happens right now is that the row is removed,
            // but all the subsequent rows shift up and are marked as dirty (e.g. because the name/index becomes the one from the row above).
            // This is an implementation challenge with react-hook-form's useFieldArray.
            // A possible solution would be to reset the form with the new values after deletion,
            // but that would also reset the dirty state of other rows, which is not ideal.

            // Record the delete operation before removing
            recordDelete(index, rowData);

            // Perform the deletion.
            remove(index);
        },
        [remove, getValues, recordDelete]
    );

    // Render the top toolbar containing the tabs and other controls
    const renderTopToolbar = useCallback(
        ({ table }: { table: MRT_TableInstance<FormDeviceResource> }) => (
            <TopToolbar
                table={table}
                currentTab={currentTab}
                uniquePointTypes={uniqueResourceTypes}
                dirtyTabs={dirtyTabs}
                tabErrorCounts={tabErrorCounts}
                onTabChange={handleTabChange}
            />
        ),
        [currentTab, uniqueResourceTypes, dirtyTabs, tabErrorCounts, handleTabChange]
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
                newDevice={isNew}
                onCommand={handleCommand}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
            />
        ),
        [device, isNew, handleCommand, handleDuplicate, handleDelete]
    );

    // Render an empty state when there are no data points, with an option to add a new one
    const renderEmptyRowsFallback = useCallback(() => <EmptyRowsFallback onAddDataPoint={handleAdd} />, [handleAdd]);

    // Set up table configuration hook
    const tableConfig = useTableConfig({
        columns: columns as any,
        filteredResources,
        theme,
        errors,
        trigger: (...args: Parameters<typeof trigger>) => {
            void trigger(...args);
        },
        minHeight,
        tableContainerRef,
        renderTopToolbar,
        renderBottomToolbarCustomActions,
        renderRowActions,
        renderEmptyRowsFallback,
        isPending,
        move,
        recordMove,
    });

    // Finally, create the table instance
    const table = useMaterialReactTable(tableConfig);
    
    // Store table instance in ref via useEffect to avoid side effects during render
    useEffect(() => {
        tableRef.current = table;
    }, [table]);

    // Render the table within the form provider to give access to form context
    return (
        <RecordChangeProvider recordChange={recordChange}>
            <FormProvider {...methods}>
                <MaterialReactTable table={table} />
                <CommandAlertSnackbar commandAlert={commandAlert} onClose={closeAlert} />
            </FormProvider>
        </RecordChangeProvider>
    );
};
