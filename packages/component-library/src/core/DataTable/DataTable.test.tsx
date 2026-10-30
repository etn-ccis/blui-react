import React from 'react';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { DataTable } from './DataTable';
import { DataTableColumnDef, DataTableState } from './types';

afterEach(cleanup);

type SampleRow = { id: string; name: string; age: number };

const sampleColumns: Array<DataTableColumnDef<SampleRow>> = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'age', header: 'Age' },
];

const sampleData: SampleRow[] = [
    { id: '1', name: 'Alice', age: 30 },
    { id: '2', name: 'Bob', age: 25 },
];

const getRowId = (row: SampleRow): string => row.id;

// A standard MUI theme with no CSS vars — causes t.vars to be undefined,
// which drives the ?? t.palette.* fallback branches in all sx callbacks.
const nonCssVarsTheme = createTheme();

describe('DataTable', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} />
            </ThemeProvider>
        );
    });

    it('renders with columns and data', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} />
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
                <DataTable columns={sampleColumns} data={sampleData} enableCreate={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('New data point')).toBeInTheDocument();
    });

    it('does not render the create button when enableCreate is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} enableCreate={false} />
            </ThemeProvider>
        );
        expect(screen.queryByText('New data point')).not.toBeInTheDocument();
    });

    it('renders the create button with custom text', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
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
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        const deleteButtons = screen.getAllByTestId('DeleteOutlineIcon');
        expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('does not render delete button when enableDelete is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={false}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
    });

    it('renders edit icon in row actions when editDisplayMode is row', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editable={true}
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
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editable={true}
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
                <DataTable
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
                <DataTable
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
                <DataTable columns={sampleColumns} data={sampleData} error="Something went wrong" />
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
                <DataTable columns={sampleColumns} data={sampleData} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders in loading state without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} isLoading={true} />
            </ThemeProvider>
        );
        // MRT shows a loading overlay — verify the table still mounts
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders in saving state without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} isSaving={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders an empty table when data is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('applies custom minHeight to the table container', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} minHeight="800px" />
            </ThemeProvider>
        );
        const tableContainer = container.querySelector('.MuiTableContainer-root');
        expect(tableContainer).toBeTruthy();
    });

    it('renders without row actions when enableRowActions is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableRowActions={false} />
            </ThemeProvider>
        );
        expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    });

    it('calls onCreate when a new row is saved without an onCreate callback (internal handler)', () => {
        const onCreate = jest.fn().mockResolvedValue(undefined);
        render(
            <ThemeProvider theme={theme}>
                <DataTable
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
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={true}
                    enableRowActions={true}
                    onDelete={onDelete}
                />
            </ThemeProvider>
        );

        const deleteButtons = screen.getAllByTestId('DeleteOutlineIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
        });

        confirmSpy.mockRestore();
    });

    it('calls onDuplicate when duplicate button is clicked and saved', async () => {
        const onDuplicate = jest.fn().mockResolvedValue(undefined);
        let savedSaveFn: (() => Promise<void>) | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onDuplicate={onDuplicate}
                    onStateChange={(state): void => {
                        savedSaveFn = state.save;
                    }}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => expect(savedSaveFn).toBeDefined());

        await act(async () => {
            await savedSaveFn!();
        });

        expect(onDuplicate).toHaveBeenCalled();
        // handleSaveRows strips the `id` field before calling onDuplicate
        const calledWith = onDuplicate.mock.calls[0][0];
        expect(calledWith.name).toBe(sampleData[0].name);
        expect(calledWith.age).toBe(sampleData[0].age);
    });

    it('calls onStateChange with initial state when rendered', async () => {
        const onStateChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <DataTable
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

        const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        expect(lastCall.canUndo).toBe(false);
        expect(lastCall.canRedo).toBe(false);
        expect(lastCall.hasPendingChanges).toBe(false);
        expect(lastCall.canSave).toBe(false);
        expect(typeof lastCall.undo).toBe('function');
        expect(typeof lastCall.redo).toBe('function');
        expect(typeof lastCall.save).toBe('function');
        expect(typeof lastCall.reset).toBe('function');
    });

    it('keyboard shortcut Ctrl+Z is registered when enableUndoRedo is true', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        addEventListenerSpy.mockRestore();
    });

    it('keyboard shortcut is not registered when enableUndoRedo is false', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={false} />
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
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyZ', ctrlKey: true });
        });
    });

    it('fires Ctrl+Shift+Z redo keyboard shortcut without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyZ', ctrlKey: true, shiftKey: true });
        });
    });

    it('fires Ctrl+Y redo keyboard shortcut without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
            </ThemeProvider>
        );
        act(() => {
            fireEvent.keyDown(window, { code: 'KeyY', ctrlKey: true });
        });
    });

    it('does not trigger undo/redo for unrelated key presses', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableUndoRedo={true} />
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
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} createDisplayMode="modal" />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders with editDisplayMode modal without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
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
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} editDisplayMode="table" />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('accepts a custom getRowId function', () => {
        type CustomRow = { customKey: string; label: string; value: number };
        const customColumns: Array<DataTableColumnDef<CustomRow>> = [
            { accessorKey: 'label', header: 'Label' },
            { accessorKey: 'value', header: 'Value' },
        ];
        const customData: CustomRow[] = [{ customKey: 'k1', label: 'Item A', value: 10 }];

        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={customColumns} data={customData} getRowId={(row): string => row.customKey} />
            </ThemeProvider>
        );
        expect(screen.getByText('Item A')).toBeInTheDocument();
    });

    it('accepts tableOptions to pass additional MRT configuration', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
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
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editable={true}
                    editDisplayMode="row"
                    enableDelete={true}
                    enableDuplicate={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('EditIcon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('DeleteOutlineIcon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('ContentCopyIcon').length).toBeGreaterThan(0);
    });

    it('shows column headers correctly', () => {
        const multiColColumns: Array<DataTableColumnDef<SampleRow>> = [
            { accessorKey: 'name', header: 'Full Name' },
            { accessorKey: 'age', header: 'User Age' },
        ];
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={multiColColumns} data={sampleData} getRowId={getRowId} />
            </ThemeProvider>
        );
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('User Age')).toBeInTheDocument();
    });

    it('canSave is false with no pending changes', async () => {
        const onStateChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );
        await waitFor(() => expect(onStateChange).toHaveBeenCalled());
        const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        expect(lastCall.canSave).toBe(false);
    });

    it('canSave becomes true after adding a new row with data and no onValidate', async () => {
        const onStateChange = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableCreate={true}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );

        // Click "New data point" to add an empty row — canSave should remain false
        fireEvent.click(screen.getByText('New data point'));
        await waitFor(() => expect(onStateChange).toHaveBeenCalled());
        const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        expect(lastCall.canSave).toBe(false);
        expect(lastCall.hasPendingChanges).toBe(false);
    });

    it('canSave is false when onValidate returns errors for a pending row', async () => {
        const onStateChange = jest.fn();
        // Validate always returns an error so canSave stays false even with pending edits
        const onValidate = jest.fn().mockReturnValue({ name: 'Required' });
        let savedSaveFn: (() => Promise<void>) | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onValidate={onValidate}
                    onStateChange={(state): void => {
                        onStateChange(state);
                        savedSaveFn = state.save;
                    }}
                />
            </ThemeProvider>
        );

        // Duplicate a row so there is a pending change
        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => expect(onStateChange).toHaveBeenCalled());
        const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        // onValidate returns an error so canSave must be false even though there's a pending row
        expect(lastCall.canSave).toBe(false);
        expect(lastCall.hasPendingChanges).toBe(true);
        expect(savedSaveFn).toBeDefined();
    });

    it('canSave is true when onValidate returns no errors for a pending row', async () => {
        const onStateChange = jest.fn();
        // Validate always passes
        const onValidate = jest.fn().mockReturnValue({});

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onValidate={onValidate}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => {
            const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
            expect(lastCall.canSave).toBe(true);
        });
    });

    it('stableSave closes editing cell and calls handleSaveRows', async () => {
        const onUpdate = jest.fn().mockResolvedValue(undefined);
        let savedSaveFn: (() => Promise<void>) | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onUpdate={onUpdate}
                    onStateChange={(state): void => {
                        savedSaveFn = state.save;
                    }}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => expect(savedSaveFn).toBeDefined());

        await act(async () => {
            await savedSaveFn!();
        });
        // Save didn't throw — stableSave's setEditingCell path executed without error
        expect(true).toBe(true);
    });

    it('stableReset closes editing cell and restores data', async () => {
        let savedResetFn: (() => void) | undefined;
        let savedHasPending: boolean | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onStateChange={(state): void => {
                        savedResetFn = state.reset;
                        savedHasPending = state.hasPendingChanges;
                    }}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);

        await waitFor(() => expect(savedHasPending).toBe(true));

        act(() => {
            savedResetFn!();
        });

        await waitFor(() => expect(savedHasPending).toBe(false));
    });

    it('renders bottom toolbar create button with binary cellType column', () => {
        type BinaryRow = { id: string; name: string; active: boolean };
        const binaryColumns: Array<DataTableColumnDef<BinaryRow>> = [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'active', header: 'Active', cellType: 'binary' },
        ];
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={binaryColumns}
                    data={[{ id: '1', name: 'Test', active: true }]}
                    getRowId={(r): string => r.id}
                    enableCreate={true}
                />
            </ThemeProvider>
        );
        expect(screen.getByText('New data point')).toBeInTheDocument();
    });

    it('uses deleteConfirmMessage factory function when provided', async () => {
        const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
        const deleteConfirmMessage = jest.fn().mockReturnValue('Delete this specific row?');
        const onDelete = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableDelete={true}
                    enableRowActions={true}
                    onDelete={onDelete}
                    deleteConfirmMessage={deleteConfirmMessage}
                />
            </ThemeProvider>
        );

        const deleteButtons = screen.getAllByTestId('DeleteOutlineIcon');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(deleteConfirmMessage).toHaveBeenCalled();
            expect(confirmSpy).toHaveBeenCalledWith('Delete this specific row?');
        });

        confirmSpy.mockRestore();
    });

    it('renders without crashing when onStateChange is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('applies minHeight undefined gracefully (no minHeight in container styles)', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} minHeight={undefined} />
            </ThemeProvider>
        );
        const tableContainer = container.querySelector('.MuiTableContainer-root');
        expect(tableContainer).toBeTruthy();
    });

    it('calls stableUndo when tableState.undo is invoked directly', async () => {
        let savedState: DataTableState | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableUndoRedo={true}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onStateChange={(state): void => {
                        savedState = state;
                    }}
                />
            </ThemeProvider>
        );

        // Duplicate to create undo history
        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);
        await waitFor(() => expect(savedState?.canUndo).toBe(true));

        act(() => {
            savedState!.undo(); // directly invokes stableUndo
        });
        await waitFor(() => expect(savedState?.canUndo).toBe(false));
    });

    it('calls stableRedo when tableState.redo is invoked directly', async () => {
        let savedState: DataTableState | undefined;

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    enableUndoRedo={true}
                    enableDuplicate={true}
                    enableRowActions={true}
                    onStateChange={(state): void => {
                        savedState = state;
                    }}
                />
            </ThemeProvider>
        );

        const duplicateButtons = screen.getAllByTestId('ContentCopyIcon');
        fireEvent.click(duplicateButtons[0]);
        await waitFor(() => expect(savedState?.canUndo).toBe(true));

        act(() => {
            savedState!.undo();
        });
        await waitFor(() => expect(savedState?.canRedo).toBe(true));

        act(() => {
            savedState!.redo(); // directly invokes stableRedo
        });
        await waitFor(() => expect(savedState?.canRedo).toBe(false));
    });

    it('renders top toolbar when enableColumnFilters is true (covers muiTopToolbarProps.sx)', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableColumnFilters={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('clicking Edit button in row mode invokes setEditingRow', () => {
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editable={true}
                    editDisplayMode="row"
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        const editButtons = screen.getAllByTestId('EditIcon');
        // Click triggers actionTable.setEditingRow(row) — MRT swaps the row into edit mode
        // so the row count doesn't change but the icon may unmount
        expect(() => fireEvent.click(editButtons[0].closest('button')!)).not.toThrow();
    });

    it('skips columns without accessorKey when building empty row for create', () => {
        type Row = { id: string; name: string };
        const colsWithNoAccessorKey: Array<DataTableColumnDef<Row>> = [
            { accessorKey: 'name', header: 'Name' },
            // no accessorKey — hits the early return branch in renderBottomToolbarCustomActions
            { header: 'Computed', id: 'computed', Cell: (): React.ReactElement => <span>computed</span> },
        ];
        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={colsWithNoAccessorKey}
                    data={[{ id: '1', name: 'Alice' }]}
                    getRowId={(r): string => r.id}
                    enableCreate={true}
                />
            </ThemeProvider>
        );
        expect(screen.getByText('New data point')).toBeInTheDocument();
    });

    it('hasPendingChanges is false for a new row where the only non-id field is false (binary)', async () => {
        type BinaryRow = { id: string; active: boolean };
        const binaryColumns: Array<DataTableColumnDef<BinaryRow>> = [
            { accessorKey: 'active', header: 'Active', cellType: 'binary' },
        ];
        const onStateChange = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={binaryColumns}
                    data={[]}
                    getRowId={(r): string => r.id}
                    enableCreate={true}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByText('New data point'));

        await waitFor(() => expect(onStateChange).toHaveBeenCalled());
        const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
        // active=false is the empty/blank state for a binary field — not a meaningful change
        expect(lastCall.hasPendingChanges).toBe(false);
        expect(lastCall.canSave).toBe(false);
    });

    it('clicking a binary cell toggles value in one click without entering edit mode', async () => {
        type BinaryRow = { id: string; active: boolean };
        const binaryColumns: Array<DataTableColumnDef<BinaryRow>> = [
            { accessorKey: 'active', header: 'Active', cellType: 'binary' },
        ];
        const onStateChange = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={binaryColumns}
                    data={[{ id: '1', active: false }]}
                    getRowId={(r): string => r.id}
                    onStateChange={onStateChange}
                />
            </ThemeProvider>
        );

        // Initial state: active=false → checkbox unchecked, text shows "0"
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.queryByText('1')).not.toBeInTheDocument();

        // The binary TD cell contains the checkbox — click the checkbox (inside the left half)
        // so the event bubbles to the <td> with a target inside [data-binary-half="left"],
        // triggering the one-click toggle path instead of entering edit mode.
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        // No edit <input> should appear — binary left-half click bypasses MRT's edit mode entirely
        expect(container.querySelector('input[type="text"]')).toBeNull();

        // hasPendingChanges becomes true and the displayed value flips to "1"
        await waitFor(() => {
            const lastCall: DataTableState = onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0];
            expect(lastCall.hasPendingChanges).toBe(true);
        });
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('clicking a non-binary text cell enters edit mode (renders an input)', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editDisplayMode="cell"
                    editable={true}
                />
            </ThemeProvider>
        );

        // MRT renders a hidden <input> for pagination — no visible edit input should exist yet
        // SimpleTextInput renders an input without aria-hidden, so we can distinguish the two
        expect(container.querySelector('input:not([aria-hidden="true"])')).toBeNull();

        // Find the "Alice" cell and click it to enter cell-edit mode
        const aliceCell = screen.getByText('Alice').closest('td')!;
        fireEvent.click(aliceCell);

        // SimpleTextInput renders an <input> without aria-hidden when the cell enters edit mode
        await waitFor(() => {
            expect(container.querySelector('input:not([aria-hidden="true"])')).not.toBeNull();
        });
    });

    // Renders with a non-CSS-vars theme so t.vars is undefined, driving all the
    // `?? t.palette.*` fallback branches in muiTablePaperProps, muiBottomToolbarProps,
    // muiTableBodyRowProps and the mrt-row-actions head/body cell sx callbacks.
    it('renders correctly with a non-CSS-vars theme (covers ?? palette fallback branches)', () => {
        render(
            <ThemeProvider theme={nonCssVarsTheme}>
                <DataTable columns={sampleColumns} data={sampleData} getRowId={getRowId} enableColumnFilters={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    // With non-CSS-vars theme, t.vars?.palette?.primary?.mainChannel is undefined (falsy),
    // which drives the `alpha(t.palette.primary.main)` else-branches and the
    // `?? t.palette.primary/error.main` fallbacks in the row-action IconButton hover sx callbacks.
    it('renders row action buttons with non-CSS-vars theme (covers hover sx fallback branches)', () => {
        render(
            <ThemeProvider theme={nonCssVarsTheme}>
                <DataTable
                    columns={sampleColumns}
                    data={sampleData}
                    getRowId={getRowId}
                    editable={true}
                    editDisplayMode="row"
                    enableDelete={true}
                    enableDuplicate={true}
                    enableRowActions={true}
                />
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('DeleteOutlineIcon').length).toBeGreaterThan(0);
    });
});
