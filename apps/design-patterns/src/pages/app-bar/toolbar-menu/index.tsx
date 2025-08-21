import React, { useState, useCallback } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItemButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import * as Colors from '@brightlayer-ui/colors';
import ListItemText from '@mui/material/ListItemText';
import { ToolbarMenu } from '@brightlayer-ui/react-components';

// Styled components replacing makeStyles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TextContent = styled(ListItemText)(({ theme }) => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&.MuiListItemText-multiline': {
        marginTop: '0.25rem',
        marginBottom: '0.25rem',
    },
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0px ${theme.spacing(2)}`,
}));

export const BluiToolbarMenu = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [subtitle, setSubtitle] = useState<string>('Subtitle');
    const updateToolbar = useCallback(
        (subtitleText: string, hideBottomSheet?: boolean): void => {
            if (hideBottomSheet) {
                setShowMenu(false);
            }
            setSubtitle(subtitleText);
        },
        [showMenu, subtitle]
    );

    const menuGroups = [
        {
            items: [
                {
                    title: 'All Locations',
                    onClick: (): void => {
                        updateToolbar('All Locations');
                    },
                },
                {
                    title: 'Gary Steel Works',
                    onClick: (): void => {
                        updateToolbar('Gary Steel Works');
                    },
                },
                {
                    title: 'US Steel',
                    onClick: (): void => {
                        updateToolbar('US Steel');
                    },
                },
            ],
        },
    ];

    return (
        <div style={{ minHeight: '100vh' }}>
            <AppBar data-cy="blui-toolbar" position={'sticky'}>
                {!md ? null : (
                    <ToolbarGutters>
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
                        <TextContent
                            className="textContent"
                            primary={<Typography variant="h6">Title</Typography>}
                            secondary={
                                <ToolbarMenu
                                    label={subtitle}
                                    menuGroups={menuGroups}
                                    sx={{ color: Colors.white[50], marginTop: '-0.25rem' }}
                                    onOpen={(): void => {
                                        setShowMenu(true);
                                    }}
                                    onClose={(): void => {
                                        setShowMenu(false);
                                    }}
                                ></ToolbarMenu>
                            }
                        />
                        <div />
                    </ToolbarGutters>
                )}
                {md ? null : (
                    <ToolbarGutters>
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
                        <TextContent
                            className="textContent"
                            primary={<Typography variant="h6">Title</Typography>}
                            secondary={
                                <ToolbarMenu
                                    sx={{ color: Colors.white[50], marginTop: '-0.25rem' }}
                                    label={subtitle}
                                    menu={
                                        <React.Fragment key={'bottom'}>
                                            <Drawer
                                                data-cy="bottom-sheet"
                                                anchor={'bottom'}
                                                transitionDuration={250}
                                                open={showMenu}
                                                onClose={(): void => setShowMenu(false)}
                                                PaperProps={{
                                                    sx: {
                                                        marginTop: theme.spacing(1),
                                                    },
                                                }}
                                            >
                                                <List>
                                                    {menuGroups[0].items.map((text) => (
                                                        <ListItemButton
                                                            key={text.title}
                                                            onClick={(): void => updateToolbar(text.title, true)}
                                                        >
                                                            <ListItemText primary={text.title} />
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                            </Drawer>
                                        </React.Fragment>
                                    }
                                    onOpen={(): void => {
                                        setShowMenu(true);
                                    }}
                                    onClose={(): void => {
                                        setShowMenu(false);
                                    }}
                                ></ToolbarMenu>
                            }
                        />
                        <div />
                    </ToolbarGutters>
                )}
            </AppBar>
        </div>
    );
};
