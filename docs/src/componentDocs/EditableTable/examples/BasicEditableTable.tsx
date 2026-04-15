import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { BasicEditableTableExample } from './BasicEditableTableExample';

const codeSnippet = `const columns: Array<EditableTableColumnDef<Product>> = [
    { accessorKey: 'id', header: 'ID', enableEditing: false, size: 70 },
    { accessorKey: 'name', header: 'Name', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'quantity', header: 'Qty', size: 90, muiEditTextFieldProps: { type: 'number', required: true } },
    { accessorKey: 'price', header: 'Price ($)', size: 110, muiEditTextFieldProps: { type: 'number', required: true } },
];

<EditableTable
    columns={columns}
    data={data}
    onValidate={validate}
    onCreate={handleCreate}
    onUpdate={handleUpdate}
    onDelete={handleDelete}
    createButtonText="Add Product"
/>`;

export const BasicEditableTable = (): React.JSX.Element => (
    <Box>
        <BasicEditableTableExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/EditableTable/examples/BasicEditableTableExample.tsx"
        />
    </Box>
);
