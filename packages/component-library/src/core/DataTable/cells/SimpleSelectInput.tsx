import React, { createContext, useContext, useMemo, useState } from 'react';
import { Autocomplete, Box, InputAdornment, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataTableSelectOption } from '../types';

type SelectSearchContextValue = {
    searchValue: string;
    onSearchChange: (value: string) => void;
};

const SelectSearchContext = createContext<SelectSearchContextValue | null>(null);

const SelectSearchPaper = (props: React.ComponentProps<typeof Paper>): React.ReactElement => {
    const searchContext = useContext(SelectSearchContext);

    return (
        <Paper {...props} data-select-search-paper="true">
            <Box sx={{ p: 1, pb: 0.5 }}>
                <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    placeholder="Search options..."
                    value={searchContext?.searchValue ?? ''}
                    onChange={(event): void => searchContext?.onSearchChange(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                    inputProps={{ 'aria-label': 'Search options' }}
                />
            </Box>
            {props.children}
        </Paper>
    );
};

type SimpleSelectInputProps = {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    options: DataTableSelectOption[];
    renderOption?: (params: {
        option: DataTableSelectOption;
        selected: boolean;
        inputValue: string;
    }) => React.ReactNode;
    hasError?: boolean;
    disabled?: boolean;
};

/**
 * SimpleSelectInput - A customized MUI Autocomplete component for dropdown cells
 * Uses MUI Autocomplete with filtering capability - users can type to filter options
 */
export const SimpleSelectInput = ({
    value,
    onChange,
    onBlur,
    options,
    renderOption,
    hasError = false,
    disabled = false,
}: SimpleSelectInputProps): React.ReactElement => {
    const [searchValue, setSearchValue] = useState('');
    const [open, setOpen] = useState(true);

    const filteredOptions = useMemo(() => {
        const query = searchValue.trim().toLocaleLowerCase();
        if (!query) return options;
        return options.filter((option) => {
            const searchableText = `${option.label} ${typeof option.description === 'string' ? option.description : ''}`;
            return searchableText.toLocaleLowerCase().includes(query);
        });
    }, [options, searchValue]);

    const handleChange = (_event: any, newValue: DataTableSelectOption | null): void => {
        onChange(newValue?.value ?? '');
        setSearchValue('');
        setOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value) || null;

    const autocomplete = (
        <Autocomplete
            value={selectedOption}
            onChange={handleChange}
            onBlur={onBlur}
            open={open}
            onOpen={(): void => setOpen(true)}
            onClose={(event, reason): void => {
                const relatedTarget = (event as React.FocusEvent).relatedTarget;
                if (
                    reason === 'blur' &&
                    relatedTarget instanceof HTMLElement &&
                    relatedTarget.closest('[data-select-search-paper="true"]')
                ) {
                    return;
                }
                setOpen(false);
            }}
            disabled={disabled}
            options={filteredOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            PaperComponent={SelectSearchPaper}
            renderOption={(props, option, state): React.ReactElement => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        {renderOption ? (
                            renderOption({ option, selected: state.selected, inputValue: searchValue })
                        ) : option.description !== undefined ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, py: 0.5 }}>
                                <Box>{option.label}</Box>
                                <Box sx={{ color: 'text.secondary', fontSize: '0.875em', whiteSpace: 'normal' }}>
                                    {option.description}
                                </Box>
                            </Box>
                        ) : (
                            option.label
                        )}
                    </li>
                );
            }}
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
                    variant="standard"
                    error={hasError}
                    inputProps={{ ...params.inputProps, readOnly: true }}
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

    return (
        <SelectSearchContext.Provider value={{ searchValue, onSearchChange: setSearchValue }}>
            {autocomplete}
        </SelectSearchContext.Provider>
    );
};
