import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CustomAnchorPointsExample } from './CustomAnchorPointsExample';

const codeSnippet = `<ImageAnnotator src={isDarkMode ? cabinetDark : cabinetLight} alt="Switchgear cabinets" sx={{ width: 600 }}>
	<MarkerAnchorPoint x={24} y={42} icon={<RoomIcon />} iconSize={32} markerColor="orange" />
	<LabelAnchorPoint x={50} y={20} label="Cabinet 2" labelBgColor="#166b68" labelColor="#ffffff" />
	<CardAnchorPoint
		x={85}
		y={72}
		cardWidth={180}
		callout
		direction="left"
		connectorLength={30}
		connectorColor="#166b68"
		connectorThickness={3}
		anchorDotColor="#166b68"
	>
		<Typography variant="subtitle2">Switchgear Cabinet</Typography>
		<Divider sx={{ width: '100%' }} />
		{[
			['Health Status', 'Good'],
			['Load Rate', '56 %'],
			['Temp', '38 ℃'],
		].map(([label, value]) => (
			<Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
				<Typography variant="body2">{label}</Typography>
				<Typography variant="body2">{value}</Typography>
			</Box>
		))}
	</CardAnchorPoint>
</ImageAnnotator>`;

export const CustomAnchorPoints = (): React.JSX.Element => (
    <Box>
        <CustomAnchorPointsExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/ImageAnnotator/examples/CustomAnchorPointsExample.tsx"
        />
    </Box>
);
