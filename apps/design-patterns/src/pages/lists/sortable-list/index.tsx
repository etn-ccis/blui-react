/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Theme, useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { InfoListItem, Spacer } from '@brightlayer-ui/react-components';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';

import { OnSortEndProps, SortableListEditProps, SortableListItemProps } from './types';

const itemsList: string[] = ['Item 01', 'Item 02', 'Item 03'];

const SortableListRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
}));

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
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
    marginTop: theme.spacing(3),
    boxShadow: theme.shadows[1],
    borderRadius: 4,
    [theme.breakpoints.down('md')]: {
        marginTop: 0,
        boxShadow: 'none',
        borderRadius: 0,
    },
}));

const SortButtonMobile = styled(IconButton)(({ theme }) => ({
    color: theme.palette.background.default,
    marginRight: theme.spacing(-1),
}));

const SortButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
});

const DragHandleIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'transparent',
    [theme.breakpoints.down('md')]: {
        marginLeft: 4,
    },
}));

const DragHandle = SortableHandle(() => <DragHandleIcon />);

const SortableListItem = SortableElement(({ listItem, ...other }: SortableListItemProps) => (
    <InfoListItem
        {...other}
        sx={{
            pl: 0,
            '& .MuiListItemText-root': { ml: (theme) => theme.spacing(2) },
        }}
        icon={
            <DragHandleIconButton disableRipple size="large">
                <DragHandle />
            </DragHandleIconButton>
        }
        title={listItem}
    />
));

export const SortableListEdit = SortableContainer(({ list, isSorting, isMobile }: SortableListEditProps) => (
    <List
        dense
        disablePadding
        component={'nav'}
        data-testid="sortableListEdit"
        sx={{ cursor: isSorting ? 'grabbing' : 'default' }}
    >
        {list.map((listItem: string, i: number) => (
            <SortableListItem
                key={`item-${i}`}
                data-cy={`sortable-row-${i}`}
                index={i}
                listItem={listItem}
                divider={list.length - 1 !== i || isMobile ? 'full' : undefined}
            />
        ))}
    </List>
));

export const SortableList = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [list, setList] = useState<string[]>(itemsList);
    const [sortable, setSortable] = useState<boolean>(false);
    const [isSorting, setIsSorting] = useState<boolean>(false);
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const arrayMove = useCallback((newList: string[], oldIndex: number, newIndex: number) => {
        const element = newList[oldIndex];
        newList.splice(oldIndex, 1);
        newList.splice(newIndex, 0, element);
        return newList;
    }, []);

    const onSortEnd = useCallback(
        ({ oldIndex, newIndex }: OnSortEndProps): void => {
            setList(arrayMove(list, oldIndex, newIndex));
            setIsSorting(false);
        },
        [list, setList]
    );

    return (
        <SortableListRoot>
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
                            sx={{ mr: 2.5 }}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Sortable List
                    </Typography>
                    <Spacer />
                    {isMobile && (
                        <SortButtonMobile data-cy="sort-done" onClick={(): void => setSortable(!sortable)} size="large">
                            {sortable ? <CheckIcon /> : <SortIcon />}
                        </SortButtonMobile>
                    )}
                </ToolbarGutters>
            </AppBarRoot>
            <Container>
                {!isMobile && (
                    <SortButtonContainer>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={(): void => setSortable(!sortable)}
                            startIcon={
                                sortable ? <CheckIcon data-cy="sort-done-btn" /> : <SortIcon data-cy="sort-btn" />
                            }
                        >
                            <Typography noWrap color={'inherit'}>
                                {sortable ? 'Done' : 'Sort'}
                            </Typography>
                        </Button>
                    </SortButtonContainer>
                )}
                <CardRoot>
                    {sortable && (
                        <SortableListEdit
                            list={list}
                            onSortEnd={onSortEnd}
                            useDragHandle={true}
                            isSorting={isSorting}
                            onSortStart={(): void => setIsSorting(true)}
                            helperClass=""
                            isMobile={isMobile}
                        />
                    )}
                    {!sortable && (
                        <List dense className={'list'} data-testid="list" disablePadding component={'nav'}>
                            {list.map((listItem: string, i: number) => (
                                <InfoListItem
                                    data-testid="infoListItem"
                                    sx={{}}
                                    hidePadding
                                    key={`item-${i}`}
                                    title={listItem}
                                    divider={list.length - 1 !== i || isMobile ? 'full' : undefined}
                                    iconAlign={'center'}
                                />
                            ))}
                        </List>
                    )}
                </CardRoot>
            </Container>
        </SortableListRoot>
    );
};
