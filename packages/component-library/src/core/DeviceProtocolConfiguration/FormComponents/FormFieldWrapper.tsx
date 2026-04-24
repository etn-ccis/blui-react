import { Controller, useFormContext } from 'react-hook-form';
import { AutocompleteField } from './AutocompleteField';
import { SwitchField } from './SwitchField';
import { TextNumberField } from './TextNumberField';
import { FieldData } from '../ProtocolUtils';

type FormFieldWrapperProps = {
    name: string;
    fieldData: FieldData;
    isListItem?: boolean;
    onChange?: (name: string, value: any) => void;
    onBlur?: (name: string) => void;
    autoFocus?: boolean;
};

export const FormFieldWrapper = ({
    name,
    fieldData,
    onChange,
    onBlur,
    isListItem,
    autoFocus,
}: FormFieldWrapperProps): JSX.Element => {
    const { control } = useFormContext();
    const { type, defaultValue, options, label, getOptionLabel, required, inputProps, helperText } = fieldData;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState }) => {
                const commonProps = {
                    field,
                    defaultValue,
                    error: fieldState.error,
                    onChange,
                    onBlur,
                    autoFocus,
                };

                switch (type) {
                    case 'autocomplete':
                        return (
                            <AutocompleteField
                                {...commonProps}
                                options={options}
                                label={label}
                                getOptionLabel={getOptionLabel}
                                required={required}
                                isListItem={isListItem}
                            />
                        );

                    case 'switch':
                        return <SwitchField {...commonProps} />;

                    case 'text':
                    case 'number':
                        return (
                            <TextNumberField
                                {...commonProps}
                                type={type}
                                label={label}
                                required={required}
                                isListItem={isListItem}
                                inputProps={inputProps}
                                helperText={helperText}
                            />
                        );

                    default:
                        return (
                            <TextNumberField
                                {...commonProps}
                                type="text"
                                label={label}
                                required={required}
                                isListItem={isListItem}
                            />
                        );
                }
            }}
        />
    );
};
