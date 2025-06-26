import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, type EmptyStateProps } from '@brightlayer-ui/react-components';
import {
    NotListedLocation,
    Close,
    Add,
    Devices,
    LocationOff,
    HelpOutline,
    ExpandMore,
    TrendingUp,
} from '@mui/icons-material';
import { action } from 'storybook/actions';
import { Button, Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import { blueThemes } from '@brightlayer-ui/react-themes';
import * as Colors from '@brightlayer-ui/colors';

const meta = {
    component: EmptyState,
    argTypes: {
        title: { control: 'text' },
        icon: {
            control: 'select',
            options: ['Close', 'NotListedLocation', 'Devices', 'LocationOff', 'HelpOutline', 'TrendingUp'],
            mapping: {
                Close: <Close fontSize="inherit" />,
                NotListedLocation: <NotListedLocation fontSize="inherit" />,
                Devices: <Devices fontSize="inherit" />,
                LocationOff: <LocationOff fontSize="inherit" />,
                HelpOutline: <HelpOutline fontSize="inherit" />,
                TrendingUp: <TrendingUp fontSize="inherit" />,
            },
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic = {
    render: ({ title, icon }) => <EmptyState title={title} icon={icon} />,
    args: {
        title: 'Location Unknown',
        icon: 'NotListedLocation',
    },
} satisfies Story;

export const Actions = {
    render: ({ title, icon, actions }) => <EmptyState title={title} icon={icon} actions={actions} />,
    args: {
        title: 'No Devices',
        icon: 'Devices',
        actions: (
            <Button variant={'outlined'} color={'primary'} onClick={action('Button Clicked')} startIcon={<Add />}>
                Action Text
            </Button>
        ),
    },
} satisfies Story;

export const Description = {
    render: ({ title, icon, description }) => <EmptyState title={title} icon={icon} description={description} />,
    args: {
        title: 'Location Services Disabled',
        icon: 'LocationOff',
        description: 'Enable Location Services via Settings to receive GPS information',
    },
} satisfies Story;

const CardEmptyStateRenderer = (args: EmptyStateProps) => {
    const { title, icon, actions, description } = args;
    const [expanded, setExpanded] = React.useState(false);
    const theme = blueThemes;

    return (
        <div style={{ margin: '0 auto', width: '392px' }}>
            <Accordion
                expanded={expanded}
                sx={{
                    '& .MuiAccordionSummary-root': {
                        height: '48px',
                        minHeight: '48px',
                        '&.Mui-expanded': {
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        },
                    },
                }}
                onChange={(): void => setExpanded(!expanded)}
            >
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography variant={'subtitle2'} sx={{ color: Colors.blue[500] }}>
                        Device Usage
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 5, py: 3 }}>
                    <EmptyState icon={icon} title={title} actions={actions} />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export const Card = {
    render: ({ title, icon, actions }) => <CardEmptyStateRenderer title={title} icon={icon} actions={actions} />,
    args: {
        title: 'No Devices Found',
        icon: 'HelpOutline',
        actions: (
            <Button variant={'outlined'} color={'primary'} onClick={action('Button Clicked')} startIcon={<Add />}>
                Action Text
            </Button>
        ),
    },
} satisfies Story;

export const FullConfig = {
    render: ({ title, icon, actions, description }) => (
        <EmptyState title={title} icon={icon} actions={actions} description={description} />
    ),
    args: {
        title: 'Predictions Page Coming Soon',
        icon: 'TrendingUp',
        description: 'A fully redesigned predictions page is coming in our next release!',
        actions: (
            <Button variant={'outlined'} color={'primary'} onClick={action('Button Clicked')} startIcon={<Add />}>
                Learn More
            </Button>
        ),
    },
} satisfies Story;
