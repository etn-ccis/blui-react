import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CardAnchorPointExample } from './CardAnchorPointExample';

const codeSnippet = `<ImageAnnotator src="cabinet.png" alt="Switchgear cabinets">
	<CardAnchorPoint x={24} y={28} cardWidth={160}>
		<Typography variant="subtitle2">Cabinet 1</Typography>
		<Typography variant="body2">Health: Good</Typography>
	</CardAnchorPoint>
	<CardAnchorPoint x={90} y={34} cardWidth={160} callout direction="left" connectorLength={30}>
		<Typography variant="subtitle2">Cabinet 4</Typography>
		<Typography variant="body2">Load rate: 56%</Typography>
	</CardAnchorPoint>
</ImageAnnotator>`;

export const CardAnchorPoint = (): React.JSX.Element => (
    <Box>
        <CardAnchorPointExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/ImageAnnotator/examples/CardAnchorPointExample.tsx"
        />
    </Box>
);
