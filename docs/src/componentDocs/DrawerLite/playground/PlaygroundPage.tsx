import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { InputConfig, PreviewComponent, CodeSnippetFunction, Playground } from '@brightlayer-ui/react-doc-components';
import Stack from '@mui/material/Stack';
import {
    Drawer,
    DrawerLite,
    DrawerBody,
    DrawerNavGroup,
    DrawerNavItem,
    DrawerHeader,
} from '@brightlayer-ui/react-components';
import Dashboard from '@mui/icons-material/Dashboard';
import Notifications from '@mui/icons-material/Notifications';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';
import Help from '@mui/icons-material/Help';
import Menu from '@mui/icons-material/Menu';
import Info from '@mui/icons-material/Info';
import Security from '@mui/icons-material/Security';
import Tune from '@mui/icons-material/Tune';
import Email from '@mui/icons-material/Email';
import Sms from '@mui/icons-material/Sms';
import Gavel from '@mui/icons-material/Gavel';

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

const inputConfig: InputConfig = [
    // Optional Props
    {
        id: 'mainNav',
        type: 'select',
        typeLabel: 'string',
        description: 'Select the main navigation item to see different DrawerLite sub-navigation',
        initialValue: 'home',
        options: ['home', 'notifications', 'settings', 'profile', 'help'],
        required: false,
        category: 'Configuration',
    },
];

const DrawerLitePreview: PreviewComponent = ({ data }) => {
    const selectedNav = data.mainNav as string;
    const currentSubNav = subNavConfigs[selectedNav] || subNavConfigs.home;
    const [activeSubItem, setActiveSubItem] = useState(currentSubNav.items[0].itemID);

    // Update active sub-item when main nav changes
    React.useEffect(() => {
        const subNav = subNavConfigs[data.mainNav as string] || subNavConfigs.home;
        setActiveSubItem(subNav.items[0].itemID);
    }, [data.mainNav]);

    const handleSubNavClick = (id: string): void => {
        setActiveSubItem(id);
    };

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: 600,
                    height: 300,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Drawer open={true} width={180} noLayout activeItem={selectedNav}>
                    <DrawerHeader title="Main Nav" icon={<Menu />} />
                    <DrawerBody>
                        <DrawerNavGroup>
                            <DrawerNavItem title="Home" icon={<Dashboard />} itemID="home" />
                            <DrawerNavItem title="Notifications" icon={<Notifications />} itemID="notifications" />
                            <DrawerNavItem title="Settings" icon={<Settings />} itemID="settings" />
                            <DrawerNavItem title="Profile" icon={<Person />} itemID="profile" />
                            <DrawerNavItem title="Help" icon={<Help />} itemID="help" />
                        </DrawerNavGroup>
                    </DrawerBody>
                </Drawer>
                <Box
                    sx={{
                        width: 180,
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
                    <h4>{currentSubNav.items.find((i) => i.itemID === activeSubItem)?.title}</h4>
                    <p>Content for {activeSubItem} section.</p>
                </Box>
            </Box>
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const mainNav = data.mainNav as string;
    const subNav = subNavConfigs[mainNav] || subNavConfigs.home;
    const subItems = subNav.items
        .map((item) => `{ title: '${item.title}', itemID: '${item.itemID}' }`)
        .join(',\n            ');

    return `// Dynamic sub-navigation based on main nav selection
const subNavConfigs = {
    ${mainNav}: {
        title: '${subNav.title}',
        items: [
            ${subItems}
        ],
    },
    // ... other nav configs
};

const selectedNav = '${mainNav}';
const currentSubNav = subNavConfigs[selectedNav];

<DrawerLite activeItem={activeSubItem}>
    <DrawerBody>
        <DrawerNavGroup title={currentSubNav.title}>
            {currentSubNav.items.map((item) => (
                <DrawerNavItem
                    key={item.itemID}
                    title={item.title}
                    icon={item.icon}
                    itemID={item.itemID}
                    onClick={() => setActiveSubItem(item.itemID)}
                />
            ))}
        </DrawerNavGroup>
    </DrawerBody>
</DrawerLite>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const DrawerLitePlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={DrawerLitePreview} />
    </Box>
);
