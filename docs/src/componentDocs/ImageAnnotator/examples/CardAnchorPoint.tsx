import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { CardAnchorPointExample } from './CardAnchorPointExample';

const codeSnippet = `<ImageAnnotator src={isDarkMode ? cabinetDark : cabinetLight} alt="Switchgear cabinets" sx={imageStyles}>
    <CardAnchorPoint
        x={20}
        y={20}
        cardWidth={160}
        cardContent={{
            cardHeader: 'Switchgear Cabinet',
            cardData: [
                { label: 'Health Status', value: 'Good' },
                { label: 'Load Rate', value: '56%' },
                { label: 'Temp', value: '38 C' },
            ],
        }}
    />
    <CardAnchorPoint
        x={90}
        y={34}
        cardWidth={160}
        callout
        direction="left"
        connectorLength={120}
        cardContent={{
            cardHeader: 'Switchgear Cabinet',
            cardData: [
                { label: 'Health Status', value: 'Good' },
                { label: 'Load Rate', value: '56%' },
            ],
        }}
    />
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
