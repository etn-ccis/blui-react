import React, { useState } from 'react';
import { Box } from '@mui/material';
import { EditableTable, type EditableTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Asset = {
    id: string;
    name: string;
    status: 'Online' | 'Offline' | 'Warning';
    health: number;
    location: string;
};

const initialData: Asset[] = [
    { id: '1', name: 'Generator A', status: 'Online', health: 92, location: 'Building 1' },
    { id: '2', name: 'Generator B', status: 'Warning', health: 45, location: 'Building 2' },
    { id: '3', name: 'UPS Unit', status: 'Offline', health: 10, location: 'Data Center' },
];

const statusOptions = ['Online', 'Offline', 'Warning'];

const statusColor: Record<string, string> = {
    Online: 'success.main',
    Warning: 'warning.main',
    Offline: 'error.main',
};

const columns: Array<EditableTableColumnDef<Asset>> = [
    { accessorKey: 'id', header: 'ID', enableEditing: false, size: 70 },
    { accessorKey: 'name', header: 'Asset Name', muiEditTextFieldProps: { required: true } },
    {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        editSelectOptions: statusOptions,
        // cellStyle: highlight row by status
        cellStyle: ({ cell }): Record<string, unknown> => ({
            color: statusColor[cell.getValue<string>()] ?? 'text.primary',
            fontWeight: 'bold',
        }),
    },
    {
        accessorKey: 'health',
        header: 'Health (%)',
        size: 120,
        muiEditTextFieldProps: { type: 'number', required: true },
        // Custom Cell: progress bar
        Cell: ({ cell }): React.ReactElement => {
            const value = cell.getValue<number>();
            const color = value >= 70 ? 'success.main' : value >= 40 ? 'warning.main' : 'error.main';
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Box
                        sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'action.disabledBackground',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
                    </Box>
                    <Box sx={{ minWidth: 32, fontSize: 12, textAlign: 'right' }}>{value}%</Box>
                </Box>
            );
        },
    },
    { accessorKey: 'location', header: 'Location' },
];

const validate = (row: Asset): Partial<Record<keyof Asset, string | undefined>> => ({
    name: !row.name ? 'Name is required' : undefined,
    health: row.health < 0 || row.health > 100 ? 'Must be 0–100' : undefined,
});

export const CustomCellsEditableTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Asset[]>(initialData);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            <EditableTable
                columns={columns}
                data={data}
                onValidate={validate}
                onCreate={(row): void => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                enableDuplicate
                createButtonText="Add Asset"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
