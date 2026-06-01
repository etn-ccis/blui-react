import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { ReadOnlyDataTableExample } from './ReadOnlyDataTableExample';

const codeSnippet = `<DataTable
    columns={columns}
    data={data}
    editable={false}
    enableCreate={false}
    enableDelete={false}
    enableDuplicate={false}
    enableRowActions={false}
/>`;

export const ReadOnlyDataTable = (): React.JSX.Element => (
    <Box>
        <ReadOnlyDataTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'4'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DataTable/examples/ReadOnlyDataTableExample.tsx"
        />
    </Box>
);
