import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadSingleFileExample } from './FileDragUploadSingleFileExample';

const codeSnippet = `<FileDragUpload
    description={'Max file size: 5 MB\\nOnly one file allowed'}
    multiple={false}
    onFilesSelected={(): void => {}}
/>`;

export const FileDragUploadSingleFile = (): React.JSX.Element => (
    <Box>
        <FileDragUploadSingleFileExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2-3" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadSingleFileExample.tsx"
        />
    </Box>
);
