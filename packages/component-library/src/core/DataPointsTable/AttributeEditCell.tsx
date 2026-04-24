// @ts-nocheck
import { useRef, useEffect, useCallback, useState, type RefObject } from 'react';
import { TextField, Checkbox, Autocomplete, Box, alpha, styled, useTheme } from '@mui/material';
import { SchemaAttribute, SchemaInfo } from './SchemaUtils';
import { MRT_Cell, MRT_Row, MRT_TableInstance } from 'material-react-table';
import { FormDeviceResource, toFieldKey, useDataPointsStoreContext, useStoreRow } from './hooks/useDataPointsStore';

type AttributeEditCellProps = {
    cell: MRT_Cell<FormDeviceResource>;
    row: MRT_Row<FormDeviceResource>;
    table: MRT_TableInstance<FormDeviceResource>;
    attributeInfo: SchemaAttribute;
    schemaInfo: SchemaInfo;
};

const CellTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'isNumber' && prop !== 'hasError',
})<{ isNumber?: boolean; hasError?: boolean }>(({ theme, isNumber, hasError }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '& .MuiInputBase-input': {
        fontSize: '14px',
        fontFamily: (theme.typography as any).fontFamilyMonospace || 'monospace',
        caretColor: theme.palette.primary.dark,
        ...(isNumber && { textAlign: 'right !important' }),
        ...(hasError && { color: theme.palette.error.main }),
        ...(!isNumber && {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        '&::placeholder': {
            ...(isNumber && { textAlign: 'right !important' }),
            ...(hasError && { color: theme.palette.error.main }),
            fontSize: '14px',
            fontFamily: (theme.typography as any).fontFamilyMonospace || 'monospace',
        },
        '&:focus': {
            color: theme.palette.text.primary,
        },
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

/**
 * Number input with local string state. Commits a typed number to the store on blur.
 */
const NumberCellInput = ({
    value,
    inputRef,
    hasError,
    onChange,
    onBlur,
}: {
    value: any;
    inputRef: React.RefObject<HTMLInputElement>;
    hasError: boolean;
    onChange: (v: any) => void;
    onBlur: () => void;
}): JSX.Element => {
    const [displayValue, setDisplayValue] = useState(() => String(value ?? ''));

    // Sync display when store value changes externally
    const prevValue = useRef(value);
    useEffect(() => {
        if (prevValue.current !== value) {
            prevValue.current = value;
            setDisplayValue(String(value ?? ''));
        }
    }, [value]);

    return (
        <CellTextField
            type="standard"
            value={displayValue}
            onChange={(e) => setDisplayValue(e.target.value)}
            onBlur={() => {
                let committed: number | string;
                if (displayValue === '' || displayValue === '-') {
                    committed = value;
                } else {
                    const num = Number(displayValue);
                    committed = isNaN(num) ? value : num;
                }
                setDisplayValue(String(committed ?? ''));
                if (committed !== value) {
                    onChange(committed);
                }
                onBlur();
            }}
            variant="standard"
            fullWidth
            inputRef={inputRef}
            slotProps={{
                input: { disableUnderline: true },
                htmlInput: { inputMode: 'numeric', pattern: '^-?\\d*(\\.\\d+)?$' },
            }}
            isNumber
            hasError={hasError}
        />
    );
};

const CellContent = ({
    cell,
    table,
    attributeInfo,
    schemaInfo,
    value,
    hasError,
    onChange,
    onBlur,
}: {
    cell: MRT_Cell<FormDeviceResource>;
    table: MRT_TableInstance<FormDeviceResource>;
    attributeInfo: SchemaAttribute;
    schemaInfo: SchemaInfo;
    value: any;
    hasError: boolean;
    onChange: (v: any) => void;
    onBlur: () => void;
}): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isEditingThisCell = table.getState().editingCell?.id === cell.id;
    const theme = useTheme();

    // Auto-focus and select on edit
    useEffect(() => {
        if (isEditingThisCell && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current instanceof HTMLInputElement && inputRef.current.type === 'text') {
                inputRef.current.select();
            }
        }
    }, [isEditingThisCell]);

    // Boolean fields
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
                    checked={!!value}
                    onChange={(e) => {
                        onChange(e.target.checked);
                        // Commit immediately for booleans (no separate blur)
                        onBlur();
                    }}
                    size="medium"
                    sx={{ p: 0 }}
                />
            </Box>
        );
    }

    // Enum fields
    if (schemaInfo.type === 'enum' && schemaInfo.enumOptions) {
        return (
            <Autocomplete
                sx={{ px: 1 }}
                slotProps={{
                    paper: {
                        sx: {
                            '& .MuiAutocomplete-option': {
                                fontFamily: (theme.typography as any).fontFamilyMonospace || 'monospace',
                                fontSize: '14px',
                            },
                        },
                    },
                }}
                value={value ?? null}
                options={schemaInfo.enumOptions}
                onChange={(_, newValue) => {
                    const valueToSet = attributeInfo.required ? (newValue ?? '') : newValue;
                    onChange(valueToSet);
                }}
                onBlur={onBlur}
                renderInput={(params) => {
                    return (
                        <CellTextField
                            {...(params as any)}
                            variant="standard"
                            placeholder="Select option"
                            inputRef={inputRef as RefObject<HTMLInputElement>}
                            hasError={hasError}
                            slotProps={{
                                input: { ...params.InputProps, disableUnderline: true },
                            }}
                            sx={{ px: 0 }}
                        />
                    );
                }}
                disableClearable={attributeInfo.required}
                size="small"
                fullWidth
            />
        );
    }

    // Number fields
    if (schemaInfo.type === 'number') {
        return (
            <NumberCellInput
                value={value}
                inputRef={inputRef as RefObject<HTMLInputElement>}
                hasError={hasError}
                onChange={onChange}
                onBlur={onBlur}
            />
        );
    }

    // String fields (default)
    return (
        <CellTextField
            type="standard"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            variant="standard"
            fullWidth
            inputRef={inputRef}
            slotProps={{ input: { disableUnderline: true } }}
            isNumber={false}
            hasError={hasError}
        />
    );
};

export const AttributeEditCell = ({
    cell,
    row,
    table,
    attributeInfo,
    schemaInfo,
}: AttributeEditCellProps): JSX.Element => {
    const store = useDataPointsStoreContext();
    const fieldIndex = row.original.formIndex;
    const fieldKey = toFieldKey(attributeInfo.name);

    // Subscribe to row-level changes for fine-grained re-renders
    useStoreRow(fieldIndex);

    const value = store.getFieldValue(fieldIndex, fieldKey);

    const cellState = store.getCellState(fieldIndex, fieldKey);

    const handleChange = useCallback(
        (newValue: any) => {
            store.ensureBeforeEditCache(fieldIndex, fieldKey);
            store.setField(fieldIndex, fieldKey, newValue);
        },
        [store, fieldIndex, fieldKey]
    );

    const handleBlur = useCallback(() => {
        store.recordChange(fieldIndex, fieldKey);
    }, [store, fieldIndex, fieldKey]);

    return (
        <CellContent
            cell={cell}
            table={table}
            attributeInfo={attributeInfo}
            schemaInfo={schemaInfo}
            value={value}
            hasError={!!cellState.error}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};
