import React, { useState } from 'react';
import { AppBar, Button, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { BluiDrawer } from './Drawer';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    padding: `0px ${theme.spacing(2)}`,
}));

const ButtonContainer = styled('div')(({ theme }) => ({
    width: '100%',
    height: `calc(100vh - ${theme.spacing(8)})`,
    display: 'flex',
    padding: 0,
    overflow: 'auto',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        height: `calc(100vh - ${theme.spacing(7)})`,
    },
}));

const CenterButton = styled(Button)(() => ({
    margin: 'auto',
    display: 'flex',
    zIndex: 4,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const InADrawer = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div style={{ backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
            <AppBar data-cy="toolbar" position={'sticky'}>
                <BluiDrawer
                    open={drawerOpen}
                    toggleDrawer={(): void => {
                        setDrawerOpen(!drawerOpen);
                    }}
                />
                <StyledToolbar disableGutters>
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
                        In a Drawer
                    </Typography>
                    <div />
                </StyledToolbar>
            </AppBar>
            <ButtonContainer>
                <CenterButton
                    variant={'contained'}
                    color={'primary'}
                    startIcon={<MenuOpenIcon />}
                    onClick={(): void => setDrawerOpen(!drawerOpen)}
                    data-cy={'toggle-drawer'}
                >
                    <Typography noWrap color={'inherit'}>
                        Open Drawer
                    </Typography>
                </CenterButton>
            </ButtonContainer>
        </div>
    );
};
