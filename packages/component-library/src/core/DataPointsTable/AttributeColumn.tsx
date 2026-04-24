// @ts-nocheck
import { MRT_ColumnDef } from 'material-react-table';
import { alpha, Badge, Box, Checkbox, Tooltip, Typography, useTheme } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank, Error, Info } from '@mui/icons-material';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';
import {
    constrainSchemaProperties,
    extractAttributesFromSchema,
    formatAttributeName,
    getSchemaInfo,
    SchemaAttribute,
    SchemaInfo,
} from './SchemaUtils';
import { AttributeEditCell } from './AttributeEditCell';
import { RealtimeValueCell } from './RealtimeValueCell';
import { FormDeviceResource, toFieldKey, useDataPointsStoreContext, useStoreRow } from './hooks/useDataPointsStore';
import { ProtocolResourceSchema } from '../DeviceProtocolConfiguration/ProtocolRegistry';
import { TypeConstraintsMap } from './schemas/DeviceResources/ResourcePropertiesValidator';
import { memo, useCallback, useState } from 'react';
import { InfoListItem } from '@brightlayer-ui/react-components';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

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
}): JSX.Element | null => {
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
                                sx={{ fontFamily: (theme.typography as any).fontFamilyMonospace || 'monospace', ml: 0.5 }}
                            >
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

/**
 * Wraps children with an MUI Badge (dirty dot) and, when dirty or errored,
 * an MUI Tooltip showing the original value / error message.
 * Shared by both the read-only cell and the edit cell.
 */
const CellBadgeTooltip = ({
    children,
    fieldIndex,
    fieldKey,
    showTooltip = true,
}: {
    children: JSX.Element;
    fieldIndex: number;
    fieldKey: string;
    showTooltip?: boolean;
}): JSX.Element => {
    const store = useDataPointsStoreContext();
    const cellState = store.getCellState(fieldIndex, fieldKey);
    const isDirty = cellState.isDirty;
    const hasError = !!cellState.error;
    const errorMessage = cellState.error?.message;
    const originalValue = store.getOriginalValue(fieldIndex, fieldKey);

    const content = (
        <Badge color="primary" variant="dot" sx={{ width: '100%' }} invisible={!isDirty}>
            {children}
        </Badge>
    );

    // Always render the Tooltip wrapper so the DOM structure stays stable.
    // Toggling between <Tooltip><Badge>… and bare <Badge>… would replace
    // child DOM nodes mid-click and swallow checkbox onChange events.
    // An empty title makes MUI Tooltip not show at all.
    const shouldShow = showTooltip && (isDirty || hasError);

    return (
        <Tooltip
            title={
                shouldShow ? (
                    <CellTooltipContent
                        isDirty={isDirty}
                        hasError={hasError}
                        errorMessage={errorMessage}
                        originalValue={originalValue}
                    />
                ) : (
                    ''
                )
            }
            enterDelay={500}
            disableInteractive
            arrow={shouldShow}
            TransitionProps={{ timeout: { enter: 200, exit: 0 } }}
            placement="top"
            followCursor
            slotProps={{
                popper: {
                    sx: { pointerEvents: 'none' },
                },
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

/**
 * Lightweight read-only cell rendered for every non-editing cell.
 * Uses plain HTML to minimize mount cost during virtualization.
 */
const ReadOnlyCell = memo(
    ({ fieldIndex, fieldKey, schemaType }: { fieldIndex: number; fieldKey: string; schemaType: string }) => {
        const store = useDataPointsStoreContext();
        const theme = useTheme();
        useStoreRow(fieldIndex);

        const value = store.getFieldValue(fieldIndex, fieldKey);
        const hasError = !!store.getCellState(fieldIndex, fieldKey).error;
        const isNumber = schemaType === 'number';
        const isBool = schemaType === 'boolean';

        // Track focus for booleans so the tooltip is suppressed while interacting
        const [boolFocused, setBoolFocused] = useState(false);

        const handleBoolToggle = useCallback(() => {
            store.ensureBeforeEditCache(fieldIndex, fieldKey);
            store.setField(fieldIndex, fieldKey, !(value === true || value === 'true'));
            store.recordChange(fieldIndex, fieldKey);
        }, [store, fieldIndex, fieldKey, value]);

        let inner: JSX.Element;
        if (isBool) {
            const checked = value === true || value === 'true';
            inner = (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    onFocus={() => setBoolFocused(true)}
                    onBlur={() => setBoolFocused(false)}
                >
                    <Checkbox checked={checked} onChange={handleBoolToggle} size="medium" sx={{ p: 0 }} />
                </Box>
            );
        } else {
            const displayValue = value ?? '';
            inner = (
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        fontFamily: (theme.typography as any).fontFamilyMonospace || 'monospace',
                        fontSize: '14px',
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingTop: '4px',
                        paddingBottom: '5px',
                        overflow: 'hidden',
                        ...(isNumber && { justifyContent: 'flex-end' }),
                        ...(hasError && { color: theme.palette.error.main }),
                    }}
                >
                    <span
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {String(displayValue)}
                    </span>
                </span>
            );
        }

        return (
            <CellBadgeTooltip fieldIndex={fieldIndex} fieldKey={fieldKey} showTooltip={!boolFocused}>
                {inner}
            </CellBadgeTooltip>
        );
    }
);

ReadOnlyCell.displayName = 'ReadOnlyCell';

/**
 * Edit cell wrapper with dirty Badge.
 * Only mounts for the actively-edited cell (editDisplayMode: 'cell'),
 * so the tooltip is suppressed.
 */
const EditCellBadge = memo(
    ({
        cell,
        row,
        table,
        attributeInfo,
        schemaInfo,
        ...rest
    }: {
        cell: any;
        row: any;
        table: any;
        attributeInfo: SchemaAttribute;
        schemaInfo: SchemaInfo;
        [key: string]: any;
    }): JSX.Element => {
        const fieldIndex = row.original.formIndex;
        const fieldKey = toFieldKey(attributeInfo.name);

        useStoreRow(fieldIndex);

        return (
            <CellBadgeTooltip fieldIndex={fieldIndex} fieldKey={fieldKey} showTooltip={false}>
                <AttributeEditCell
                    cell={cell}
                    row={row}
                    table={table}
                    attributeInfo={attributeInfo}
                    schemaInfo={schemaInfo}
                    {...rest}
                />
            </CellBadgeTooltip>
        );
    }
);

EditCellBadge.displayName = 'EditCellBadge';

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
            attributeInfo.name === 'units' ||
            attributeInfo.name === 'scale' ||
            attributeInfo.name === 'offset'
        ) {
            const properties = row.properties as Record<string, unknown>;
            return properties?.[attributeInfo.name]?.toString() ?? attributeInfo.defaultValue?.toString() ?? '';
        }
        const attributes = row.attributes as Record<string, unknown>;
        return attributes?.[attributeInfo.name]?.toString() ?? attributeInfo.defaultValue?.toString() ?? '';
    };

    // Pre-compute schema info once per column instead of per cell render
    const schemaInfo = getSchemaInfo(attributeInfo.schema);

    // Estimate size based on header length
    // Column sizes must be in pixels.
    const header = formatAttributeName(attributeInfo.name) + (attributeInfo.required ? '*' : '');

    // Calculate the longest word in the header.
    const longestHeaderWordLength = header.split(' ').reduce((max, word) => Math.max(max, word.length), 0);
    let minSize = longestHeaderWordLength * 7 + 82;

    if (schemaInfo.type === 'enum') {
        // Ensure min size fits the longest enum option
        // (~8.8px per char in monospace + 62px padding)
        const longestOptionLength = schemaInfo.enumOptions
            ? schemaInfo.enumOptions.reduce((max, option) => Math.max(max, option.length), 0)
            : 0;
        // When using a monospace font, each character is approximately 8.8px wide, and there are 62 pixels of padding/icons in the autocomplete.
        const clearSpace = attributeInfo.required ? 0 : 30;
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
        // Booleans are interactive via ReadOnlyCell's Checkbox, so edit mode
        // is disabled to prevent unmounting the cell before onChange fires.
        enableEditing: schemaInfo.type !== 'boolean',
        Cell: ({ row }) => (
            <ReadOnlyCell
                fieldIndex={row.original.formIndex}
                fieldKey={toFieldKey(attributeInfo.name)}
                schemaType={schemaInfo.type}
            />
        ),
        Edit: (props) => <EditCellBadge {...props} attributeInfo={attributeInfo} schemaInfo={schemaInfo} />,
        size: minSize,
        minSize,
        maxSize,
        grow: attributeInfo.name === 'description' ? 99999 : 0,
    };
};

const RealtimeCell = memo(
    ({ device, resource }: { device: DeviceConfiguration; resource: FormDeviceResource }) => {
        const store = useDataPointsStoreContext();
        const theme = useTheme();

        // Subscribe to row changes only; structural changes handled by MRT via filteredResources.
        useStoreRow(resource.formIndex);

        const isDirty = store.isRowDirty(resource.formIndex);
        const hasError = store.isRowInvalid(resource.formIndex);

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

        return <RealtimeValueCell device={device} res={resource} />;
    },
    // Only re-render when the stable row UUID or device identity changes
    (prev, next) => prev.resource.id === next.resource.id && prev.device === next.device
);

RealtimeCell.displayName = 'RealtimeCell';

export const createRealtimeValueColumn = (
    device?: DeviceConfiguration,
    newDevice?: boolean
): MRT_ColumnDef<FormDeviceResource> | null => {
    if (!device || newDevice) return null;

    return {
        id: 'realtime-value',
        header: 'Real-Time Value',
        enableEditing: false,
        muiTableHeadCellProps: {
            title: 'Real-time value of the data point, if available',
        },
        // Remove padding from cell, adjust depending on contents
        muiTableBodyCellProps: {
            sx: {
                p: 0,
            },
        },
        accessorFn: (row: FormDeviceResource) => row,
        Cell: ({ cell }) => <RealtimeCell device={device} resource={cell.row.original} />,
        size: 200,
        minSize: 200,
    };
};

export const createColumns = (
    schema: ProtocolResourceSchema,
    propertiesConstraints: TypeConstraintsMap,
    currentTab: string,
    device?: DeviceConfiguration,
    newDevice?: boolean
): Array<MRT_ColumnDef<FormDeviceResource>> => {
    if (!currentTab) return [];

    const attributes = extractAttributesFromSchema(
        constrainSchemaProperties(schema, propertiesConstraints, currentTab) as ProtocolResourceSchema,
        currentTab
    );
    const attributeColumns = attributes
        .map((attr) => createAttributeColumn(attr))
        .filter((col): col is MRT_ColumnDef<FormDeviceResource> => col !== null);

    const realtimeColumn = createRealtimeValueColumn(device, newDevice);

    return realtimeColumn ? [realtimeColumn, ...attributeColumns] : attributeColumns;
};
