/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme, styled } from '@mui/material/styles';
import { InfoListItem, ListItemTag } from '@brightlayer-ui/react-components';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../../redux/actions';
import * as colors from '@brightlayer-ui/colors';

type Item = {
    id: number;
    title: string;
    hasTag?: boolean;
};

const itemList: Item[] = [
    {
        id: 1,
        title: 'High Humidity',
        hasTag: true,
    },
    {
        id: 2,
        title: 'Battery Service',
    },
    {
        id: 3,
        title: 'Bypass Over Frequency',
    },
];

const getTitle = (title: string): React.ReactNode => <Typography variant="subtitle1">{title}</Typography>;

const ActionListRoot = styled('div')(({ theme }) => ({
    minHeight: '100vh',
}));

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
}));

const ToolbarTextContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

const ToolBarSubtitle = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(-1),
}));

const HoveredInfoListItem = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const Container = styled('div')(({ theme }) => ({
    maxWidth: 818,
    padding: theme.spacing(3),
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        padding: 0,
        margin: 0,
    },
}));

const CardRoot = styled(Card)(({ theme }) => ({
    borderRadius: 4,
    [theme.breakpoints.down('md')]: {
        marginTop: 0,
        boxShadow: 'none',
        borderRadius: 0,
    },
}));

const CardContentRoot = styled(CardContent)(({ theme }) => ({
    padding: 0,
    '&:last-child': {
        paddingBottom: 0,
    },
}));

const RightComponentChevron = styled('div')(({ theme }) => ({
    color: theme.palette.text.secondary,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
    },
}));

const NoListItem = styled('div')(({ theme }) => ({
    height: theme.spacing(7),
    padding: 0,
}));

const NoListItemText = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        marginLeft: theme.spacing(2),
    },
}));

const ResetTableLink = styled('span')(({ theme }) => ({
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontWeight: 500,
}));

const MenuItemRoot = styled(MenuItem)(({ theme }) => ({
    minHeight: theme.spacing(6),
}));

const VersionNote = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(15),
}));

export const ActionListInline = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [list, setList] = useState(itemList.slice());
    const [hoveredItem, setHoveredItem] = useState(0);
    const [menuPosition, setMenuPosition] = useState<null | HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const options: string[] = ['Delete', 'Save', 'Archive'];

    const onMenuClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, i: number): void => {
            setMenuPosition(event.currentTarget);
            setActiveIndex(i);
        },
        [setMenuPosition, setActiveIndex]
    );

    const onMenuClose = useCallback((): void => {
        setMenuPosition(null);
        setActiveIndex(-1);
    }, [setMenuPosition, setActiveIndex]);

    const onDeleteItem = useCallback(
        (option: string, i: number): void => {
            if (option === 'Delete') {
                const tempList = list.slice();
                tempList.splice(i, 1);
                setList(tempList);
            }
            onMenuClose();
        },
        [list, onMenuClose]
    );

    const onResetData = useCallback((): void => {
        setList(itemList);
    }, []);

    return (
        <ActionListRoot>
            <AppBarRoot data-cy={'blui-toolbar'} position={'sticky'}>
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
                    <ToolbarTextContainer>
                        <Typography variant={'h6'} color={'inherit'}>
                            Local Item Actions
                        </Typography>
                        <ToolBarSubtitle variant={'body1'} color={'inherit'}>
                            Inline Actions
                        </ToolBarSubtitle>
                    </ToolbarTextContainer>
                </ToolbarGutters>
            </AppBarRoot>
            <Container>
                <CardRoot>
                    <CardContentRoot>
                        {list.length ? (
                            list.map(
                                (item, i): JSX.Element => (
                                    <InfoListItem
                                        key={i}
                                        data-testid="infoListItem"
                                        classes={{
                                            root: hoveredItem === item.id && !isMobile ? undefined : undefined,
                                            rightComponent: undefined,
                                        }}
                                        sx={
                                            hoveredItem === item.id && !isMobile
                                                ? { backgroundColor: theme.palette.background.default }
                                                : undefined
                                        }
                                        hidePadding
                                        ripple
                                        title={getTitle(item.title)}
                                        divider={list.length - 1 !== i || isMobile ? 'full' : undefined}
                                        info={
                                            item.hasTag && isMobile
                                                ? [
                                                      <ListItemTag
                                                          key="active"
                                                          label={'active'}
                                                          backgroundColor={colors.red[500]}
                                                      />,
                                                  ]
                                                : undefined
                                        }
                                        rightComponent={
                                            !isMobile ? (
                                                hoveredItem === item.id ? (
                                                    <div>
                                                        <Tooltip title={'Delete'}>
                                                            <StyledIconButton
                                                                data-testid="deleteIcon"
                                                                onClick={(): void => onDeleteItem('Delete', i)}
                                                                size="large"
                                                            >
                                                                <DeleteIcon />
                                                            </StyledIconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Save'}>
                                                            <StyledIconButton data-testid="saveIcon" size="large">
                                                                <BookmarkIcon />
                                                            </StyledIconButton>
                                                        </Tooltip>
                                                        <Tooltip title={'Archive'}>
                                                            <StyledIconButton data-testid="archiveIcon" size="large">
                                                                <ArchiveIcon />
                                                            </StyledIconButton>
                                                        </Tooltip>
                                                    </div>
                                                ) : item.hasTag ? (
                                                    <ListItemTag label={'active'} backgroundColor={colors.red[500]} />
                                                ) : undefined
                                            ) : (
                                                <>
                                                    <IconButton
                                                        data-cy={'action-menu'}
                                                        onClick={(evt): void => onMenuClick(evt, i)}
                                                        edge={'end'}
                                                        size="large"
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        id={'long-menu'}
                                                        anchorEl={menuPosition}
                                                        onClose={onMenuClose}
                                                        open={Boolean(menuPosition)}
                                                        PaperProps={{
                                                            style: {
                                                                minWidth: theme.spacing(19),
                                                            },
                                                        }}
                                                        elevation={6}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'right',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                    >
                                                        {options.map((option) => (
                                                            <MenuItemRoot
                                                                key={option}
                                                                onClick={(): void => onDeleteItem(option, activeIndex)}
                                                            >
                                                                {option}
                                                            </MenuItemRoot>
                                                        ))}
                                                    </Menu>
                                                </>
                                            )
                                        }
                                        onMouseOver={(): void => setHoveredItem(item.id)}
                                        onMouseLeave={(): void => setHoveredItem(0)}
                                    />
                                )
                            )
                        ) : (
                            <InfoListItem
                                data-testid="infoListItem"
                                classes={{
                                    root: undefined,
                                    listItemText: undefined,
                                }}
                                sx={{
                                    height: theme.spacing(7),
                                    padding: 0,
                                    '& .MuiListItemText-root': {
                                        [theme.breakpoints.down('md')]: {
                                            marginLeft: theme.spacing(2),
                                        },
                                    },
                                }}
                                hidePadding
                                ripple
                                title={
                                    <div>
                                        <Typography variant="body2" align={isMobile ? 'left' : 'center'}>
                                            No items found.{' '}
                                            <ResetTableLink onClick={onResetData}>Reset data</ResetTableLink>
                                        </Typography>
                                    </div>
                                }
                                divider={isMobile ? 'full' : undefined}
                            />
                        )}
                    </CardContentRoot>
                </CardRoot>
                {!isMobile && (
                    <VersionNote variant="body1" align="center">
                        This behaviour is exclusive to desktop version.
                    </VersionNote>
                )}
            </Container>
        </ActionListRoot>
    );
};
