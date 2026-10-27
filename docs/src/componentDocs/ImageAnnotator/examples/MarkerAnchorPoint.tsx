import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { MarkerAnchorPointExample } from './MarkerAnchorPointExample';

const codeSnippet = `<ImageAnnotator src={isDarkMode ? partsDark : partsLight} alt="Factory floor parts" sx={imageStyles}>
	<MarkerAnchorPoint x={42} y={14} icon={<CameraAltIcon />} markerColor="orange" />
	<MarkerAnchorPoint x={18} y={76} icon={<PartyMode />} markerColor="neutral" />
	<MarkerAnchorPoint x={43} y={78} icon={<DeviceThermostatOutlinedIcon />} markerColor="success" />
	<MarkerAnchorPoint
		x={8}
		y={30}
		icon={<RoomIcon />}
		markerColor="primary"
		callout
		direction="bottom"
		connectorLength={30}
	/>
	<MarkerAnchorPoint x={88} y={24} icon={<Map />} markerColor="warning" callout connectorLength={30} />
	<MarkerAnchorPoint
		x={35}
		y={58}
		icon={<Vibration />}
		markerColor="purple"
		callout
		direction="top"
		connectorLength={30}
	/>
	<MarkerAnchorPoint
		x={71}
		y={50}
		icon={<SupervisorAccount />}
		markerColor="error"
		callout
		connectorLength={30}
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
