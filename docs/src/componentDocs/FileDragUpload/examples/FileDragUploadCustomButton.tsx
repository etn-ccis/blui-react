import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadCustomButtonExample } from './FileDragUploadCustomButtonExample';

const codeSnippet = `<FileDragUpload
    customButton={
        <Button variant="outlined" color="primary" startIcon={<CloudUpload />}>
            Browse Files
        </Button>
    }
    onFilesSelected={(files) => {
        console.log('Selected files:', files);
    }}
/>`;

export const FileDragUploadCustomButton = (): React.JSX.Element => (
    <Box>
        <FileDragUploadCustomButtonExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2-6" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadCustomButtonExample.tsx"
        />
    </Box>
);
