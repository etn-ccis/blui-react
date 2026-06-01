import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { InteractiveHorizontalStackedBarExample } from './InteractiveHorizontalStackedBarExample';

const codeSnippet = `<HorizontalStackedBar
    data={data}
    hideEmptyCategories
    onChange={(label) => setSelectedStatus(label)}
/>`;

export const InteractiveHorizontalStackedBar = (): React.JSX.Element => (
    <Box>
        <InteractiveHorizontalStackedBarExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/HorizontalStackedBar/examples/InteractiveHorizontalStackedBarExample.tsx"
        />
    </Box>
);
