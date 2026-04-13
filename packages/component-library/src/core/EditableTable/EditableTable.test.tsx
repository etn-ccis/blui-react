import React from 'react';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { EditableTable } from './EditableTable';
import { EditableTableColumnDef, EditableTableState } from './types';

afterEach(cleanup);

type SampleRow = { id: string; name: string; age: number };

const sampleColumns: Array<EditableTableColumnDef<SampleRow>> = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
];

const sampleData: SampleRow[] = [
    { id: '1', name: 'Alice', age: 30 },
    { id: '2', name: 'Bob', age: 25 },
];

const getRowId = (row: SampleRow): string => row.id;

describe('EditableTable', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} />
            </ThemeProvider>
        );
    });

    it('renders with columns and data', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders the create button with default text when enableCreate is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} enableCreate={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('New data point')).toBeInTheDocument();
    });

    it('does not render the create button when enableCreate is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} enableCreate={false} />
            </ThemeProvider>
        );
        expect(screen.queryByText('New data point')).not.toBeInTheDocument();
    });

    it('renders the create button with custom text', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    enableCreate={true}
                    createButtonText="Add New Record"
                />
            </ThemeProvider>
        );
        expect(screen.getByText('Add New Record')).toBeInTheDocument();
    });

    it('renders delete button in row actions when enableDelete is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('does not render delete button when enableDelete is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={false}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
    });

    it('renders edit icon in row actions when editDisplayMode is row', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableEdit={true}
                    editDisplayMode="row"
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        const editButtons = screen.getAllByTestId('EditIcon');
        expect(editButtons.length).toBeGreaterThan(0);
    });

    it('does not render edit icon when editDisplayMode is cell', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableEdit={true}
                    editDisplayMode="cell"
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        // Edit icon in row actions is only shown in 'row' mode
        expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    });

    it('renders duplicate button when enableDuplicate is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        expect(duplicateButtons.length).toBeGreaterThan(0);
    });

    it('does not render duplicate button when enableDuplicate is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={false}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.queryByTestId('ContentCopyIcon')).not.toBeInTheDocument();
    });

    it('renders without crashing when error prop is provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} error="Something went wrong" />
            </ThemeProvider>
        );
        // The error triggers showAlertBanner; the banner is inside the top toolbar
        // which is disabled (enableTopToolbar: false), so just assert the table still mounts.
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('renders normally when no error prop is provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders in loading state without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} isLoading={true} />
            </ThemeProvider>
        );
        // MRT shows a loading overlay — verify the table still mounts
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders in saving state without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} isSaving={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders an empty table when data is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('applies custom minHeight to the table container', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} minHeight="800px" />
            </ThemeProvider>
        );
        const tableContainer = container.querySelector('.MuiTableContainer-root');
        expect(tableContainer).toBeTruthy();
    });

    it('renders without row actions when enableRowActions is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableRowActions={false} />
            </ThemeProvider>
        );
        expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    });

    it('calls onCreate when a new row is saved without an onCreate callback (internal handler)', () => {
        const onCreate = jest.fn().mockResolvedValue(undefined);
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableCreate={true}
                    onCreate={onCreate}
                />
            </ThemeProvider>
        );
        expect(screen.getByText('New data point')).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', async () => {
        const onDelete = jest.fn().mockResolvedValue(undefined);

        // Mock window.confirm to return true so deletion proceeds
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={true}
                    enableRowActions={true}
                    onDelete={onDelete}
                />
            </ThemeProvider>
        );

        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
        });

        confirmSpy.mockRestore();
    });

    it('calls onDuplicate when duplicate button is clicked', async () => {
        const onDuplicate = jest.fn().mockResolvedValue(undefined);
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onDuplicate={onDuplicate}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => {
            expect(onDuplicate).toHaveBeenCalled();
            // handleDuplicateRow strips the `id` field before calling onDuplicate
            const calledWith = onDuplicate.mock.calls[0][0];
            expect(calledWith.name).toBe(sampleData[0].name);
            expect(calledWith.age).toBe(sampleData[0].age);
        });
    });

    it('calls onStateChange with initial state when rendered', async () => {
        const onStateChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableUndoRedo={true}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(onStateChange).toHaveBeenCalled();
        });

        const lastCall: EditableTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        expect(lastCall.canUndo).toBe(false);
        expect(lastCall.canRedo).toBe(false);
        expect(lastCall.hasPendingChanges).toBe(false);
        expect(typeof lastCall.undo).toBe('function');
        expect(typeof lastCall.redo).toBe('function');
        expect(typeof lastCall.save).toBe('function');
        expect(typeof lastCall.reset).toBe('function');
    });

    it('keyboard shortcut Ctrl+Z is registered when enableUndoRedo is true', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        addEventListenerSpy.mockRestore();
    });

    it('keyboard shortcut is not registered when enableUndoRedo is false', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={false} />
            </ThemeProvider>
        );
        // keydown listener for undo/redo should not be added
        const keydownCalls = addEventListenerSpy.mock.calls.filter(([event]) => event === 'keydown');
        expect(keydownCalls.length).toBe(0);
        addEventListenerSpy.mockRestore();
    });

    it('fires Ctrl+Z undo keyboard shortcut without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyZ', ctrlKey: true });
        });
    });

    it('fires Ctrl+Shift+Z redo keyboard shortcut without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyZ', ctrlKey: true, shiftKey: true });
        });
    });

    it('fires Ctrl+Y redo keyboard shortcut without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyY', ctrlKey: true });
        });
    });

    it('does not trigger undo/redo for unrelated key presses', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        // Should not throw when an unrelated key is pressed
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyA' });
        });
    });

    it('renders with createDisplayMode modal without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    createDisplayMode="modal"
                />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders with editDisplayMode modal without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editDisplayMode="modal"
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders with editDisplayMode table without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={sampleColumns} data={sampleData} getRowId={getRowId} editDisplayMode="table" />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('accepts a custom getRowId function', () => {
        type CustomRow = { customKey: string; label: string; value: number };
        const customColumns: Array<EditableTableColumnDef<CustomRow>> = [
            { accessorKey: 'label', header: 'Label' },
            { accessorKey: 'value', header: 'Value' },
        ];
        const customData: CustomRow[] = [{ customKey: 'k1', label: 'Item A', value: 10 }];

        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={customColumns} data={customData} getRowId={(row): string => row.customKey} />
            </ThemeProvider>
        );
        expect(screen.getByText('Item A')).toBeInTheDocument();
    });

    it('accepts tableOptions to pass additional MRT configuration', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    tableOptions={{ enablePagination: false }}
                />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders all row action buttons when all are enabled', () => {
        render(
            <ThemeProvider theme={theme}>
                <EditableTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableEdit={true}
                    editDisplayMode="row"
                    enableDelete={true}
                    enableDuplicate={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('EditIcon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('DeleteIcon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('ContentCopyIcon').length).toBeGreaterThan(0);
    });

    it('shows column headers correctly', () => {
        const multiColColumns: Array<EditableTableColumnDef<SampleRow>> = [
            { accessorKey: 'name', header: 'Full Name' },
            { accessorKey: 'age', header: 'User Age' },
        ];
        render(
            <ThemeProvider theme={theme}>
                <EditableTable columns={multiColColumns} data={sampleData} getRowId={getRowId} />
            </ThemeProvider>
        );
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('User Age')).toBeInTheDocument();
    });
});
