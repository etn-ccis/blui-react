import React, { useState } from 'react';
import {
    Drawer,
    DrawerLite,
    DrawerBody,
    DrawerNavGroup,
    DrawerNavItem,
    DrawerHeader,
} from '@brightlayer-ui/react-components';
import Box from '@mui/material/Box';
import Dashboard from '@mui/icons-material/Dashboard';
import Notifications from '@mui/icons-material/Notifications';
import Gavel from '@mui/icons-material/Gavel';
import Menu from '@mui/icons-material/Menu';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
import Help from '@mui/icons-material/Help';
import Info from '@mui/icons-material/Info';
import Security from '@mui/icons-material/Security';
import Tune from '@mui/icons-material/Tune';
import Email from '@mui/icons-material/Email';
import Sms from '@mui/icons-material/Sms';
import { ExampleShowcase } from '../../../shared';

type SubNavConfig = {
    title: string;
    items: Array<{ title: string; icon: React.JSX.Element; itemID: string }>;
};

const subNavConfigs: Record<string, SubNavConfig> = {
    home: {
        title: 'Home',
        items: [
            { title: 'Overview', icon: <Dashboard />, itemID: 'overview' },
            { title: 'Recent Activity', icon: <Info />, itemID: 'recent' },
            { title: 'Quick Stats', icon: <Tune />, itemID: 'stats' },
        ],
    },
    notifications: {
        title: 'Notifications',
        items: [
            { title: 'All Alerts', icon: <Notifications />, itemID: 'all-alerts' },
            { title: 'Email', icon: <Email />, itemID: 'email' },
            { title: 'SMS', icon: <Sms />, itemID: 'sms' },
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
    profile: {
        title: 'Profile',
        items: [
            { title: 'Account Info', icon: <Person />, itemID: 'account-info' },
            { title: 'Privacy', icon: <Security />, itemID: 'privacy' },
        ],
    },
    help: {
        title: 'Help',
        items: [
            { title: 'FAQ', icon: <Help />, itemID: 'faq' },
            { title: 'Contact Us', icon: <Email />, itemID: 'contact' },
            { title: 'Legal', icon: <Gavel />, itemID: 'legal' },
        ],
    },
};

export const DrawerLiteExample = (): React.JSX.Element => {
    const [selectedNav, setSelectedNav] = useState('home');
    const [activeSubItem, setActiveSubItem] = useState('overview');

    const currentSubNav = subNavConfigs[selectedNav];

    const handleMainNavClick = (id: string): void => {
        setSelectedNav(id);
        setActiveSubItem(subNavConfigs[id].items[0].itemID);
    };

    const handleSubNavClick = (id: string): void => {
        setActiveSubItem(id);
    };

    return (
        <ExampleShowcase>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    height: 300,
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
                                title="Notifications"
                                icon={<Notifications />}
                                itemID="notifications"
                                onClick={(): void => handleMainNavClick('notifications')}
                            />
                            <DrawerNavItem
                                title="Settings"
                                icon={<Settings />}
                                itemID="settings"
                                onClick={(): void => handleMainNavClick('settings')}
                            />
                            <DrawerNavItem
                                title="Profile"
                                icon={<Person />}
                                itemID="profile"
                                onClick={(): void => handleMainNavClick('profile')}
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
                                        onClick={(): void => handleSubNavClick(item.itemID)}
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
                    <h3>{currentSubNav.items.find((i) => i.itemID === activeSubItem)?.title}</h3>
                    <p>Content for {activeSubItem} section.</p>
                </Box>
            </Box>
        </ExampleShowcase>
    );
};
