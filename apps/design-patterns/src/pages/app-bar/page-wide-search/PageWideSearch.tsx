import React, { useCallback, useState } from 'react';
import {
    Badge,
    Card,
    Divider,
    IconButton,
    InputProps,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, InfoListItem, Spacer } from '@brightlayer-ui/react-components';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { Close, Search } from '@mui/icons-material';

type OnChangeHandler = InputProps['onChange'];

const ToolbarGutters = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(0.5),
}));

const BodyContent = styled('div')(({ theme }) => ({
    maxWidth: '900px',
    margin: '0 auto',
    padding: `0 ${theme.spacing(2)}`,
    [theme.breakpoints.down('sm')]: {
        padding: 0,
    },
}));

const ToolbarRightContent = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});

const AppBarRoot = styled('div')(({ theme }) => ({
    zIndex: theme.zIndex.appBar + 1,
}));

const MobileAppbar = styled('div')(({ theme }) => ({
    height: theme.spacing(7),
    backgroundColor: theme.palette.background.paper,
}));

const MobileSearchToolbar = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    height: theme.spacing(7),
    overflowX: 'auto',
}));

const DesktopSearchContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginRight: theme.spacing(4),
}));

const ResultsCard = styled(Card)(({ theme }) => ({
    margin: `0 ${theme.spacing(4)}`,
    [theme.breakpoints.down('sm')]: {
        margin: 0,
        borderRadius: 0,
    },
}));

const NoResults = styled(Typography)(({ theme }) => ({
    margin: `0 ${theme.spacing(4)}`,
    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(4),
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OutlinedTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: '20px',
            borderColor: 'red',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#C52328',
            borderWidth: '2px',
        },
    },
}));

const data = ['Apple', 'Grape', 'Orange', 'Pineapple', 'Watermelon'];

export const PageWideSearch = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(data);

    const search = useCallback((term: string): void => {
        if (term === '') {
            setSearchResults(data);
            return;
        }

        const q = term.toLowerCase().trim();
        const filteredItems = [];
        for (const item of data) {
            if (!item.toLowerCase().trim().includes(q)) {
                continue;
            }
            const re = new RegExp(q, 'gi');
            filteredItems.push(item.replace(re, '<strong>$&</strong>'));
        }
        setSearchResults(filteredItems);
    }, []);

    const onSearchTermChange: OnChangeHandler = useCallback(
        (event) => {
            setSearchTerm(event.target.value);
            search(event.target.value);
        },
        [searchTerm]
    );

    return (
        <div style={{ minHeight: '100vh' }}>
            <AppBar variant={'collapsed'} position={'sticky'}>
                <AppBarRoot>
                    <Toolbar data-cy={'toolbar'} disableGutters>
                        <ToolbarGutters>
                            {md ? null : (
                                <IconButton
                                    data-cy="toolbar-menu"
                                    onClick={(): void => {
                                        dispatch({ type: TOGGLE_DRAWER, payload: true });
                                    }}
                                    color={'inherit'}
                                    edge={'start'}
                                    style={{ marginRight: 20 }}
                                    size="large"
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </ToolbarGutters>
                        <Typography variant={'h6'} color={'inherit'}>
                            {isMobile ? 'Page Search' : 'Page Wide Search'}
                        </Typography>
                        <Spacer />
                        <ToolbarRightContent>
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
                </AppBarRoot>
            </AppBar>
            {isMobile && (
                <AppBar variant={'collapsed'} elevation={0}>
                    <MobileAppbar>
                        <MobileSearchToolbar>
                            <Toolbar data-cy={'search-field'}>
                                <OutlinedTextField
                                    placeholder="Search"
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={onSearchTermChange}
                                    InputProps={{
                                        startAdornment: (
                                            <Search
                                                style={{
                                                    marginRight: theme.spacing(4),
                                                    color: theme.palette.text.secondary,
                                                }}
                                            />
                                        ),
                                        endAdornment: searchTerm.length > 0 && (
                                            <Close
                                                onClick={(): void => {
                                                    setSearchTerm('');
                                                    search('');
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: theme.palette.text.secondary,
                                                    marginLeft: theme.spacing(1),
                                                }}
                                            />
                                        ),
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </Toolbar>
                        </MobileSearchToolbar>
                    </MobileAppbar>
                </AppBar>
            )}
            <Divider />
            <BodyContent>
                {!isMobile && (
                    <DesktopSearchContainer>
                        <Spacer />
                        <TextField
                            data-cy={'search-field'}
                            placeholder="Search"
                            variant="standard"
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            InputProps={{
                                startAdornment: (
                                    <Search
                                        style={{
                                            color: theme.palette.text.secondary,
                                            marginRight: theme.spacing(1),
                                        }}
                                    />
                                ),
                            }}
                        />
                    </DesktopSearchContainer>
                )}

                {searchResults.length > 0 && (
                    <ResultsCard elevation={isMobile ? 0 : undefined}>
                        {searchResults.map((item, index) => (
                            <InfoListItem
                                data-cy={'list-items'}
                                title={
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    <div dangerouslySetInnerHTML={{ __html: item }} />
                                }
                                key={index}
                                hidePadding
                                divider={isMobile || index !== searchResults.length - 1 ? 'full' : undefined}
                            />
                        ))}
                    </ResultsCard>
                )}

                {searchResults.length === 0 && <NoResults variant={'body1'}>No results.</NoResults>}
            </BodyContent>
        </div>
    );
};
