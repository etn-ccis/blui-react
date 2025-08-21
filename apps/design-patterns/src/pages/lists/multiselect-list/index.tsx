/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import {
    AppBar,
    Button,
    Card,
    CardContent,
    Checkbox,
    Toolbar,
    Typography,
    IconButton,
    Theme,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { InfoListItem, Spacer } from '@brightlayer-ui/react-components';

import * as colors from '@brightlayer-ui/colors';

export type ListItemType = {
    id: number;
    name: string;
    checked: boolean;
    day: string;
};

const category = ['High Humidity', 'Battery Service', 'Bypass Over Frequency'];
const days = ['Today', 'Yesterday'];

const createItem = (index: number, name: string, day: string): ListItemType => ({
    id: index,
    name: name,
    checked: false,
    day: day,
});

const generatedList: ListItemType[] = [];

for (let i = 0; i < 5; i++) {
    if (i < 3) {
        generatedList.push(createItem(i, category[i], 'Today'));
    } else {
        generatedList.push(createItem(i, category[i - 3], 'Yesterday'));
    }
}
const categorizeList = (list: ListItemType[]): any =>
    list.reduce((r, a) => {
        r[a.day] = r[a.day] || [];
        r[a.day].push(a);
        return r;
    }, Object.create(null));

// Styled components to replace makeStyles
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
        boxShadow: 'none',
        borderRadius: 0,
        marginBottom: theme.spacing(2),
    },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: 0,
    '&:last-child': {
        paddingBottom: 0,
    },
}));

const StyledDeleteBtn = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    color: colors.white[50],
    height: '36px',
    '&:hover': {
        backgroundColor: colors.red[300],
    },
}));

const DeleteRow = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const ExampleContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
    margin: '0 auto',
    maxWidth: '816px',
    [theme.breakpoints.down('md')]: {
        padding: 0,
        boxShadow: 'none',
        borderRadius: 0,
        maxWidth: 'unset',
    },
}));

const ListItemIconSx = (theme: Theme) => ({
    marginLeft: theme.spacing(-1),
});

const ListItemTitleSx = (theme: Theme) => ({
    marginLeft: theme.spacing(1),
});

const ListItemRootSx = (theme: Theme) => ({
    backgroundColor: 'rgba(0, 123, 193, 0.05)',
});

const NoResultListItemSx = (theme: Theme) => ({
    marginLeft: theme.spacing(0.5),
});

const PanelHeaderRoot1Sx = (theme: Theme) => ({
    paddingLeft: theme.spacing(1),
    '& h6': {
        marginLeft: theme.spacing(1),
    },
});

const PanelHeaderRoot2Sx = (theme: Theme) => ({
    paddingLeft: theme.spacing(2),
    '& h6': {
        marginLeft: theme.spacing(1),
    },
});

const ResetDataLinkSx = (theme: Theme) => ({
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    cursor: 'pointer',
});

const ResetListItemSx = (theme: Theme) => ({
    paddingLeft: theme.spacing(2.5),
});

const ToolbarGuttersSx = (theme: Theme) => ({
    padding: `0 ${theme.spacing(2)}`,
});

const CheckboxIndeterminateSx = (theme: Theme) => ({
    color: theme.palette.primary.main,
});

export const MultiselectList = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const [list, setList] = useState<ListItemType[]>(generatedList);
    const result = categorizeList(list);
    const [filteredResult, setFilteredResult] = useState(result);
    const [selectedItems1, setSelectedItems1] = useState<ListItemType[]>([]);
    const [selectedItems2, setSelectedItems2] = useState<ListItemType[]>([]);

    const onSelect = useCallback(
        (item: ListItemType): void => {
            switch (item.day) {
                case 'Yesterday': {
                    if (!selectedItems2.includes(item)) {
                        setSelectedItems2([...selectedItems2, item]);
                    } else {
                        const index = selectedItems2.indexOf(item);
                        setSelectedItems2(selectedItems2.filter((_: ListItemType, i: number) => i !== index));
                    }
                    break;
                }
                case 'Today':
                default: {
                    if (!selectedItems1.includes(item)) {
                        setSelectedItems1([...selectedItems1, item]);
                    } else {
                        const index = selectedItems1.indexOf(item);
                        setSelectedItems1(selectedItems1.filter((_: ListItemType, i: number) => i !== index));
                    }
                    break;
                }
            }
        },
        [selectedItems1, selectedItems2]
    );

    const isSelected = useCallback(
        (item: ListItemType): boolean => {
            switch (item.day) {
                case 'Yesterday': {
                    return selectedItems2.includes(item);
                }
                case 'Today':
                default: {
                    return selectedItems1.includes(item);
                }
            }
        },
        [selectedItems1, selectedItems2]
    );

    const isToday = useCallback((day: string): boolean => day === 'Today', []);

    const resetData = useCallback(
        (day: string): void => {
            const resetDayDetails = categorizeList(generatedList)[day];
            filteredResult[day] = resetDayDetails;
            setList(generatedList);
            setFilteredResult(filteredResult);
            if (isToday(day)) {
                setSelectedItems1([]);
            } else {
                setSelectedItems2([]);
            }
        },
        [filteredResult, selectedItems1, selectedItems2]
    );

    const onDelete = useCallback((): void => {
        const updatedList = [...list];

        selectedItems1.forEach((item: ListItemType) => {
            const index = updatedList.indexOf(item);
            updatedList.splice(index, 1);
        });

        selectedItems2.forEach((item: ListItemType) => {
            const index = updatedList.indexOf(item);
            updatedList.splice(index, 1);
        });

        const result1 = categorizeList(updatedList);

        setList(updatedList);
        setFilteredResult(result1);
        setSelectedItems1([]);
        setSelectedItems2([]);
    }, [list, filteredResult, selectedItems1, selectedItems2]);

    const selectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const day = event.target.value;
        if (event.target.checked) {
            const newSelectedItems = filteredResult[day].filter((item: ListItemType) => item.day === day);
            if (isToday(day)) {
                setSelectedItems1(newSelectedItems);
            } else {
                setSelectedItems2(newSelectedItems);
            }
            return;
        }
        if (isToday(day)) {
            setSelectedItems1([]);
        } else {
            setSelectedItems2([]);
        }
    };
    const emptyCard = (day: string): JSX.Element => (
        <div>
            <StyledCard>
                <StyledCardContent>
                    <div className="panel-header">
                        <InfoListItem
                            sx={isMobile ? ResetListItemSx(theme) : undefined}
                            title={
                                <Typography color={'primary'} variant={'subtitle2'}>
                                    {day}
                                </Typography>
                            }
                            divider={'full'}
                            dense
                            hidePadding
                        />
                    </div>
                    <div>
                        <InfoListItem
                            data-cy="no-result"
                            hidePadding
                            divider={isMobile ? 'full' : undefined}
                            sx={isMobile ? ResetListItemSx(theme) : undefined}
                            title={
                                <Typography data-cy={'empty-table'}>
                                    No results.{' '}
                                    <span
                                        style={ResetDataLinkSx(theme)}
                                        onClick={(): void => resetData(day)}
                                        data-cy={'reset'}
                                    >
                                        Reset data.
                                    </span>
                                </Typography>
                            }
                        />
                    </div>
                </StyledCardContent>
            </StyledCard>
        </div>
    );
    const getCardContent = (day: string): JSX.Element => (
        <div>
            {filteredResult[day] ? (
                <StyledCard>
                    <StyledCardContent>
                        {filteredResult[day].map((resultItem: ListItemType, index: number) => (
                            <div key={`result-item-${index}`}>
                                <div>
                                    {index === 0 ? (
                                        <div className="panel-header">
                                            <InfoListItem
                                                key={`list-header`}
                                                sx={
                                                    filteredResult[day].length !== 0
                                                        ? PanelHeaderRoot1Sx(theme)
                                                        : PanelHeaderRoot2Sx(theme)
                                                }
                                                icon={
                                                    filteredResult[day].length !== 0 ? (
                                                        <Checkbox
                                                            sx={CheckboxIndeterminateSx(theme)}
                                                            indeterminate={
                                                                isToday(day)
                                                                    ? selectedItems1.length > 0 &&
                                                                      selectedItems1.length < filteredResult[day].length
                                                                    : selectedItems2.length > 0 &&
                                                                      selectedItems2.length < filteredResult[day].length
                                                            }
                                                            checked={
                                                                isToday(day)
                                                                    ? filteredResult[day].length > 0 &&
                                                                      selectedItems1.length ===
                                                                          filteredResult[day].length
                                                                    : filteredResult[day].length > 0 &&
                                                                      selectedItems2.length ===
                                                                          filteredResult[day].length
                                                            }
                                                            onChange={selectAll}
                                                            value={day}
                                                            name="checkbox-header-cell"
                                                            color="primary"
                                                            size="medium"
                                                            data-cy={'table-header-checkbox'}
                                                            data-testid={'checkboxHeader'}
                                                        />
                                                    ) : undefined
                                                }
                                                title={
                                                    isToday(day) ? (
                                                        selectedItems1.length > 0 ? (
                                                            <Typography color={'primary'} variant={'subtitle2'}>
                                                                {day} (
                                                                {selectedItems1.length > 0 ? selectedItems1.length : ''}
                                                                )
                                                            </Typography>
                                                        ) : (
                                                            <Typography color={'primary'} variant={'subtitle2'}>
                                                                {day}
                                                            </Typography>
                                                        )
                                                    ) : selectedItems2.length > 0 ? (
                                                        <Typography color={'primary'} variant={'subtitle2'}>
                                                            {day} (
                                                            {selectedItems2.length > 0 ? selectedItems2.length : ''})
                                                        </Typography>
                                                    ) : (
                                                        <Typography color={'primary'} variant={'subtitle2'}>
                                                            {day}
                                                        </Typography>
                                                    )
                                                }
                                                divider={'full'}
                                                dense
                                                hidePadding
                                            />
                                        </div>
                                    ) : undefined}
                                </div>
                                <InfoListItem
                                    key={index}
                                    data-testid="infoListItem"
                                    data-cy={'list-content'}
                                    icon={
                                        <Checkbox
                                            value={resultItem.name}
                                            onChange={(): void => onSelect(resultItem)}
                                            checked={isSelected(resultItem)}
                                            name="checkbox-col-cell"
                                            color="primary"
                                            size="medium"
                                        />
                                    }
                                    sx={{
                                        ...(isSelected(resultItem) ? ListItemRootSx(theme) : {}),
                                        '& .MuiListItemIcon-root': ListItemIconSx(theme),
                                        '& .MuiListItemText-primary': ListItemTitleSx(theme),
                                    }}
                                    hidePadding
                                    title={resultItem.name}
                                    divider={filteredResult[day].length - 1 !== index || isMobile ? 'full' : undefined}
                                />
                            </div>
                        ))}
                    </StyledCardContent>
                </StyledCard>
            ) : (
                emptyCard(day)
            )}
        </div>
    );

    return (
        <div>
            <StyledAppBar position={'sticky'}>
                <Toolbar sx={ToolbarGuttersSx(theme)}>
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
                    <Typography variant={'h6'} data-cy={'blui-toolbar'} color={'inherit'}>
                        Multiselect List
                    </Typography>
                    <Spacer />
                    {md ? null : selectedItems1.length !== 0 || selectedItems2.length !== 0 ? (
                        <IconButton data-cy="delete-btn" color={'inherit'} onClick={onDelete} edge={'end'} size="large">
                            <DeleteIcon />
                        </IconButton>
                    ) : (
                        ''
                    )}
                </Toolbar>
            </StyledAppBar>
            <ExampleContainer>
                {isMobile ? null : (
                    <DeleteRow>
                        <StyledDeleteBtn
                            data-testid="deleteButton"
                            data-cy="delete-btn"
                            variant={'contained'}
                            color={'inherit'}
                            startIcon={<DeleteIcon />}
                            disabled={selectedItems1.length === 0 && selectedItems2.length === 0}
                            onClick={onDelete}
                        >
                            DELETE
                        </StyledDeleteBtn>
                    </DeleteRow>
                )}
                {days.map((day, index) => (
                    <div key={`item-${index}`}>{getCardContent(day)}</div>
                ))}
            </ExampleContainer>
        </div>
    );
};
