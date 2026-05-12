import React, { useState } from 'react';
import { DataTable, type DataTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Sensor = {
    id: string;
    name: string;
    unit: string;
    location: 'Boiler Room' | 'Pump Station' | 'Server Room' | 'Control Room';
    threshold: number;
    enabled: boolean;
};

const locationOptions = ['Boiler Room', 'Pump Station', 'Server Room', 'Control Room'];

const initialData: Sensor[] = [
    { id: '1', name: 'Temperature Sensor', unit: '°C', location: 'Boiler Room', threshold: 80, enabled: true },
    { id: '2', name: 'Pressure Gauge', unit: 'bar', location: 'Pump Station', threshold: 120, enabled: true },
    { id: '3', name: 'Humidity Monitor', unit: '%RH', location: 'Server Room', threshold: 60, enabled: false },
];

const columns: Array<DataTableColumnDef<Sensor>> = [
    { accessorKey: 'name', header: 'Name', cellType: 'text', required: true },
    { accessorKey: 'unit', header: 'Unit', cellType: 'text', size: 90, required: true },
    {
        accessorKey: 'location',
        header: 'Location',
        cellType: 'select',
        editSelectOptions: locationOptions,
        required: true,
    },
    { accessorKey: 'threshold', header: 'Threshold', cellType: 'number', size: 110 },
    { accessorKey: 'enabled', header: 'Enabled', cellType: 'binary', size: 90 },
];

const validate = (row: Sensor): Partial<Record<keyof Sensor, string | undefined>> => ({
    name: !row.name ? 'Name is required' : undefined,
    unit: !row.unit ? 'Unit is required' : undefined,
    location: !row.location ? 'Location is required' : undefined,
    threshold: row.threshold < 0 ? 'Must be ≥ 0' : undefined,
});

export const BasicDataTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Sensor[]>(initialData);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            <DataTable
                columns={columns}
                data={data}
                onValidate={validate}
                onCreate={(row): void => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                onDuplicate={(row): void => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
                enableDuplicate
                createButtonText="Add Sensor"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
