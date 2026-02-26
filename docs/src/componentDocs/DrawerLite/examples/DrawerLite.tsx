import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { DrawerLiteExample } from './DrawerLiteExample';

const codeSnippet = `const [selectedNav, setSelectedNav] = useState('home');
const [activeSubItem, setActiveSubItem] = useState('overview');

// Define sub-navigation for each main nav item
const subNavConfigs = {
    home: {
        title: 'Home',
        items: [
            { title: 'Overview', icon: <Dashboard />, itemID: 'overview' },
            { title: 'Recent Activity', icon: <Info />, itemID: 'recent' },
        ],
    },
    settings: {
        title: 'Settings',
        items: [
            { title: 'General', icon: <Settings />, itemID: 'general' },
            { title: 'Security', icon: <Security />, itemID: 'security' },
        ],
    },
};

const currentSubNav = subNavConfigs[selectedNav];

<Box sx={{ display: 'flex' }}>
    <Drawer open={true} width={200} noLayout activeItem={selectedNav}>
        <DrawerHeader title="Main Nav" icon={<Menu />} />
        <DrawerBody>
            <DrawerNavGroup>
                <DrawerNavItem
                    title="Home"
                    icon={<Dashboard />}
                    itemID="home"
                    onClick={() => setSelectedNav('home')}
                />
                <DrawerNavItem
                    title="Settings"
                    icon={<Settings />}
                    itemID="settings"
                    onClick={() => setSelectedNav('settings')}
                />
            </DrawerNavGroup>
        </DrawerBody>
    </Drawer>
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
    </DrawerLite>
    <Box sx={{ flex: 1, p: 2 }}>
        Content for {activeSubItem}
    </Box>
</Box>`;

export const DrawerLite = (): React.JSX.Element => (
    <Box>
        <DrawerLiteExample />
        <CodeBlock code={codeSnippet} language="jsx" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DrawerLite/examples/DrawerLiteExample.tsx"
        />
    </Box>
);
