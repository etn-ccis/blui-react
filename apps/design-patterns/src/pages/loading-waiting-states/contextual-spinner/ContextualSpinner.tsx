/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from 'react';
import { useTheme, styled, keyframes } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery, IconButton, Typography, Button, Fab, CircularProgress } from '@mui/material';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { Menu, PlayArrow } from '@mui/icons-material';

const showKeyframes = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const hideKeyframes = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    padding: 0,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));

const ExampleContainer = styled('div')(({ theme }) => ({
    margin: `${theme.spacing(3)} ${theme.spacing(2)}`,
}));

const Description = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const LoginButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    width: 90,
    height: 36,
}));

const StartRoutineButton = styled(Fab, {
    shouldForwardProp: (prop) => prop !== 'loading',
})<{ loading?: boolean }>(({ theme, loading }) => ({
    width: loading ? 56 : 156,
    height: 56,
    borderRadius: 29,
    transition: theme.transitions.create('width', { duration: theme.transitions.duration.standard }),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    justifyContent: 'flex-start',
    paddingLeft: loading ? 18 : undefined,
}));

const PlayArrowIcon = styled(PlayArrow)(({ theme }) => ({
    marginRight: theme.spacing(1),
    opacity: 1,
}));

const ShowAnimation = styled('span')(({ theme }) => ({
    animationName: showKeyframes,
    animationDuration: `${theme.transitions.duration.standard}ms`,
    animationTimingFunction: 'linear',
    animationIterationCount: 1,
    display: 'inherit',
}));

const HideAnimation = styled('span')(({ theme }) => ({
    animationName: hideKeyframes,
    animationDuration: `${theme.transitions.duration.standard}ms`,
    animationTimingFunction: 'linear',
    animationIterationCount: 1,
    display: 'inherit',
}));

const ShowCircular = styled(CircularProgress)(({ theme }) => ({
    animationName: showKeyframes,
    animationDuration: `${theme.transitions.duration.standard}ms`,
    animationTimingFunction: 'linear',
    animationIterationCount: 1,
}));

const HideCircular = styled(CircularProgress)(({ theme }) => ({
    animationName: hideKeyframes,
    animationDuration: `${theme.transitions.duration.standard}ms`,
    animationTimingFunction: 'linear',
    animationIterationCount: 1,
}));

export const ContextualSpinner = (): JSX.Element => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isStartRoutineLoading, setIsStartRoutineLoading] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const md = useMediaQuery(theme.breakpoints.up('md'));
    let loginTimeout: ReturnType<typeof setTimeout>;
    let startRoutineTimeout: ReturnType<typeof setTimeout>;

    const handleLoginClick = useCallback((): void => {
        setIsLoginLoading(true);
        loginTimeout = setTimeout(() => {
            setIsLoginLoading(false);
            clearInterval(loginTimeout);
        }, 3000);
    }, []);

    const handleStartRoutineClick = useCallback((): void => {
        setShouldAnimate(true);
        setIsStartRoutineLoading(true);
        startRoutineTimeout = setTimeout(() => {
            setIsStartRoutineLoading(false);
            clearInterval(startRoutineTimeout);
        }, 3000);
    }, []);

    useEffect(
        () => (): void => {
            clearInterval(loginTimeout);
            clearInterval(startRoutineTimeout);
        },
        []
    );

    return (
        <div>
            <StyledAppBar data-cy="blui-toolbar" position={'sticky'}>
                <StyledToolbar>
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
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Contextual Spinner
                    </Typography>
                </StyledToolbar>
            </StyledAppBar>
            <ExampleContainer>
                <Description variant={'body1'}>Click on the buttons below to see the spinners.</Description>
                <LoginButton data-cy={'login-btn'} variant={'contained'} color="primary" onClick={handleLoginClick}>
                    {isLoginLoading ? <CircularProgress size={'20px'} color={'inherit'} /> : 'Login'}
                </LoginButton>
                <br />
                <StartRoutineButton
                    data-cy={'start-btn'}
                    variant={isStartRoutineLoading ? 'circular' : 'extended'}
                    color="primary"
                    loading={isStartRoutineLoading}
                    onClick={handleStartRoutineClick}
                >
                    {isStartRoutineLoading ? (
                        <ShowCircular size={'20px'} color={'inherit'} />
                    ) : shouldAnimate ? (
                        isStartRoutineLoading ? (
                            <HideAnimation>
                                <PlayArrowIcon />
                                Start Routine
                            </HideAnimation>
                        ) : (
                            <ShowAnimation>
                                <PlayArrowIcon />
                                Start Routine
                            </ShowAnimation>
                        )
                    ) : (
                        <span style={{ display: 'inherit' }}>
                            <PlayArrowIcon />
                            Start Routine
                        </span>
                    )}
                </StartRoutineButton>
            </ExampleContainer>
        </div>
    );
};
