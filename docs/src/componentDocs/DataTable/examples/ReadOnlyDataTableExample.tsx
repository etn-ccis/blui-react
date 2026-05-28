import React from 'react';
import { DataTable, type DataTableColumnDef } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Device = {
    id: string;
    name: string;
    status: 'Online' | 'Offline' | 'Maintenance';
    site: string;
    uptimeDays: number;
};

const initialData: Device[] = [
    { id: '1', name: 'Edge Gateway 01', status: 'Online', site: 'Phoenix', uptimeDays: 187 },
    { id: '2', name: 'Panel Controller 12', status: 'Maintenance', site: 'Austin', uptimeDays: 12 },
    { id: '3', name: 'Power Monitor 08', status: 'Offline', site: 'Chicago', uptimeDays: 0 },
];

const columns: Array<DataTableColumnDef<Device>> = [
    { accessorKey: 'name', header: 'Device Name', cellType: 'text' },
    { accessorKey: 'status', header: 'Status', cellType: 'text' },
    { accessorKey: 'site', header: 'Site', cellType: 'text' },
    { accessorKey: 'uptimeDays', header: 'Uptime (Days)', cellType: 'number', size: 130 },
];

export const ReadOnlyDataTableExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ p: 2 }}>
        <DataTable
            columns={columns}
            data={initialData}
            editable={false}
            enableCreate={false}
            enableDelete={false}
            enableDuplicate={false}
            enableRowActions={false}
            createButtonText="Add Device"
        />
    </ExampleShowcase>
);
