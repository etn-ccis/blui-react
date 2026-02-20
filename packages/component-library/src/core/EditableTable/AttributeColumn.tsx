import { MRT_ColumnDef } from 'material-react-table';
import { alpha, Badge, Box, Tooltip, Typography, useTheme } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, Error, Info } from '@mui/icons-material';
import { FieldError, FieldValues, FormState, useFormContext } from 'react-hook-form';
import {
    constrainSchemaProperties,
    extractAttributesFromSchema,
    formatAttributeName,
    getSchemaInfo,
    SchemaAttribute,
    ResourceSchema,
    ResourcePropertiesConstraints,
} from './SchemaUtils';
import { AttributeEditCell } from './AttributeEditCell';
import { FormDeviceResource } from './hooks/useDataPointsForm';
import { memo, useMemo } from 'react';
import { InfoListItem } from '@brightlayer-ui/react-components';

const CellTooltipContent = ({
    isDirty,
    hasError,
    errorMessage,
    originalValue,
}: {
    isDirty: boolean;
    hasError: boolean;
    errorMessage?: string;
    originalValue?: any;
}): React.JSX.Element | null => {
    if (!isDirty && !hasError) return null;

    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {isDirty && (
                <>
                    <Typography variant="body2">Change not saved to device yet.</Typography>
                    {originalValue !== undefined && originalValue !== null && originalValue !== '' && (
                        <Typography variant="caption">
                            Changed from:
                            <Typography
                                variant="caption"
                                component="span"
                                sx={{ fontFamily: 'monospace', ml: 0.5 }}
                            >
                                {/* Adjust vertical alignment of icon */}

                                {typeof originalValue === 'boolean' ? (
                                    <Box
                                        component="span"
                                        sx={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
                                    >
                                        {originalValue ? (
                                            <CheckBox fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                        ) : (
                                            <CheckBoxOutlineBlank
                                                fontSize="small"
                                                sx={{ color: theme.palette.grey[400] }}
                                            />
                                        )}
                                        {` (${String(originalValue)})`}
                                    </Box>
                                ) : (
                                    String(originalValue)
                                )}
                            </Typography>
                        </Typography>
                    )}
                </>
            )}
            {hasError && errorMessage && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: isDirty ? 0.5 : 0 }}>
                    <Error sx={{ color: theme.palette.error.dark }} />
                    <Typography variant="caption" color={theme.palette.error.main}>
                        {errorMessage}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

const createAttributeColumn = (attributeInfo: SchemaAttribute): MRT_ColumnDef<FormDeviceResource> | null => {
    // Helper to get value from a row
    const accessorFn = (row: FormDeviceResource): string => {
        if (attributeInfo.name === 'name') {
            return row.name;
        }
        if (attributeInfo.name === 'description') {
            return row.description ?? '';
        }
        if (
            attributeInfo.name === 'readWrite' ||
            attributeInfo.name === 'valueType' ||
            attributeInfo.name === 'units'
        ) {
            const properties = row.properties as Record<string, unknown>;
            return properties?.[attributeInfo.name]?.toString() ?? attributeInfo.defaultValue?.toString() ?? '';
        }
        const attributes = row.attributes as Record<string, unknown>;
        return attributes?.[attributeInfo.name]?.toString() ?? attributeInfo.defaultValue?.toString() ?? '';
    };

    // Helper component to wrap cells with dirty badge and tooltip
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const BadgeCellWithTooltip = (props: any, CellComponent: typeof AttributeEditCell): React.JSX.Element => {
        const { getFieldState, formState } = useFormContext();
        const fieldIndex = props.row.original.formIndex;
        const isEditingThisCell = props.table.getState().editingCell?.id === props.cell.id;

        // Determine field path
        let fieldPath: string;
        if (attributeInfo.name === 'name') {
            fieldPath = `deviceResources.${fieldIndex}.name`;
        } else if (attributeInfo.name === 'description') {
            fieldPath = `deviceResources.${fieldIndex}.description`;
        } else if (
            attributeInfo.name === 'readWrite' ||
            attributeInfo.name === 'valueType' ||
            attributeInfo.name === 'units'
        ) {
            fieldPath = `deviceResources.${fieldIndex}.properties.${attributeInfo.name}`;
        } else {
            fieldPath = `deviceResources.${fieldIndex}.attributes.${attributeInfo.name}`;
        }

        // Check if this specific field is dirty
        const { isDirty, error } = getFieldState(fieldPath, formState);
        const hasError = !!error;
        const errorMessage = error?.message;

        // Get original value for tooltip
        const originalValue =
            formState.defaultValues?.deviceResources?.[fieldIndex]?.attributes?.[attributeInfo.name] ??
            formState.defaultValues?.deviceResources?.[fieldIndex]?.properties?.[attributeInfo.name] ??
            formState.defaultValues?.deviceResources?.[fieldIndex]?.[attributeInfo.name];

        const content = (
            <Badge
                color="primary"
                variant="dot"
                sx={{
                    width: '100%',
                }}
                invisible={!isDirty}
            >
                <CellComponent {...props} attributeInfo={attributeInfo} />
            </Badge>
        );

        // Only show tooltip when not editing if cell is dirty or has error
        if (isEditingThisCell || (!isDirty && !hasError)) {
            return content;
        }

        return (
            <Tooltip
                title={
                    <CellTooltipContent
                        isDirty={isDirty}
                        hasError={hasError}
                        errorMessage={errorMessage}
                        originalValue={originalValue}
                    />
                }
                enterDelay={500}
                arrow
                placement="top"
                followCursor
                slotProps={{
                    tooltip: {
                        sx: {
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: hasError ? 'error.dark' : 'primary.dark',
                        },
                    },
                    arrow: {
                        sx: {
                            color: 'background.paper',
                            '&:before': {
                                border: '1px solid',
                                borderColor: hasError ? 'error.dark' : 'primary.dark',
                            },
                        },
                    },
                }}
            >
                {content}
            </Tooltip>
        );
    };

    // Estimate size based on header length: 7px per character + 82px for icons and padding
    // It's quite annoying that column sizes need to be pixels!
    const header = formatAttributeName(attributeInfo.name) + (attributeInfo.required ? '*' : '');

    // Calculate the longest word in the header.
    const longestHeaderWordLength = header.split(' ').reduce((max, word) => Math.max(max, word.length), 0);
    let minSize = longestHeaderWordLength * 7 + 82;

    const schemaInfo = getSchemaInfo(attributeInfo.schema);
    if (schemaInfo.type === 'enum') {
        // For enums, ensure min size can fit the longest option
        const longestOptionLength = schemaInfo.enumOptions
            ? schemaInfo.enumOptions.reduce((max, option) => Math.max(max, option.length), 0)
            : 0;
        // When using a monospace font, each character is approximately 8.8px wide, and there are 62 pixels of padding/icons in the autocomplete.
        const clearSpace = attributeInfo.required ? 0 : 30; // Account for clear button space if not required
        minSize = Math.max(minSize, longestOptionLength * 8.8 + 62 + clearSpace);
    }

    const maxSize = schemaInfo.type === 'boolean' ? minSize : Math.max(minSize, 2000);

    let filterVariant;
    switch (schemaInfo.type) {
        case 'boolean':
            filterVariant = 'checkbox';
            break;
        case 'enum':
            filterVariant = 'select';
            break;
        case 'number':
            filterVariant = 'range';
            break;
        default:
            filterVariant = 'text';
            break;
    }

    return {
        id: attributeInfo.name,
        header,
        filterVariant: filterVariant as MRT_ColumnDef<FormDeviceResource>['filterVariant'],
        muiTableHeadCellProps: {
            title: attributeInfo.description ?? `${formatAttributeName(attributeInfo.name)} attribute`,
            sx: {
                '& .Mui-TableHeadCell-Content-Wrapper': {
                    textOverflow: 'clip', // Prevent ellipsis
                    whiteSpace: 'normal',
                    lineHeight: 'normal',
                    px: 2,
                },
                '& .Mui-TableHeadCell-Content': {
                    // TODO: Check if this is desirable
                    justifyContent: 'flex-start',
                },
                // Set left padding within the header to zero so that we can leverage the content wrapper padding instead.
                // Don't touch right padding though, as it would interfere with the column resize handle.
                pl: 0,
            },
            // Make elements centered vertically within the cell header
            //align: 'center',
        },
        accessorFn,
        Edit: (props) => BadgeCellWithTooltip(props, AttributeEditCell),
        size: minSize,
        minSize,
        maxSize,
        grow: attributeInfo.name === 'description' ? 99999 : 0,
    };
};

const getRowState = (
    formIndex: number,
    formState: FormState<FieldValues>
): { isDirty: boolean; error?: FieldError } => {
    let isDirty = false;
    const dirtyName = formState.dirtyFields.deviceResources?.[formIndex]?.name;
    const dirtyDescription = formState.dirtyFields.deviceResources?.[formIndex]?.description;

    // Check basic fields first, then properties and attributes if needed
    if (dirtyName || dirtyDescription) {
        isDirty = true;
    } else {
        const dirtyProperties = formState.dirtyFields.deviceResources?.[formIndex]?.properties as
            | Record<string, boolean>
            | undefined;
        const dirtyAttributes = formState.dirtyFields.deviceResources?.[formIndex]?.attributes as
            | Record<string, boolean>
            | undefined;

        if (
            (dirtyProperties && Object.values(dirtyProperties).some(Boolean)) ||
            (dirtyAttributes && Object.values(dirtyAttributes).some(Boolean))
        ) {
            isDirty = true;
        }
    }

    const error = Array.isArray(formState.errors.deviceResources)
        ? (formState.errors.deviceResources[formIndex] as FieldError | undefined)
        : undefined;

    return { isDirty, error };
};

const RealtimeCell = memo(({ device, resource }: { device: any; resource: FormDeviceResource }) => {
    const { formState } = useFormContext();
    const { isDirty, error } = useMemo(
        () => getRowState(resource.formIndex, formState),
        [resource.formIndex, formState]
    );

    const theme = useTheme();
    const hasError = !!error;

    // TODO: If desired, we could show specific error messages here instead of a generic one.
    // For example, the design shows "Please fill in all required fields" for attribute columns;
    // however, that requires manual parsing of the error object to find relevant messages (invalid_type, too_small, etc.)
    // For now, we keep it generic to avoid complexity.

    if (isDirty || hasError) {
        return (
            <InfoListItem
                key={`${resource.name}-dirty`}
                title={
                    hasError ? (
                        <Typography variant="caption" color="error" sx={{ whiteSpace: 'normal' }}>
                            Please correct all errors
                        </Typography>
                    ) : (
                        <Typography variant="caption" color="info" sx={{ whiteSpace: 'normal' }}>
                            Apply or reset changes for real-time value
                        </Typography>
                    )
                }
                icon={<Info color="inherit" />}
                dense
                statusColor={hasError ? theme.palette.error.dark : theme.palette.info.dark}
                backgroundColor={alpha(hasError ? theme.palette.error.dark : theme.palette.info.dark, 0.2)}
                sx={{
                    '& .BluiInfoListItem-icon': {
                        mr: 1,
                        width: '100%',
                    },
                }}
            />
        );
    }

    // Default: return empty cell since realtime values are not available in generic version
    return <Typography variant="body2">—</Typography>;
});

RealtimeCell.displayName = 'RealtimeCell';

export const createRealtimeValueColumn = (
    device?: any,
    newDevice?: boolean
): MRT_ColumnDef<FormDeviceResource> | null => {
    // Realtime value column is disabled in generic version
    // Users can provide custom columns for realtime data if needed
    return null;
};

export const createColumns = (
    schema: ResourceSchema,
    propertiesConstraints: ResourcePropertiesConstraints,
    currentTab: string,
    device?: any,
    newDevice?: boolean
): Array<MRT_ColumnDef<FormDeviceResource>> => {
    if (!currentTab) return [];

    const attributes = extractAttributesFromSchema(
        constrainSchemaProperties(schema, propertiesConstraints, currentTab) as any,
        currentTab
    );
    const attributeColumns = attributes
        .map((attr) => createAttributeColumn(attr))
        .filter((col): col is MRT_ColumnDef<FormDeviceResource> => col !== null);

    // Realtime column removed - not available in generic version
    return attributeColumns;
};
