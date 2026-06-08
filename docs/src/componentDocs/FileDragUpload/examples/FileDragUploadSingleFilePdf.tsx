import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadSingleFilePdfExample } from './FileDragUploadSingleFilePdfExample';

const codeSnippet = `<FileDragUpload
    description={'Max file size: 10 MB\\nAllowed format: PDF\\nOnly one file allowed'}
    accept="application/pdf"
    multiple={false}
    onFilesSelected={(files) => {
        console.log('Selected files:', files);
    }}
/>`;

export const FileDragUploadSingleFilePdf = (): React.JSX.Element => (
    <Box>
        <FileDragUploadSingleFilePdfExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2-4" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadSingleFilePdfExample.tsx"
        />
    </Box>
);
