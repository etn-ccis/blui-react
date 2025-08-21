/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select from '@mui/material/Select';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, styled } from '@mui/material/styles';
import { InfoListItem } from '@brightlayer-ui/react-components';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../../redux/actions';

type Item = {
    id: number;
    name: string;
    registeredBeforeDays: number;
    details: string;
};

const ActionListRoot = styled('div')(({ theme }) => ({
    minHeight: '100vh',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));

const ToolbarTextContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

const ToolBarSubtitle = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(-1),
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

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 4,
    [theme.breakpoints.down('md')]: {
        marginTop: 0,
        boxShadow: 'none',
        borderRadius: 0,
    },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CardHeaderTitle = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});

const CategoryName = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: theme.spacing(11),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    '&:focus': {
        backgroundColor: theme.palette.background.paper,
    },
    '&.MuiFilledInput-input': {
        padding: 0,
    },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    minHeight: theme.spacing(6),
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const DropDownIconSx = (theme: any) => ({
    right: 0,
    color: theme.palette.text.primary,
});

const MenuPropsSx = (theme: any) => ({
    '& .MuiPaper-root': {
        width: 154,
        marginTop: theme.spacing(2),
    },
});

const CardContentSx = {
    padding: 0,
    '&:last-child': {
        paddingBottom: 0,
    },
};

const NoListItemSx = {
    height: 56,
    padding: 0,
};

const RightComponentChevronSx = (theme: any) => ({
    color: theme.palette.text.secondary,
});

const itemList: Item[] = [
    {
        id: 1,
        name: 'Item 01',
        registeredBeforeDays: 8,
        details: 'Registered 8 days ago',
    },
    {
        id: 2,
        name: 'Item 02',
        registeredBeforeDays: 15,
        details: 'Registered 15 days ago',
    },
    {
        id: 3,
        name: 'Item 03',
        registeredBeforeDays: 30,
        details: 'Registered 28 days ago',
    },
];

const ranges: number[] = [30, 15, 7];

export const ActionListPanelHeader = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const [range, setRange] = useState<string>(String(ranges[0]));
    const [list, setList] = useState(itemList);

    const handleOnChange = useCallback((selectedRange: number): void => {
        const tempList = itemList.filter((item) => item.registeredBeforeDays <= selectedRange);
        setList(tempList);
    }, []);

    const getCardHeaderTitle = (): JSX.Element => (
        <CardHeaderTitle>
            <CategoryName variant="subtitle2">Category Name</CategoryName>
            <StyledFormControl variant={'filled'}>
                <StyledSelect
                    data-cy={'range-selector'}
                    fullWidth
                    disableUnderline
                    value={range}
                    defaultValue={range}
                    labelId={'range-label'}
                    onChange={(event): void => {
                        setRange(String(event.target.value));
                        handleOnChange(Number(event.target.value));
                    }}
                    IconComponent={(props) => <span {...props} style={DropDownIconSx(theme)} />}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        sx: MenuPropsSx(theme),
                    }}
                >
                    {ranges.map((rangeItem) => (
                        <StyledMenuItem key={rangeItem} value={rangeItem}>
                            <Typography variant="subtitle2">{`${rangeItem} Days`}</Typography>
                        </StyledMenuItem>
                    ))}
                </StyledSelect>
            </StyledFormControl>
        </CardHeaderTitle>
    );

    return (
        <ActionListRoot>
            <StyledAppBar data-cy={'blui-toolbar'} position={'sticky'}>
                <StyledToolbar>
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
                    <ToolbarTextContainer>
                        <Typography variant={'h6'} color={'inherit'}>
                            Global Action List
                        </Typography>
                        <ToolBarSubtitle variant={'body1'} color={'inherit'}>
                            In Panel Header
                        </ToolBarSubtitle>
                    </ToolbarTextContainer>
                </StyledToolbar>
            </StyledAppBar>
            <Container>
                <StyledCard>
                    <StyledCardHeader title={getCardHeaderTitle()} />
                    <CardContent sx={CardContentSx}>
                        {list.length ? (
                            list.map(
                                (item, i): JSX.Element => (
                                    <InfoListItem
                                        key={i}
                                        data-testid="infoListItem"
                                        sx={RightComponentChevronSx(theme)}
                                        hidePadding
                                        ripple
                                        title={item.name}
                                        subtitle={item.details}
                                        divider={list.length - 1 !== i || isMobile ? 'full' : undefined}
                                        chevron
                                    />
                                )
                            )
                        ) : (
                            <InfoListItem
                                data-testid="infoListItem"
                                sx={NoListItemSx}
                                hidePadding
                                ripple
                                title={
                                    <Typography variant="body2" align="center">
                                        No items found.
                                    </Typography>
                                }
                                divider={isMobile ? 'full' : undefined}
                            />
                        )}
                    </CardContent>
                </StyledCard>
            </Container>
        </ActionListRoot>
    );
};
