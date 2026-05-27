import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';

const sectionTitleStyles = { mb: 1 };
const containerStyles = { mb: 4 };

const combinedData = [
    { label: 'Failed', variant: 'failed' as const, count: 10 },
    { label: 'Cancelled', variant: 'canceled' as const, count: 30 },
    { label: 'Deployed', variant: 'success' as const, count: 19 },
    { label: 'Deploying', variant: 'info' as const, count: 10 },
    { label: 'Pending', variant: 'pending' as const, count: 40 },
];

const equalData = [
    { label: 'Failed', variant: 'failed' as const, count: 20 },
    { label: 'Cancelled', variant: 'canceled' as const, count: 20 },
    { label: 'Deployed', variant: 'success' as const, count: 20 },
    { label: 'Deploying', variant: 'info' as const, count: 20 },
    { label: 'Pending', variant: 'pending' as const, count: 20 },
];

const emptyData = [
    { label: 'Failed', variant: 'failed' as const, count: 0 },
    { label: 'Cancelled', variant: 'canceled' as const, count: 0 },
    { label: 'Deployed', variant: 'success' as const, count: 0 },
    { label: 'Deploying', variant: 'info' as const, count: 0 },
    { label: 'Pending', variant: 'pending' as const, count: 0 },
];

const singleData = [{ label: 'Deployed', variant: 'success' as const, count: 150 }];

const customColorData = [
    { label: 'Alpha', backgroundColor: '#6200ea', count: 25 },
    { label: 'Beta', backgroundColor: '#00bfa5', count: 45 },
    { label: 'Gamma', backgroundColor: '#ff6d00', count: 30 },
    { label: 'Delta', backgroundColor: '#2962ff', count: 50 },
];

const customIconData = [
    {
        label: 'Success',
        variant: 'success' as const,
        icon: <CheckCircleIcon fontSize="small" />,
        disabledIcon: <CheckCircleIcon fontSize="small" />,
        count: 40,
    },
    {
        label: 'Failed',
        variant: 'failed' as const,
        icon: <CancelIcon fontSize="small" />,
        disabledIcon: <CancelIcon fontSize="small" />,
        count: 0,
    },
    {
        label: 'Pending',
        variant: 'pending' as const,
        icon: <HourglassEmptyIcon fontSize="small" />,
        disabledIcon: <HourglassEmptyIcon fontSize="small" />,
        count: 30,
    },
];

const mixedData = [
    { label: 'Failed', variant: 'failed' as const, count: 10 },
    { label: 'Custom Blue', backgroundColor: '#1565c0', count: 35 },
    { label: 'Success', variant: 'success' as const, count: 25 },
    { label: 'Custom Orange', backgroundColor: '#e65100', count: 20 },
    { label: 'Pending', variant: 'pending' as const, count: 10 },
];

const controlledStatuses = ['Failed', 'Cancelled', 'Deploying', 'Pending'];

const InteractiveExample: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    return (
        <Box>
            <HorizontalStackedBar
                data={combinedData}
                hideEmptyCategories
                onChange={(label): void => setSelectedStatus(label)}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                {selectedStatus ? `Selected: ${selectedStatus}` : 'Click a legend item or bar segment to select'}
            </Typography>
        </Box>
    );
};

const ControlledExample: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {controlledStatuses.map((status) => (
                    <Chip
                        key={status}
                        label={status}
                        size="small"
                        color={selectedStatus === status ? 'primary' : 'default'}
                        onClick={(): void => setSelectedStatus((prev) => (prev === status ? '' : status))}
                    />
                ))}
            </Box>
            <HorizontalStackedBar
                data={combinedData}
                hideEmptyCategories
                selectedStatus={selectedStatus}
                onChange={(label): void => setSelectedStatus(label)}
            />
        </Box>
    );
};

export const HorizontalStackedBarExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Default (Show All Categories)
            </Typography>
            <HorizontalStackedBar data={combinedData} />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Hide Empty Categories
            </Typography>
            <HorizontalStackedBar data={combinedData} hideEmptyCategories />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Interactive (Uncontrolled Selection)
            </Typography>
            <InteractiveExample />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Controlled Selection
            </Typography>
            <ControlledExample />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Custom Colors
            </Typography>
            <HorizontalStackedBar data={customColorData} />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Custom Icons
            </Typography>
            <HorizontalStackedBar data={customIconData} hideEmptyCategories />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Single Category
            </Typography>
            <HorizontalStackedBar data={singleData} />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                All Equal Counts
            </Typography>
            <HorizontalStackedBar data={equalData} />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Empty State (All Zero Counts)
            </Typography>
            <HorizontalStackedBar data={emptyData} />
        </Box>

        <Box sx={containerStyles}>
            <Typography variant="body1" sx={sectionTitleStyles}>
                Mixed: Variants + Custom Colors
            </Typography>
            <HorizontalStackedBar data={mixedData} />
        </Box>
    </Box>
);
