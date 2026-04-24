import { useCallback, useEffect, useState } from 'react';

export type FormStateManager = {
    reset: (values?: any) => void;
    getValues: () => any;
    isDirty: boolean;
    isValid: boolean;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    // Allow parent to trigger save flow
    triggerSave?: () => Promise<boolean>;
};

export const useFormStateManager = (
    onStateAvailable?: (state: FormStateManager) => void
): [(state: FormStateManager) => void, FormStateManager | null] => {
    const [formState, setFormState] = useState<FormStateManager | null>(null);

    const registerFormState = useCallback((state: FormStateManager) => {
        setFormState(state);
    }, []);

    useEffect(() => {
        if (formState) {
            onStateAvailable?.(formState);
        }
    }, [formState, onStateAvailable]);

    return [registerFormState, formState];
};
