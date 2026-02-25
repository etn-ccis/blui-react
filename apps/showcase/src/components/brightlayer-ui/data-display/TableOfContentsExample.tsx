import React, { useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { TableOfContents, DrawerNavGroup, DrawerNavItem } from '@brightlayer-ui/react-components';
import { Home, Settings, Info, Notifications, Person } from '@mui/icons-material';
import Box from '@mui/material/Box';

const componentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    mb: 4,
};

const sectionTitleStyles = {
    mb: 2,
};

const contentSectionStyles = {
    p: 2,
    minHeight: 100,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    mb: 2,
};

export const TableOfContentsExample: React.FC = () => {
    const [activeItem1, setActiveItem1] = useState('home');
    const [activeItem2, setActiveItem2] = useState('notifications');
    const [activeItem3, setActiveItem3] = useState('general');

    const handleNavClick = useCallback((itemID: string, setActiveItem: (id: string) => void) => {
        setActiveItem(itemID);
        const element = document.getElementById(itemID);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <>
            <Box sx={componentContainerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Basic Usage
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ minWidth: 200 }}>
                        <TableOfContents activeItem={activeItem1}>
                            <DrawerNavGroup title="Navigation">
                                <DrawerNavItem title="Home" itemID="home" icon={<Home />} onClick={() => handleNavClick('home', setActiveItem1)} />
                                <DrawerNavItem title="Settings" itemID="settings" icon={<Settings />} onClick={() => handleNavClick('settings', setActiveItem1)} />
                                <DrawerNavItem title="About" itemID="about" icon={<Info />} onClick={() => handleNavClick('about', setActiveItem1)} />
                            </DrawerNavGroup>
                        </TableOfContents>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Box id="home" sx={contentSectionStyles}>
                            <Typography variant="h6">Home Section</Typography>
                            <Typography>Welcome to the home section content.</Typography>
                        </Box>
                        <Box id="settings" sx={contentSectionStyles}>
                            <Typography variant="h6">Settings Section</Typography>
                            <Typography>Configure your application settings here.</Typography>
                        </Box>
                        <Box id="about" sx={contentSectionStyles}>
                            <Typography variant="h6">About Section</Typography>
                            <Typography>Learn more about this application.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={componentContainerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Multiple Groups
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ minWidth: 200 }}>
                        <TableOfContents activeItem={activeItem2}>
                            <DrawerNavGroup title="Main">
                                <DrawerNavItem title="Home" itemID="home-2" icon={<Home />} onClick={() => handleNavClick('home-2', setActiveItem2)} />
                                <DrawerNavItem title="Profile" itemID="profile" icon={<Person />} onClick={() => handleNavClick('profile', setActiveItem2)} />
                            </DrawerNavGroup>
                            <DrawerNavGroup title="Other">
                                <DrawerNavItem title="Notifications" itemID="notifications" icon={<Notifications />} onClick={() => handleNavClick('notifications', setActiveItem2)} />
                                <DrawerNavItem title="Settings" itemID="settings-2" icon={<Settings />} onClick={() => handleNavClick('settings-2', setActiveItem2)} />
                            </DrawerNavGroup>
                        </TableOfContents>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Box id="home-2" sx={contentSectionStyles}>
                            <Typography variant="h6">Home</Typography>
                            <Typography>Main home section content.</Typography>
                        </Box>
                        <Box id="profile" sx={contentSectionStyles}>
                            <Typography variant="h6">Profile</Typography>
                            <Typography>View and edit your profile.</Typography>
                        </Box>
                        <Box id="notifications" sx={contentSectionStyles}>
                            <Typography variant="h6">Notifications</Typography>
                            <Typography>Manage your notification preferences.</Typography>
                        </Box>
                        <Box id="settings-2" sx={contentSectionStyles}>
                            <Typography variant="h6">Settings</Typography>
                            <Typography>Application settings and configuration.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={componentContainerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    With Nested Items
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ minWidth: 200 }}>
                        <TableOfContents activeItem={activeItem3}>
                            <DrawerNavGroup title="Settings">
                                <DrawerNavItem
                                    title="Account"
                                    itemID="account"
                                    icon={<Person />}
                                    onClick={() => handleNavClick('account', setActiveItem3)}
                                    items={[
                                        { title: 'General', itemID: 'general', onClick: () => handleNavClick('general', setActiveItem3) },
                                        { title: 'Security', itemID: 'security', onClick: () => handleNavClick('security', setActiveItem3) },
                                        { title: 'Privacy', itemID: 'privacy', onClick: () => handleNavClick('privacy', setActiveItem3) },
                                    ]}
                                />
                                <DrawerNavItem
                                    title="Notifications"
                                    itemID="notifications-settings"
                                    icon={<Notifications />}
                                    onClick={() => handleNavClick('notifications-settings', setActiveItem3)}
                                    items={[
                                        { title: 'Email', itemID: 'email', onClick: () => handleNavClick('email', setActiveItem3) },
                                        { title: 'Push', itemID: 'push', onClick: () => handleNavClick('push', setActiveItem3) },
                                    ]}
                                />
                            </DrawerNavGroup>
                        </TableOfContents>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Box id="account" sx={contentSectionStyles}>
                            <Typography variant="h6">Account</Typography>
                            <Typography>Manage your account settings.</Typography>
                        </Box>
                        <Box id="general" sx={contentSectionStyles}>
                            <Typography variant="h6">General</Typography>
                            <Typography>General account preferences.</Typography>
                        </Box>
                        <Box id="security" sx={contentSectionStyles}>
                            <Typography variant="h6">Security</Typography>
                            <Typography>Security and authentication settings.</Typography>
                        </Box>
                        <Box id="privacy" sx={contentSectionStyles}>
                            <Typography variant="h6">Privacy</Typography>
                            <Typography>Privacy controls and data settings.</Typography>
                        </Box>
                        <Box id="notifications-settings" sx={contentSectionStyles}>
                            <Typography variant="h6">Notifications</Typography>
                            <Typography>Notification preferences.</Typography>
                        </Box>
                        <Box id="email" sx={contentSectionStyles}>
                            <Typography variant="h6">Email</Typography>
                            <Typography>Email notification settings.</Typography>
                        </Box>
                        <Box id="push" sx={contentSectionStyles}>
                            <Typography variant="h6">Push</Typography>
                            <Typography>Push notification settings.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
