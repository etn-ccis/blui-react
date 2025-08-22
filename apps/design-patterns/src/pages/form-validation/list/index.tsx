import React from 'react';
import { AppBar, Card, IconButton, Switch, TextField, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { Dns, Menu, Timeline } from '@mui/icons-material';
import List from '@mui/material/List';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { InfoListItem } from '@brightlayer-ui/react-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContainerWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    flex: '1 1 0',
}));

const Container = styled(Card)(({ theme }) => ({
    maxWidth: 600,
    margin: theme.spacing(3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: '0 16px',
}));

const TextFieldRoot = styled(TextField)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: 138,
    },
}));

const SkinnyInputStyle = {
    paddingTop: 11,
};

export const ListFormValidation = (): JSX.Element => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const md = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            <AppBarRoot data-cy={'blui-toolbar'} position={'sticky'}>
                <ToolbarGutters>
                    {md ? null : (
                        <IconButton
                            data-cy={'toolbar-menu'}
                            color={'inherit'}
                            onClick={(): void => {
                                dispatch({ type: TOGGLE_DRAWER, payload: true });
                            }}
                            edge={'start'}
                            style={{ marginRight: 20 }}
                            size="large"
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        In a List
                    </Typography>
                </ToolbarGutters>
            </AppBarRoot>

            <ContainerWrapper>
                <Container>
                    <List disablePadding style={{ width: '100%' }}>
                        <InfoListItem
                            icon={<Dns />}
                            divider={'partial'}
                            title={'IP Address'}
                            rightComponent={
                                <TextFieldRoot
                                    data-cy={'ip-address'}
                                    defaultValue={'10.0.0.1'}
                                    variant={'filled'}
                                    inputProps={{
                                        style: SkinnyInputStyle,
                                    }}
                                />
                            }
                        ></InfoListItem>

                        <InfoListItem
                            icon={<Timeline />}
                            divider={'full'}
                            title={'Insight Report'}
                            subtitle={'Auto-report every 2 months'}
                            rightComponent={<Switch name={'demo-switch'} data-cy={'switch'} />}
                            data-cy={'switch'}
                        ></InfoListItem>
                    </List>
                </Container>
            </ContainerWrapper>
        </>
    );
};
