import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadMultipleExample } from './FileDragUploadMultipleExample';

const codeSnippet = `<FileDragUpload
    multiple
    accept="image/*"
    title="Upload Images"
    description={'Max file size: 5 MB\\nAllowed format: Images'}
    onFilesSelected={(): void => {}}
/>`;

export const FileDragUploadMultiple = (): React.JSX.Element => (
    <Box>
        <FileDragUploadMultipleExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2-5" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadMultipleExample.tsx"
        />
    </Box>
);
