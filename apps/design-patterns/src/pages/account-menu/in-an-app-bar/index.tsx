import React, { useCallback, useState } from 'react';
import { AppBar, Avatar, Badge, Toolbar, IconButton, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import { AccountCircle, Apps, ExitToApp, LockOpen, Settings, VpnKey } from '@mui/icons-material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Spacer, UserMenu } from '@brightlayer-ui/react-components';
import { Chip } from './Chip';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import * as colors from '@brightlayer-ui/colors';

import avatarImage from '../../../assets/avatar_40.png';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    '&.MuiToolbar-gutters': {
        padding: `0 ${theme.spacing(2)}`,
    },
}));

const AppBarContainer = styled(Box)(({ theme }) => ({
    maxWidth: 960,
    margin: '0 auto',
    padding: `0 ${theme.spacing(2)}`,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '&:last-child': {
        marginBottom: 0,
    },
}));

const AppBarHeader = styled(Box)(({ theme }) => ({
    maxWidth: 600,
    margin: `${theme.spacing(5)} auto ${theme.spacing(3)}`,
    [theme.breakpoints.down('lg')]: {
        padding: `0 ${theme.spacing(2)}`,
    },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-dot': {
        backgroundColor: colors.green[500],
        color: colors.green[500],
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
}));

const TextContainer = styled(Box)(({ theme }) => ({
    marginLeft: theme.spacing(2.5),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
}));

const SubtitleTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(-0.5),
}));

const menuGroupItems = [
    {
        items: [
            {
                title: 'Change Password',
                icon: <VpnKey />,
                onClick: (): void => {},
            },
            {
                title: 'Preferences',
                icon: <Settings />,
                onClick: (): void => {},
            },
            {
                title: 'Log Out',
                icon: <ExitToApp />,
                onClick: (): void => {},
            },
        ],
    },
];
const avatarTitle = 'Chima Thabani';
const avatarSubtitile = 'CThabani@example.com';

export const InAnAppBar = (): JSX.Element => {
    const dispatch = useDispatch();
    const [chipToggled, setChipToggled] = useState(false);
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const toggleChip = useCallback((): void => {
        setChipToggled((oldValue) => !oldValue);
    }, []);

    return (
        <div style={{ minHeight: '100vh' }}>
            <AppBar data-cy="toolbar" position={'sticky'}>
                <StyledToolbar>
                    {md ? null : (
                        <IconButton
                            data-cy="toolbar-menu"
                            color={'inherit'}
                            onClick={(): void => {
                                dispatch({ type: TOGGLE_DRAWER, payload: true });
                            }}
                            edge={'start'}
                            style={{ marginRight: 20 }}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        In an App Bar
                    </Typography>
                    <div />
                </StyledToolbar>
            </AppBar>
            <div>
                <AppBarHeader>
                    <Typography variant={'body1'}>
                        Click on each avatar to see the account menu. Resize the screen to view the account menu / user
                        menu rendered responsively.
                    </Typography>
                </AppBarHeader>
                <AppBarContainer>
                    {/* Generic Icon Avatar Example */}
                    <StyledAppBar position="static" color="inherit">
                        <StyledToolbar>
                            <IconButton edge={'start'} size="large">
                                <MenuIcon />
                            </IconButton>
                            <TextContainer>
                                <Typography variant={'h6'} noWrap>
                                    Generic Icon Avatar
                                </Typography>
                                <SubtitleTypography variant={'body1'} noWrap>
                                    Shared / Anonymous Account / Unauthenticated
                                </SubtitleTypography>
                            </TextContainer>
                            <Spacer />
                            <UserMenu
                                avatar={<Avatar />}
                                data-cy={'generic-avatar-menu'}
                                menuGroups={[
                                    {
                                        items: [
                                            {
                                                title: 'Log In',
                                                icon: <LockOpen />,
                                                onClick: (): void => {},
                                            },
                                            {
                                                title: 'Register',
                                                icon: <Apps />,
                                                onClick: (): void => {},
                                            },
                                            {
                                                title: 'About',
                                                icon: <InfoIcon />,
                                                onClick: (): void => {},
                                            },
                                        ],
                                    },
                                ]}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    sx: {
                                        '& .MuiPaper-root': {
                                            marginTop: theme.spacing(1),
                                        },
                                    },
                                }}
                                onOpen={(): void => {}}
                                onClose={(): void => {}}
                            />
                        </StyledToolbar>
                    </StyledAppBar>
                    {/* Basic Letter Avatar Example */}
                    <StyledAppBar position="static" color="inherit">
                        <StyledToolbar>
                            <IconButton edge={'start'} size="large">
                                <MenuIcon />
                            </IconButton>
                            <TextContainer>
                                <Typography variant={'h6'} noWrap>
                                    Basic Letter Avatar
                                </Typography>
                                <SubtitleTypography variant={'body1'} noWrap>
                                    Showing User's Initials
                                </SubtitleTypography>
                            </TextContainer>
                            <Spacer />
                            <UserMenu
                                avatar={<Avatar>CT</Avatar>}
                                menuGroups={menuGroupItems}
                                menuTitle={avatarTitle}
                                menuSubtitle={avatarSubtitile}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    sx: {
                                        '& .MuiPaper-root': {
                                            marginTop: theme.spacing(1),
                                        },
                                    },
                                }}
                                onOpen={(): void => {}}
                                onClose={(): void => {}}
                            />
                        </StyledToolbar>
                    </StyledAppBar>
                    {/* Image Avatar Example */}
                    <StyledAppBar position="static" color="inherit">
                        <StyledToolbar>
                            <IconButton edge={'start'} size="large">
                                <MenuIcon />
                            </IconButton>
                            <TextContainer>
                                <Typography variant={'h6'} noWrap>
                                    Image Avatar
                                </Typography>
                                <SubtitleTypography variant={'body1'} noWrap>
                                    Showing A Custom Profile Picture
                                </SubtitleTypography>
                            </TextContainer>
                            <Spacer />
                            <UserMenu
                                avatar={<Avatar alt="Chima Thabani" src={avatarImage} />}
                                menuGroups={menuGroupItems}
                                menuTitle={avatarTitle}
                                menuSubtitle={avatarSubtitile}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    sx: {
                                        '& .MuiPaper-root': {
                                            marginTop: theme.spacing(1),
                                        },
                                    },
                                }}
                                onOpen={(): void => {}}
                                onClose={(): void => {}}
                            />
                        </StyledToolbar>
                    </StyledAppBar>
                    {/* Status Avatar Example */}
                    <StyledAppBar position="static" color="inherit">
                        <StyledToolbar>
                            <IconButton edge={'start'} size="large">
                                <MenuIcon />
                            </IconButton>
                            <TextContainer>
                                <Typography variant={'h6'} noWrap>
                                    Status Avatar
                                </Typography>
                                <SubtitleTypography variant={'body1'} noWrap>
                                    Avatar with Status Indicator
                                </SubtitleTypography>
                            </TextContainer>
                            <Spacer />
                            <UserMenu
                                avatar={
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        variant="dot"
                                    >
                                        {<Avatar alt="Chima Thabani" src={avatarImage} />}
                                    </StyledBadge>
                                }
                                menuGroups={menuGroupItems}
                                menuTitle={avatarTitle}
                                menuSubtitle={avatarSubtitile}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    sx: {
                                        '& .MuiPaper-root': {
                                            marginTop: theme.spacing(1),
                                        },
                                    },
                                }}
                                onOpen={(): void => {}}
                                onClose={(): void => {}}
                            />
                        </StyledToolbar>
                    </StyledAppBar>
                    {/* Text Menu Example */}
                    <StyledAppBar position="static" color="inherit">
                        <StyledToolbar>
                            <IconButton color={'inherit'} edge={'start'} size="large">
                                <MenuIcon />
                            </IconButton>
                            <TextContainer>
                                <Typography variant={'h6'} noWrap>
                                    Text Menu
                                </Typography>
                                <SubtitleTypography variant={'body1'} noWrap>
                                    Calling Out the User Name
                                </SubtitleTypography>
                            </TextContainer>
                            <Spacer />
                            <UserMenu
                                onClick={toggleChip}
                                avatar={
                                    <Chip
                                        sx={{ minWidth: 112.5, maxHeight: 32 }}
                                        variant="outlined"
                                        icon={<AccountCircle style={{ color: colors.gray[500] }} />}
                                        label="Admin"
                                        rightIcon={
                                            chipToggled ? (
                                                <ExpandLessIcon fontSize={'small'} />
                                            ) : (
                                                <ExpandMoreOutlinedIcon fontSize={'small'} />
                                            )
                                        }
                                        highlight={chipToggled}
                                    />
                                }
                                menuGroups={menuGroupItems}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                    sx: {
                                        '& .MuiPaper-root': {
                                            marginTop: theme.spacing(1),
                                        },
                                    },
                                }}
                                onOpen={(): void => {}}
                                onClose={(): void => {}}
                            />
                        </StyledToolbar>
                    </StyledAppBar>
                </AppBarContainer>
            </div>
        </div>
    );
};
