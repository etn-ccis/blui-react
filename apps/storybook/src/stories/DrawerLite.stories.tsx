import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    DrawerLite,
    Drawer,
    DrawerHeader,
    DrawerBody,
    DrawerNavGroup,
    DrawerNavItem,
} from '@brightlayer-ui/react-components';
import {
    Menu,
    Dashboard,
    Notifications,
    Settings,
    Person,
    Help,
    Info,
    Security,
    Tune,
    Email,
    Gavel,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

type DrawerLiteStoryProps = {
    activeItem: string;
};

const meta: Meta<DrawerLiteStoryProps> = {
    title: 'Components/DrawerLite',
    argTypes: {
        activeItem: {
            control: 'select',
            options: ['overview', 'recent', 'stats', 'general', 'security', 'preferences'],
        },
    },
    parameters: {
        layout: 'centered',
    },
    decorators: [(story): React.ReactElement => <Box sx={{ height: '400px', display: 'flex' }}>{story()}</Box>],
};

export default meta;
type Story = StoryObj<DrawerLiteStoryProps>;

export const BasicUsage: Story = {
    render: ({ activeItem }) => (
        <Box
            sx={{
                width: 250,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <DrawerLite activeItem={activeItem}>
                <DrawerBody>
                    <DrawerNavGroup title="Navigation">
                        <DrawerNavItem title="Overview" icon={<Dashboard />} itemID="overview" />
                        <DrawerNavItem title="Recent" icon={<Info />} itemID="recent" />
                        <DrawerNavItem title="Stats" icon={<Tune />} itemID="stats" />
                    </DrawerNavGroup>
                </DrawerBody>
            </DrawerLite>
        </Box>
    ),
    args: {
        activeItem: 'overview',
    },
};

export const WithMainDrawer: Story = {
    render: () => {
        const [selectedNav, setSelectedNav] = useState('home');
        const [activeSubItem, setActiveSubItem] = useState('overview');

        const subNavConfigs: Record<
            string,
            { title: string; items: Array<{ title: string; icon: React.ReactElement; itemID: string }> }
        > = {
            home: {
                title: 'Home',
                items: [
                    { title: 'Overview', icon: <Dashboard />, itemID: 'overview' },
                    { title: 'Recent Activity', icon: <Info />, itemID: 'recent' },
                    { title: 'Quick Stats', icon: <Tune />, itemID: 'stats' },
                ],
            },
            settings: {
                title: 'Settings',
                items: [
                    { title: 'General', icon: <Settings />, itemID: 'general' },
                    { title: 'Security', icon: <Security />, itemID: 'security' },
                    { title: 'Preferences', icon: <Tune />, itemID: 'preferences' },
                ],
            },
            help: {
                title: 'Help',
                items: [
                    { title: 'FAQ', icon: <Help />, itemID: 'faq' },
                    { title: 'Contact', icon: <Email />, itemID: 'contact' },
                    { title: 'Legal', icon: <Gavel />, itemID: 'legal' },
                ],
            },
        };

        const currentSubNav = subNavConfigs[selectedNav];

        const handleMainNavClick = (id: string): void => {
            setSelectedNav(id);
            setActiveSubItem(subNavConfigs[id].items[0].itemID);
        };

        return (
            <Box
                sx={{
                    display: 'flex',
                    width: 600,
                    height: 350,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Drawer open={true} width={200} noLayout activeItem={selectedNav}>
                    <DrawerHeader title="Main Nav" icon={<Menu />} />
                    <DrawerBody>
                        <DrawerNavGroup>
                            <DrawerNavItem
                                title="Home"
                                icon={<Dashboard />}
                                itemID="home"
                                onClick={(): void => handleMainNavClick('home')}
                            />
                            <DrawerNavItem
                                title="Settings"
                                icon={<Settings />}
                                itemID="settings"
                                onClick={(): void => handleMainNavClick('settings')}
                            />
                            <DrawerNavItem
                                title="Help"
                                icon={<Help />}
                                itemID="help"
                                onClick={(): void => handleMainNavClick('help')}
                            />
                        </DrawerNavGroup>
                    </DrawerBody>
                </Drawer>
                <Box
                    sx={{
                        width: 200,
                        backgroundColor: 'background.paper',
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <DrawerLite activeItem={activeSubItem}>
                        <DrawerBody>
                            <DrawerNavGroup title={currentSubNav.title}>
                                {currentSubNav.items.map((item) => (
                                    <DrawerNavItem
                                        key={item.itemID}
                                        title={item.title}
                                        icon={item.icon}
                                        itemID={item.itemID}
                                        onClick={(): void => setActiveSubItem(item.itemID)}
                                    />
                                ))}
                            </DrawerNavGroup>
                        </DrawerBody>
                    </DrawerLite>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: 'background.paper',
                        p: 2,
                    }}
                >
                    <Typography variant="h6">
                        {currentSubNav.items.find((i) => i.itemID === activeSubItem)?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Content for {activeSubItem} section.
                    </Typography>
                </Box>
            </Box>
        );
    },
};

export const MultipleNavGroups: Story = {
    render: ({ activeItem }) => (
        <Box
            sx={{
                width: 280,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <DrawerLite activeItem={activeItem}>
                <DrawerBody>
                    <DrawerNavGroup title="Main">
                        <DrawerNavItem title="Overview" icon={<Dashboard />} itemID="overview" />
                        <DrawerNavItem title="Notifications" icon={<Notifications />} itemID="notifications" />
                    </DrawerNavGroup>
                    <DrawerNavGroup title="Settings">
                        <DrawerNavItem title="General" icon={<Settings />} itemID="general" />
                        <DrawerNavItem title="Security" icon={<Security />} itemID="security" />
                        <DrawerNavItem title="Profile" icon={<Person />} itemID="profile" />
                    </DrawerNavGroup>
                </DrawerBody>
            </DrawerLite>
        </Box>
    ),
    args: {
        activeItem: 'overview',
    },
};
