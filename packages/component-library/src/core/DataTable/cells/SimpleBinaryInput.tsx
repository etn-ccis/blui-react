import React, { useEffect, useState } from 'react';
import { Checkbox, Box } from '@mui/material';

type SimpleBinaryInputProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
};

/**
 * SimpleBinaryInput - A MUI Checkbox component with editable text (0/1) for boolean/binary cells
 * Checkbox on left, editable text showing 0 or 1 on right
 */
export const SimpleBinaryInput = ({
    value,
    onChange,
    disabled = false,
}: SimpleBinaryInputProps): React.ReactElement => {
    const checkboxRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [textValue, setTextValue] = useState(value ? '1' : '0');

    // Auto-focus on mount - focus the text input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    // Sync text value when checkbox value changes externally
    useEffect(() => {
        setTextValue(value ? '1' : '0');
    }, [value]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = event.target.checked;
        onChange(newValue);
        setTextValue(newValue ? '1' : '0');
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value;
        // Only allow '0' or '1'
        if (inputValue === '0' || inputValue === '1') {
            setTextValue(inputValue);
            onChange(inputValue === '1');
        } else if (inputValue === '') {
            setTextValue('');
        }
    };

    const handleTextBlur = (): void => {
        // On blur, ensure value is valid
        if (textValue !== '0' && textValue !== '1') {
            setTextValue(value ? '1' : '0');
        }
    };

    const handleTextClick = (e: React.MouseEvent<HTMLInputElement>): void => {
        // Prevent the click from propagating
        e.stopPropagation();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minHeight: 52,
                px: '8px',
            }}
        >
            {/* Checkbox half - 50% width, center-aligned */}
            <Box
                sx={{
                    flex: '0 0 50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    if (!disabled) {
                        const newValue = !value;
                        onChange(newValue);
                        setTextValue(newValue ? '1' : '0');
                    }
                }}
            >
                <Checkbox
                    ref={checkboxRef}
                    checked={value ?? false}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                    size="small"
                    sx={{
                        padding: 0,
                        pointerEvents: 'none', // Prevent double-click handling
                        '&.Mui-disabled': {
                            // Override disabled styles to maintain focus colors
                            color: 'action.active',
                        },
                    }}
                />
            </Box>

            {/* Text input half - 50% width, center-aligned */}
            <Box
                sx={{
                    flex: '0 0 50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={textValue}
                    onChange={handleTextChange}
                    onBlur={handleTextBlur}
                    onClick={handleTextClick}
                    disabled={disabled}
                    style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '14px',
                        width: '30px',
                        textAlign: 'center',
                        cursor: 'text',
                        padding: 0,
                    }}
                />
            </Box>
        </Box>
    );
};
