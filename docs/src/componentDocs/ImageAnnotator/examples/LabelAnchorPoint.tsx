import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { LabelAnchorPointExample } from './LabelAnchorPointExample';

const codeSnippet = `<ImageAnnotator src="parts.png" alt="Factory floor parts">
	<LabelAnchorPoint x={8} y={50} label="Temperature sensor" />
	<LabelAnchorPoint
		x={20}
		y={80}
		label="Factory floor camera"
		callout
		direction="right"
		connectorLength={40}
	/>
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
