import { TextField } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { BLUIColors } from '@brightlayer-ui/colors';

type TextNumberFieldProps = {
    field: ControllerRenderProps<any, string>;
    type: 'text' | 'number';
    defaultValue?: any;
    label?: string;
    required?: boolean;
    error?: any;
    onChange?: (name: string, value: any) => void;
    onBlur?: (name: string) => void;
    isListItem?: boolean;
    autoFocus?: boolean;
    inputProps?: object;
    helperText?: string;
};

export const TextNumberField = ({
    field,
    type,
    defaultValue,
    label,
    required = false,
    error,
    onChange,
    onBlur,
    isListItem = false,
    autoFocus,
    inputProps,
    helperText,
}: TextNumberFieldProps): JSX.Element => {
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
        <TextField
            {...field}
            inputRef={field.ref}
            fullWidth
            variant={isListItem ? 'standard' : 'filled'}
            value={field.value ?? defaultValue}
            type={type}
            label={label}
            onChange={(e) => {
                const newValue = type === 'text' ? e.target.value : e.target.value === '' ? '' : Number(e.target.value);
                onChange?.(field.name, newValue);
                field.onChange(newValue);
            }}
            onBlur={() => {
                onBlur?.(field.name);
                field.onBlur();
            }}
            error={!!error}
            helperText={
                error
                    ? type === 'number' && error.type === 'invalid_type'
                        ? 'Invalid input'
                        : error.message?.replace(/string|number/g, 'input')
                    : (helperText ?? ' ')
            }
            required={required}
            autoFocus={autoFocus}
            slotProps={{
                input: {
                    ...(isListItem ? { sx: commonInputSx } : {}),
                    ...inputProps,
                },
            }}
        />
    );
};
