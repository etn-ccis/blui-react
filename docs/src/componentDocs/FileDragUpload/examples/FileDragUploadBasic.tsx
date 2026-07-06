import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadBasicExample } from './FileDragUploadBasicExample';

const codeSnippet = `<FileDragUpload
    onFilesSelected={(): void => {}}
/>`;

export const FileDragUploadBasic = (): React.JSX.Element => (
    <Box>
        <FileDragUploadBasicExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadBasicExample.tsx"
        />
    </Box>
);
