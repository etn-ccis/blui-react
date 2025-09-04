import React, { useCallback, useState } from 'react';
import {
    AppBar,
    Button,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import { Spacer } from '@brightlayer-ui/react-components';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import * as colors from '@brightlayer-ui/colors';

export type ListItemType = {
    id: number;
    name: string;
    ip: string;
    checked: boolean;
};

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
    transition: theme.transitions.create('opacity', { duration: theme.transitions.duration.shorter }),
}));

const ContextualAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    backgroundColor: colors.black[500],
    color: colors.white[50],
    right: 0,
    width: 0,
    opacity: 0,
    ...(active && {
        [theme.breakpoints.down('md')]: {
            width: '100%',
            opacity: 1,
        },
    }),
}));

const CheckboxCell = styled(TableCell)(({ theme }) => ({
    padding: `0 0 0 ${theme.spacing(1)}`,
    minWidth: '56px',
    [theme.breakpoints.down('md')]: {
        padding: `0 0 0 ${theme.spacing(1)}`,
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DataCell = styled(TableCell)(({ theme }) => ({
    minWidth: '150px',
}));

const DeleteBtn = styled(Button)(({ theme }) => ({
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
}));

const DeleteRow = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const NoResult = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
}));

const NoteText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(3),
}));

const ResetTableLink = styled('span')(({ theme }) => ({
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    cursor: 'pointer',
}));

const SecondaryToolbar = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
}));

const TableBodyDiv = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const TableContainerDiv = styled('div')(({ theme }) => ({
    overflow: 'auto',
    maxWidth: '800px',
    width: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        maxWidth: 'unset',
        padding: 0,
    },
}));

const ToolbarGutters = styled(Toolbar)({
    paddingLeft: 16,
    paddingRight: 4,
});

const createItem = (index: number, ip: string): ListItemType => ({
    id: index,
    name: `Device 0${index}`,
    ip: ip,
    checked: false,
});

const generatedList: ListItemType[] = [];

for (let i = 1; i < 5; i++) {
    generatedList.push(createItem(i, '192.168.0.1'));
}

export const ContextualAction = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [list, setList] = useState<ListItemType[]>(generatedList);
    const [selectedItems, setSelectedItems] = useState<ListItemType[]>([]);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const onSelect = useCallback(
        (item: ListItemType): void => {
            if (!selectedItems.includes(item)) {
                setSelectedItems([...selectedItems, item]);
            } else {
                const index = selectedItems.indexOf(item);
                setSelectedItems(selectedItems.filter((_: ListItemType, i: number) => i !== index));
            }
        },
        [selectedItems]
    );

    const isSelected = useCallback((item: ListItemType): boolean => selectedItems.includes(item), [selectedItems]);

    const onDelete = useCallback((): void => {
        const updatedList = [...list];

        selectedItems.forEach((item: ListItemType) => {
            const index = updatedList.indexOf(item);
            updatedList.splice(index, 1);
        });

        setList(updatedList);
        setSelectedItems([]);
    }, [list, selectedItems]);

    const resetTable = useCallback((): void => {
        setList(list);
    }, []);

    const onClose = useCallback((): void => {
        setSelectedItems([]);
    }, []);

    const selectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            const newSelectedItems = list.map((item) => item);
            setSelectedItems(newSelectedItems);
            return;
        }
        setSelectedItems([]);
    };

    const getTable = (): JSX.Element => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <CheckboxCell padding="checkbox">
                            <Checkbox
                                sx={{
                                    color: theme.palette.primary.main,
                                    '&.Mui-checked': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                                indeterminate={selectedItems.length > 0 && selectedItems.length < list.length}
                                checked={list.length > 0 && selectedItems.length === list.length}
                                onChange={selectAll}
                                name="checkbox-header-cell"
                                color="primary"
                                size="medium"
                                data-cy={'table-header-checkbox'}
                            />
                        </CheckboxCell>
                        <DataCell>Name</DataCell>
                        <DataCell>IP Address</DataCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((row, index) => (
                        <TableRow
                            key={index}
                            hover={false}
                            selected={isSelected(row)}
                            sx={
                                isSelected(row)
                                    ? {
                                          backgroundColor: `rgba(${theme.palette.primary.main}, 0.05)`,
                                      }
                                    : undefined
                            }
                        >
                            <CheckboxCell component="th" scope="row" data-cy={'table-cell-checkbox'}>
                                <Checkbox
                                    value={row.name}
                                    onChange={(): void => onSelect(row)}
                                    checked={isSelected(row)}
                                    name="checkbox-col-cell"
                                    color="primary"
                                    size="medium"
                                />
                            </CheckboxCell>
                            <DataCell>{row.name}</DataCell>
                            <DataCell>{row.ip}</DataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <AppBarRoot data-cy="app-bar" position={'sticky'}>
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
                        Contextual App Bar
                    </Typography>
                </ToolbarGutters>
            </AppBarRoot>
            <ContextualAppBar active={selectedItems.length !== 0 && isMobile} position={'fixed'} color={'default'}>
                <SecondaryToolbar>
                    <IconButton
                        color={'inherit'}
                        edge={'start'}
                        style={{ marginRight: 20 }}
                        onClick={onClose}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant={'h6'} color={'inherit'}>
                        {selectedItems.length} selected
                    </Typography>
                    <Spacer />
                    <IconButton color={'inherit'} edge={'end'} onClick={onDelete} size="large">
                        <DeleteIcon />
                    </IconButton>
                </SecondaryToolbar>
            </ContextualAppBar>
            <div>
                <TableBodyDiv>
                    <TableContainerDiv>
                        {isMobile ? null : (
                            <DeleteRow>
                                <Typography variant={'caption'} color={'inherit'}>
                                    {selectedItems.length} selected item(s)
                                </Typography>
                                <DeleteBtn
                                    data-cy={'delete-btn'}
                                    variant={'outlined'}
                                    startIcon={<DeleteIcon />}
                                    disabled={selectedItems.length === 0}
                                    onClick={onDelete}
                                >
                                    Delete selected items
                                </DeleteBtn>
                            </DeleteRow>
                        )}
                        <div>{getTable()}</div>
                        {list.length === 0 ? (
                            <NoResult data-cy={'empty-table'}>
                                No items found.{' '}
                                <ResetTableLink onClick={resetTable} data-cy={'reset'}>
                                    Reset table
                                </ResetTableLink>
                            </NoResult>
                        ) : undefined}

                        {isMobile ? null : (
                            <NoteText variant="body2">The contextual app bar is for mobile only.</NoteText>
                        )}
                    </TableContainerDiv>
                </TableBodyDiv>
            </div>
        </div>
    );
};
