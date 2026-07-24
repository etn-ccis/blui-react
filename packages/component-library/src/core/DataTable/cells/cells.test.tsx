/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { BinaryCell } from './BinaryCell';
import { SelectCell } from './SelectCell';
import { SimpleBinaryInput } from './SimpleBinaryInput';
import { SimpleSelectInput } from './SimpleSelectInput';
import { SimpleTextInput } from './SimpleTextInput';
import { TextNumberCell } from './TextNumberCell';

afterEach(cleanup);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Row = { id: string; value: string };

/** Minimal MRT_Cell mock */
function makeCell(rowId: string, columnId: string, value: any): any {
    return {
        column: { id: columnId },
        row: { id: rowId, original: { id: rowId, [columnId]: value } },
        getValue: () => value,
    };
}

/** Minimal MRT_Row mock */
function makeRow(rowId: string, original: Record<string, any>): any {
    return { id: rowId, original };
}

// ---------------------------------------------------------------------------
// TextNumberCell
// ---------------------------------------------------------------------------

describe('TextNumberCell', () => {
    const buildProps = (overrides?: Record<string, any>): any => ({
        cell: makeCell('r1', 'name', 'Alice'),
        row: makeRow('r1', { id: 'r1', name: 'Alice' }),
        renderedCellValue: 'Alice',
        validationErrors: {},
        editedRows: {},
        originalDataMap: new Map([['r1', { id: 'r1', name: 'Alice' }]]),
        theme: theme as any,
        ...overrides,
    });

    it('renders renderedCellValue', () => {
        render(
            <ThemeProvider theme={theme}>
                <TextNumberCell<Row> {...buildProps()} />
            </ThemeProvider>
        );
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('shows a tooltip when there is a validation error', () => {
        render(
            <ThemeProvider theme={theme}>
                <TextNumberCell<Row> {...buildProps({ validationErrors: { r1_name: 'Required' } as any })} />
            </ThemeProvider>
        );
        // Tooltip wraps the box — the content is still visible
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders edited-indicator dot for a modified cell', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <TextNumberCell<Row>
                    {...buildProps({
                        editedRows: { r1: { id: 'r1', name: 'Bob' } as any },
                        originalDataMap: new Map([['r1', { id: 'r1', name: 'Alice' }]]),
                    })}
                />
            </ThemeProvider>
        );
        // The dot is a small Box with borderRadius: '50%' — it adds an extra child
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(1);
    });

    it('renders edited-indicator dot for a new row', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <TextNumberCell<Row>
                    {...buildProps({
                        editedRows: { r1: { id: 'r1', name: 'Alice' } as any },
                        // row NOT present in originalDataMap → treated as new
                        originalDataMap: new Map(),
                    })}
                />
            </ThemeProvider>
        );
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(1);
    });

    it('does not render edited-indicator dot when cell is unedited', () => {
        // editedRows has the row but value matches original
        const { container } = render(
            <ThemeProvider theme={theme}>
                <TextNumberCell<Row>
                    {...buildProps({
                        editedRows: { r1: { id: 'r1', name: 'Alice' } as any },
                        originalDataMap: new Map([['r1', { id: 'r1', name: 'Alice' }]]),
                    })}
                />
            </ThemeProvider>
        );
        // Without the dot, there should be fewer nested boxes
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        // Only the outer box + content wrapper (2), no dot box
        expect(boxes.length).toBe(2);
    });
});

// ---------------------------------------------------------------------------
// BinaryCell
// ---------------------------------------------------------------------------

describe('BinaryCell', () => {
    const buildProps = (value: boolean, overrides?: Record<string, any>): any => ({
        cell: makeCell('r1', 'active', value),
        row: makeRow('r1', { id: 'r1', active: value }),
        renderedCellValue: value ? '1' : '0',
        validationErrors: {},
        editedRows: {},
        originalDataMap: new Map([['r1', { id: 'r1', active: value }]]),
        theme: theme as any,
        ...overrides,
    });

    it('renders a checked checkbox when value is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }> {...buildProps(true)} />
            </ThemeProvider>
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('renders an unchecked checkbox when value is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }> {...buildProps(false)} />
            </ThemeProvider>
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('displays "1" when value is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }> {...buildProps(true)} />
            </ThemeProvider>
        );
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('displays "0" when value is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }> {...buildProps(false)} />
            </ThemeProvider>
        );
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('shows tooltip when there is a validation error', () => {
        render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }>
                    {...buildProps(false, { validationErrors: { r1_active: 'Invalid' } as any })}
                />
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders edited-indicator dot when cell value changed', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }>
                    {...buildProps(true, {
                        editedRows: { r1: { id: 'r1', active: false } as any },
                        originalDataMap: new Map([['r1', { id: 'r1', active: true }]]),
                    })}
                />
            </ThemeProvider>
        );
        // Dot adds an extra Box sibling
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(2);
    });

    it('renders edited-indicator dot for a new row', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <BinaryCell<{ id: string; active: boolean }>
                    {...buildProps(true, {
                        editedRows: { r1: { id: 'r1', active: true } as any },
                        originalDataMap: new Map(),
                    })}
                />
            </ThemeProvider>
        );
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(2);
    });
});

// ---------------------------------------------------------------------------
// SelectCell
// ---------------------------------------------------------------------------

describe('SelectCell', () => {
    const buildProps = (renderedValue: string, overrides?: Record<string, any>): any => ({
        cell: makeCell('r1', 'status', renderedValue),
        row: makeRow('r1', { id: 'r1', status: renderedValue }),
        renderedCellValue: renderedValue,
        validationErrors: {},
        editedRows: {},
        originalDataMap: new Map([['r1', { id: 'r1', status: renderedValue }]]),
        theme: theme as any,
        ...overrides,
    });

    it('renders the cell value', () => {
        render(
            <ThemeProvider theme={theme}>
                <SelectCell<Row> {...buildProps('Option A')} />
            </ThemeProvider>
        );
        expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('renders the ArrowDropDown icon', () => {
        render(
            <ThemeProvider theme={theme}>
                <SelectCell<Row> {...buildProps('Option A')} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('ArrowDropDownIcon')).toBeInTheDocument();
    });

    it('shows tooltip on validation error', () => {
        render(
            <ThemeProvider theme={theme}>
                <SelectCell<Row> {...buildProps('Option A', { validationErrors: { r1_status: 'Required' } as any })} />
            </ThemeProvider>
        );
        expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('renders edited-indicator dot when cell value changed', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <SelectCell<Row>
                    {...buildProps('Option B', {
                        editedRows: { r1: { id: 'r1', status: 'Option B' } as any },
                        originalDataMap: new Map([['r1', { id: 'r1', status: 'Option A' }]]),
                    })}
                />
            </ThemeProvider>
        );
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(2);
    });

    it('renders edited-indicator dot for a new row', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <SelectCell<Row>
                    {...buildProps('Option A', {
                        editedRows: { r1: { id: 'r1', status: 'Option A' } as any },
                        originalDataMap: new Map(),
                    })}
                />
            </ThemeProvider>
        );
        const boxes = container.querySelectorAll('[class*="MuiBox-root"]');
        expect(boxes.length).toBeGreaterThan(2);
    });
});

// ---------------------------------------------------------------------------
// SimpleBinaryInput
// ---------------------------------------------------------------------------

describe('SimpleBinaryInput', () => {
    it('renders a checked checkbox when value is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={jest.fn()} />
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders an unchecked checkbox when value is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={jest.fn()} />
            </ThemeProvider>
        );
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('shows "1" in the text input when value is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={jest.fn()} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('1');
        expect(textInput).toBeInTheDocument();
    });

    it('shows "0" in the text input when value is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={jest.fn()} />
            </ThemeProvider>
        );
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('calls onChange when checkbox is toggled via the wrapper box click', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={onChange} />
            </ThemeProvider>
        );
        // Click the wrapper Box (not the checkbox input itself, which has pointerEvents:none)
        const wrapperBoxes = screen.getAllByRole('checkbox');
        // Fire click on the parent container of the checkbox
        fireEvent.click(wrapperBoxes[0].closest('[class*="MuiBox-root"]')!);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange when text input changes to "1"', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={onChange} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('0');
        fireEvent.change(textInput, { target: { value: '1' } });
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange when text input changes to "0"', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={onChange} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('1');
        fireEvent.change(textInput, { target: { value: '0' } });
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('ignores invalid text input values', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={onChange} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('0');
        fireEvent.change(textInput, { target: { value: 'x' } });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('resets text value on blur when it is invalid', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={jest.fn()} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('1');
        // Clear the input then blur — should revert to '1'
        fireEvent.change(textInput, { target: { value: '' } });
        fireEvent.blur(textInput);
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('does not call onChange when disabled and wrapper is clicked', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={onChange} disabled={true} />
            </ThemeProvider>
        );
        const wrapperBoxes = screen.getAllByRole('checkbox');
        fireEvent.click(wrapperBoxes[0].closest('[class*="MuiBox-root"]')!);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('stops propagation on text input click', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={false} onChange={jest.fn()} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('0');
        // Should not throw
        fireEvent.click(textInput);
    });

    it('calls onChange with false and sets text to "0" when wrapper is clicked while checked', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={onChange} />
            </ThemeProvider>
        );
        const checkbox = screen.getByRole('checkbox');
        // Click the wrapper Box (pointerEvents:none is on the checkbox itself)
        fireEvent.click(checkbox.closest('[class*="MuiBox-root"]')!);
        expect(onChange).toHaveBeenCalledWith(false);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('sets textValue to empty string when text input is cleared', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleBinaryInput value={true} onChange={onChange} />
            </ThemeProvider>
        );
        const textInput = screen.getByDisplayValue('1');
        fireEvent.change(textInput, { target: { value: '' } });
        // onChange should NOT be called — empty string is not a real value change
        expect(onChange).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// SimpleSelectInput
// ---------------------------------------------------------------------------

const selectOptions = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
];

describe('SimpleSelectInput', () => {
    it('renders the selected option label', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput value="a" onChange={jest.fn()} onBlur={jest.fn()} options={selectOptions} />
            </ThemeProvider>
        );
        expect(screen.getByDisplayValue('Option A')).toBeInTheDocument();
    });

    it('renders with no selection when value does not match any option', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput value="z" onChange={jest.fn()} onBlur={jest.fn()} options={selectOptions} />
            </ThemeProvider>
        );
        // Input should be empty or show nothing matching
        const input = screen.getByRole('combobox');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange when a new option is selected', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput value="a" onChange={onChange} onBlur={jest.fn()} options={selectOptions} />
            </ThemeProvider>
        );
        // Open the dropdown and pick Option B
        const input = screen.getByRole('combobox');
        fireEvent.click(input);
        const optionB = screen.getByText('Option B');
        fireEvent.click(optionB);
        expect(onChange).toHaveBeenCalledWith('b');
    });

    it('calls onBlur when the input loses focus', () => {
        const onBlur = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput value="a" onChange={jest.fn()} onBlur={onBlur} options={selectOptions} />
            </ThemeProvider>
        );
        const input = screen.getByRole('combobox');
        fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalled();
    });

    it('renders as disabled when disabled prop is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput
                    value="a"
                    onChange={jest.fn()}
                    onBlur={jest.fn()}
                    options={selectOptions}
                    disabled={true}
                />
            </ThemeProvider>
        );
        const input = screen.getByRole('combobox');
        expect(input).toBeDisabled();
    });

    it('renders with hasError styling without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleSelectInput
                    value="a"
                    onChange={jest.fn()}
                    onBlur={jest.fn()}
                    options={selectOptions}
                    hasError={true}
                />
            </ThemeProvider>
        );
        expect(screen.getByDisplayValue('Option A')).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// SimpleTextInput
// ---------------------------------------------------------------------------

describe('SimpleTextInput', () => {
    it('renders with initial text value', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="Hello" onChange={jest.fn()} onBlur={jest.fn()} />
            </ThemeProvider>
        );
        expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    });

    it('calls onChange with string when type is text', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="" onChange={onChange} onBlur={jest.fn()} />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New value' } });
        expect(onChange).toHaveBeenCalledWith('New value');
    });

    it('calls onChange with number when type is number', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value={0} onChange={onChange} onBlur={jest.fn()} type="number" />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '42' } });
        expect(onChange).toHaveBeenCalledWith(42);
    });

    it('calls onChange with empty string when type is number and input is cleared', () => {
        const onChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value={5} onChange={onChange} onBlur={jest.fn()} type="number" />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
        expect(onChange).toHaveBeenCalledWith('');
    });

    it('calls onBlur when input loses focus', () => {
        const onBlur = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="text" onChange={jest.fn()} onBlur={onBlur} />
            </ThemeProvider>
        );
        fireEvent.blur(screen.getByRole('textbox'));
        expect(onBlur).toHaveBeenCalled();
    });

    it('renders as disabled when disabled prop is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="text" onChange={jest.fn()} onBlur={jest.fn()} disabled={true} />
            </ThemeProvider>
        );
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies right text-align style when isNumber is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="123" onChange={jest.fn()} onBlur={jest.fn()} isNumber={true} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox');
        expect(input).toHaveStyle({ textAlign: 'right' });
    });

    it('applies left text-align style when isNumber is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="text" onChange={jest.fn()} onBlur={jest.fn()} isNumber={false} />
            </ThemeProvider>
        );
        const input = screen.getByRole('textbox');
        expect(input).toHaveStyle({ textAlign: 'left' });
    });

    it('renders with hasError styling without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <SimpleTextInput value="bad" onChange={jest.fn()} onBlur={jest.fn()} hasError={true} />
            </ThemeProvider>
        );
        expect(screen.getByDisplayValue('bad')).toBeInTheDocument();
    });
});
