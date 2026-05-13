import React from 'react';
import { HorizontalBar, Legend } from '@brightlayer-ui/react-components';
import Box from '@mui/material/Box';
import { Cancel, CheckCircle, Error, Pending, PlayCircle } from '@mui/icons-material';

const LegendData = [
    { label: 'Failed', icon: <Error fontSize="medium" />, backgroundColor: '#CA3C3D', count: 5 },
    { label: 'Cancelled', icon: <Cancel fontSize="medium" />, backgroundColor: '#F2B741', count: 16 },
    { label: 'Deployed', icon: <CheckCircle fontSize="medium" />, backgroundColor: '#2CA618', count: 45 },
    { label: 'Deploying', icon: <PlayCircle fontSize="medium" />, backgroundColor: '#0075EE', count: 3 },
    { label: 'Pending', icon: <Pending fontSize="medium" />, backgroundColor: '#424E54', count: 80 },
];

const horizontalBarData = [
    { name: 'Failed', color: '#CA3C3D', barPercentage: 25 },
    { name: 'Cancelled', color: '#F2B741', barPercentage: 75 },
    { name: 'Deployed', color: '#2CA618', barPercentage: 75 },
    { name: 'Deploying', color: '#0075EE', barPercentage: 200 },
    { name: 'Pending', color: '#424E54', barPercentage: 125 },
];

export const HorizontalBarExample: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = React.useState<string>('');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {LegendData.map((item) => (
                    <Legend
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        count={item.count}
                        backgroundColor={item.backgroundColor}
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
                        color={bar.color}
                        barPercentage={bar.barPercentage}
                        selectedStatus={selectedStatus}
                        onClick={(): void => {
                            setSelectedStatus(selectedStatus !== bar.name ? bar.name : '');
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};
