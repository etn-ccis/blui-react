import React, { useState } from 'react';
import { Box } from '@mui/material';
import { DataTable, type DataTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Circuit = {
    id: string;
    panel: string;
    label: string;
    zone: 'Zone A' | 'Zone B' | 'Zone C';
    load: number;
    active: boolean;
};

const initialData: Circuit[] = [
    { id: '1', panel: 'P-01', label: 'Main Feed', zone: 'Zone A', load: 78, active: true },
    { id: '2', panel: 'P-02', label: 'Backup Line', zone: 'Zone B', load: 42, active: true },
    { id: '3', panel: 'P-03', label: 'Emergency', zone: 'Zone C', load: 15, active: false },
];

const zoneOptions = ['Zone A', 'Zone B', 'Zone C'];

const zoneColor: Record<string, string> = {
    'Zone A': 'success.main',
    'Zone B': 'warning.main',
    'Zone C': 'error.main',
};

const columns: Array<DataTableColumnDef<Circuit>> = [
    { accessorKey: 'panel', header: 'Panel', cellType: 'text', size: 90, required: true },
    { accessorKey: 'label', header: 'Label', cellType: 'text', required: true },
    {
        accessorKey: 'zone',
        header: 'Zone',
        cellType: 'select',
        editSelectOptions: zoneOptions,
        cellStyle: ({ cell }): Record<string, unknown> => ({
            color: zoneColor[cell.getValue<string>()] ?? 'text.primary',
            fontWeight: 'bold',
        }),
    },
    {
        accessorKey: 'load',
        header: 'Load (%)',
        cellType: 'number',
        size: 130,
        Cell: ({ cell }): React.ReactElement => {
            const value = cell.getValue<number>();
            const color = value >= 70 ? 'error.main' : value >= 40 ? 'warning.main' : 'success.main';
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
    { accessorKey: 'active', header: 'Active', cellType: 'binary', size: 90 },
];

const validate = (row: Circuit): Partial<Record<keyof Circuit, string | undefined>> => ({
    panel: !row.panel ? 'Panel is required' : undefined,
    label: !row.label ? 'Label is required' : undefined,
    load: row.load < 0 || row.load > 100 ? 'Must be 0–100' : undefined,
});

export const CustomCellsDataTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Circuit[]>(initialData);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            <DataTable
                columns={columns}
                data={data}
                onValidate={validate}
                onCreate={(row): void =>
                    setData((prev) => [
                        ...prev,
                        { ...row, id: String(prev.length + 1), panel: row.panel || `P-0${prev.length + 1}` },
                    ])
                }
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                onDuplicate={(row): void =>
                    setData((prev) => [...prev, { ...row, id: String(prev.length + 1), panel: `${row.panel}-copy` }])
                }
                enableDuplicate
                createButtonText="Add Circuit"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
