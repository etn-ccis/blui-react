import { useFormContext } from 'react-hook-form';
import z from 'zod';
import ProtocolConfigList from './ProtocolConfigList';
import { FieldData, formatTitle, getFieldData, shouldShowField } from './ProtocolUtils';
import { ProtocolListItem } from './ProtocolListItem';
import { memo, useEffect } from 'react';
import { ProtocolType } from '../DataPointsTable/schemas/ProtocolSchemas';
import { FormFieldWrapper } from './FormComponents/FormFieldWrapper';

export const FieldConfigSection = memo(
    ({
        section,
        schema,
        protocolType,
    }: {
        section: {
            title: string;
            fields: string[];
        };
        schema: z.ZodType;
        protocolType?: ProtocolType;
    }): JSX.Element => {
        const { watch, setValue, trigger, clearErrors } = useFormContext();

        const getFieldDataForKey = (key: string): FieldData => getFieldData(key, schema);

        const handleBlur = (name: string): void => {
            // TODO: This has to be improved, as it does not scale well with more inter-dependent fields
            if (name === 'connection.type') {
                void trigger('modbus-type');
            }
            if (name === 'modbus-type') {
                void trigger('device-address');
            }
            if (name.startsWith('group-variation-requests.')) {
                void trigger('unsol-enable');
            }
        };

        useEffect(() => {
            section.fields.forEach((key) => {
                const { defaultValue } = getFieldDataForKey(key);
                const shouldShow = shouldShowField(key, watch(), undefined, undefined, protocolType);

                if (!shouldShow && defaultValue !== undefined) {
                    clearErrors(key);
                    setValue(key, defaultValue);
                }
            });
        }, [watch('modbus-type'), watch('sync-type')]);

        return (
            <ProtocolConfigList key={section.title} title={section.title}>
                {section.fields
                    .filter((key) => shouldShowField(key, watch(), undefined, undefined, protocolType))
                    .map((key) => {
                        const fieldData = getFieldDataForKey(key);
                        const title = formatTitle(key);
                        return (
                            <ProtocolListItem
                                key={key}
                                title={title}
                                description={fieldData.description}
                                valueComponent={
                                    <FormFieldWrapper
                                        name={key}
                                        fieldData={fieldData}
                                        onBlur={handleBlur}
                                        isListItem={true}
                                    />
                                }
                            />
                        );
                    })}
            </ProtocolConfigList>
        );
    }
);
