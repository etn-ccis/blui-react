import React, { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DataPointsTable, type DataPointsTab } from '@brightlayer-ui/react-components';
import { Box, Typography, Paper } from '@mui/material';
import { Thermostat, ToggleOn, Speed, Output } from '@mui/icons-material';

// Define a sample data type for stories
type DataPoint = {
    id: string;
    name: string;
    description: string;
    category: string;
    value: number;
    unit: string;
    enabled: boolean;
};

// Sample data
const sampleData: DataPoint[] = [
    { id: '1', name: 'Temperature Sensor 1', description: 'Main reactor temperature', category: 'analog-input', value: 75.5, unit: '°C', enabled: true },
    { id: '2', name: 'Temperature Sensor 2', description: 'Secondary temperature', category: 'analog-input', value: 68.2, unit: '°C', enabled: true },
    { id: '3', name: 'Pressure Gauge', description: 'System pressure', category: 'analog-input', value: 101.3, unit: 'kPa', enabled: true },
    { id: '4', name: 'Flow Meter', description: 'Water flow rate', category: 'analog-input', value: 45.0, unit: 'L/min', enabled: false },
    { id: '5', name: 'Valve Status', description: 'Main valve open/closed', category: 'binary-input', value: 1, unit: '', enabled: true },
    { id: '6', name: 'Pump Status', description: 'Pump running indicator', category: 'binary-input', value: 0, unit: '', enabled: true },
    { id: '7', name: 'Motor Control', description: 'Start/stop motor', category: 'binary-output', value: 0, unit: '', enabled: true },
    { id: '8', name: 'Heater Control', description: 'Heater on/off', category: 'binary-output', value: 1, unit: '', enabled: true },
    { id: '9', name: 'Speed Setpoint', description: 'Motor speed setting', category: 'analog-output', value: 1500, unit: 'RPM', enabled: true },
];

// Column definitions
const columns: unknown[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
        editable: true,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        size: 250,
        editable: true,
    },
    {
        accessorKey: 'value',
        header: 'Value',
        size: 100,
        editable: true,
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
        size: 80,
        editable: true,
    },
    {
        accessorKey: 'enabled',
        header: 'Enabled',
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
        editable: false,
    },
];

// Tab definitions
const tabs: DataPointsTab[] = [
    { id: 'analog-input', label: 'Analog Inputs', icon: <Thermostat fontSize="small" /> },
    { id: 'binary-input', label: 'Binary Inputs', icon: <ToggleOn fontSize="small" /> },
    { id: 'analog-output', label: 'Analog Outputs', icon: <Speed fontSize="small" /> },
    { id: 'binary-output', label: 'Binary Outputs', icon: <Output fontSize="small" /> },
];

// Simple tabs without icons
const simpleTabs: DataPointsTab[] = [
    { id: 'analog-input', label: 'Analog Inputs' },
    { id: 'binary-input', label: 'Binary Inputs' },
    { id: 'analog-output', label: 'Analog Outputs' },
    { id: 'binary-output', label: 'Binary Outputs' },
];

const meta: Meta<typeof DataPointsTable> = {
    title: 'Components/DataPointsTable',
    component: DataPointsTable,
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        enableUndoRedo: { control: 'boolean' },
        enableRowReordering: { control: 'boolean' },
        enableAdd: { control: 'boolean' },
        enableDelete: { control: 'boolean' },
        enableDuplicate: { control: 'boolean' },
        enableRowActions: { control: 'boolean' },
        addButtonLabel: { control: 'text' },
        emptyStateText: { control: 'text' },
        emptyStateDescription: { control: 'text' },
        loading: { control: 'boolean' },
        minHeight: { control: 'number' },
        maxHeight: { control: 'number' },
    },
    args: {
        enableUndoRedo: true,
        enableRowReordering: true,
        enableAdd: true,
        enableDelete: true,
        enableDuplicate: true,
        enableRowActions: true,
        addButtonLabel: 'Add Data Point',
        loading: false,
    },
    decorators: [
        (Story) => (
            <Box sx={{ width: '100%', maxWidth: 1200 }}>
                <Story />
            </Box>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DataPointsTable<DataPoint>>;

// Helper wrapper component for stateful stories
const DataPointsTableWrapper = (props: React.ComponentProps<typeof DataPointsTable<DataPoint>>) => {
    const [data, setData] = useState<DataPoint[]>(props.data);

    const handleChange = useCallback((newData: DataPoint[]) => {
        setData(newData);
        props.onChange?.(newData, { row: newData[0], rowIndex: 0, type: 'edit' });
    }, [props.onChange]);

    const handleAdd = useCallback((currentTab?: string): DataPoint => {
        const newId = String(Date.now());
        if (props.onAdd) {
            const result = props.onAdd(currentTab);
            if (result) return result;
        }
        return {
            id: newId,
            name: `New Point ${data.length + 1}`,
            description: 'New data point',
            category: currentTab || 'analog-input',
            value: 0,
            unit: '',
            enabled: true,
        };
    }, [data.length, props.onAdd]);

    const handleDuplicate = useCallback((row: DataPoint): DataPoint => {
        if (props.onDuplicate) {
            const result = props.onDuplicate(row);
            if (result) return result;
        }
        return {
            ...row,
            id: String(Date.now()),
            name: `${row.name} (copy)`,
        };
    }, [props.onDuplicate]);

    return (
        <DataPointsTable
            {...props}
            data={data}
            onChange={handleChange}
            onAdd={handleAdd}
            onDuplicate={handleDuplicate}
        />
    );
};

export const Default: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns}
        />
    ),
    args: {
        addButtonLabel: 'Add Data Point',
        minHeight: 300,
    },
};

export const WithTabs: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData}
            columns={columns}
            tabs={tabs}
            tabField="category"
        />
    ),
    args: {
        addButtonLabel: 'Add Data Point',
        minHeight: 400,
    },
};

export const WithSimpleTabs: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData}
            columns={columns}
            tabs={simpleTabs}
            tabField="category"
        />
    ),
    args: {
        addButtonLabel: 'Add Data Point',
        minHeight: 400,
    },
};

export const WithValidation: Story = {
    render: (args) => {
        const validateRow = (row: DataPoint): Record<string, string> | undefined => {
            const errors: Record<string, string> = {};
            if (!row.name || row.name.trim() === '') {
                errors.name = 'Name is required';
            }
            if (row.name && row.name.length > 30) {
                errors.name = 'Name must be 30 characters or less';
            }
            if (row.value < 0) {
                errors.value = 'Value must be positive';
            }
            return Object.keys(errors).length > 0 ? errors : undefined;
        };

        return (
            <DataPointsTableWrapper
                {...args}
                data={sampleData}
                columns={columns}
                tabs={simpleTabs}
                tabField="category"
                validateRow={validateRow}
            />
        );
    },
    args: {
        addButtonLabel: 'Add Data Point',
        minHeight: 400,
    },
};

export const EmptyState: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={[]}
            columns={columns}
        />
    ),
    args: {
        emptyStateText: 'No data points available',
        emptyStateDescription: 'Click the button below to add your first data point',
        addButtonLabel: 'Add Data Point',
        minHeight: 300,
    },
};

export const ReadOnly: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns.map(col => ({ ...col, editable: false }))}
        />
    ),
    args: {
        enableAdd: false,
        enableDelete: false,
        enableDuplicate: false,
        enableRowReordering: false,
        enableRowActions: false,
        minHeight: 300,
    },
};

export const NoRowReordering: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData}
            columns={columns}
            tabs={simpleTabs}
            tabField="category"
        />
    ),
    args: {
        enableRowReordering: false,
        addButtonLabel: 'Add Data Point',
        minHeight: 400,
    },
};

export const CustomAddButton: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns}
        />
    ),
    args: {
        addButtonLabel: 'Create New Sensor',
        minHeight: 300,
    },
};

export const Loading: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns}
        />
    ),
    args: {
        loading: true,
        minHeight: 300,
    },
};

export const WithMaxHeight: Story = {
    render: (args) => (
        <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Table with maxHeight constraint - content will scroll when exceeding the limit
            </Typography>
            <DataPointsTableWrapper
                {...args}
                data={[
                    ...sampleData,
                    { id: '10', name: 'Extra Sensor 1', description: 'Additional sensor', category: 'analog-input', value: 100, unit: '°C', enabled: true },
                    { id: '11', name: 'Extra Sensor 2', description: 'Additional sensor', category: 'analog-input', value: 200, unit: '°C', enabled: true },
                    { id: '12', name: 'Extra Sensor 3', description: 'Additional sensor', category: 'analog-input', value: 300, unit: '°C', enabled: true },
                    { id: '13', name: 'Extra Sensor 4', description: 'Additional sensor', category: 'analog-input', value: 400, unit: '°C', enabled: true },
                    { id: '14', name: 'Extra Sensor 5', description: 'Additional sensor', category: 'analog-input', value: 500, unit: '°C', enabled: true },
                ].filter(d => d.category === 'analog-input')}
                columns={columns}
            />
        </Box>
    ),
    args: {
        maxHeight: 400,
        addButtonLabel: 'Add Data Point',
    },
};

export const OnlyDuplicateAction: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns}
        />
    ),
    args: {
        enableDelete: false,
        enableDuplicate: true,
        enableRowReordering: false,
        addButtonLabel: 'Add Data Point',
        minHeight: 300,
    },
};

export const OnlyDeleteAction: Story = {
    render: (args) => (
        <DataPointsTableWrapper
            {...args}
            data={sampleData.filter(d => d.category === 'analog-input')}
            columns={columns}
        />
    ),
    args: {
        enableDelete: true,
        enableDuplicate: false,
        enableRowReordering: false,
        addButtonLabel: 'Add Data Point',
        minHeight: 300,
    },
};

export const InCard: Story = {
    render: (args) => (
        <Paper elevation={2} sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Data Points Configuration</Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure and manage your data points
                </Typography>
            </Box>
            <DataPointsTableWrapper
                {...args}
                data={sampleData}
                columns={columns}
                tabs={simpleTabs}
                tabField="category"
            />
        </Paper>
    ),
    args: {
        addButtonLabel: 'Add Data Point',
        minHeight: 400,
    },
};
