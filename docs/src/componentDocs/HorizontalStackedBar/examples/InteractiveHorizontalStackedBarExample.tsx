import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

const data = [
    { label: 'Failed', variant: 'failed' as const, count: 12 },
    { label: 'Canceled', variant: 'canceled' as const, count: 16 },
    { label: 'Success', variant: 'success' as const, count: 48 },
    { label: 'Pending', variant: 'pending' as const, count: 24 },
];

export const InteractiveHorizontalStackedBarExample = (): React.JSX.Element => {
    const [selectedStatus, setSelectedStatus] = React.useState('');

    return (
        <ExampleShowcase>
            <Box>
                <HorizontalStackedBar data={data} hideEmptyCategories onChange={setSelectedStatus} />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                    {selectedStatus ? `Selected: ${selectedStatus}` : 'Click a legend item or bar segment to select'}
                </Typography>
            </Box>
        </ExampleShowcase>
    );
};
