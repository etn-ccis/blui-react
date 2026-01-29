import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolbarMenu, AppBar } from '@brightlayer-ui/react-components';
import { Home, LocationOn, Devices, AccountCircle, Settings, Notifications, Business, Menu } from '@mui/icons-material';
import { action } from 'storybook/actions';
import { Toolbar, IconButton, ListItemText, Typography, Box } from '@mui/material';
import * as Colors from '@brightlayer-ui/colors';

const meta = {
    component: ToolbarMenu,
    argTypes: {
        label: { control: 'text' },
        icon: {
            control: 'select',
            options: [
                'None',
                'Home',
                'LocationOn',
                'Devices',
                'AccountCircle',
                'Settings',
                'Notifications',
                'Business',
            ],
            mapping: {
                None: undefined,
                Home: <Home />,
                LocationOn: <LocationOn />,
                Devices: <Devices />,
                AccountCircle: <AccountCircle />,
                Settings: <Settings />,
                Notifications: <Notifications />,
                Business: <Business />,
            },
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ToolbarMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            menuGroups={[
                {
                    items: [
                        { title: 'Item 1', onClick: action('Item 1 Clicked') },
                        { title: 'Item 2', onClick: action('Item 2 Clicked') },
                        { title: 'Item 3', onClick: action('Item 3 Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'label',
    },
} satisfies Story;

export const WithIcon: Story = {
    render: ({ label, icon }) => (
        <ToolbarMenu
            label={label}
            icon={icon}
            menuGroups={[
                {
                    items: [
                        { title: 'London', onClick: action('London Clicked') },
                        { title: 'New York', onClick: action('New York Clicked') },
                        { title: 'New Haven', onClick: action('New Haven Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'My Home',
        icon: 'Home',
    },
} satisfies Story;

export const WithMultipleGroups: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            menuGroups={[
                {
                    title: 'North America',
                    items: [
                        { title: 'New York', onClick: action('New York Clicked') },
                        { title: 'Los Angeles', onClick: action('Los Angeles Clicked') },
                        { title: 'Chicago', onClick: action('Chicago Clicked') },
                    ],
                },
                {
                    title: 'Europe',
                    items: [
                        { title: 'London', onClick: action('London Clicked') },
                        { title: 'Paris', onClick: action('Paris Clicked') },
                        { title: 'Berlin', onClick: action('Berlin Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'Locations',
    },
} satisfies Story;

export const WithItemIcons: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            menuGroups={[
                {
                    items: [
                        { title: 'Home', icon: <Home />, onClick: action('Home Clicked') },
                        { title: 'Devices', icon: <Devices />, onClick: action('Devices Clicked') },
                        { title: 'Settings', icon: <Settings />, onClick: action('Settings Clicked') },
                        { title: 'Notifications', icon: <Notifications />, onClick: action('Notifications Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'Menu',
    },
} satisfies Story;

export const WithinToolbar: Story = {
    render: ({ label }) => (
        <Box sx={{ width: '100%', minWidth: 350 }}>
            <AppBar
                variant="collapsed"
                sx={{
                    zIndex: 'auto',
                }}
            >
                <Toolbar>
                    <IconButton sx={{ mr: 3 }} color="inherit" edge="start">
                        <Menu />
                    </IconButton>
                    <ListItemText
                        disableTypography
                        primary={<Typography variant="h6">Alarms</Typography>}
                        secondary={
                            <ToolbarMenu
                                sx={{ color: Colors.white[50], mt: -1 }}
                                label={label}
                                menuGroups={[
                                    {
                                        items: [
                                            { title: 'Location 1', onClick: action('Location 1 Clicked') },
                                            { title: 'Location 2', onClick: action('Location 2 Clicked') },
                                            { title: 'Location 3', onClick: action('Location 3 Clicked') },
                                        ],
                                    },
                                ]}
                            />
                        }
                    />
                </Toolbar>
            </AppBar>
        </Box>
    ),
    args: {
        label: 'Location',
    },
} satisfies Story;

export const WithCustomColors: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            menuGroups={[
                {
                    fontColor: Colors.blue[500],
                    iconColor: Colors.blue[500],
                    items: [
                        { title: 'Blue Item 1', icon: <Home />, onClick: action('Blue Item 1 Clicked') },
                        { title: 'Blue Item 2', icon: <LocationOn />, onClick: action('Blue Item 2 Clicked') },
                    ],
                },
                {
                    fontColor: Colors.red[500],
                    iconColor: Colors.red[500],
                    items: [
                        { title: 'Red Item 1', icon: <Devices />, onClick: action('Red Item 1 Clicked') },
                        { title: 'Red Item 2', icon: <Settings />, onClick: action('Red Item 2 Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'Colored Menu',
    },
} satisfies Story;

export const WithCallbacks: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            onOpen={action('Menu Opened')}
            onClose={action('Menu Closed')}
            menuGroups={[
                {
                    items: [
                        { title: 'Item 1', onClick: action('Item 1 Clicked') },
                        { title: 'Item 2', onClick: action('Item 2 Clicked') },
                        { title: 'Item 3', onClick: action('Item 3 Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'Interactive Menu',
    },
} satisfies Story;

export const WithTypographyVariant: Story = {
    render: ({ label }) => (
        <ToolbarMenu
            label={label}
            variant="h6"
            color="primary"
            menuGroups={[
                {
                    items: [
                        { title: 'Item 1', onClick: action('Item 1 Clicked') },
                        { title: 'Item 2', onClick: action('Item 2 Clicked') },
                        { title: 'Item 3', onClick: action('Item 3 Clicked') },
                    ],
                },
            ]}
        />
    ),
    args: {
        label: 'Large Menu',
    },
} satisfies Story;
