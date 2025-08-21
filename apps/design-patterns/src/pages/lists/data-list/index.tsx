import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { InfoListItem, ChannelValue } from '@brightlayer-ui/react-components';
import { presidentsList } from './list';
import { EmptyState } from './EmptyState';

export const DataList = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <div style={{ backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
            <AppBar data-cy="blui-toolbar" position={'sticky'} sx={{ padding: 0 }}>
                <Toolbar sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
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
                        Data List
                    </Typography>
                </Toolbar>
            </AppBar>
            {presidentsList.length < 1 && <EmptyState />}
            <List disablePadding component={'nav'}>
                {presidentsList.map((president) => (
                    <InfoListItem
                        hidePadding
                        key={president.lastName}
                        title={`${president.firstName} ${president.lastName}`}
                        rightComponent={<ChannelValue value={president.year}></ChannelValue>}
                    ></InfoListItem>
                ))}
            </List>
        </div>
    );
};
