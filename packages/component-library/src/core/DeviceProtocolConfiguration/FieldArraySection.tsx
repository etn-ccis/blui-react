import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import z from 'zod';
import { formatTitle, getArrayData, shouldShowField } from './ProtocolUtils';
import { ProtocolListItem } from './ProtocolListItem';
import { FormFieldWrapper } from './FormComponents/FormFieldWrapper';

type FieldArraySectionProps = {
    id: string;
    index: number;
    arrayName: string;
    sequenceFields: string[];
    schema: z.ZodObject;
};

export const FieldArraySection = ({
    id,
    index,
    arrayName,
    sequenceFields,
    schema,
}: FieldArraySectionProps): JSX.Element => {
    const { watch, setValue, trigger, clearErrors } = useFormContext();
    const data = watch();
    const handleHiddenFields = (): void => {
        sequenceFields.forEach((key) => {
            const fieldData = getArrayData(key, arrayName, schema, data, index);
            const { defaultValue } = fieldData;
            const shouldShow = shouldShowField(key, data, arrayName, index, undefined);
            if (!shouldShow && defaultValue !== undefined && clearErrors && setValue) {
                clearErrors(`${arrayName}.${index}.${key}`);
                setValue(`${arrayName}.${index}.${key}`, defaultValue);
            }
        });
    };

    const handleBlur = (name: string): void => {
        handleHiddenFields();

        if (name === 'asdu-type' && arrayName === 'parameter-loading') {
            const currentParameterType = data[arrayName][index]['parameter-type'];

            const newValue = data[arrayName][index]['asdu-type'];

            if (
                newValue !== 'cyclic-report' &&
                (currentParameterType === 'enable' || currentParameterType === 'disable') &&
                setValue
            ) {
                setValue(`${arrayName}.${index}.parameter-type`, '');
            }
        }

        void trigger(`${arrayName}.${index}.${name}`);
        void trigger(`${arrayName}.${index}`);
        void trigger(arrayName);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <div>
                {sequenceFields
                    .filter((key) => shouldShowField(key, data, arrayName, index, undefined))
                    .map((key) => {
                        const fieldData = getArrayData(key, arrayName, schema, data, index);
                        const title = formatTitle(key);
                        const fieldName = `${arrayName}.${index}.${key}`;

                        return (
                            <ProtocolListItem
                                key={`${id}-${key}`}
                                title={title}
                                description={fieldData.description}
                                valueComponent={
                                    <FormFieldWrapper
                                        name={fieldName}
                                        fieldData={fieldData}
                                        onBlur={handleBlur}
                                        isListItem={true}
                                    />
                                }
                            />
                        );
                    })}
            </div>
        </Box>
    );
};
