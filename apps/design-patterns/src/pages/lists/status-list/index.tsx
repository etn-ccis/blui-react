/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import { Theme, useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Chevron from '@mui/icons-material/ChevronRight';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { InfoListItem, ListItemTag, Spacer } from '@brightlayer-ui/react-components';
import * as colors from '@brightlayer-ui/colors';
import { Maintenance } from '@brightlayer-ui/icons-mui';

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
    marginBottom: theme.spacing(3),
    borderRadius: 4,
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        marginBottom: theme.spacing(3),
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

const AccordionDetailsRoot = styled(AccordionDetails)({
    display: 'block',
    padding: 0,
});

const ListItemTitle = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const Station = styled('span')({
    fontSize: 14,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
});

const Location = styled('span')({
    fontSize: 12,
});

const LeftComponentRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
    marginRight: theme.spacing(4),
}));

const TimeStamp = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const Time = styled(Typography)({
    fontWeight: 700,
    fontSize: 12,
});

const TimePeriod = styled(Typography)({
    marginLeft: 4,
});

const RightComponentRoot = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const HeaderIcon = styled('span')(({ theme }) => ({
    marginLeft: theme.spacing(4),
}));

const AssignedTag = styled(ListItemTag)(({ theme }) => ({
    marginTop: 4,
}));

const ActiveTag = styled(ListItemTag)(({ theme }) => ({
    marginTop: 4,
    marginLeft: theme.spacing(0),
}));

const RightComponentChevron = styled(Chevron)({
    color: colors.gray[500],
});

const InfoComponent = styled('div')(({ theme }) => ({
    display: 'flex',
    margin: `4px 0px 4px ${theme.spacing(4)}`,
}));

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

const getSubtitle = (station: string, location: string): Array<ReactNode> => [
    <Station key="station">{station}</Station>,
    <Location key="location">
        {`<`} &nbsp; {location}
    </Location>,
];

const getLeftComponent = (time: string, timePeriod: 'AM' | 'PM', date: string): ReactNode => (
    <LeftComponentRoot>
        <TimeStamp>
            <Time>{time}</Time>
            <TimePeriod variant={'caption'}>{timePeriod}</TimePeriod>
        </TimeStamp>
        <Typography variant={'caption'}>{date}</Typography>
    </LeftComponentRoot>
);

const getRightComponent = (isMobile: boolean, tag = false): ReactNode => (
    <RightComponentRoot>
        {tag && !isMobile && (
            <>
                <AssignedTag label={'assigned'} backgroundColor={colors.blue[500]} />
                <ActiveTag label={'active'} backgroundColor={colors.red[500]} />
            </>
        )}
    </RightComponentRoot>
);

const getInfoComponent = (isMobile: boolean, tag = false): Array<ReactNode> | undefined => {
    if (tag && isMobile) {
        return [
            <AssignedTag key="assigned" label={'assigned'} backgroundColor={colors.blue[500]} />,
            <ActiveTag key="active" label={'active'} backgroundColor={colors.red[500]} />,
        ];
    }
    return undefined;
};

export const StatusList = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
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
                            sx={{ marginRight: 2.5 }}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Status Lists
                    </Typography>
                    <Spacer />
                    <IconButton color={'inherit'} edge={'end'} size="large">
                        <HelpIcon />
                        <Badge sx={{ ml: 4 }} color="error" badgeContent={88}>
                            <NotificationIcon />
                        </Badge>
                        <MoreVertIcon sx={{ ml: 4 }} />
                    </IconButton>
                </ToolbarGutters>
            </AppBarRoot>
            <AccordionContainer>
                <AccordionRoot
                    key={'With Time Stamps, with Title+SubTitle+Info'}
                    data-testid="statusListAccordion"
                    defaultExpanded={true}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant={'subtitle2'} color={'primary'}>
                            With Time Stamps, with Title+SubTitle+Info
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetailsRoot>
                        <List className={'list'} disablePadding>
                            <InfoListItem
                                title={getTitle('High Humidity', 'PX341 sensor level 9', isMobile)}
                                data-testid="statusListInfoListItem"
                                subtitle={getSubtitle('Cherrington Station', 'Moon Township')}
                                subtitleSeparator={' '}
                                info={getInfoComponent(isMobile, true)}
                                icon={<NotificationsActiveIcon />}
                                iconColor={theme.palette.common.white[50]}
                                statusColor={colors.red[500]}
                                leftComponent={getLeftComponent('8:21', 'AM', '11/23/21')}
                                rightComponent={getRightComponent(isMobile, true)}
                                divider={'partial'}
                                avatar
                                chevron
                                iconAlign="center"
                            />
                            <InfoListItem
                                data-testid="statusListInfoListItem"
                                title={getTitle('Battery Service', 'Eaton GH142', isMobile)}
                                subtitle={getSubtitle('Cherrington Station', 'Moon Township')}
                                subtitleSeparator={' '}
                                info={getInfoComponent(isMobile)}
                                icon={<Maintenance />}
                                iconColor={colors.orange[500]}
                                statusColor={colors.orange[500]}
                                leftComponent={getLeftComponent('7:48', 'AM', '11/23/21')}
                                divider={'partial'}
                                avatar={false}
                                chevron
                                iconAlign="center"
                            />
                            <InfoListItem
                                data-testid="statusListInfoListItem"
                                title={getTitle('Bypass Over Frequency', 'A2 Max Reval', isMobile)}
                                subtitle={getSubtitle('Tuscarawas R.', 'Beaver')}
                                subtitleSeparator={' '}
                                info={getInfoComponent(isMobile)}
                                icon={<NotificationIcon />}
                                iconColor={colors.gray[500]}
                                statusColor={'transparent'}
                                leftComponent={getLeftComponent('2:13', 'AM', '11/23/21')}
                                avatar={false}
                                chevron
                                iconAlign="center"
                            />
                        </List>
                    </AccordionDetailsRoot>
                </AccordionRoot>
                <AccordionRoot
                    key={'Without Icons, with Title'}
                    data-testid="statusListAccordion"
                    defaultExpanded={true}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant={'subtitle2'} color={'primary'}>
                            Without Icons, with Title
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetailsRoot>
                        <List className={'list'} disablePadding>
                            <InfoListItem
                                title={getTitle('High Humidity', 'PX341 sensor level 9', isMobile)}
                                data-testid="statusListInfoListItem"
                                subtitle={!isMobile ? getSubtitle('Cherrington Station', 'Moon Township') : undefined}
                                subtitleSeparator={' '}
                                statusColor={colors.red[500]}
                                hidePadding
                                divider={'full'}
                                chevron
                                iconAlign="center"
                            />
                            <InfoListItem
                                data-testid="statusListInfoListItem"
                                title={getTitle('Battery Service', 'Eaton GH142', isMobile)}
                                hidePadding
                                chevron
                                iconAlign="center"
                            />
                        </List>
                    </AccordionDetailsRoot>
                </AccordionRoot>
                <AccordionRoot key={'With Icons, with Title'} data-testid="statusListAccordion" defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant={'subtitle2'} color={'primary'}>
                            With Icons, with Title
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetailsRoot>
                        <List className={'list'} disablePadding>
                            <InfoListItem
                                title={getTitle('High Humidity', 'PX341 sensor level 9', isMobile)}
                                data-testid="statusListInfoListItem"
                                subtitle={!isMobile ? getSubtitle('Cherrington Station', 'Moon Township') : undefined}
                                subtitleSeparator={' '}
                                icon={<NotificationsActiveIcon />}
                                iconColor={theme.palette.common.white[50]}
                                statusColor={colors.red[500]}
                                divider={'partial'}
                                avatar
                                chevron
                                iconAlign="center"
                            />
                            <InfoListItem
                                data-testid="statusListInfoListItem"
                                title={getTitle('Battery Service', 'Eaton GH142', isMobile)}
                                icon={<Maintenance />}
                                iconColor={colors.gray[500]}
                                avatar={false}
                                chevron
                                iconAlign="center"
                            />
                        </List>
                    </AccordionDetailsRoot>
                </AccordionRoot>
            </AccordionContainer>
        </div>
    );
};
