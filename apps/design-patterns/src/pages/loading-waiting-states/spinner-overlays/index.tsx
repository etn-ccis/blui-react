import React, { useState, useEffect, useCallback } from 'react';
import {
    AppBar,
    Button,
    Card as MuiCard,
    CardActions as MuiCardActions,
    CardHeader as MuiCardHeader,
    CardContent as MuiCardContent,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    useMediaQuery,
    useTheme,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { eulaText } from './eulaText';

const Container = styled('div')(({ theme }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    maxWidth: '450px',
    margin: '0 auto',
    height: `calc(100vh - ${theme.spacing(8)})`,
    [theme.breakpoints.down('sm')]: {
        height: `calc(100vh - ${theme.spacing(7)})`,
        padding: 0,
    },
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
}));

const ReloadButton = styled(Button)({
    width: '100%',
});

const EulaContent = styled(Typography)({
    flex: '1 1 0px',
    overflow: 'auto',
});

const EulaConfirmationCheck = styled(FormControlLabel)(({ theme }) => ({
    flex: '0 0 auto',
    marginRight: 0,
    marginTop: theme.spacing(2),
}));

const Card = styled(MuiCard)(({ theme }) => ({
    position: 'relative',
    padding: 0,
    width: '100%',
    height: '100%',
    maxWidth: '450px',
    maxHeight: '730px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
        maxWidth: 'none',
        maxHeight: 'none',
        borderRadius: 0,
    },
}));

const CardTitle = styled(MuiCardHeader)(({ theme }) => ({
    padding: `${theme.spacing(4)} ${theme.spacing(3)} 0 ${theme.spacing(3)}`,
    [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
    },
}));

const CardContent = styled(MuiCardContent)(({ theme }) => ({
    flex: '1 1 0px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)}`,
    },
}));

const CardActions = styled(MuiCardActions)(({ theme }) => ({
    padding: theme.spacing(3),
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OverlayBackground = styled('div')(({ theme }) => ({
    position: 'absolute',
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
}));

export const SpinnerOverlays = (): JSX.Element => {
    const dispatch = useDispatch();
    const [eulaAccepted, setEulaAccepted] = useState(false);
    const [eulaLoaded, setEulaLoaded] = useState(false);
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const changeCheckboxState = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEulaAccepted(event.target.checked);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!eulaLoaded) {
            timer = setTimeout(() => {
                setEulaLoaded(true);
            }, 3000);
        }
        return (): void => {
            clearTimeout(timer);
        };
    }, [eulaLoaded]);

    const reloadEulaDetails = useCallback((): void => {
        setEulaLoaded(false);
        setEulaAccepted(false);
    }, []);

    return (
        <div style={{ minHeight: '100vh' }}>
            <AppBar data-cy="blui-toolbar" position={'sticky'}>
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
                        Spinner Overlays
                    </Typography>
                    <div />
                </ToolbarGutters>
            </AppBar>
            <Container>
                <Card>
                    {!eulaLoaded && (
                        <OverlayBackground>
                            <CircularProgress size={96} />
                        </OverlayBackground>
                    )}
                    <CardTitle title={<Typography variant={'h6'}>End User License Agreement</Typography>} />
                    <CardContent>
                        <EulaContent variant={eulaLoaded ? 'body1' : 'subtitle1'}>
                            {eulaLoaded ? eulaText : 'Loading EULA...'}
                        </EulaContent>
                        <EulaConfirmationCheck
                            control={
                                <Checkbox
                                    checked={eulaAccepted}
                                    onChange={changeCheckboxState}
                                    name="eulaConformation"
                                    color="primary"
                                />
                            }
                            label="I have read and agree to the Terms & Conditions"
                        />
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <ReloadButton
                            data-cy={'reload'}
                            variant={'contained'}
                            color={'primary'}
                            onClick={reloadEulaDetails}
                        >
                            <Typography noWrap color={'inherit'}>
                                Reload
                            </Typography>
                        </ReloadButton>
                    </CardActions>
                </Card>
            </Container>
        </div>
    );
};
