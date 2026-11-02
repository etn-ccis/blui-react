import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CustomAnchorPointsExample } from './CustomAnchorPointsExample';

const codeSnippet = `<ImageAnnotator
	src={isDarkMode ? cabinetDark : cabinetLight}
	alt="Switchgear cabinets"
	sx={{ width: 600, mx: 'auto' }}
>
	<MarkerAnchorPoint
		x={10}
		y={42}
		icon={<CabinTwoTone />}
		markerColor="warning"
		callout
		direction="right"
		connectorLength={60}
		anchorDotColor="#d8442a"
		connectorColor={['yellow', 'red']}
	/>
	<LabelAnchorPoint
		x={50}
		y={20}
		label="Cabinet #2"
		callout
		anchorDotColor="#5090ef"
		connectorColor={['#2cc333', '#5090ef']}
		connectorLength={70}
	/>
	<CardAnchorPoint
		x={80}
		y={75}
		cardWidth={180}
		callout
		direction="left"
		connectorLength={90}
		connectorColor="#e09bf1"
		connectorThickness={1}
		anchorDotColor="#059893"
	>
		<>
			<Typography
				variant="subtitle2"
				sx={{ fontWeight: 600, pb: 0.25, whiteSpace: 'nowrap', color: '#07908b' }}
			>
				Switchgear Cabinet
			</Typography>
			<Divider sx={{ width: '100%' }} />
			{[
				['Health Status', 'Good'],
				['Load Rate', '56 %'],
				['Temp', '38 ℃'],
			].map(([label, value]) => (
				<Box
					key={label}
					sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}
				>
					<Typography variant="body2">{label}</Typography>
					<Typography variant="body2">{value}</Typography>
				</Box>
			))}
		</>
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
