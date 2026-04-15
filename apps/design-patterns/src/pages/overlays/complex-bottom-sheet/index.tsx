/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Hero, HeroBanner, InfoListItem, Spacer } from '@brightlayer-ui/react-components';
import * as Colors from '@brightlayer-ui/colors';
import Box from '@mui/material/Box';

import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import MoreVert from '@mui/icons-material/MoreVert';
import Notifications from '@mui/icons-material/Notifications';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import AccessTime from '@mui/icons-material/AccessTime';
import Info from '@mui/icons-material/Info';
import Settings from '@mui/icons-material/Settings';
import Update from '@mui/icons-material/Update';

import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { styled, useTheme } from '@mui/material/styles';
import getEvents, { Event, formatDate } from './alarmData';
import { EmptyState } from './EmptyState';
import { useMediaQuery } from '@mui/material';

export const TYPES = {
    TIME: 'time',
    TYPE: 'type',
};

export const FILTERS = {
    ALARM: 'alarm',
    SESSION: 'session',
    SETTINGS: 'settings',
};

const eventList = getEvents(20);

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: '0 16px',
}));

const PaperDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiPaper-root': {
        width: '100%',
        maxWidth: 600,
        margin: 'auto',
        userSelect: 'none',
    },
}));

const HeroBannerStyled = styled(HeroBanner)(({ theme }) => ({
    width: '100%',
    height: 100,
    display: 'flex',
    justifyContent: 'center',
}));

const HeroStyled = styled(Hero)(({ theme }) => ({
    cursor: 'pointer',
    flex: 'unset',
    minWidth: 100,
}));

const ActiveIcon = styled('span')(({ theme }) => ({
    color: Colors.blue[500],
}));

const EmptyStateContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    height: `calc(100vh - ${theme.spacing(8)})`,
    justifyContent: 'center',
}));

export const sortedEvents = (events: Event[], sortby: string): Event[] => {
    switch (sortby) {
        case TYPES.TYPE:
            return events.sort((a, b) => {
                // primary sort by type
                if (a.type < b.type) {
                    return -1;
                } else if (a.type > b.type) {
                    return 1;
                }
                // secondary sort by alarm active and/or date
                if (a.type !== FILTERS.ALARM) {
                    return b.date - a.date;
                }
                if (a.active && !b.active) {
                    return -1;
                } else if (b.active && !a.active) {
                    return 1;
                }
                return b.date - a.date;
            });
        case TYPES.TIME:
        default:
            return events.sort((a, b) => b.date - a.date);
    }
};

export const filteredEvents = (events: Event[], config: any): Event[] => {
    const { showActiveAlarms, showAlarms, showSettings, showSessions } = config;
    return events.filter((item) => {
        if (!showActiveAlarms && item.type === FILTERS.ALARM && item.active) {
            return false;
        }
        if (!showAlarms && item.type === FILTERS.ALARM && !item.active) {
            return false;
        }
        if (!showSettings && item.type === FILTERS.SETTINGS) {
            return false;
        }
        if (!showSessions && item.type === FILTERS.SESSION) {
            return false;
        }
        return true;
    });
};

export const ComplexBottomSheet = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const [showMenu, setShowMenu] = useState(false);
    const [list, setList] = useState(eventList);
    const [currentSort, setCurrentSort] = useState('time');
    const [showAlarms, setShowAlarms] = useState(true);
    const [showActiveAlarms, setShowActiveAlarms] = useState(true);
    const [showSettings, setShowSettings] = useState(true);
    const [showSessions, setShowSessions] = useState(true);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        setList(
            filteredEvents(sortedEvents(eventList, currentSort), {
                showActiveAlarms,
                showAlarms,
                showSettings,
                showSessions,
            })
        );
    }, [currentSort, showActiveAlarms, showAlarms, showSettings, showSessions]);

    return (
        <div style={{ backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
            <AppBarRoot data-cy="blui-toolbar" position={'sticky'}>
                <ToolbarGutters disableGutters>
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
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'} noWrap>
                        Complex Bottom Sheet
                    </Typography>
                    <Spacer />
                    <IconButton
                        data-cy={'action-menu'}
                        color={'inherit'}
                        onClick={(): void => setShowMenu(true)}
                        edge={'end'}
                        size="large"
                    >
                        <MoreVert />
                    </IconButton>
                </ToolbarGutters>
            </AppBarRoot>

            {list.length > 0 && (
                <List disablePadding data-cy={'list-content'}>
                    {list.map((event, i) => (
                        <InfoListItem
                            key={i}
                            icon={
                                <>
                                    {event.type === 'alarm' && event.active && <NotificationsActive />}
                                    {event.type === 'alarm' && !event.active && <Notifications />}
                                    {event.type === 'settings' && <Settings />}
                                    {event.type === 'session' && <Update />}
                                </>
                            }
                            title={`${event.active ? 'ACTIVE: ' : ''}${event.details}`}
                            subtitle={formatDate(event.date)}
                            fontColor={event.active ? theme.palette.error.main : undefined}
                            avatar
                            statusColor={event.active ? theme.palette.error.main : 'transparent'}
                            iconColor={event.active ? undefined : theme.palette.text.primary}
                        />
                    ))}
                </List>
            )}

            {list.length === 0 && (
                <EmptyStateContainer>
                    <EmptyState />
                </EmptyStateContainer>
            )}

            {/* Custom/Complex Bottom Sheet Definition */}
            <PaperDrawer
                anchor={'bottom'}
                transitionDuration={250}
                open={showMenu}
                onClose={(): void => setShowMenu(false)}
            >
                <List disablePadding>
                    <ListItem data-cy={'btm-sheet-sort'} sx={{ width: '100%', flexDirection: 'column' }}>
                        <Typography variant={'overline'} style={{ width: '100%' }} gutterBottom>
                            Sort By:
                        </Typography>

                        <HeroBannerStyled>
                            <HeroStyled
                                icon={<AccessTime />}
                                label={'Time'}
                                classes={
                                    currentSort === TYPES.TIME ? { label: 'Mui-active', icon: 'Mui-active' } : undefined
                                }
                                sx={currentSort === TYPES.TIME ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setCurrentSort(TYPES.TIME)}
                            />
                            <HeroStyled
                                icon={<Info />}
                                label={'Type'}
                                classes={
                                    currentSort === TYPES.TYPE ? { label: 'Mui-active', icon: 'Mui-active' } : undefined
                                }
                                sx={currentSort === TYPES.TYPE ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setCurrentSort(TYPES.TYPE)}
                            />
                        </HeroBannerStyled>
                    </ListItem>
                    <Divider />
                    <ListItem data-cy={'btm-sheet-show'} sx={{ width: '100%', flexDirection: 'column' }}>
                        <Typography variant="overline" style={{ width: '100%' }} gutterBottom>
                            Show:
                        </Typography>

                        <HeroBannerStyled>
                            <HeroStyled
                                icon={<NotificationsActive />}
                                label={'Active Alarms'}
                                data-cy={'active-alarms'}
                                sx={showActiveAlarms ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setShowActiveAlarms(!showActiveAlarms)}
                            />
                            <HeroStyled
                                icon={<Notifications />}
                                label={'Alarms'}
                                data-cy={'alarms'}
                                sx={showAlarms ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setShowAlarms(!showAlarms)}
                            />
                            <HeroStyled
                                icon={<Settings />}
                                label={'Settings'}
                                data-cy={'settings'}
                                sx={showSettings ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setShowSettings(!showSettings)}
                            />
                            <HeroStyled
                                icon={<Update />}
                                label={'Sessions'}
                                data-cy={'sessions'}
                                sx={showSessions ? { color: Colors.blue[500] } : undefined}
                                onClick={(): void => setShowSessions(!showSessions)}
                            />
                        </HeroBannerStyled>
                    </ListItem>

                    {!isMobile && <Divider />}
                    <Box
                        boxShadow={isMobile ? 8 : 0}
                        sx={{ position: 'sticky', bottom: 0, background: Colors.white[50] }}
                    >
                        <InfoListItem
                            data-cy="btm-sheet-cancel"
                            icon={<Close />}
                            title={'Close'}
                            dense
                            onClick={(): void => setShowMenu(false)}
                        />
                    </Box>
                </List>
            </PaperDrawer>
        </div>
    );
};
