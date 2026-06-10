import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { FileDragUploadImageAcceptExample } from './FileDragUploadImageAcceptExample';

const codeSnippet = `<FileDragUpload
    title="Upload a Photo"
    icon={<PhotoIcon fontSize={'inherit'} />}
    description={'Max file size: 25 MB\\nAllowed format: PNG, JPG, WEBP, TIFF, SVG'}
    accept="image/png,image/jpeg,image/webp,image/tiff,image/svg+xml"
    multiple
    onFilesSelected={(): void => {}}
/>`;

export const FileDragUploadImageAccept = (): React.JSX.Element => (
    <Box>
        <FileDragUploadImageAcceptExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="2-6" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/FileDragUpload/examples/FileDragUploadImageAcceptExample.tsx"
        />
    </Box>
);
