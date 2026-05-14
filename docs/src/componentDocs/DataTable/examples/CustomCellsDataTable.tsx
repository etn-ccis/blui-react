import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CustomCellsDataTableExample } from './CustomCellsDataTableExample';

const codeSnippet = `// cellType: 'select' with cellStyle for conditional text color
{
    accessorKey: 'zone',
    header: 'Zone',
    cellType: 'select',
    editSelectOptions: ['Zone A', 'Zone B', 'Zone C'],
    cellStyle: ({ cell }) => ({
        color: zoneColor[cell.getValue<string>()],
        fontWeight: 'bold',
    }),
},

// cellType: 'number' with a custom Cell renderer (load bar)
{
    accessorKey: 'load',
    header: 'Load (%)',
    cellType: 'number',
    Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        const color = value >= 70 ? 'error.main' : value >= 40 ? 'warning.main' : 'success.main';
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box sx={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: 'action.disabledBackground', overflow: 'hidden' }}>
                    <Box sx={{ width: \`\${value}%\`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
                </Box>
                <Box sx={{ minWidth: 32, fontSize: 12, textAlign: 'right' }}>{value}%</Box>
            </Box>
        );
    },
},

// cellType: 'binary' for boolean toggle
{ accessorKey: 'active', header: 'Active', cellType: 'binary' }`;

export const CustomCellsDataTable = (): React.JSX.Element => (
    <Box>
        <CustomCellsDataTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'3-14,17-33,36'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DataTable/examples/CustomCellsDataTableExample.tsx"
        />
    </Box>
);
