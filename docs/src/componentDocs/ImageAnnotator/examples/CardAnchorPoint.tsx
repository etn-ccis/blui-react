import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CardAnchorPointExample } from './CardAnchorPointExample';
import { cardFieldStylesSnippet } from '../cardFieldStyles';

const codeSnippet = `import * as BLUIColors from '@brightlayer-ui/colors';

${cardFieldStylesSnippet}

<ImageAnnotator src={isDarkMode ? cabinetDark : cabinetLight} alt="Switchgear cabinets" sx={imageStyles}>
    <CardAnchorPoint x={20} y={20} cardWidth={160} sx={cardFieldStyles}>
        <Typography variant="subtitle2">Cabinet 1</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
            <Typography variant="body2" className="card-field-label">Health Status</Typography>
            <Typography variant="body2" className="card-field-value">Good</Typography>
        </Box>
    </CardAnchorPoint>
    <CardAnchorPoint x={90} y={34} cardWidth={160} callout direction="left" connectorLength={120} sx={cardFieldStyles}>
        <Typography variant="subtitle2">Cabinet 4</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
            <Typography variant="body2" className="card-field-label">Load Rate</Typography>
            <Typography variant="body2" className="card-field-value">56%</Typography>
        </Box>
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
