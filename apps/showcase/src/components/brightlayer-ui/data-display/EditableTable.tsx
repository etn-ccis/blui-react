import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { EditableTable, DataPointCommandDialogProvider } from '@brightlayer-ui/react-components';
import type { MRT_ColumnDef } from 'material-react-table';

const componentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    mb: 4,
    width: '100%',
};

const sectionTitleStyles = {
    mb: 2,
};

type DataPoint = {
    id: string;
    name: string;
    description: string;
    type: 'Sensor' | 'Control';
    readWrite: 'R' | 'W' | 'RW';
    valueType: 'Int32' | 'Float32' | 'String' | 'Bool';
    units?: string;
};

// Sample data
const sampleData: DataPoint[] = [
    {
        id: '1',
        name: 'Temperature',
        description: 'Current temperature reading',
        type: 'Sensor',
        readWrite: 'R',
        valueType: 'Float32',
        units: '°C',
    },
    {
        id: '2',
        name: 'SetPoint',
        description: 'Target temperature',
        type: 'Control',
        readWrite: 'RW',
        valueType: 'Float32',
        units: '°C',
    },
    {
        id: '3',
        name: 'Status',
        description: 'Device status',
        type: 'Sensor',
        readWrite: 'R',
        valueType: 'String',
    },
];

export const EditableTableExample: React.FC = () => {
    const [data] = React.useState(sampleData);

    // Define custom columns
    const columns = React.useMemo<MRT_ColumnDef<DataPoint>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                size: 200,
            },
            {
                accessorKey: 'type',
                header: 'Type',
                size: 120,
                enableEditing: false,
            },
            {
                accessorKey: 'readWrite',
                header: 'Read/Write',
                size: 120,
                editVariant: 'select',
                editSelectOptions: ['R', 'W', 'RW'],
            },
            {
                accessorKey: 'valueType',
                header: 'Value Type',
                size: 120,
                editVariant: 'select',
                editSelectOptions: ['Int32', 'Float32', 'String', 'Bool'],
            },
            {
                accessorKey: 'units',
                header: 'Units',
                size: 100,
            },
        ],
        []
    );

    const handleSendCommand = async (
        device: any,
        resourceName: string,
        value: any
    ): Promise<{ statusCode: number; message?: string }> => {
        console.log('Send command:', { device, resourceName, value });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ statusCode: 200, message: 'Command sent successfully' });
            }, 500);
        });
    };

    return (
        <>
            <Box sx={componentContainerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Basic Editable Table
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    A fully customizable editable table with validation and inline editing. You provide the data and
                    column definitions.
                </Typography>
                <DataPointCommandDialogProvider>
                    <Box sx={{ width: '100%' }}>
                        <EditableTable<DataPoint>
                            data={data}
                            columns={columns}
                            onSendCommand={handleSendCommand}
                        />
                    </Box>
                </DataPointCommandDialogProvider>
            </Box>
        </>
    );
};

