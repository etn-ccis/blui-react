import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadCompactExample } from './FileDragUploadCompactExample';

const codeSnippet = `<FileDragUpload
    compact
    onFilesSelected={(files) => {
        console.log('Selected files:', files);
    }}
/>`;

export const FileDragUploadCompact = (): React.JSX.Element => (
    <Box>
        <FileDragUploadCompactExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadCompactExample.tsx"
        />
    </Box>
);
