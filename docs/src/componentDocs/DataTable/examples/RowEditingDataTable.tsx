import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { RowEditingDataTableExample } from './RowEditingDataTableExample';

const codeSnippet = `<DataTable
    columns={columns}
    data={data}
    editDisplayMode="row"
    createDisplayMode="row"
    enableDuplicate
    onValidate={validate}
    onCreate={handleCreate}
    onUpdate={handleUpdate}
    onDelete={handleDelete}
/>`;

export const RowEditingDataTable = (): React.JSX.Element => (
    <Box>
        <RowEditingDataTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'3-4'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DataTable/examples/RowEditingDataTableExample.tsx"
        />
    </Box>
);
