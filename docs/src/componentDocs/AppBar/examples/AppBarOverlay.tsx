import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { AppBarOverlayExample } from './AppBarOverlayExample';

const codeSnippet = `<Box>
    <AppBar 
        position="sticky" 
        color="transparent" 
        overlay
    >
        <Toolbar>
            <Typography variant="h6">Overlay</Typography>
        </Toolbar>
    </AppBar>
    {getBodyFiller()}
</Box>
`;

export const AppBarOverlay = (): React.JSX.Element => (
    <Box>
        <AppBarOverlayExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="1-7" />
        <CodeBlockActionButtonRow copyText={codeSnippet} url="componentDocs/AppBar/examples/AppBarOverlayExample.tsx" />
    </Box>
);
