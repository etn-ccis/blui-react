import React from 'react';
import { Badge, IconButton, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Spacer, ThreeLiner } from '@brightlayer-ui/react-components';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { getBodyFiller } from '../utils/utils';

// @ts-ignore
import backgroundImage from '../../../assets/collapsible_app_bar_demo.jpg';
const linearGradientOverlayImage = `linear-gradient(to bottom, rgba(0, 123, 193, 1) 22.4%, rgba(0, 123, 193, 0.2) 100%), url(${backgroundImage})`;

const PREFIX = 'CollapsibleAppBar';

const classes = {
    title: `${PREFIX}-title`,
    subtitle: `${PREFIX}-subtitle`,
    info: `${PREFIX}-info`,
    liner: `${PREFIX}-liner`,
    expanded: `${PREFIX}-expanded`,
    collapsed: `${PREFIX}-collapsed`,
    toolbarGutters: `${PREFIX}-toolbarGutters`,
    backgroundGradient: `${PREFIX}-backgroundGradient`,
    bodyContent: `${PREFIX}-bodyContent`,
    toolbarRightContent: `${PREFIX}-toolbarRightContent`,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    [`& .${classes.backgroundGradient}`]: {
        backgroundImage: `${linearGradientOverlayImage}`,
        backgroundPosition: 'center',
    },
    [`&.${classes.collapsed} .${classes.title}`]: {
        fontSize: '1.25rem',
        fontWeight: 600,
    },
    [`&.${classes.collapsed} .${classes.subtitle}`]: {
        fontSize: 0,
    },
    [`&.${classes.collapsed} .${classes.info}`]: {
        fontSize: '1rem',
        marginTop: '-0.25rem',
        fontWeight: 400,
    },
    [`&.${classes.collapsed} .${classes.backgroundGradient}`]: {
        backgroundImage: 'none',
    },
    [`&.${classes.expanded} .${classes.liner}`]: {
        top: 80,
    },
}));

const Liner = styled('div')(({ theme }) => ({
    top: 0,
    position: 'absolute',
    flexGrow: 1,
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
        marginLeft: 56,
    },
}));

const ToolbarRightContent = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});

const BodyContent = styled('div')(({ theme }) => ({
    maxWidth: '900px',
    margin: '0 auto',
    padding: `0 ${theme.spacing(2)}`,
}));

export const Collapsible = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div style={{ minHeight: '100vh' }}>
            <StyledAppBar
                expandedHeight={200}
                collapsedHeight={isMobile ? 56 : 64}
                scrollThreshold={136}
                animationDuration={300}
                backgroundImage={backgroundImage}
                variant={'snap'}
                classes={{
                    collapsed: classes.collapsed,
                    expanded: classes.expanded,
                    background: classes.backgroundGradient,
                }}
            >
                <Toolbar
                    data-cy={'toolbar'}
                    sx={{
                        paddingLeft: '16px',
                        paddingRight: '4px',
                    }}
                >
                    {md ? null : (
                        <IconButton
                            data-cy="toolbar-menu"
                            onClick={(): void => {
                                dispatch({ type: TOGGLE_DRAWER, payload: true });
                            }}
                            color={'inherit'}
                            edge={'start'}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Spacer />
                    <ThreeLiner
                        classes={{
                            title: classes.title,
                            subtitle: classes.subtitle,
                            info: classes.info,
                        }}
                        className={classes.liner}
                        component={Liner}
                        title={'Timeline'}
                        subtitle={'Online'}
                        info={'Gary Steel Works'}
                        animationDuration={300}
                    />
                    <ToolbarRightContent className={classes.toolbarRightContent}>
                        <IconButton color={'inherit'} size="large">
                            <HelpIcon />
                        </IconButton>
                        <IconButton color={'inherit'} size="large">
                            <Badge color="error" badgeContent={88}>
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton color={'inherit'} size="large">
                            <MoreVertIcon />
                        </IconButton>
                    </ToolbarRightContent>
                </Toolbar>
            </StyledAppBar>
            <BodyContent id={'page-body'}>{getBodyFiller()}</BodyContent>
        </div>
    );
};
