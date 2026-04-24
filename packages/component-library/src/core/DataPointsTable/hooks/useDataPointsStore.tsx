import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { z } from 'zod';
import { DeviceResource } from '../schemas/DeviceProfileSchema';
import { ProtocolResourceSchema } from '../../DeviceProtocolConfiguration/ProtocolRegistry';
import { v4 as uuidv4 } from 'uuid';

export type FormDeviceResource = {
    // Index of this row in the flat (all-tabs) resources array
    formIndex: number;
    // Stable row identity, used by MRT as getRowId
    id: string;
} & DeviceResource;

// Per-field error stored alongside a row index + column
export type FieldError = {
    message: string;
};

// Map from dot-path (e.g. "attributes.pollingInterval") to the field error
export type RowErrors = Map<string, FieldError>;

// Lightweight snapshot that identifies which fields are dirty and which have errors.
export type CellState = {
    isDirty: boolean;
    error: FieldError | undefined;
};

type HistoryEntry =
    | {
          type: 'field';
          rowId: string;
          fieldKey: string;
          oldValue: any;
          newValue: any;
          tabType?: string;
          rowIndex: number;
          columnId: string;
      }
    | { type: 'add'; rowId: string; row: DeviceResource; index: number; tabType?: string }
    | { type: 'delete'; rowId: string; row: DeviceResource; index: number; tabType?: string }
    | { type: 'move'; fromIndex: number; toIndex: number; tabType?: string };

export type UndoRedoResult = {
    tabType?: string;
    rowIndex?: number;
    columnId?: string;
} | null;

// Resolve a value from a DeviceResource by dot-path key (e.g. "attributes.pollingInterval")
const getNestedValue = (resource: DeviceResource, key: string): any => {
    // Fast-path for top-level keys
    if (key === 'name') return resource.name;
    if (key === 'description') return resource.description;

    const parts = key.split('.');
    let current: any = resource;
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = current[part];
    }
    return current;
};

// Set a nested value on a shallow-cloned resource, returning a new object
const setNestedValue = (resource: DeviceResource, key: string, value: any): DeviceResource => {
    if (key === 'name') return { ...resource, name: value };
    if (key === 'description') return { ...resource, description: value };

    const parts = key.split('.');
    // We only ever have depth 2 (e.g. "attributes.foo" or "properties.bar")
    if (parts.length === 2) {
        const [section, field] = parts;
        return {
            ...resource,
            [section]: {
                ...(resource as any)[section],
                [field]: value,
            },
        };
    }

    // Fallback for deeper paths (shouldn't happen in practice)
    const clone = structuredClone(resource);
    let current: any = clone;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    return clone;
};

// Build a flat key->value map for a DeviceResource (used for dirty comparison)
const flattenResource = (resource: DeviceResource): Map<string, any> => {
    const map = new Map<string, any>();
    map.set('name', resource.name);
    if (resource.description !== undefined) map.set('description', resource.description);

    if (resource.properties && typeof resource.properties === 'object') {
        for (const [k, v] of Object.entries(resource.properties)) {
            map.set(`properties.${k}`, v);
        }
    }
    if (resource.attributes && typeof resource.attributes === 'object') {
        for (const [k, v] of Object.entries(resource.attributes)) {
            map.set(`attributes.${k}`, v);
        }
    }
    return map;
};

// Generate a unique row ID
const newRowId = (): string => uuidv4();

// Converts column names to field keys
export const toFieldKey = (attributeName: string): string => {
    if (attributeName === 'name') return 'name';
    if (attributeName === 'description') return 'description';
    if (
        attributeName === 'readWrite' ||
        attributeName === 'valueType' ||
        attributeName === 'units' ||
        attributeName === 'scale' ||
        attributeName === 'offset'
    ) {
        return `properties.${attributeName}`;
    }
    return `attributes.${attributeName}`;
};

export type DataPointsStore = {
    // ---- Data access ----
    getResources: () => DeviceResource[];
    getResource: (index: number) => DeviceResource;
    getResourceCount: () => number;
    getFieldValue: (rowIndex: number, fieldKey: string) => any;

    // ---- Mutations ----
    setField: (rowIndex: number, fieldKey: string, value: any) => void;
    addRow: (row: DeviceResource) => number;
    deleteRow: (index: number) => void;
    moveRow: (from: number, to: number) => void;

    // ---- State queries ----
    getCellState: (rowIndex: number, fieldKey: string) => CellState;
    getOriginalValue: (rowIndex: number, fieldKey: string) => any;
    getRowErrors: (rowIndex: number) => RowErrors;
    isRowDirty: (rowIndex: number) => boolean;
    isRowInvalid: (rowIndex: number) => boolean;

    // ---- Aggregate state ----
    isDirty: boolean;
    isValid: boolean;
    dirtyTabs: Set<string>;
    tabErrorCounts: Map<string, number>;

    // ---- Snapshots ----
    getFormValues: () => { deviceResources: DeviceResource[] };

    // ---- Reset ----
    reset: (values?: { deviceResources: DeviceResource[] }) => void;

    // ---- Undo / Redo ----
    undo: () => UndoRedoResult;
    redo: () => UndoRedoResult;
    canUndo: boolean;
    canRedo: boolean;

    // ---- History recording ----
    recordChange: (rowIndex: number, fieldKey: string) => void;
    // Snapshot the current value before editing begins
    ensureBeforeEditCache: (rowIndex: number, fieldKey: string) => void;
    // Record an add operation for undo/redo
    recordAdd: (index: number, row: DeviceResource) => void;
    // Record a delete operation for undo/redo
    recordDelete: (index: number, row: DeviceResource) => void;
    // Record a move operation for undo/redo
    recordMove: (fromIndex: number, toIndex: number) => void;

    // ---- Validation ----
    validate: (rowIndex?: number) => void;

    // ---- Subscriptions (for useSyncExternalStore) ----
    subscribe: (listener: () => void) => () => void;

    // Snapshot version - incremented on every mutation for useSyncExternalStore
    getVersion: () => number;

    // Structural version - only incremented on add/delete/move/reset
    getStructuralVersion: () => number;

    // ---- Per-row subscriptions for fine-grained re-renders ----
    subscribeRow: (rowIndex: number, listener: () => void) => () => void;
    getRowVersion: (rowIndex: number) => number;

    // ---- Filtered resources helper ----
    getFilteredResources: (tabType: string) => FormDeviceResource[];
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useDataPointsStore = (schema: ProtocolResourceSchema, initialDeviceResources?: DeviceResource[]) => {
    // Build the form schema once
    const formSchema = useMemo(() => z.object({ deviceResources: z.array(schema) }), [schema]);

    // Parse and store the canonical initial data
    const parsedInitial = useMemo(() => {
        const result = formSchema.safeParse({ deviceResources: initialDeviceResources ?? [] });
        return result.success ? result.data.deviceResources : (initialDeviceResources ?? []);
    }, [initialDeviceResources, formSchema]);

    // Current resources (source of truth)
    const resourcesRef = useRef<DeviceResource[]>([...parsedInitial]);

    // Saved state per row: rowId -> (fieldKey -> saved value)
    const snapshotRef = useRef<Map<string, Map<string, any>>>(new Map());

    // Stable row IDs mirroring resourcesRef indices
    const rowIdsRef = useRef<string[]>([]);

    // Per-row errors: rowIndex → Map<fieldKey, FieldError>
    const errorsRef = useRef<Map<number, RowErrors>>(new Map());

    // Cached initial errors so we can skip validateAll on reset-to-initial
    const initialErrorsRef = useRef<Map<number, RowErrors>>(new Map());

    const listenersRef = useRef(new Set<() => void>());
    const versionRef = useRef(0);

    const structuralVersionRef = useRef(0);

    const rowListenersRef = useRef(new Map<number, Set<() => void>>());
    const rowVersionsRef = useRef(new Map<number, number>());

    const notify = useCallback(() => {
        versionRef.current++;
        for (const listener of listenersRef.current) listener();
    }, []);

    const notifyStructural = useCallback(() => {
        structuralVersionRef.current++;
    }, []);

    const notifyRow = useCallback((index: number) => {
        const rowVersion = rowVersionsRef.current.get(index) ?? 0;
        rowVersionsRef.current.set(index, rowVersion + 1);
        const listeners = rowListenersRef.current.get(index);
        if (listeners) {
            for (const listener of listeners) listener();
        }
    }, []);

    const historyRef = useRef<HistoryEntry[]>([]);
    const historyIndexRef = useRef(-1);
    const isUndoRedoRef = useRef(false);
    // Before-edit value cache, keyed by `${rowId}:${fieldKey}`
    const beforeEditCacheRef = useRef<Map<string, any>>(new Map());

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateCanStates = useCallback(() => {
        setCanUndo(historyIndexRef.current >= 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }, []);

    // Initialize snapshot + rowIds
    const initializeSnapshot = useCallback((resources: DeviceResource[]) => {
        snapshotRef.current.clear();
        rowIdsRef.current = [];
        beforeEditCacheRef.current.clear();
        for (const resource of resources) {
            const id = newRowId();
            rowIdsRef.current.push(id);
            snapshotRef.current.set(id, flattenResource(resource));
        }
    }, []);

    // Run initialization on first render only
    const initializedRef = useRef(false);
    if (!initializedRef.current) {
        initializedRef.current = true;
        resourcesRef.current = [...parsedInitial];
        initializeSnapshot(parsedInitial);
        // Run initial validation
        const parseResult = formSchema.safeParse({ deviceResources: resourcesRef.current });
        if (!parseResult.success) {
            const newErrors = new Map<number, RowErrors>();
            for (const issue of parseResult.error.issues) {
                // path like ["deviceResources", 0, "attributes", "pollingInterval"]
                if (issue.path[0] === 'deviceResources' && typeof issue.path[1] === 'number') {
                    const rowIdx = issue.path[1];
                    const fieldKey = issue.path.slice(2).join('.');
                    if (!newErrors.has(rowIdx)) newErrors.set(rowIdx, new Map());
                    newErrors.get(rowIdx)!.set(fieldKey, { message: issue.message });
                }
            }
            errorsRef.current = newErrors;
        }
        // Cache initial errors for fast reset
        initialErrorsRef.current = new Map([...errorsRef.current].map(([k, v]) => [k, new Map(v)]));
    }

    // Dirty computation (keyed by stable rowId)
    const isFieldDirty = useCallback((rowIndex: number, fieldKey: string): boolean => {
        const rowId = rowIdsRef.current[rowIndex];
        if (!rowId) return false;
        const saved = snapshotRef.current.get(rowId);
        if (!saved) return true; // New row
        const savedValue = saved.get(fieldKey);
        const currentValue = getNestedValue(resourcesRef.current[rowIndex], fieldKey);
        return savedValue !== currentValue;
    }, []);

    const isRowDirty = useCallback((rowIndex: number): boolean => {
        const rowId = rowIdsRef.current[rowIndex];
        if (!rowId) return false;
        const saved = snapshotRef.current.get(rowId);
        if (!saved) return true; // New row

        const resource = resourcesRef.current[rowIndex];
        // Compare saved keys to current values
        for (const [key, savedValue] of saved) {
            if (getNestedValue(resource, key) !== savedValue) return true;
        }
        // Check for keys that were added after the snapshot
        const currentFlat = flattenResource(resource);
        for (const [key, value] of currentFlat) {
            if (!saved.has(key) && value !== undefined) return true;
        }
        return false;
    }, []);

    const computeIsDirty = useCallback((): boolean => {
        // Check for added/deleted rows
        const currentRowIds = new Set(rowIdsRef.current);
        for (const savedId of snapshotRef.current.keys()) {
            if (!currentRowIds.has(savedId)) return true;
        }
        for (const currentId of rowIdsRef.current) {
            if (!snapshotRef.current.has(currentId)) return true;
        }
        // Check if row order changed (only compare rows present in both)
        const savedIds = new Set(snapshotRef.current.keys());
        const survivingCurrent = rowIdsRef.current.filter((id) => savedIds.has(id));
        const survivingSaved = [...snapshotRef.current.keys()].filter((id) => currentRowIds.has(id));
        for (let i = 0; i < survivingSaved.length; i++) {
            if (survivingSaved[i] !== survivingCurrent[i]) return true;
        }
        // Check individual field values
        return resourcesRef.current.some((_, i) => isRowDirty(i));
    }, [isRowDirty]);

    const computeDirtyTabs = useCallback((): Set<string> => {
        const tabs = new Set<string>();
        // Deleted rows
        const currentRowIds = new Set(rowIdsRef.current);
        for (const [savedId, savedFields] of snapshotRef.current) {
            if (!currentRowIds.has(savedId)) {
                const tabType = savedFields.get('attributes.type');
                if (tabType) tabs.add(tabType);
            }
        }
        // Row order changes - compare per-tab to avoid false positives.
        // A move within one tab shifts global positions of other tabs' rows,
        // but their relative order within their own tab is unchanged.
        const savedIds = new Set(snapshotRef.current.keys());

        // Build per-tab ordering from saved snapshot (insertion order = original order)
        const savedOrderByTab = new Map<string, string[]>();
        for (const [id, fields] of snapshotRef.current) {
            if (!currentRowIds.has(id)) continue; // Skip deleted (handled above)
            const tabType = fields.get('attributes.type');
            if (!tabType) continue;
            let arr = savedOrderByTab.get(tabType);
            if (!arr) {
                arr = [];
                savedOrderByTab.set(tabType, arr);
            }
            arr.push(id);
        }

        // Build per-tab ordering from current state
        const currentOrderByTab = new Map<string, string[]>();
        for (let i = 0; i < rowIdsRef.current.length; i++) {
            const id = rowIdsRef.current[i];
            if (!savedIds.has(id)) continue; // Skip new rows (handled below)
            const tabType = (resourcesRef.current[i]?.attributes as any)?.type;
            if (!tabType) continue;
            let arr = currentOrderByTab.get(tabType);
            if (!arr) {
                arr = [];
                currentOrderByTab.set(tabType, arr);
            }
            arr.push(id);
        }

        // Compare per-tab
        for (const [tabType, savedOrder] of savedOrderByTab) {
            const currentOrder = currentOrderByTab.get(tabType);
            if (!currentOrder || savedOrder.length !== currentOrder?.length) {
                tabs.add(tabType);
                continue;
            }
            for (let i = 0; i < savedOrder.length; i++) {
                if (savedOrder[i] !== currentOrder[i]) {
                    tabs.add(tabType);
                    break;
                }
            }
        }

        // Current rows (new or field-dirty)
        for (let i = 0; i < resourcesRef.current.length; i++) {
            const rowId = rowIdsRef.current[i];
            if (!snapshotRef.current.has(rowId)) {
                // New row
                const type = (resourcesRef.current[i].attributes as any)?.type;
                if (type) tabs.add(type);
                continue;
            }
            if (isRowDirty(i)) {
                const type = (resourcesRef.current[i].attributes as any)?.type;
                if (type) tabs.add(type);
            }
        }

        return tabs;
    }, [isRowDirty]);

    const computeTabErrorCounts = useCallback((): Map<string, number> => {
        const counts = new Map<string, number>();
        for (const [rowIdx, rowErrors] of errorsRef.current) {
            if (rowErrors.size === 0) continue;
            const resource = resourcesRef.current[rowIdx];
            if (!resource) continue;
            const type = (resource.attributes as any)?.type;
            if (type) {
                counts.set(type, (counts.get(type) ?? 0) + rowErrors.size);
            }
        }
        return counts;
    }, []);

    const computeIsValid = useCallback((): boolean => {
        for (const [, rowErrors] of errorsRef.current) {
            if (rowErrors.size > 0) return false;
        }
        return true;
    }, []);

    // ---- Validation ----
    const validateRow = useCallback(
        (rowIndex: number) => {
            const resource = resourcesRef.current[rowIndex];
            if (!resource) return;

            // Validate just this single resource against the schema
            const result = schema.safeParse(resource);
            if (result.success) {
                errorsRef.current.delete(rowIndex);
            } else {
                const rowErrors: RowErrors = new Map();
                for (const issue of result.error.issues) {
                    const fieldKey = issue.path.join('.');
                    rowErrors.set(fieldKey, { message: issue.message });
                }
                if (rowErrors.size > 0) {
                    errorsRef.current.set(rowIndex, rowErrors);
                } else {
                    errorsRef.current.delete(rowIndex);
                }
            }
        },
        [schema]
    );

    const validateAll = useCallback(() => {
        errorsRef.current.clear();
        for (let i = 0; i < resourcesRef.current.length; i++) {
            validateRow(i);
        }
    }, [validateRow]);

    // ---- Mutations ----
    const setField = useCallback(
        (rowIndex: number, fieldKey: string, value: any) => {
            const resource = resourcesRef.current[rowIndex];
            if (!resource) return;
            resourcesRef.current[rowIndex] = setNestedValue(resource, fieldKey, value);
            // Re-validate the changed row
            validateRow(rowIndex);
            notifyRow(rowIndex);
            notify();
        },
        [validateRow, notifyRow, notify]
    );

    const addRow = useCallback(
        (row: DeviceResource): number => {
            const index = resourcesRef.current.length;
            resourcesRef.current.push(row);
            const id = newRowId();
            rowIdsRef.current.push(id);
            // New rows have no snapshot (always dirty)
            validateRow(index);
            notifyStructural();
            notify();
            return index;
        },
        [validateRow, notifyStructural, notify]
    );

    const deleteRow = useCallback(
        (index: number) => {
            resourcesRef.current.splice(index, 1);
            rowIdsRef.current.splice(index, 1);

            // Shift error indices after removal
            const oldErrors = errorsRef.current;
            const newErrors = new Map<number, RowErrors>();
            for (const [rowIdx, rowErrs] of oldErrors) {
                if (rowIdx === index) continue; // Deleted row
                const newIdx = rowIdx > index ? rowIdx - 1 : rowIdx;
                newErrors.set(newIdx, rowErrs);
            }
            errorsRef.current = newErrors;

            notifyStructural();
            notify();
        },
        [notifyStructural, notify]
    );

    const moveRow = useCallback(
        (from: number, to: number) => {
            const [resource] = resourcesRef.current.splice(from, 1);
            resourcesRef.current.splice(to, 0, resource);
            const [id] = rowIdsRef.current.splice(from, 1);
            rowIdsRef.current.splice(to, 0, id);
            validateAll();
            notifyStructural();
            notify();
        },
        [validateAll, notifyStructural, notify]
    );

    // ---- History recording ----
    const recordChange = useCallback(
        (rowIndex: number, fieldKey: string) => {
            if (isUndoRedoRef.current) return;

            const rowId = rowIdsRef.current[rowIndex];
            if (!rowId) return;

            const cacheKey = `${rowId}:${fieldKey}`;

            // If ensureBeforeEditCache was never called, no edit was started - skip.
            if (!beforeEditCacheRef.current.has(cacheKey)) return;

            const oldValue = beforeEditCacheRef.current.get(cacheKey);
            const newValue = getNestedValue(resourcesRef.current[rowIndex], fieldKey);

            // No change
            if (oldValue === newValue) return;

            // Truncate future entries
            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
            }

            const tabType = (resourcesRef.current[rowIndex]?.attributes as any)?.type;

            // Derive columnId from fieldKey
            let columnId = fieldKey;
            if (fieldKey.startsWith('properties.')) columnId = fieldKey.replace('properties.', '');
            else if (fieldKey.startsWith('attributes.')) columnId = fieldKey.replace('attributes.', '');

            historyRef.current.push({
                type: 'field',
                rowId,
                fieldKey,
                oldValue,
                newValue,
                tabType,
                rowIndex,
                columnId,
            });
            historyIndexRef.current++;

            // Update before-edit cache to current value
            beforeEditCacheRef.current.set(cacheKey, newValue);

            // Cap history
            const MAX_HISTORY = 100;
            if (historyRef.current.length > MAX_HISTORY) {
                historyRef.current = historyRef.current.slice(-MAX_HISTORY);
                historyIndexRef.current = historyRef.current.length - 1;
            }

            updateCanStates();
        },
        [updateCanStates]
    );

    // Snapshot the field value before editing begins
    const ensureBeforeEditCache = useCallback((rowIndex: number, fieldKey: string) => {
        const rowId = rowIdsRef.current[rowIndex];
        if (!rowId) return;
        const cacheKey = `${rowId}:${fieldKey}`;
        if (!beforeEditCacheRef.current.has(cacheKey)) {
            beforeEditCacheRef.current.set(cacheKey, getNestedValue(resourcesRef.current[rowIndex], fieldKey));
        }
    }, []);

    const recordAdd = useCallback(
        (index: number, row: DeviceResource) => {
            if (isUndoRedoRef.current) return;

            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
            }

            const tabType = (row.attributes as any)?.type;
            const rowId = rowIdsRef.current[index];

            historyRef.current.push({ type: 'add', rowId, row: structuredClone(row), index, tabType });
            historyIndexRef.current++;
            updateCanStates();
        },
        [updateCanStates]
    );

    const recordDelete = useCallback(
        (index: number, row: DeviceResource, rowId: string) => {
            if (isUndoRedoRef.current) return;

            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
            }

            const tabType = (row.attributes as any)?.type;

            historyRef.current.push({ type: 'delete', rowId, row: structuredClone(row), index, tabType });
            historyIndexRef.current++;
            updateCanStates();
        },
        [updateCanStates]
    );

    const recordMove = useCallback(
        (fromIndex: number, toIndex: number) => {
            if (isUndoRedoRef.current) return;

            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
            }

            const tabType = (resourcesRef.current[fromIndex]?.attributes as any)?.type;

            historyRef.current.push({ type: 'move', fromIndex, toIndex, tabType });
            historyIndexRef.current++;
            updateCanStates();
        },
        [updateCanStates]
    );

    // ---- Undo / Redo ----
    const findRowIndex = useCallback((rowId: string): number => rowIdsRef.current.indexOf(rowId), []);

    const undo = useCallback((): UndoRedoResult => {
        if (historyIndexRef.current < 0) return null;
        const entry = historyRef.current[historyIndexRef.current];
        isUndoRedoRef.current = true;

        let result: UndoRedoResult = null;

        if (entry.type === 'field') {
            const currentIdx = findRowIndex(entry.rowId);
            if (currentIdx >= 0) {
                resourcesRef.current[currentIdx] = setNestedValue(
                    resourcesRef.current[currentIdx],
                    entry.fieldKey,
                    entry.oldValue
                );
                beforeEditCacheRef.current.set(`${entry.rowId}:${entry.fieldKey}`, entry.oldValue);
                validateRow(currentIdx);
                notifyRow(currentIdx);
                result = { tabType: entry.tabType, rowIndex: currentIdx, columnId: entry.columnId };
            }
        } else if (entry.type === 'add') {
            const currentIdx = findRowIndex(entry.rowId);
            if (currentIdx >= 0) {
                resourcesRef.current.splice(currentIdx, 1);
                rowIdsRef.current.splice(currentIdx, 1);
                const oldErrors = errorsRef.current;
                const newErrors = new Map<number, RowErrors>();
                for (const [rowIdx, rowErrs] of oldErrors) {
                    if (rowIdx === currentIdx) continue;
                    const newIdx = rowIdx > currentIdx ? rowIdx - 1 : rowIdx;
                    newErrors.set(newIdx, rowErrs);
                }
                errorsRef.current = newErrors;
                notifyStructural();
                result = { tabType: entry.tabType };
            }
        } else if (entry.type === 'delete') {
            const insertIdx = Math.min(entry.index, resourcesRef.current.length);
            resourcesRef.current.splice(insertIdx, 0, structuredClone(entry.row));
            rowIdsRef.current.splice(insertIdx, 0, entry.rowId);
            const oldErrors = errorsRef.current;
            const newErrors = new Map<number, RowErrors>();
            for (const [rowIdx, rowErrs] of oldErrors) {
                const newIdx = rowIdx >= insertIdx ? rowIdx + 1 : rowIdx;
                newErrors.set(newIdx, rowErrs);
            }
            errorsRef.current = newErrors;
            validateRow(insertIdx);
            notifyStructural();
            result = { tabType: entry.tabType, rowIndex: insertIdx };
        } else if (entry.type === 'move') {
            const [resource] = resourcesRef.current.splice(entry.toIndex, 1);
            resourcesRef.current.splice(entry.fromIndex, 0, resource);
            const [id] = rowIdsRef.current.splice(entry.toIndex, 1);
            rowIdsRef.current.splice(entry.fromIndex, 0, id);
            validateAll();
            notifyStructural();
            result = { tabType: entry.tabType };
        }

        historyIndexRef.current--;

        requestAnimationFrame(() => {
            isUndoRedoRef.current = false;
        });

        notify();
        updateCanStates();
        return result;
    }, [findRowIndex, validateRow, validateAll, notifyRow, notifyStructural, notify, updateCanStates]);

    const redo = useCallback((): UndoRedoResult => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return null;
        historyIndexRef.current++;
        const entry = historyRef.current[historyIndexRef.current];
        isUndoRedoRef.current = true;

        let result: UndoRedoResult = null;

        if (entry.type === 'field') {
            const currentIdx = findRowIndex(entry.rowId);
            if (currentIdx >= 0) {
                resourcesRef.current[currentIdx] = setNestedValue(
                    resourcesRef.current[currentIdx],
                    entry.fieldKey,
                    entry.newValue
                );
                beforeEditCacheRef.current.set(`${entry.rowId}:${entry.fieldKey}`, entry.newValue);
                validateRow(currentIdx);
                notifyRow(currentIdx);
                result = { tabType: entry.tabType, rowIndex: currentIdx, columnId: entry.columnId };
            }
        } else if (entry.type === 'add') {
            const insertIdx = Math.min(entry.index, resourcesRef.current.length);
            resourcesRef.current.splice(insertIdx, 0, structuredClone(entry.row));
            rowIdsRef.current.splice(insertIdx, 0, entry.rowId);
            const oldErrors = errorsRef.current;
            const newErrors = new Map<number, RowErrors>();
            for (const [rowIdx, rowErrs] of oldErrors) {
                const newIdx = rowIdx >= insertIdx ? rowIdx + 1 : rowIdx;
                newErrors.set(newIdx, rowErrs);
            }
            errorsRef.current = newErrors;
            validateRow(insertIdx);
            notifyStructural();
            result = { tabType: entry.tabType, rowIndex: insertIdx };
        } else if (entry.type === 'delete') {
            const currentIdx = findRowIndex(entry.rowId);
            if (currentIdx >= 0) {
                resourcesRef.current.splice(currentIdx, 1);
                rowIdsRef.current.splice(currentIdx, 1);
                const oldErrors = errorsRef.current;
                const newErrors = new Map<number, RowErrors>();
                for (const [rowIdx, rowErrs] of oldErrors) {
                    if (rowIdx === currentIdx) continue;
                    const newIdx = rowIdx > currentIdx ? rowIdx - 1 : rowIdx;
                    newErrors.set(newIdx, rowErrs);
                }
                errorsRef.current = newErrors;
                notifyStructural();
                result = { tabType: entry.tabType };
            }
        } else if (entry.type === 'move') {
            const [resource] = resourcesRef.current.splice(entry.fromIndex, 1);
            resourcesRef.current.splice(entry.toIndex, 0, resource);
            const [id] = rowIdsRef.current.splice(entry.fromIndex, 1);
            rowIdsRef.current.splice(entry.toIndex, 0, id);
            validateAll();
            notifyStructural();
            result = { tabType: entry.tabType };
        }

        requestAnimationFrame(() => {
            isUndoRedoRef.current = false;
        });

        notify();
        updateCanStates();
        return result;
    }, [findRowIndex, validateRow, validateAll, notifyRow, notifyStructural, notify, updateCanStates]);

    // ---- Reset ----
    const reset = useCallback(
        (values?: { deviceResources: DeviceResource[] }) => {
            const newResources = values?.deviceResources ?? parsedInitial;
            resourcesRef.current = [...newResources];
            errorsRef.current.clear();
            initializeSnapshot(newResources);
            beforeEditCacheRef.current.clear();
            historyRef.current = [];
            historyIndexRef.current = -1;
            updateCanStates();
            // Fast path: when resetting to initial data, restore cached errors
            if (newResources === parsedInitial) {
                errorsRef.current = new Map([...initialErrorsRef.current].map(([k, v]) => [k, new Map(v)]));
            } else {
                validateAll();
            }
            notifyStructural();
            notify();
        },
        [parsedInitial, initializeSnapshot, updateCanStates, validateAll, notifyStructural, notify]
    );

    // ---- Subscriptions ----
    const subscribe = useCallback((listener: () => void): (() => void) => {
        listenersRef.current.add(listener);
        return (): void => {
            listenersRef.current.delete(listener);
        };
    }, []);

    const getVersion = useCallback((): number => versionRef.current, []);

    const subscribeRow = useCallback((rowIndex: number, listener: () => void): (() => void) => {
        if (!rowListenersRef.current.has(rowIndex)) {
            rowListenersRef.current.set(rowIndex, new Set());
        }
        rowListenersRef.current.get(rowIndex)!.add(listener);
        return (): void => {
            rowListenersRef.current.get(rowIndex)?.delete(listener);
        };
    }, []);

    const getRowVersion = useCallback((rowIndex: number): number => rowVersionsRef.current.get(rowIndex) ?? 0, []);

    // ---- Public API ----

    // Build a stable store object that doesn't change identity
    const storeRef = useRef<DataPointsStore>(null as any);
    storeRef.current ??= {} as DataPointsStore;

    // Update the store methods - these closures are stable due to useCallback
    Object.assign(storeRef.current, {
        getResources: (): DeviceResource[] => resourcesRef.current,
        getResource: (index: number): DeviceResource => resourcesRef.current[index],
        getResourceCount: (): number => resourcesRef.current.length,
        getFieldValue: (rowIndex: number, fieldKey: string): any =>
            getNestedValue(resourcesRef.current[rowIndex], fieldKey),

        setField,
        addRow,
        deleteRow,
        moveRow,

        getCellState: (rowIndex: number, fieldKey: string): CellState => ({
            isDirty: isFieldDirty(rowIndex, fieldKey),
            error: errorsRef.current.get(rowIndex)?.get(fieldKey),
        }),
        getOriginalValue: (rowIndex: number, fieldKey: string): any => {
            const rowId = rowIdsRef.current[rowIndex];
            if (!rowId) return undefined;
            const saved = snapshotRef.current.get(rowId);
            return saved?.get(fieldKey);
        },
        getRowErrors: (rowIndex: number): RowErrors => errorsRef.current.get(rowIndex) ?? new Map(),
        isRowDirty,
        isRowInvalid: (rowIndex: number): boolean => {
            const rowErrs = errorsRef.current.get(rowIndex);
            return !!rowErrs && rowErrs.size > 0;
        },

        get isDirty(): boolean {
            return computeIsDirty();
        },
        get isValid(): boolean {
            return computeIsValid();
        },
        get dirtyTabs(): Set<string> {
            return computeDirtyTabs();
        },
        get tabErrorCounts(): Map<string, number> {
            return computeTabErrorCounts();
        },

        getFormValues: (): { deviceResources: DeviceResource[] } => ({
            deviceResources: [...resourcesRef.current],
        }),
        reset,
        undo,
        redo,
        get canUndo(): boolean {
            return canUndo;
        },
        get canRedo(): boolean {
            return canRedo;
        },
        recordChange,
        ensureBeforeEditCache,
        recordAdd,
        recordDelete: (index: number, row: DeviceResource): void => {
            const rowId = rowIdsRef.current[index];
            if (rowId) recordDelete(index, row, rowId);
        },
        recordMove,
        validate: (rowIndex?: number): void => {
            if (rowIndex !== undefined) validateRow(rowIndex);
            else validateAll();
        },
        subscribe,
        getVersion,
        getStructuralVersion: (): number => structuralVersionRef.current,
        subscribeRow,
        getRowVersion,
        getFilteredResources: (tabType: string): FormDeviceResource[] => {
            const result: FormDeviceResource[] = [];
            for (let i = 0; i < resourcesRef.current.length; i++) {
                const r = resourcesRef.current[i];
                if ((r.attributes as any)?.type === tabType) {
                    result.push({
                        ...r,
                        formIndex: i,
                        id: rowIdsRef.current[i],
                    });
                }
            }
            return result;
        },
    } satisfies Record<string, any>);

    return storeRef.current;
};

// Context and provider for the data points store
const DataPointsStoreContext = createContext<DataPointsStore | null>(null);

export const DataPointsStoreProvider = DataPointsStoreContext.Provider;

export const useDataPointsStoreContext = (): DataPointsStore => {
    const store = useContext(DataPointsStoreContext);
    if (!store) throw new Error('useDataPointsStoreContext must be used within a DataPointsStoreProvider');
    return store;
};

/**
 * Subscribe to the whole store - re-renders when *any* mutation happens.
 * Use sparingly; prefer `useStoreRow` for cell-level components.
 */
export const useStoreSnapshot = (): number => {
    const store = useDataPointsStoreContext();
    return useSyncExternalStore(store.subscribe, store.getVersion);
};

/**
 * Subscribe to a single row - re-renders only when that row mutates.
 * Ideal for cell components.
 */
export const useStoreRow = (rowIndex: number): number => {
    const store = useDataPointsStoreContext();
    const subscribeFn = useCallback(
        (listener: () => void) => store.subscribeRow(rowIndex, listener),
        [store, rowIndex]
    );
    const getSnapshot = useCallback(() => store.getRowVersion(rowIndex), [store, rowIndex]);
    return useSyncExternalStore(subscribeFn, getSnapshot);
};
