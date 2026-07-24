import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { BasicHorizontalStackedBarExample } from './BasicHorizontalStackedBarExample';

const codeSnippet = `const data = [
    { label: 'Failed', variant: 'failed', count: 10 },
    { label: 'Canceled', variant: 'canceled', count: 20 },
    { label: 'Success', variant: 'success', count: 35 },
    { label: 'Pending', variant: 'pending', count: 15 },
    { label: 'Info', variant: 'info', count: 20 },
];

<HorizontalStackedBar data={data} />`;

export const BasicHorizontalStackedBar = (): React.JSX.Element => (
    <Box>
        <BasicHorizontalStackedBarExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/HorizontalStackedBar/examples/BasicHorizontalStackedBarExample.tsx"
        />
    </Box>
);
