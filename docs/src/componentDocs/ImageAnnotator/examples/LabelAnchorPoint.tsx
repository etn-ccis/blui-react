import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { LabelAnchorPointExample } from './LabelAnchorPointExample';

const codeSnippet = `<ImageAnnotator src={isDarkMode ? entranceDark : entranceLight} alt="Entrance" sx={imageStyles}>
	<LabelAnchorPoint x={75} y={10} label="Entrance #2" />
	<LabelAnchorPoint x={33} y={25} label="Cabinet #2" callout direction="left" connectorLength={50} />
	<LabelAnchorPoint x={70} y={50} label="Cabinet #1" callout connectorLength={50} />
	<LabelAnchorPoint x={25} y={80} label="Entrance #1" callout direction="right" connectorLength={60} />
</ImageAnnotator>`;

export const LabelAnchorPoint = (): React.JSX.Element => (
    <Box>
        <LabelAnchorPointExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/ImageAnnotator/examples/LabelAnchorPointExample.tsx"
        />
    </Box>
);
