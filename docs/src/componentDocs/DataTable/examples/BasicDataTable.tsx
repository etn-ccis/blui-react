import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { BasicDataTableExample } from './BasicDataTableExample';

const codeSnippet = `type Sensor = {
    id: string;
    name: string;
    unit: string;
    location: string;
    threshold: number;
    enabled: boolean;
};

const locationOptions = ['Boiler Room', 'Pump Station', 'Server Room', 'Control Room'];

const columns: Array<DataTableColumnDef<Sensor>> = [
    { accessorKey: 'name', header: 'Name', cellType: 'text' },
    { accessorKey: 'unit', header: 'Unit', cellType: 'text', size: 90 },
    { accessorKey: 'location', header: 'Location', cellType: 'select', editSelectOptions: locationOptions },
    { accessorKey: 'threshold', header: 'Threshold', cellType: 'number', size: 110 },
    { accessorKey: 'enabled', header: 'Enabled', cellType: 'binary', size: 90 },
];

const validate = (row: Sensor) => ({
    name: !row.name ? 'Name is required' : undefined,
    unit: !row.unit ? 'Unit is required' : undefined,
    location: !row.location ? 'Location is required' : undefined,
    threshold: row.threshold < 0 ? 'Must be ≥ 0' : undefined,
});

<DataTable
    columns={columns}
    data={data}
    onValidate={validate}
    onCreate={(row) => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
    onUpdate={(row) => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
    onDelete={(id) => setData((prev) => prev.filter((r) => r.id !== id))}
    onDuplicate={(row) => setData((prev) => [...prev, { ...row, id: String(prev.length + 1) }])}
    enableDuplicate
    createButtonText="Add Sensor"
/>`;

export const BasicDataTable = (): React.JSX.Element => (
    <Box>
        <BasicDataTableExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DataTable/examples/BasicDataTableExample.tsx"
        />
    </Box>
);
