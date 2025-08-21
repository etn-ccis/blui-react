/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import {
    AppBar,
    Slide,
    Toolbar,
    Typography,
    List,
    IconButton,
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Menu,
    MenuItem,
    Switch,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Language, Email, Sms, MoreVert, Edit, ArrowBack } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../../redux/actions';
import { InfoListItem, Spacer } from '@brightlayer-ui/react-components';
import { LocalActionsScoreCard } from './scorecard';
import { LanguageSelect } from './select-language';
import { LanguageSelectMobile } from './select-language-mobile';
import { DeviceEdit } from './device-edit';
import { DeviceEditMobile } from './device-edit-mobile';

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
    display: 'flex',
    justifyContent: 'space-between',
}));

const AccordionContainer = styled('div')(({ theme }) => ({
    maxWidth: 768,
    margin: '0 auto',
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        margin: `0 auto ${theme.spacing(3)} auto`,
        padding: 0,
    },
}));

const AccordionRoot = styled(Accordion)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: 4,
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        marginBottom: theme.spacing(2),
    },
    '& .MuiAccordionSummary-root': {
        height: theme.spacing(6),
        minHeight: theme.spacing(6),
        '&.Mui-expanded': {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        boxShadow: 'none',
        borderRadius: 0,
        '&:before': {
            display: 'none',
        },
        '& .MuiAccordionSummary-root': {
            height: theme.spacing(6),
            minHeight: theme.spacing(6),
            '&.Mui-expanded': {
                borderBottom: `1px solid ${theme.palette.divider}`,
                margin: 0,
            },
        },
    },
}));

const AccordionSummaryRoot = styled(AccordionSummary)(({ theme }) => ({
    pointerEvents: 'none',
}));

const AccordionDetailsRoot = styled(AccordionDetails)(({ theme }) => ({
    display: 'block',
    padding: 0,
}));

const ChangeBackgroundColor = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
}));

const DeviceEditMobileContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.down('sm')]: {
        height: 'calc(100vh - 56px)',
    },
}));

const ListItemTitle = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const MenuPaper = styled('div')({
    width: 154,
});

const MenuList = styled('ul')(({ theme }) => ({
    padding: 0,
    '& > *': { height: theme.spacing(6) },
}));

const ListItemTextSx = { marginLeft: 0 };

const getTitle = (deviceStatus: string, device: string, isMobile: boolean): ReactNode => (
    <ListItemTitle>
        <Typography variant={'subtitle1'} noWrap>
            {deviceStatus}
        </Typography>
        {!isMobile && (
            <Typography variant={'body1'} noWrap>
                : &nbsp;{device}
            </Typography>
        )}
    </ListItemTitle>
);

type Screens =
    | 'localItemActionScreen'
    | 'batteryServiceScreen'
    | 'editDeviceScreen'
    | 'mobileLanguageSelectScreen'
    | 'desktopLanguageSelectScreen';

export const ActionListLocalActions = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] = useState(false);
    const [isSmsNotificationsEnabled, setIsSmsNotificationsEnabled] = useState(true);
    const [activeScreen, setActiveScreen] = useState<Screens>('localItemActionScreen');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showDeviceEditDialog, setShowDeviceEditDialog] = useState(false);
    const [subTitle, setSubTitle] = useState('A2 Max Reveal');
    const [language, setLanguage] = useState('english');

    const inputEl = useRef<HTMLInputElement>(null);
    const slideAnimationDurationMs = 250;
    const exitSlideAnimationDurationMs = 0;

    const onShowBatteryServiceDetailsClick = useCallback((): void => {
        setActiveScreen('batteryServiceScreen');
    }, []);

    const onBackNavigation = useCallback((): void => {
        setActiveScreen('localItemActionScreen');
    }, []);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = (): void => {
        setAnchorEl(null);
    };

    const handleEditDeviceClick = useCallback((): void => {
        if (isMobile) setActiveScreen('editDeviceScreen');
        if (!isMobile) setShowDeviceEditDialog(true);
    }, [isMobile]);

    useEffect(() => {
        if (activeScreen === 'editDeviceScreen' && inputEl.current) {
            inputEl.current.focus();
        }
    }, [activeScreen]);

    const getToolbarIcon = useCallback((): ReactNode => {
        if (activeScreen === 'localItemActionScreen') {
            return md ? null : (
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
            );
        }
        return (
            <IconButton
                data-cy="toolbar-menu"
                color={'inherit'}
                onClick={onBackNavigation}
                edge={'start'}
                style={{ marginRight: 20 }}
                size="large"
            >
                <ArrowBack />
            </IconButton>
        );
    }, [activeScreen]);

    const getToolbarTitle = useCallback((): string => {
        let tempTitle = '';
        switch (activeScreen) {
            case 'localItemActionScreen':
                tempTitle = 'Local Item Actions';
                break;
            case 'batteryServiceScreen':
                tempTitle = 'Battery Service';
                break;
            case 'editDeviceScreen':
                tempTitle = 'Device';
                break;
            case 'mobileLanguageSelectScreen':
                tempTitle = 'Language';
                break;
            default:
                tempTitle = 'Local Item Actions';
                break;
        }
        return tempTitle;
    }, [activeScreen]);

    const getSubtitleByLanguage = useCallback((): string => {
        let tempSubTitle = '';
        switch (language) {
            case 'english':
                tempSubTitle = 'English (United States)';
                break;
            case 'deutsch':
                tempSubTitle = 'Deutsch (Germany)';
                break;
            case 'espanol':
                tempSubTitle = 'Español (Spain)';
                break;
            case 'francais':
                tempSubTitle = 'Français (France)';
                break;
            default:
                tempSubTitle = 'English (United States)';
        }
        return tempSubTitle;
    }, [language]);

    return (
        <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <AppBarRoot data-cy="pxb-toolbar" position={'sticky'}>
                <ToolbarGutters>
                    {getToolbarIcon()}
                    <Typography variant={'h6'} color={'inherit'}>
                        {getToolbarTitle()}
                    </Typography>
                    <Spacer />
                </ToolbarGutters>
            </AppBarRoot>
            <Slide
                direction={'right'}
                in={activeScreen === 'localItemActionScreen'}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: slideAnimationDurationMs, exit: exitSlideAnimationDurationMs }}
            >
                <AccordionContainer>
                    <AccordionRoot key={'today'} data-testid="accordion" defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant={'subtitle2'} color={'primary'}>
                                Today
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetailsRoot>
                            <List className={'list'} disablePadding>
                                <InfoListItem
                                    sx={ListItemTextSx}
                                    title={getTitle('Battery Service', 'Eaton GH142', isMobile)}
                                    data-testid="infoListItem"
                                    divider={'full'}
                                    hidePadding
                                    onClick={onShowBatteryServiceDetailsClick}
                                    chevron
                                />
                                <InfoListItem
                                    sx={ListItemTextSx}
                                    data-testid="infoListItem"
                                    title={getTitle('Bypass Over Frequency', 'A2 Max Reveal', isMobile)}
                                    divider={'full'}
                                    hidePadding
                                    rightComponent={
                                        <>
                                            <IconButton edge={'end'} onClick={openMenu} size="large">
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                PaperProps={{ sx: { width: 154 } }}
                                                MenuListProps={{
                                                    sx: { padding: 0, '& > *': { height: theme.spacing(6) } },
                                                }}
                                                id="more-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={closeMenu}
                                            >
                                                <MenuItem onClick={closeMenu}>Edit</MenuItem>
                                                <MenuItem onClick={closeMenu}>Delete</MenuItem>
                                                <MenuItem onClick={closeMenu}>Export</MenuItem>
                                            </Menu>
                                        </>
                                    }
                                />
                                <InfoListItem
                                    sx={ListItemTextSx}
                                    data-testid="infoListItem"
                                    title={getTitle('Device', subTitle, isMobile)}
                                    subtitleSeparator={' '}
                                    hidePadding
                                    rightComponent={
                                        <IconButton edge={'end'} onClick={handleEditDeviceClick} size="large">
                                            <Edit />
                                        </IconButton>
                                    }
                                    divider={isMobile ? 'full' : undefined}
                                />
                            </List>
                        </AccordionDetailsRoot>
                    </AccordionRoot>
                    <AccordionRoot
                        key={'Notifications'}
                        data-testid="accordion"
                        defaultExpanded={true}
                        TransitionProps={{ in: true }}
                    >
                        <AccordionSummaryRoot>
                            <Typography variant={'subtitle2'} color={'primary'}>
                                Notifications
                            </Typography>
                        </AccordionSummaryRoot>
                        <AccordionDetailsRoot>
                            <List className={'list'} disablePadding>
                                <InfoListItem
                                    sx={ListItemTextSx}
                                    title={'Email Notifications'}
                                    data-testid="infoListItem"
                                    subtitle={isEmailNotificationsEnabled ? 'Enabled' : 'Disabled'}
                                    rightComponent={
                                        <Switch
                                            checked={isEmailNotificationsEnabled}
                                            onChange={(): void => {
                                                setIsEmailNotificationsEnabled(!isEmailNotificationsEnabled);
                                            }}
                                        />
                                    }
                                    divider={'partial'}
                                    icon={<Email />}
                                    iconAlign="left"
                                />
                                <InfoListItem
                                    sx={ListItemTextSx}
                                    data-testid="infoListItem"
                                    title={'SMS Notifications'}
                                    subtitle={isSmsNotificationsEnabled ? 'Enabled' : 'Disabled'}
                                    rightComponent={
                                        <Switch
                                            checked={isSmsNotificationsEnabled}
                                            onChange={(): void => {
                                                setIsSmsNotificationsEnabled(!isSmsNotificationsEnabled);
                                            }}
                                        />
                                    }
                                    icon={<Sms />}
                                    iconAlign="left"
                                    divider={isMobile ? 'full' : undefined}
                                />
                            </List>
                        </AccordionDetailsRoot>
                    </AccordionRoot>
                    <AccordionRoot
                        key={'Locale'}
                        data-testid="accordion"
                        defaultExpanded={true}
                        TransitionProps={{ in: true }}
                        onChange={(event: any): void => {
                            event.preventDefault();
                        }}
                    >
                        <AccordionSummaryRoot>
                            <Typography variant={'subtitle2'} color={'primary'}>
                                Locale
                            </Typography>
                        </AccordionSummaryRoot>
                        <AccordionDetailsRoot>
                            <List className={'list'} disablePadding>
                                <InfoListItem
                                    sx={{
                                        ...ListItemTextSx,
                                        ...(theme.breakpoints.up('md') && {
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            },
                                        }),
                                    }}
                                    data-testid="infoListItem"
                                    title={'Language'}
                                    subtitle={getSubtitleByLanguage()}
                                    icon={<Language />}
                                    hidePadding
                                    iconAlign="left"
                                    rightComponent={
                                        isMobile ? undefined : (
                                            <LanguageSelect
                                                language={language}
                                                updateLanguage={(updatedLanguage): void => {
                                                    setLanguage(updatedLanguage);
                                                }}
                                            />
                                        )
                                    }
                                    chevron={isMobile}
                                    onClick={
                                        isMobile
                                            ? (): void => {
                                                  setActiveScreen('mobileLanguageSelectScreen');
                                              }
                                            : undefined
                                    }
                                    divider={isMobile ? 'full' : undefined}
                                />
                            </List>
                        </AccordionDetailsRoot>
                    </AccordionRoot>
                </AccordionContainer>
            </Slide>
            <Slide
                direction={'left'}
                in={activeScreen === 'batteryServiceScreen'}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: slideAnimationDurationMs, exit: exitSlideAnimationDurationMs }}
            >
                <div>
                    <LocalActionsScoreCard />
                </div>
            </Slide>
            <Slide
                direction={'left'}
                in={activeScreen === 'editDeviceScreen'}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: slideAnimationDurationMs, exit: exitSlideAnimationDurationMs }}
            >
                <DeviceEditMobileContainer>
                    <DeviceEditMobile
                        navigateBack={(): void => onBackNavigation()}
                        subTitle={subTitle}
                        updateSubTitle={(updatedSubTitle): void => {
                            setSubTitle(updatedSubTitle);
                        }}
                    />
                </DeviceEditMobileContainer>
            </Slide>
            <Slide
                direction={'left'}
                in={activeScreen === 'mobileLanguageSelectScreen'}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: slideAnimationDurationMs, exit: exitSlideAnimationDurationMs }}
            >
                <div>
                    <LanguageSelectMobile
                        language={language}
                        updateLanguage={(updatedLanguage): void => {
                            setLanguage(updatedLanguage);
                        }}
                        navigateBack={(): void => onBackNavigation()}
                    />
                </div>
            </Slide>
            <DeviceEdit
                open={showDeviceEditDialog}
                handleClose={(): void => setShowDeviceEditDialog(false)}
                subTitle={subTitle}
                updateSubTitle={(updatedSubTitle): void => {
                    setSubTitle(updatedSubTitle);
                }}
            />
        </div>
    );
};
