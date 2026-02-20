import { Controller, useFormContext } from 'react-hook-form';
import { useRef, useEffect, useCallback } from 'react';
import { TextField, Checkbox, Autocomplete, Box, alpha, styled, useTheme } from '@mui/material';
import { getSchemaInfo, SchemaAttribute } from './SchemaUtils';
import { MRT_Cell, MRT_Row, MRT_TableInstance } from 'material-react-table';
import { FormDeviceResource } from './hooks/useDataPointsForm';
import { useRecordChange } from './contexts/RecordChangeContext';

type AttributeEditCellProps = {
    cell: MRT_Cell<FormDeviceResource>;
    row: MRT_Row<FormDeviceResource>;
    table: MRT_TableInstance<FormDeviceResource>;
    attributeInfo: SchemaAttribute;
};

const CellTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'isNumber' && prop !== 'hasError',
})<{ isNumber?: boolean; hasError?: boolean }>(({ theme, isNumber, hasError }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .MuiInputBase-input': {
        // Set the font to match the design system's monospace font
        fontSize: '14px',
        fontFamily: 'monospace',
        // The caret should be the primary dark color instead of the default
        caretColor: theme.palette.primary.dark,
        // Long text should be ellipsed, and numbers should be right-aligned
        ...(isNumber && { textAlign: 'right !important' }),
        ...(hasError && { color: theme.palette.error.main }),
        ...(!isNumber && {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        // The placeholder should reproduce the same styles
        '&::placeholder': {
            ...(isNumber && { textAlign: 'right !important' }),
            ...(hasError && { color: theme.palette.error.main }),
            fontSize: '14px',
            fontFamily: 'monospace',
        },
        // When focused, the text color should be the primary text color (even in error cells)
        '&:focus': {
            color: theme.palette.text.primary,
        },
        // Selected text should be highlighted with the primary dark color
        '&::selection': {
            backgroundColor: alpha(theme.palette.primary.dark, 0.36),
            color: theme.palette.getContrastText(alpha(theme.palette.primary.dark, 0.36)),
        },
        '&::-moz-selection': {
            backgroundColor: alpha(theme.palette.primary.dark, 0.36),
            color: theme.palette.getContrastText(alpha(theme.palette.primary.dark, 0.36)),
        },
    },
}));

export const AttributeEditCell = ({ cell, row, table, attributeInfo }: AttributeEditCellProps): React.JSX.Element => {
    const { control } = useFormContext();
    const { recordChange } = useRecordChange();
    const fieldIndex = row.original.formIndex;
    const schemaInfo = getSchemaInfo(attributeInfo.schema);

    const fieldPath =
        attributeInfo.name === 'name'
            ? `deviceResources.${fieldIndex}.name`
            : attributeInfo.name === 'description'
              ? `deviceResources.${fieldIndex}.description`
              : attributeInfo.name === 'readWrite' ||
                  attributeInfo.name === 'valueType' ||
                  attributeInfo.name === 'units'
                ? `deviceResources.${fieldIndex}.properties.${attributeInfo.name}`
                : `deviceResources.${fieldIndex}.attributes.${attributeInfo.name}`;

    const handleBlur = useCallback(() => {
        recordChange(fieldPath);
    }, [fieldPath, recordChange]);

    const theme = useTheme();

    return (
        // Controller to connect the input to react-hook-form
        <Controller
            name={fieldPath}
            control={control}
            defaultValue={attributeInfo.defaultValue}
            render={({ field, fieldState }) => {
                const inputRef = useRef<HTMLInputElement>(null);
                const isEditingThisCell = table.getState().editingCell?.id === cell.id;
                const hasError = !!fieldState.error;

                // Focus and select the input when this cell is being edited, if it's a text field.
                useEffect(() => {
                    if (isEditingThisCell && inputRef.current) {
                        inputRef.current.focus();
                        if (inputRef.current instanceof HTMLInputElement && inputRef.current.type === 'text') {
                            inputRef.current.select();
                        }
                    }
                }, [isEditingThisCell]);

                // Boolean fields are rendered as checkboxes
                if (schemaInfo.type === 'boolean') {
                    return (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Checkbox
                                checked={!!field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.checked);
                                }}
                                onBlur={() => {
                                    field.onBlur();
                                    handleBlur();
                                }}
                                size="medium"
                                sx={{ p: 0 }}
                            />
                        </Box>
                    );
                }

                // Enum fields are rendered as autocompletes
                if (schemaInfo.type === 'enum' && schemaInfo.enumOptions) {
                    return (
                        <Autocomplete
                            sx={{
                                px: 1,
                            }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        '& .MuiAutocomplete-option': {
                                            fontFamily: 'monospace',
                                            fontSize: '14px',
                                        },
                                    },
                                },
                            }}
                            value={field.value ?? null}
                            options={schemaInfo.enumOptions}
                            onChange={(_, newValue) => {
                                const valueToSet = attributeInfo.required ? (newValue ?? '') : newValue;
                                field.onChange(valueToSet);
                            }}
                            onBlur={() => {
                                field.onBlur();
                                handleBlur();
                            }}
                            // The input should match freeform text fields
                            renderInput={(params) => (
                                <CellTextField
                                    {...params}
                                    variant="standard"
                                    placeholder="Select option"
                                    inputRef={inputRef}
                                    hasError={hasError}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            disableUnderline: true,
                                        },
                                    }}
                                    sx={{ px: 0 }}
                                />
                            )}
                            disableClearable={attributeInfo.required}
                            size="small"
                            fullWidth
                        />
                    );
                }

                // All other fields (including numbers) are rendered as text fields
                return (
                    <CellTextField
                        type="standard"
                        value={field.value ?? ''}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                        }}
                        // Handle blur to record changes and format numbers
                        onBlur={() => {
                            if (schemaInfo.type === 'number') {
                                if (field.value === '') {
                                    field.onChange('');
                                } else {
                                    const newValue = Number(field.value);
                                    field.onChange(isNaN(newValue) ? '' : newValue);
                                }
                            }
                            field.onBlur();
                            handleBlur();
                        }}
                        variant="standard"
                        fullWidth
                        inputRef={inputRef}
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            },
                            // Use inputMode and pattern instead of type="number" to avoid
                            // the default browser number input styles (which conflict with our design, among other issues).
                            htmlInput: {
                                inputMode: schemaInfo.type === 'number' ? 'numeric' : 'text',
                                pattern: schemaInfo.type === 'number' ? '^-?\\d*(\\.\\d+)?$' : undefined,
                            },
                        }}
                        isNumber={schemaInfo.type === 'number'}
                        hasError={hasError}
                    />
                );
            }}
        />
    );
};
