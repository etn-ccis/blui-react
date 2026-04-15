import React, { useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useMediaQuery, styled } from '@mui/material';

// Material Icons
import Close from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';

// Handles Drawer
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

// Other
import { useTheme } from '@mui/material/styles';
import { InfoListItem, Spacer } from '@brightlayer-ui/react-components';
import { DRAWER_WIDTH } from '../../../assets/constants';
import clsx from 'clsx';
import { ArrowBack } from '@mui/icons-material';

const list = ['Apple', 'Grape', 'Orange', 'Pineapple', 'Watermelon'];

// Styled components to replace makeStyles
const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
    transition: theme.transitions.create('all', { duration: theme.transitions.duration.short }),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: '0 16px',
}));

const SearchBarAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'searchActive',
})<{ searchActive?: boolean }>(({ theme, searchActive }) => ({
    background: theme.palette.background.paper,
    right: 0,
    width: searchActive ? `calc(100% - ${DRAWER_WIDTH}px)` : 0,
    [theme.breakpoints.down('md')]: {
        width: searchActive ? '100%' : 0,
    },
    '& ::-ms-clear': {
        width: 0,
        height: 0,
    },
    transition: theme.transitions.create('all', { duration: theme.transitions.duration.short }),
}));

const SearchField = styled(TextField)(({ theme }) => ({
    flex: 1,
    marginLeft: theme.spacing(2),
}));

export const searchResults = (searchString: string): string[] => {
    const q = searchString.toLowerCase().trim();
    const filteredItems = [];
    for (const item of list) {
        if (!item.toLowerCase().trim().includes(q)) {
            continue;
        }
        const re = new RegExp(q, 'gi');
        filteredItems.push(item.replace(re, '<strong>$&</strong>'));
    }
    return filteredItems;
};

export const SearchBar = (): JSX.Element => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [filteredList, setFilteredList] = useState(list);
    const [searchActive, setSearchActive] = useState(false);
    const [query, setQuery] = useState('');
    const md = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        if (searchActive) {
            if (query === '') {
                setFilteredList(list);
            } else {
                setFilteredList(searchResults(query));
            }
        }
    }, [query, searchActive]);

    useEffect(() => {
        if (!searchActive) {
            setQuery('');
            setFilteredList(list);
        }
    }, [searchActive]);

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* The Regular App Bar */}
            <AppBarRoot
                data-cy="blui-toolbar"
                position={'sticky'}
                className={clsx(searchActive && 'searchActive')}
                sx={{ opacity: searchActive ? 0 : 1 }}
            >
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
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Search Bar
                    </Typography>
                    <Spacer />
                    <IconButton
                        color={'inherit'}
                        onClick={(): void => setSearchActive(true)}
                        edge={'end'}
                        data-cy="search-btn"
                        size="large"
                    >
                        <Search />
                    </IconButton>
                </ToolbarGutters>
            </AppBarRoot>

            {/* Search Bar */}
            <SearchBarAppBar position={'fixed'} color={'default'} searchActive={searchActive} elevation={0}>
                <ToolbarGutters>
                    <IconButton
                        color={'inherit'}
                        edge={'start'}
                        style={{ color: theme.palette.text.secondary }}
                        onClick={(): void => setSearchActive(false)}
                        size="large"
                    >
                        <ArrowBack />
                    </IconButton>
                    {searchActive && (
                        <SearchField
                            value={query}
                            placeholder={'Search'}
                            onChange={(evt): void => setQuery(evt.target.value)}
                            InputProps={{ disableUnderline: true }}
                            autoFocus
                            id={'#search-field'}
                            data-cy={'search-field'}
                            variant="standard"
                        />
                    )}
                    {query && (
                        <IconButton
                            color={'inherit'}
                            onClick={(): void => setQuery('')}
                            edge={'end'}
                            data-cy="clear-search-field"
                            style={{ color: theme.palette.text.secondary }}
                            size="large"
                        >
                            <Close />
                        </IconButton>
                    )}
                </ToolbarGutters>
            </SearchBarAppBar>

            {/* List */}
            <List data-cy="list-view" style={{ backgroundColor: theme.palette.background.paper, padding: 0 }}>
                {filteredList.map((item, index) => (
                    <InfoListItem
                        avatar
                        hidePadding
                        key={index}
                        title={
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            <div dangerouslySetInnerHTML={{ __html: item }} />
                        }
                        divider={'full'}
                        statusColor={'transparent'}
                        iconColor={theme.palette.text.primary}
                    />
                ))}
            </List>
            {filteredList.length < 1 && (
                <Typography
                    variant={'body2'}
                    style={{ marginLeft: theme.spacing(9), marginTop: theme.spacing(3), fontWeight: 600 }}
                >
                    No Results.
                </Typography>
            )}
        </div>
    );
};
