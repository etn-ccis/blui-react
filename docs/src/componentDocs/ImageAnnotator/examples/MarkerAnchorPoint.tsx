import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { MarkerAnchorPointExample } from './MarkerAnchorPointExample';

const codeSnippet = `<ImageAnnotator src={isDarkMode ? partsDark : partsLight} alt="Factory floor parts" sx={imageStyles}>
	<MarkerAnchorPoint x={8} y={35} icon={<RoomIcon />} color="primary" />
	<MarkerAnchorPoint x={42} y={14} icon={<DeviceThermostatOutlinedIcon />} color="orange" />
	<MarkerAnchorPoint x={18} y={76} icon={<DeviceThermostatOutlinedIcon />} color="neutral" />
	<MarkerAnchorPoint x={43} y={78} icon={<DeviceThermostatOutlinedIcon />} color="success" />
	<MarkerAnchorPoint x={88} y={24} icon={<DeviceThermostatOutlinedIcon />} color="warning" />
	<MarkerAnchorPoint x={88} y={78} icon={<DeviceThermostatOutlinedIcon />} color="purple" />
	<MarkerAnchorPoint
		x={71}
		y={50}
		icon={<DeviceThermostatOutlinedIcon />}
		color="error"
		callout
		connectorLength={30}
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
