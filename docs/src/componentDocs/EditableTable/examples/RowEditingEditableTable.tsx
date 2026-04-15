import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { RowEditingEditableTableExample } from './RowEditingEditableTableExample';

const codeSnippet = `<EditableTable
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

export const RowEditingEditableTable = (): React.JSX.Element => (
    <Box>
        <RowEditingEditableTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'3-4'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/EditableTable/examples/RowEditingEditableTableExample.tsx"
        />
    </Box>
);
