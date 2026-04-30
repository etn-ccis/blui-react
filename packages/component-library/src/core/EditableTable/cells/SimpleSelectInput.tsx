import React, { useRef, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { EditableTableData } from '../types';

type SimpleSelectInputProps<TData extends EditableTableData> = {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    options: Array<{ value: any; label: string }>;
    hasError?: boolean;
    disabled?: boolean;
};

/**
 * SimpleSelectInput - A customized MUI Autocomplete component for dropdown cells
 * Uses MUI Autocomplete with filtering capability - users can type to filter options
 */
export const SimpleSelectInput = <TData extends EditableTableData>({
    value,
    onChange,
    onBlur,
    options,
    hasError = false,
    disabled = false,
}: SimpleSelectInputProps<TData>): React.ReactElement => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = (_event: any, newValue: { value: any; label: string } | null): void => {
        onChange(newValue?.value ?? '');
    };

    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
        <Autocomplete
            value={selectedOption}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            autoHighlight
            openOnFocus
            fullWidth
            disableClearable
            slotProps={{
                paper: {
                    sx: {
                        marginTop: '4px',
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputRef={inputRef}
                    variant="standard"
                    autoFocus
                    error={hasError}
                    sx={{
                        '& .MuiInput-root': {
                            '&:before': { display: 'none' },
                            '&:after': { display: 'none' },
                        },
                        '& .MuiInput-underline:before': { display: 'none' },
                        '& .MuiInput-underline:after': { display: 'none' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
                        '&:before': { display: 'none' },
                        '&:after': { display: 'none' },
                        '&:hover:not(.Mui-disabled):before': { display: 'none' },
                        '& .MuiInputBase-root': {
                            px: 2,
                            fontSize: '14px',
                            minHeight: '52px',
                            boxSizing: 'border-box',
                        },
                        '& .MuiInputBase-input': {
                            cursor: 'text',
                            fontSize: '14px',
                        },
                        '& .MuiAutocomplete-endAdornment': {
                            right: '8px',
                            '& .MuiSvgIcon-root': {
                                cursor: 'pointer !important',
                            },
                        },
                    }}
                />
            )}
        />
    );
};
