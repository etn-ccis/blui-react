import { useRef, useCallback, useEffect, useState } from 'react';
import {
    FieldValues,
    UseFieldArrayAppend,
    UseFieldArrayMove,
    UseFieldArrayRemove,
    UseFormGetValues,
    UseFormSetValue,
} from 'react-hook-form';

type HistoryEntry = {
    type: 'field' | 'add' | 'delete' | 'move';
    // For field changes
    fieldPath?: string;
    oldValue?: any;
    newValue?: any;
    tabType?: string;
    rowIndex?: number;
    columnId?: string;
    // For row operations
    row?: any; // The full row data
    index?: number; // Position where row was added/deleted
};

type UndoRedoResult = {
    fieldPath?: string;
    tabType?: string;
    rowIndex?: number;
    columnId?: string;
} | null;

type UseFormHistoryReturn = {
    undo: () => UndoRedoResult;
    redo: () => UndoRedoResult;
    canUndo: boolean;
    canRedo: boolean;
    clearHistory: () => void;
    recordChange: (fieldPath: string) => void;
    recordAdd: (index: number, row: any) => void;
    recordDelete: (index: number, row: any) => void;
    recordMove: (fromIndex: number, toIndex: number) => void;
};

const initializeValues = (obj: any, path = '', valuesMap: Map<string, any>): void => {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach((key) => {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                initializeValues(item, `${fullPath}.${index}`, valuesMap);
            });
        } else if (value && typeof value === 'object') {
            initializeValues(value, fullPath, valuesMap);
        } else {
            valuesMap.set(fullPath, value);
        }
    });
};

export const useFormHistory = <T extends FieldValues>(
    getValues: UseFormGetValues<T>,
    setValue: UseFormSetValue<T>,
    append: UseFieldArrayAppend<T>,
    remove: UseFieldArrayRemove,
    move: UseFieldArrayMove
): UseFormHistoryReturn => {
    const history = useRef<HistoryEntry[]>([]);
    const currentIndex = useRef(-1);
    const isUndoRedoAction = useRef(false);
    const previousValues = useRef<Map<string, any>>(new Map());

    // Use state for canUndo/canRedo so they're reactive
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Helper to update can states
    const updateCanStates = (): void => {
        setCanUndo(currentIndex.current >= 0);
        setCanRedo(currentIndex.current < history.current.length - 1);
    };

    // Initialize previous values on mount
    useEffect(() => {
        const allValues = getValues();
        initializeValues(allValues, '', previousValues.current);
    }, [getValues]);

    // Record a change when a field is blurred (validated)
    const recordChange = useCallback(
        (fieldPath: string) => {
            if (isUndoRedoAction.current) return;

            // Extract tab type and cell coordinates from field path
            let tabType: string | undefined;
            let rowIndex: number | undefined;
            let columnId: string | undefined;

            if (fieldPath.startsWith('deviceResources.')) {
                const match = /deviceResources\.(\d+)\.(.+)/.exec(fieldPath);
                if (match) {
                    rowIndex = parseInt(match[1]);
                    const resources = getValues('deviceResources' as any) as any[];
                    tabType = resources[rowIndex]?.attributes?.type;

                    // Extract column ID from the rest of the path
                    const remainingPath = match[2];
                    if (remainingPath === 'name') {
                        columnId = 'name';
                    } else if (remainingPath === 'description') {
                        columnId = 'description';
                    } else if (remainingPath.startsWith('properties.')) {
                        columnId = remainingPath.replace('properties.', '');
                    } else if (remainingPath.startsWith('attributes.')) {
                        columnId = remainingPath.replace('attributes.', '');
                    }
                }
            }

            // Get the current value
            const currentValue = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], getValues());

            // Get the previous value from our cache
            const oldValue = previousValues.current.get(fieldPath);

            // Skip if values are the same or isn't initialized
            if (oldValue === currentValue) return;

            // Remove any "future" history if we're not at the end
            if (currentIndex.current < history.current.length - 1) {
                history.current = history.current.slice(0, currentIndex.current + 1);
            }

            // Add new entry with both old and new values
            history.current.push({
                type: 'field',
                fieldPath,
                oldValue,
                newValue: currentValue,
                tabType,
                rowIndex,
                columnId,
            });
            currentIndex.current++;

            // Update the previous value cache for this field
            previousValues.current.set(fieldPath, currentValue);

            // Limit history size
            const MAX_HISTORY = 100;
            if (history.current.length > MAX_HISTORY) {
                history.current = history.current.slice(-MAX_HISTORY);
                currentIndex.current = history.current.length - 1;
            }

            // Update can states after recording
            updateCanStates();
        },
        [getValues]
    );

    const recordAdd = useCallback((index: number, row: any) => {
        if (isUndoRedoAction.current) return;

        // Clear future history
        if (currentIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, currentIndex.current + 1);
        }

        initializeValues(row, `deviceResources.${index}`, previousValues.current);

        const tabType = row.attributes?.type;

        history.current.push({
            type: 'add',
            index,
            row,
            tabType,
        });
        currentIndex.current++;
        updateCanStates();
    }, []);

    const recordDelete = useCallback((index: number, row: any) => {
        if (isUndoRedoAction.current) return;

        // Clear future history
        if (currentIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, currentIndex.current + 1);
        }

        const tabType = row.attributes?.type;

        history.current.push({
            type: 'delete',
            index,
            row,
            tabType,
        });
        currentIndex.current++;
        updateCanStates();
    }, []);

    const recordMove = useCallback((fromIndex: number, toIndex: number) => {
        if (isUndoRedoAction.current) return;

        // Clear future history
        if (currentIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, currentIndex.current + 1);
        }

        history.current.push({
            type: 'move',
            oldValue: fromIndex,
            newValue: toIndex,
        });
        currentIndex.current++;
        updateCanStates();
    }, []);

    const undo = useCallback(() => {
        if (currentIndex.current < 0) return null;

        const entry = history.current[currentIndex.current];
        isUndoRedoAction.current = true;

        let result: UndoRedoResult = null;

        if (entry.type === 'field') {
            // Restore the old value
            setValue(entry.fieldPath as any, entry.oldValue, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });
            previousValues.current.set(entry.fieldPath!, entry.oldValue);

            result = {
                fieldPath: entry.fieldPath,
                tabType: entry.tabType,
                rowIndex: entry.rowIndex,
                columnId: entry.columnId,
            };
        } else if (entry.type === 'add') {
            // Remove the added row
            remove(entry.index);
            result = { tabType: entry.tabType };
        } else if (entry.type === 'delete') {
            // Re-add the deleted row
            const resources = getValues('deviceResources' as any) as any[];
            // Insert at the original position
            if (entry.index! >= resources.length) {
                append(entry.row);
            } else {
                // Insert by moving all subsequent items
                append(entry.row);
                move(resources.length, entry.index!);
            }
            result = { tabType: entry.tabType, rowIndex: entry.index };
        } else if (entry.type === 'move') {
            // Reverse the move
            move(entry.newValue as number, entry.oldValue as number);
        }

        currentIndex.current--;

        requestAnimationFrame(() => {
            isUndoRedoAction.current = false;
        });

        updateCanStates();
        return result;
    }, [setValue, remove, append, move, getValues]);

    const redo = useCallback(() => {
        if (currentIndex.current >= history.current.length - 1) return null;

        currentIndex.current++;
        const entry = history.current[currentIndex.current];
        isUndoRedoAction.current = true;

        let result: UndoRedoResult = null;

        if (entry.type === 'field') {
            // Restore the new value
            setValue(entry.fieldPath as any, entry.newValue, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });
            previousValues.current.set(entry.fieldPath!, entry.newValue);

            result = {
                fieldPath: entry.fieldPath,
                tabType: entry.tabType,
                rowIndex: entry.rowIndex,
                columnId: entry.columnId,
            };
        } else if (entry.type === 'add') {
            // Re-add the row
            const resources = getValues('deviceResources' as any) as any[];
            if (entry.index! >= resources.length) {
                append(entry.row);
            } else {
                append(entry.row);
                move(resources.length, entry.index!);
            }
            result = { tabType: entry.tabType, rowIndex: entry.index };
        } else if (entry.type === 'delete') {
            // Re-delete the row
            remove(entry.index);
            result = { tabType: entry.tabType };
        } else if (entry.type === 'move') {
            // Redo the move
            move(entry.oldValue as number, entry.newValue as number);
        }

        requestAnimationFrame(() => {
            isUndoRedoAction.current = false;
        });

        updateCanStates();
        return result;
    }, [setValue, remove, append, move, getValues]);

    const clearHistory = useCallback(() => {
        history.current = [];
        currentIndex.current = -1;
        // Reinitialize previous values
        const allValues = getValues();
        previousValues.current.clear();
        initializeValues(allValues, '', previousValues.current);

        // Update can states after clearing
        updateCanStates();
    }, [getValues]);

    return {
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
        recordChange,
        recordAdd,
        recordDelete,
        recordMove,
    };
};
