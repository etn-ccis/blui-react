import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormHistory } from './useFormHistory';
import type { ResourceSchema } from '../SchemaUtils';

export type FormResource = {
    formIndex: number;
    id: string;
} & Record<string, any>;

export type FormDeviceResource = FormResource; // Backwards compatibility

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useDataPointsForm = <T extends Record<string, any> = Record<string, any>>(
    schema: ResourceSchema,
    resources?: T[]
) => {
    const formSchema = useMemo(
        () =>
            z.object({
                deviceResources: z.array(schema),
            }),
        [schema]
    );

    type DeviceResourcesDataPoints = z.infer<typeof formSchema>;

    const initialValues = useMemo(
        () => formSchema.safeParse({ deviceResources: resources ?? [] }),
        [resources, formSchema]
    );

    const methods = useForm<DeviceResourcesDataPoints>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: initialValues.data,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const { control, getValues, reset, trigger, setValue } = methods;
    const { isDirty, errors, isValid } = useFormState({ control });

    const { fields, append, remove, move, update } = useFieldArray({
        control,
        name: 'deviceResources',
    });

    const { undo, redo, canUndo, canRedo, clearHistory, recordChange, recordAdd, recordDelete, recordMove } =
        useFormHistory(getValues, setValue, append, remove, move);

    // Clear history when form is reset
    const resetWithHistory = useCallback(
        (values?: DeviceResourcesDataPoints): void => {
            // If values are provided, reset to those values (e.g., after save)
            // Otherwise, reset to initial values (e.g., when user clicks "Reset Changes")
            const resetValues = values ?? initialValues.data;
            reset(resetValues);
            clearHistory();
        },
        [reset, clearHistory, initialValues.data]
    );

    return {
        methods,
        control,
        getValues,
        reset: resetWithHistory,
        trigger,
        isDirty,
        errors,
        isValid,
        fields,
        append,
        remove,
        move,
        update,
        undo,
        redo,
        canUndo,
        canRedo,
        recordChange,
        recordAdd,
        recordDelete,
        recordMove,
    };
};
