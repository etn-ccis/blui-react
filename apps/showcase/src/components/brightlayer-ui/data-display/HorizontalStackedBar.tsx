import React from 'react';
import Box from '@mui/material/Box';
import { HorizontalBar, Legend, HorizontalStackedBar } from '@brightlayer-ui/react-components';

const legendData = [
    { label: 'Failed', variant: 'failed' as const, count: 0 },
    { label: 'Cancelled', variant: 'canceled' as const, count: 0 },
    { label: 'Deployed', variant: 'success' as const, count: 0 },
    { label: 'Deploying', variant: 'info' as const, count: 0 },
    { label: 'Pending', variant: 'pending' as const, count: 0 },
    { label: 'Warning', variant: 'warning' as const, count: 25 },
];

const horizontalBarData = [
    { name: 'Failed', variant: 'failed' as const, barPercentage: 0 },
    { name: 'Cancelled', variant: 'canceled' as const, barPercentage: 0 },
    { name: 'Deployed', variant: 'success' as const, barPercentage: 0 },
    { name: 'Deploying', variant: 'info' as const, barPercentage: 0 },
    { name: 'Pending', variant: 'pending' as const, barPercentage: 0 },
    { name: 'Warning', variant: 'warning' as const, barPercentage: 100 },
];

const combinedData = [
    { label: 'Failed', variant: 'failed' as const, count: 10 },
    { label: 'Cancelled', variant: 'canceled' as const, count: 30 },
    { label: 'Deployed', variant: 'success' as const, count: 20 },
    { label: 'Deploying', variant: 'info' as const, count: 50 },
    { label: 'Pending', variant: 'pending' as const, count: 40 },
    { label: 'Warning', variant: 'warning' as const, count: 60 },
];

export const HorizontalStackedBarExample: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = React.useState<string>('');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Combined Component Example */}
            <Box>
                <h3>Combined Component</h3>
                <HorizontalStackedBar data={combinedData} />
            </Box>

            {/* Separate Components Example */}
            <Box>
                <h3>Separate Components</h3>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowX: 'auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '4px',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {legendData.map((item) => (
                            <Legend
                                key={item.label}
                                label={item.label}
                                count={item.count}
                                variant={item.variant}
                                selectedStatus={selectedStatus}
                                onClick={(): void => {
                                    setSelectedStatus(selectedStatus !== item.label ? item.label : '');
                                }}
                            />
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                        {horizontalBarData.map((bar) => (
                            <HorizontalBar
                                key={bar.name}
                                name={bar.name}
                                variant={bar.variant}
                                barPercentage={bar.barPercentage}
                                selectedStatus={selectedStatus}
                                onClick={(): void => {
                                    setSelectedStatus(selectedStatus !== bar.name ? bar.name : '');
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
