import { Autocomplete, TextField } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { BLUIColors } from '@brightlayer-ui/colors';

type AutocompleteFieldProps = {
    field: ControllerRenderProps<any, string>;
    defaultValue?: any;
    options?: string[];
    label?: string;
    getOptionLabel?: (option: string | number) => string;
    required?: boolean;
    error?: any;
    onChange?: (name: string, value: any) => void;
    onBlur?: (name: string) => void;
    isListItem?: boolean;
    autoFocus?: boolean;
};

export const AutocompleteField = ({
    field,
    defaultValue,
    options = [],
    label,
    getOptionLabel,
    required = false,
    error,
    onChange,
    onBlur,
    isListItem = false,
    autoFocus,
}: AutocompleteFieldProps): JSX.Element => {
    const commonInputSx = {
        width: '280px',
        padding: '6px 10px',
        backgroundColor: BLUIColors.black[700],
        borderRadius: '4px 4px 0 0',
        '& input': {
            color: error ? BLUIColors.red[200] : 'inherit',
        },
    };

    return (
        <Autocomplete
            options={options}
            getOptionLabel={
                getOptionLabel ?? ((option): string => (typeof option === 'number' ? String(option) : option))
            }
            value={field.value ?? defaultValue ?? ''}
            onChange={(_, newValue) => {
                onChange?.(field.name, newValue);
                field.onChange(newValue);
            }}
            onBlur={() => {
                onBlur?.(field.name);
                field.onBlur();
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    inputRef={field.ref}
                    variant={isListItem ? 'standard' : 'filled'}
                    error={!!error}
                    helperText={error ? error.message : ' '}
                    label={label}
                    required={required}
                    {...(isListItem && { slotProps: { input: { ...params.InputProps, sx: commonInputSx } } })}
                    autoFocus={autoFocus}
                />
            )}
            disableClearable={true}
        />
    );
};
