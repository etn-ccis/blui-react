/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
    AppBar,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { InfoListItem } from '@brightlayer-ui/react-components';

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
}));

const AppBarRoot = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const TextFieldRoot = styled(TextField)(({ theme }) => ({
    width: 128,
    '& .MuiInputBase-input': {
        paddingTop: 11,
        textAlign: 'right',
    },
}));

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
    maxWidth: 528,
    width: 'auto',
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    boxSizing: 'border-box',
}));

const createData = (id: number, name: string, min: number, max: number): any => ({ id, name, min, max });

const rows = [createData(1, 'Power', 123, 456), createData(2, 'Xpert', 123, 456), createData(3, 'Blue', 123, 456)];

const getLastRowStyles = (index: number): { borderBottomWidth: number } => ({
    borderBottomWidth: index === rows.length - 1 ? 0 : 1,
});

export const TableFormValidation = (): JSX.Element => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    const getTable = (): JSX.Element => (
        <TableContainerStyled component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align={'left'}>Name</TableCell>
                        <TableCell align={'right'}>Min</TableCell>
                        <TableCell align={'right'}>Max</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.id} hover={false}>
                            <TableCell component={'th'} scope={'row'} style={getLastRowStyles(index)}>
                                {row.id}
                            </TableCell>
                            <TableCell align={'left'} style={getLastRowStyles(index)}>
                                {row.name}
                            </TableCell>
                            <TableCell align={'right'} style={getLastRowStyles(index)}>
                                <TextFieldRoot variant={'filled'} value={row.min} />
                            </TableCell>
                            <TableCell align={'right'} style={getLastRowStyles(index)}>
                                <TextFieldRoot variant={'filled'} value={row.max} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainerStyled>
    );

    const getList = (): JSX.Element => (
        <>
            {rows.map((row, index) => (
                <div key={index}>
                    <InfoListItem
                        icon={
                            <Typography variant={'body1'} style={{ color: theme.palette.text.secondary }}>
                                #{row.id}
                            </Typography>
                        }
                        title={<Typography variant={'h6'}>{row.name}</Typography>}
                    />
                    <InfoListItem title={'Min'} rightComponent={<TextFieldRoot variant={'filled'} value={row.min} />} />
                    <InfoListItem title={'Max'} rightComponent={<TextFieldRoot variant={'filled'} value={row.max} />} />
                    <Divider
                        variant={index === rows.length - 1 ? 'fullWidth' : 'inset'}
                        style={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}
                    />
                </div>
            ))}
        </>
    );

    return (
        <>
            <AppBarRoot data-cy={'blui-toolbar'} position={'sticky'}>
                <ToolbarGutters disableGutters>
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
                        In a Table
                    </Typography>
                </ToolbarGutters>
            </AppBarRoot>
            {smDown ? null : getTable()}
            {smUp ? null : <div style={{ background: 'white' }}>{getList()}</div>}
            <Typography style={{ padding: theme.spacing(2) }} variant={'body1'}>
                Remember that in a real application you would need to implement form validations to check, for example,
                &quot;Min&quot; is less than &quot;Max&quot;.
            </Typography>
        </>
    );
};
