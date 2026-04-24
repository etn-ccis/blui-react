import { Box, Paper, Typography } from '@mui/material';
import { ProtocolListItem } from './ProtocolListItem';
import { extractArrayFields, getArrayBounds } from './ProtocolUtils';
import { forwardRef, startTransition, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { FieldErrors, FormProvider, useFieldArray, useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ProtocolConfigList from './ProtocolConfigList';
import { ProtocolArrayRow } from './ProtocolArrayRow';
import { DraggableList } from './ProtocolDraggableList';
import { FieldConfigSection } from './FieldConfigSection';
import { DeviceProtocol, DeviceProtocolData } from '../DataPointsTable/schemas/ProtocolSchemas';
import { ProtocolRegistry } from './ProtocolRegistry';
import z from 'zod';
import { BLUIColors } from '@brightlayer-ui/colors';
import { ProtocolConfigurationsSkeleton } from './ProtocolConfigurationsSkeleton';

const generateFieldSections = (schema: z.ZodObject): Array<{ title: string; fields: string[] }> => {
    const shape = schema.shape;
    const protocolSectionsMap: Record<string, Set<string>> = {};

    const collectFields = (currentKey: string, currentShape: z.core.$ZodLooseShape): void => {
        Object.entries(currentShape).forEach(([key, fieldSchema]: [string, z.ZodType]) => {
            let innerSchema = fieldSchema;

            // Unwrap defaults and optionals
            while (innerSchema instanceof z.ZodDefault || innerSchema instanceof z.ZodOptional) {
                innerSchema = innerSchema.unwrap() as z.ZodType;
            }

            // Skip arrays for sectioning purposes
            if (innerSchema instanceof z.ZodArray) {
                return;
            }

            // Get nested fields from objects
            if (innerSchema instanceof z.ZodObject) {
                collectFields(currentKey ? `${currentKey}.${key}` : key, innerSchema.shape);
                return;
            }

            // Get all fields from discriminated unions (e.g. connection)
            if (innerSchema instanceof z.ZodDiscriminatedUnion) {
                const options = innerSchema.options;
                options.forEach((option) => {
                    if (option instanceof z.ZodObject) {
                        collectFields(currentKey ? `${currentKey}.${key}` : key, option.shape);
                    }
                });
                return;
            }

            const sectionTitle = currentKey ? currentKey : 'General Settings';
            if (!protocolSectionsMap[sectionTitle]) {
                protocolSectionsMap[sectionTitle] = new Set();
            }
            protocolSectionsMap[sectionTitle].add(currentKey ? `${currentKey}.${key}` : key);
        });
    };

    collectFields('', shape);

    return Object.entries(protocolSectionsMap).map(([title, fields]) => ({
        title: title
            .split('.')
            .map((part) =>
                part
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            )
            .join(' — '),

        fields: Array.from(fields),
    }));
};

type ProtocolConfigurationsProps = {
    protocols: DeviceProtocol;
    searchTerm?: string;
    onSubmit?: (data: DeviceProtocol) => Promise<void>;
    onDataChange?: (data: DeviceProtocolData, isDirty: boolean, errors: FieldErrors<DeviceProtocolData>) => void;
};

export type ProtocolConfigurationsRef = {
    submit: () => void;
    getData: () => DeviceProtocolData;
    isValid: () => boolean;
};

export const ProtocolConfigurations = forwardRef<ProtocolConfigurationsRef, ProtocolConfigurationsProps>(
    (props, ref): JSX.Element => {
        const [isReady, setIsReady] = useState(false);
        const { protocols } = props;
        const {
            type: protocolType,
            data: protocol,
            definition: protocolDefinition,
        } = ProtocolRegistry.extract(protocols);
        const formSchema = protocolDefinition.configSchema;
        // Put the "Connection" section first
        const protocolSections = useMemo(
            () =>
                generateFieldSections(formSchema).sort((a, b) =>
                    a.title === 'Connection' ? -1 : b.title === 'Connection' ? 1 : 0
                ),
            [formSchema]
        );

        const initialValues = protocol;

        const methods = useForm<DeviceProtocolData>({
            resolver: zodResolver(formSchema) as any,
            defaultValues: Object.keys(initialValues).length > 0 ? initialValues : undefined,
            mode: 'onBlur',
        });

        const { control, handleSubmit, trigger, getValues, reset } = methods;
        const { isDirty, errors, isValid } = useFormState({ control });

        const onSubmit = async (): Promise<void> => {
            if (props.onSubmit) {
                try {
                    await props.onSubmit({ [protocolType]: getValues() } as DeviceProtocol);
                } catch (error) {
                    console.error('Error in onSubmit:', error);
                }
            }
            // Reset the form on submit to clear the isDirty flag
            reset(getValues());
        };

        // Reset the form to the actual initial values after they are passed to the form,
        // since the schema might have props that are not rendered (as they are hidden).
        // This is important for the isDirty check to work correctly.
        useEffect(() => {
            reset(getValues());
            void trigger();
        }, []);

        useEffect(() => {
            if (props.onDataChange) {
                props.onDataChange(getValues(), isDirty, errors);
            }
        }, [isDirty, errors, isValid]);

        const arrayFields = extractArrayFields(formSchema);

        const sequenceConfig = arrayFields.map(({ arrayName, title, keys }) => ({
            arrayName,
            title,
            fields: useFieldArray({
                control,
                name: arrayName as any,
            }),
            keys,
        }));

        const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

        useImperativeHandle(ref, () => ({
            submit: async (): Promise<void> => {
                await handleSubmit(async () => {
                    await onSubmit();
                })();
            },
            getData: (): DeviceProtocolData => getValues(),
            isValid: (): boolean => isValid,
        }));

        useEffect(() => {
            // Defer heavy rendering to allow the page to paint first
            startTransition(() => {
                setIsReady(true);
            });
        }, []);

        if (!isReady) {
            return <ProtocolConfigurationsSkeleton />;
        }

        return (
            <FormProvider {...methods}>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(onSubmit)(e);
                    }}
                >
                    <Paper>
                        <ProtocolListItem
                            title={'Protocol'}
                            valueComponent={<span>{ProtocolRegistry.getName(protocolType)}</span>}
                        />
                    </Paper>

                    {protocolSections.map((section: { title: string; fields: string[] }) => (
                        <FieldConfigSection
                            key={section.title}
                            section={section}
                            schema={formSchema}
                            protocolType={protocolType}
                        />
                    ))}

                    {sequenceConfig.map((config) => {
                        const { arrayName, title, fields, keys } = config;
                        const bounds = getArrayBounds(formSchema, config);
                        const addAllowed = bounds ? fields.fields.length < bounds.maxItems : true;
                        const removeAllowed = bounds ? fields.fields.length > bounds.minItems : true;
                        return (
                            <ProtocolConfigList
                                key={arrayName}
                                title={title}
                                config={config}
                                schema={formSchema}
                                //  If add not allowed, don't set the add property
                                {...(addAllowed && {
                                    add: (item): void => {
                                        const newIndex = fields.fields.length;
                                        fields.append(item, {
                                            shouldFocus: false,
                                        });
                                        setLastAddedIndex(newIndex);
                                    },
                                })}
                            >
                                {config.fields.fields.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body2" sx={{ color: BLUIColors.black[200] }}>
                                            No {title.toLocaleLowerCase()} configured. Click "New Item" to add one.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <DraggableList
                                        items={fields.fields.map((field, index) => ({
                                            id: field.id,
                                            index,
                                        }))}
                                        onDragEnd={(sourceIndex, destinationIndex) => {
                                            fields.move(sourceIndex, destinationIndex);
                                            setLastAddedIndex(null);
                                        }}
                                        renderItem={(item) => (
                                            <ProtocolArrayRow
                                                index={item.index}
                                                arrayName={arrayName}
                                                sequenceFields={keys}
                                                schema={formSchema}
                                                // If remove not allowed, don't set the remove property
                                                {...(removeAllowed && {
                                                    remove: () => fields.remove(item.index),
                                                })}
                                                config={config}
                                                initialExpanded={item.index === lastAddedIndex}
                                            />
                                        )}
                                    />
                                )}
                            </ProtocolConfigList>
                        );
                    })}
                </form>
            </FormProvider>
        );
    }
);
