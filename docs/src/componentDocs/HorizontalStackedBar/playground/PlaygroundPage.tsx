import React from 'react';
import Box from '@mui/material/Box';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';

const data = [
    { label: 'Failed', variant: 'failed' as const, count: 10 },
    { label: 'Canceled', variant: 'canceled' as const, count: 18 },
    { label: 'Success', variant: 'success' as const, count: 44 },
    { label: 'Pending', variant: 'pending' as const, count: 28 },
];

export const HorizontalStackedBarPlaygroundComponent = (): React.JSX.Element => (
    <Box sx={{ p: 3 }}>
        <HorizontalStackedBar data={data} />
    </Box>
);
