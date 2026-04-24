import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { DataPointsTable, DataPointsColumnDef, DataPointsTab } from '@brightlayer-ui/react-components';

const componentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    mb: 4,
};

const sectionTitleStyles = {
    mb: 2,
};

// Define a simple data point type
type DataPoint = {
    id: string;
    name: string;
    description: string;
    category: string;
    value: number;
    unit: string;
    enabled: boolean;
};

// Sample data for the table
const initialData: DataPoint[] = [
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

// Tab definitions
const tabs: DataPointsTab[] = [
    { id: 'analog-input', label: 'Analog Inputs' },
    { id: 'binary-input', label: 'Binary Inputs' },
    { id: 'analog-output', label: 'Analog Outputs' },
    { id: 'binary-output', label: 'Binary Outputs' },
];

// Column definitions
const columns: DataPointsColumnDef<DataPoint>[] = [
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

export const DataPointsTableExample: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>(initialData);

    // Handle data changes from the table
    const handleChange = useCallback((newData: DataPoint[]) => {
        setData(newData);
        console.log('Data changed:', newData);
    }, []);

    // Handle adding a new row
    const handleAdd = useCallback((currentTab?: string): DataPoint => {
        const newId = String(Date.now());
        return {
            id: newId,
            name: `New Point ${data.length + 1}`,
            description: 'New data point',
            category: currentTab || 'analog-input',
            value: 0,
            unit: '',
            enabled: true,
        };
    }, [data.length]);

    // Handle duplicating a row
    const handleDuplicate = useCallback((row: DataPoint): DataPoint => ({
        ...row,
        id: String(Date.now()),
        name: `${row.name} (copy)`,
    }), []);

    // Validate rows
    const validateRow = useCallback((row: DataPoint): Record<string, string> | undefined => {
        const errors: Record<string, string> = {};
        if (!row.name || row.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (row.name && row.name.length > 50) {
            errors.name = 'Name must be 50 characters or less';
        }
        return Object.keys(errors).length > 0 ? errors : undefined;
    }, []);

    return (
        <>
            <Box sx={componentContainerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    DataPointsTable Component
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    A props-driven editable table with tabs, inline editing, undo/redo, and row operations.
                </Typography>
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: 'background.paper',
                    }}
                >
                    <DataPointsTable
                        data={data}
                        columns={columns}
                        tabs={tabs}
                        tabField="category"
                        onChange={handleChange}
                        onAdd={handleAdd}
                        onDuplicate={handleDuplicate}
                        validateRow={validateRow}
                        enableUndoRedo={true}
                        enableRowReordering={true}
                        addButtonLabel="Add Data Point"
                        emptyStateText="No data points in this category"
                        emptyStateDescription="Click the button below to add a new data point"
                        minHeight={400}
                        maxHeight={600}
                    />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                    Features: Tab navigation, inline cell editing, undo/redo (Ctrl+Z / Ctrl+Shift+Z), drag-and-drop reordering, add/duplicate/delete rows, validation
                </Typography>
            </Box>
        </>
    );
};

