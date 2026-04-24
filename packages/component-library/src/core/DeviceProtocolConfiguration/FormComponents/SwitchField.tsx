import { Switch } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';

type SwitchFieldProps = {
    field: ControllerRenderProps<any, string>;
    defaultValue?: boolean;
    onChange?: (name: string, value: boolean) => void;
    onBlur?: (name: string) => void;
    autoFocus?: boolean;
};

export const SwitchField = ({
    field,
    defaultValue = false,
    onChange,
    onBlur,
    autoFocus,
}: SwitchFieldProps): JSX.Element => (
    <Switch
        slotProps={{
            input: {
                ref: field.ref,
            },
        }}
        checked={field.value ?? defaultValue}
        onChange={(e) => {
            onChange?.(field.name, e.target.checked);
            field.onChange(e.target.checked);
        }}
        onBlur={() => {
            onBlur?.(field.name);
            field.onBlur();
        }}
        autoFocus={autoFocus}
    />
);
