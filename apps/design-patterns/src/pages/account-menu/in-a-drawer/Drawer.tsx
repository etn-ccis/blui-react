import React from 'react';
import { Avatar, IconButton, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dashboard, Notifications, ExitToApp, Settings, VpnKey } from '@mui/icons-material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerNavGroup,
    DrawerLayout,
    NavItem,
    Spacer,
} from '@brightlayer-ui/react-components';
import CloseIcon from '@mui/icons-material/Close';
import { Device } from '@brightlayer-ui/icons-mui';

import backgroundImage from '../../../assets/cubes_tile.png';
const linearGradientOverlayImage = `linear-gradient(to right, rgba(0, 123, 193, 1) 22.4%, rgba(0, 123, 193, 0.2) 100%), url(${backgroundImage})`;

type DrawerProps = {
    open: boolean;
    toggleDrawer: () => void;
};

import avatarImage from '../../../assets/avatar_40.png';

const AvatarSize = styled(Avatar)({
    height: '48px',
    width: '48px',
});

const CloseIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(-2),
    marginTop: theme.spacing(-4),
}));

const ExtendedHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(0.5)}`,
}));

const Header = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
});

const HeaderDetails = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(2),
    position: 'relative',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(-0.5),
}));

export const BluiDrawer = (props: DrawerProps): JSX.Element => {
    const { open, toggleDrawer } = props;
    const variant = 'temporary';
    const selected = '1';

    const navGroupItems1: NavItem[] = [
        {
            title: 'Dashboard',
            itemID: '1',
            icon: <Dashboard />,
            onClick: (): void => toggleDrawer(),
        },
        {
            title: 'Notifications',
            itemID: '2',
            icon: <Notifications />,
            onClick: (): void => toggleDrawer(),
        },
        {
            title: 'Locations',
            itemID: '3',
            icon: <LocationOnIcon />,
            onClick: (): void => toggleDrawer(),
        },
        {
            title: 'Analytics',
            itemID: '4',
            icon: <AssessmentIcon />,
            onClick: (): void => toggleDrawer(),
        },
        {
            title: 'Assets',
            itemID: '5',
            icon: <Device />,
            onClick: (): void => toggleDrawer(),
        },
    ];

    const navGroupItems2: NavItem[] = [
        {
            title: 'Change Password',
            itemID: '6',
            onClick: (): void => toggleDrawer(),
            icon: <VpnKey />,
        },
        {
            title: 'Preferences',
            itemID: '7',
            onClick: (): void => toggleDrawer(),
            icon: <Settings />,
        },
        {
            title: 'Logout',
            itemID: '8',
            onClick: (): void => toggleDrawer(),
            icon: <ExitToApp />,
        },
    ];

    const DrawerHeaderContent = (): JSX.Element => (
        <ExtendedHeader>
            <Header>
                <AvatarSize alt="Chima Thabani" src={avatarImage} />
                <CloseIconButton
                    data-cy="toolbar-menu"
                    color={'inherit'}
                    edge={'end'}
                    onClick={toggleDrawer}
                    size="large"
                >
                    <CloseIcon />
                </CloseIconButton>
            </Header>
            <HeaderDetails>
                <Typography variant={'h6'}>Chima Thabani</Typography>
                <Subtitle variant={'body1'}>CThabani@example.com</Subtitle>
            </HeaderDetails>
        </ExtendedHeader>
    );
    return (
        <DrawerLayout
            drawer={
                <Drawer
                    open={open}
                    width={292}
                    variant={variant}
                    condensed={false}
                    onClose={toggleDrawer}
                    activeItem={selected}
                    activeItemBackgroundShape={'round'}
                >
                    <DrawerHeader
                        sx={{
                            backgroundImage: `${linearGradientOverlayImage}`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'right',
                        }}
                        backgroundOpacity={0.5}
                        titleContent={<DrawerHeaderContent />}
                        data-cy={'drawer-header'}
                    />
                    <DrawerBody>
                        <DrawerNavGroup items={navGroupItems1} />
                        <Spacer />
                        <DrawerNavGroup hidePadding title={'My Account'} items={navGroupItems2} />
                    </DrawerBody>
                </Drawer>
            }
        ></DrawerLayout>
    );
};
