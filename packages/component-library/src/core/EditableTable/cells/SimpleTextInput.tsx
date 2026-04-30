import React, { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { EditableTableData } from '../types';

type SimpleTextInputProps<TData extends EditableTableData> = {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    hasError?: boolean;
    isNumber?: boolean;
    type?: 'text' | 'number';
    disabled?: boolean;
};

/**
 * SimpleTextInput - A plain HTML input element styled to match the table design
 * Replaces MUI TextField for better performance and simpler implementation
 */
export const SimpleTextInput = <TData extends EditableTableData>({
    value,
    onChange,
    onBlur,
    hasError = false,
    isNumber = false,
    type = 'text',
    disabled = false,
}: SimpleTextInputProps<TData>): React.ReactElement => {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    const primaryMain = (theme.vars as any)?.palette?.primary?.main ?? theme.palette.primary.main;
    const errorMain = (theme.vars as any)?.palette?.error?.main ?? theme.palette.error.main;
    const textPrimary = (theme.vars as any)?.palette?.text?.primary ?? theme.palette.text.primary;

    const inputStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        minHeight: '52px',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        padding: '0 16px',
        fontSize: '14px',
        color: hasError ? errorMain : textPrimary,
        caretColor: primaryMain,
        textAlign: isNumber ? 'right' : 'left',
        boxSizing: 'border-box',
        cursor: 'text',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = type === 'number' && e.target.value !== '' ? Number(e.target.value) : e.target.value;
        onChange(newValue);
    };

    return (
        <input
            ref={inputRef}
            type={type}
            value={value ?? ''}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            style={inputStyle}
        />
    );
};
