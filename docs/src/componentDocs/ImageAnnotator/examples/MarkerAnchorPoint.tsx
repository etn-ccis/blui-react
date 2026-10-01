import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { MarkerAnchorPointExample } from './MarkerAnchorPointExample';

const codeSnippet = `<ImageAnnotator src="entrance.png" alt="Cleanroom entrance">
	<MarkerAnchorPoint
		x={8}
		y={35}
		icon={<DeviceThermostatOutlinedIcon />}
		color="orange"
	/>
	<MarkerAnchorPoint
		x={72}
		y={42}
		icon={<DeviceThermostatOutlinedIcon />}
		color="error"
		callout
		direction="right"
	/>
</ImageAnnotator>`;

export const MarkerAnchorPoint = (): React.JSX.Element => (
    <Box>
        <MarkerAnchorPointExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/ImageAnnotator/examples/MarkerAnchorPointExample.tsx"
        />
    </Box>
);
