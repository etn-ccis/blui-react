import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    DrawerFooter,
    Drawer,
    DrawerHeader,
    DrawerBody,
    DrawerNavGroup,
    DrawerNavItem,
} from '@brightlayer-ui/react-components';
import { Menu, Dashboard, Notifications, Settings, Person, Today } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import * as Colors from '@brightlayer-ui/colors';
import EatonFooterLogoLight from '../../../themeShowcase/src/EatonLogoLight.png';

const meta = {
    component: DrawerFooter,
    argTypes: {
        backgroundColor: { control: 'color' },
        divider: { control: 'boolean' },
        hideContentOnCollapse: { control: 'boolean' },
    },
    parameters: {
        layout: 'centered',
    },
    decorators: [(story): React.ReactElement => <Box sx={{ height: '600px', display: 'flex' }}>{story()}</Box>],
} satisfies Meta<typeof DrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBasicUsage: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Basic Footer" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Notifications />} title="Notifications" itemID="notifications" />
                    <DrawerNavItem icon={<Settings />} title="Settings" itemID="settings" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2">Footer Content</Typography>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithVersionInfo: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Version Info" subtitle="Application Footer" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Person />} title="Profile" itemID="profile" />
                    <DrawerNavItem icon={<Today />} title="Calendar" itemID="calendar" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                        Version 2.4.0
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                        Build 10:33:05 03/12/22
                    </Typography>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithCopyrightInfo: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Copyright" subtitle="Legal Information" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Notifications />} title="Notifications" itemID="notifications" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Copyright © Eaton 2026
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        All Rights Reserved
                    </Typography>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithCustomBackground: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Custom Footer" subtitle="With Background Color" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Settings />} title="Settings" itemID="settings" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Application Footer
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                        Custom styled content
                    </Typography>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        backgroundColor: Colors.blue[50],
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithNoDivider: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="No Divider" subtitle="Footer without separator" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Person />} title="Profile" itemID="profile" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Box>
                    <Typography variant="body2">Footer without divider</Typography>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: false,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithActionButton: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={300} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Action Button" subtitle="Interactive Footer" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Settings />} title="Settings" itemID="settings" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Button variant="outlined" sx={{ width: '260px' }}>
                    Sign Out
                </Button>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;

export const WithComplexContent: Story = {
    render: ({ backgroundColor, divider, hideContentOnCollapse }) => (
        <Drawer open width={320} noLayout sx={{ minHeight: 'unset' }}>
            <DrawerHeader icon={<Menu />} title="Complex Footer" subtitle="Multiple content sections" />
            <DrawerBody sx={{ flex: '1 1 auto' }}>
                <DrawerNavGroup>
                    <DrawerNavItem icon={<Dashboard />} title="Dashboard" itemID="dashboard" />
                    <DrawerNavItem icon={<Today />} title="Calendar" itemID="calendar" />
                    <DrawerNavItem icon={<Person />} title="Profile" itemID="profile" />
                </DrawerNavGroup>
            </DrawerBody>
            <DrawerFooter
                backgroundColor={backgroundColor}
                divider={divider}
                hideContentOnCollapse={hideContentOnCollapse}
                sx={{ p: 2 }}
            >
                <Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                            v2.4.0
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                            10:33:05 03/12/22
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: 83 }} component="img" src={EatonFooterLogoLight} alt="Eaton Logo" />
                        <Box sx={{ paddingRight: '35px' }}>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                                Copyright © Eaton
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                                All Rights Reserved
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DrawerFooter>
        </Drawer>
    ),
    args: {
        divider: true,
        hideContentOnCollapse: true,
    },
} satisfies Story;
