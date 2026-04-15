import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CustomCellsEditableTableExample } from './CustomCellsEditableTableExample';

const codeSnippet = `{
    accessorKey: 'status',
    header: 'Status',
    editVariant: 'select',
    editSelectOptions: ['Online', 'Offline', 'Warning'],
    // cellStyle: color the text by status value
    cellStyle: ({ cell }) => ({
        color: statusColor[cell.getValue<string>()],
        fontWeight: 'bold',
    }),
},
{
    accessorKey: 'health',
    header: 'Health (%)',
    // Custom Cell: render a progress bar
    Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress variant="determinate" value={value} sx={{ flex: 1 }} />
                <span>{value}%</span>
            </Box>
        );
    },
}`;

export const CustomCellsEditableTable = (): React.JSX.Element => (
    <Box>
        <CustomCellsEditableTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'6-10,17-27'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/EditableTable/examples/CustomCellsEditableTableExample.tsx"
        />
    </Box>
);
