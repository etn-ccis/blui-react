import React, { useState, useEffect, useCallback } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    TextField,
    InputAdornment,
    List,
    ListItem,
    InputProps,
    Divider,
    Button,
    Card,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Done, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import * as Colors from '@brightlayer-ui/colors';
import { Spacer } from '@brightlayer-ui/react-components';

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
}));

const ContainerWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: '1 1 0',
});

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0px',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    maxWidth: 450,
    height: '100%',
    maxHeight: 'calc(100vh - 64px)',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        maxWidth: 600,
        height: 'unset',
        minHeight: 'calc(100vh - 56px)',
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
    width: '100%',
    marginBottom: 16,
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const NewPasswordInputField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
}));

const FormOverflow = styled('div')({
    display: 'flex',
    flex: '1',
    overflow: 'auto',
    width: '100%',
});

const PasswordCriteriaListItem = styled(ListItem)({
    paddingTop: 0,
    paddingBottom: 0,
});

const AppbarRoot = styled(AppBar)({
    padding: 0,
});

const VisibilityToggle = styled(IconButton)({
    height: 36,
    width: 36,
});

const ToolbarGutters = styled(Toolbar)({
    padding: '0 16px',
});

const DividerStyled = styled(Divider)(({ theme }) => ({
    width: `calc(100% + ${theme.spacing(6)})`,
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    [theme.breakpoints.down('sm')]: {
        width: `calc(100% + ${theme.spacing(4)})`,
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
    },
}));

const TopDivider = styled(DividerStyled)(({ theme }) => ({
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(2),
    },
}));

const BottomDivider = styled(DividerStyled)(({ theme }) => ({
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(1),
    },
}));

const SubmitButtonContainer = styled('div')(({ theme }) => ({
    width: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const MobileSubmitButtonContainer = styled('div')(({ theme }) => ({
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
}));

type FormError = undefined | null | string;
type OnChangeHandler = InputProps['onChange'];

export const emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
export const phoneNumberRegex = new RegExp(/^((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})$/);
export const upperCharRegex = new RegExp(/[A-Z]+/);
export const lowerCharRegex = new RegExp(/[a-z]+/);
export const numberRegex = new RegExp(/[0-9]+/);
export const splCharRegex = new RegExp(/(!|@|#|\$|\^|&)+/);

export const PasswordFormValidation = (): JSX.Element => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState<FormError>();
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState<FormError>();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<FormError>();
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [blurredConfirmPassword, setBlurredConfirmPassword] = useState<boolean>(false);
    const [passwordErrors, setPasswordErrors] = useState({
        minLengthRequired: false,
        atLeast1UpperCharRequired: false,
        atLeast1LowerCharRequired: false,
        atLeast1NumberRequired: false,
        atLeast1SplCharRequired: false,
    });

    const theme = useTheme();
    const dispatch = useDispatch();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const PASSWORD_MISMATCH = 'Passwords do not match';

    const getPasswordCriteriaIcon = (error: boolean): JSX.Element => (
        <Done
            style={{
                fontSize: 18,
                color: error ? theme.palette.primary.main : Colors.gray[200],
                marginRight: theme.spacing(),
            }}
        />
    );

    const validateCurrentPassword = useCallback((): void => {
        let err = '';
        if (!currentPassword.trim()) {
            err = 'required';
        }
        setCurrentPasswordError(err);
    }, [currentPassword]);

    const validateNewPassword = useCallback((): void => {
        let err = '';
        if (!newPassword.trim() || Object.values(passwordErrors).includes(false)) {
            err = 'required';
        }
        setNewPasswordError(err);
    }, [newPassword, passwordErrors]);

    const validatePasswordCriteria = useCallback((): void => {
        if (newPasswordError) {
            validateNewPassword();
        } else {
            setNewPasswordError(null);
        }
    }, [newPasswordError, validateNewPassword]);

    const onCurrentPasswordChange: OnChangeHandler = useCallback(
        (event) => {
            setCurrentPassword(event.target.value);
            if (currentPasswordError) {
                validateCurrentPassword();
            } else {
                setCurrentPasswordError(null);
            }
        },
        [currentPasswordError, validateCurrentPassword, confirmPassword]
    );

    const onNewPasswordChange: OnChangeHandler = useCallback(
        (event) => {
            setNewPassword(event.target.value);
            setConfirmPasswordError('');
            validatePasswordCriteria();
            if (event.target.value !== confirmPassword && confirmPassword !== '') {
                setConfirmPasswordError(PASSWORD_MISMATCH);
            }
        },
        [validatePasswordCriteria, confirmPassword]
    );

    const onConfirmPasswordChange: OnChangeHandler = useCallback(
        (event) => {
            setConfirmPasswordError('');
            setConfirmPassword(event.target.value);
            if (newPassword !== event.target.value && blurredConfirmPassword) {
                setConfirmPasswordError(PASSWORD_MISMATCH);
            }
        },
        [newPassword, blurredConfirmPassword]
    );

    useEffect(() => {
        setPasswordErrors({
            minLengthRequired: newPassword.length >= 8,
            atLeast1UpperCharRequired: upperCharRegex.test(newPassword),
            atLeast1LowerCharRequired: lowerCharRegex.test(newPassword),
            atLeast1NumberRequired: numberRegex.test(newPassword),
            atLeast1SplCharRequired: splCharRegex.test(newPassword),
        });
    }, [newPassword]);

    const meetsRequirements = useCallback(
        (): boolean =>
            Boolean(passwordErrors.atLeast1LowerCharRequired) &&
            Boolean(passwordErrors.atLeast1NumberRequired) &&
            Boolean(passwordErrors.atLeast1SplCharRequired) &&
            Boolean(passwordErrors.minLengthRequired) &&
            Boolean(passwordErrors.atLeast1UpperCharRequired),
        [passwordErrors]
    );

    const submitEnabled = useCallback(
        (): boolean => meetsRequirements() && newPassword === confirmPassword && Boolean(currentPassword),
        [meetsRequirements, newPassword, confirmPassword, currentPassword]
    );

    const clearForms = (): void => {
        setCurrentPassword('');
        setConfirmPassword('');
        setNewPassword('');
        setBlurredConfirmPassword(false);
        setConfirmPasswordError('');
        setCurrentPasswordError('');
    };

    const passwordHintText = (error: boolean): string => (error ? theme.palette.text.primary : Colors.gray[200]);

    return (
        <Root>
            <AppbarRoot data-cy={'blui-toolbar'} position={'sticky'}>
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
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Change Password
                    </Typography>
                </ToolbarGutters>
            </AppbarRoot>

            <ContainerWrapper>
                <StyledCard elevation={4}>
                    <SectionHeader variant={'h6'}>Change Password</SectionHeader>
                    <Typography variant={'body1'}>
                        Password must be at least 8 characters long, contain at least one uppercase character, one
                        lowercase character, one number, and one special character.
                    </Typography>

                    <TopDivider />

                    <FormOverflow>
                        <form style={{ width: '100%' }}>
                            <TextField
                                id={'currentPassword'}
                                label={'Old Password'}
                                type={showCurrentPassword ? 'text' : 'password'}
                                onChange={onCurrentPasswordChange}
                                value={currentPassword}
                                error={Boolean(currentPasswordError)}
                                onBlur={validateCurrentPassword}
                                required
                                fullWidth
                                variant={'filled'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            <VisibilityToggle
                                                onClick={(): void => setShowCurrentPassword(!showCurrentPassword)}
                                                size="large"
                                            >
                                                {showCurrentPassword && <Visibility />}
                                                {!showCurrentPassword && <VisibilityOff />}
                                            </VisibilityToggle>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <NewPasswordInputField
                                id={'newPassword'}
                                label={'New Password'}
                                type={showNewPassword ? 'text' : 'password'}
                                onChange={onNewPasswordChange}
                                value={newPassword}
                                error={Boolean(newPasswordError)}
                                onBlur={validateNewPassword}
                                required
                                fullWidth
                                variant={'filled'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            <VisibilityToggle
                                                onClick={(): void => setShowNewPassword(!showNewPassword)}
                                                size="large"
                                            >
                                                {showNewPassword && <Visibility />}
                                                {!showNewPassword && <VisibilityOff />}
                                            </VisibilityToggle>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <List disablePadding component={'ul'} style={{ marginTop: 8 }}>
                                <PasswordCriteriaListItem disableGutters>
                                    {getPasswordCriteriaIcon(passwordErrors.minLengthRequired)}
                                    <Typography
                                        variant={'caption'}
                                        style={{ color: passwordHintText(passwordErrors.minLengthRequired) }}
                                    >
                                        At least 8 characters in length
                                    </Typography>
                                </PasswordCriteriaListItem>
                                <PasswordCriteriaListItem disableGutters>
                                    {getPasswordCriteriaIcon(passwordErrors.atLeast1NumberRequired)}
                                    <Typography
                                        variant={'caption'}
                                        style={{ color: passwordHintText(passwordErrors.atLeast1NumberRequired) }}
                                    >
                                        At least 1 digit
                                    </Typography>
                                </PasswordCriteriaListItem>
                                <PasswordCriteriaListItem disableGutters>
                                    {getPasswordCriteriaIcon(passwordErrors.atLeast1UpperCharRequired)}
                                    <Typography
                                        variant={'caption'}
                                        style={{ color: passwordHintText(passwordErrors.atLeast1UpperCharRequired) }}
                                    >
                                        At least 1 uppercase letter
                                    </Typography>
                                </PasswordCriteriaListItem>
                                <PasswordCriteriaListItem disableGutters>
                                    {getPasswordCriteriaIcon(passwordErrors.atLeast1LowerCharRequired)}
                                    <Typography
                                        variant={'caption'}
                                        style={{ color: passwordHintText(passwordErrors.atLeast1LowerCharRequired) }}
                                    >
                                        At least 1 lowercase letter
                                    </Typography>
                                </PasswordCriteriaListItem>
                                <PasswordCriteriaListItem disableGutters>
                                    {getPasswordCriteriaIcon(passwordErrors.atLeast1SplCharRequired)}
                                    <Typography
                                        variant={'caption'}
                                        style={{ color: passwordHintText(passwordErrors.atLeast1SplCharRequired) }}
                                    >
                                        At least 1 special character: (valid: ! @ # $ ^ &)
                                    </Typography>
                                </PasswordCriteriaListItem>
                            </List>

                            <NewPasswordInputField
                                id={'confirmPassword'}
                                label={'Confirm Password'}
                                type={showConfirmPassword ? 'text' : 'password'}
                                helperText={confirmPasswordError}
                                onChange={onConfirmPasswordChange}
                                onBlur={(): void => {
                                    setBlurredConfirmPassword(true);
                                    if (newPassword !== confirmPassword) {
                                        setConfirmPasswordError(PASSWORD_MISMATCH);
                                    }
                                }}
                                value={confirmPassword}
                                error={Boolean(confirmPasswordError) && blurredConfirmPassword}
                                required
                                fullWidth
                                variant={'filled'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            <VisibilityToggle
                                                onClick={(): void => setShowConfirmPassword(!showConfirmPassword)}
                                                size="large"
                                            >
                                                {showConfirmPassword && <Visibility />}
                                                {!showConfirmPassword && <VisibilityOff />}
                                            </VisibilityToggle>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </form>
                    </FormOverflow>
                    <BottomDivider />
                    <SubmitButtonContainer>
                        <Button
                            color={'primary'}
                            style={{ width: 100 }}
                            variant={'outlined'}
                            onClick={(): void => clearForms()}
                        >
                            Cancel
                        </Button>
                        <Spacer />
                        <Button
                            color={'primary'}
                            style={{ width: 100 }}
                            variant={'contained'}
                            disabled={!submitEnabled()}
                            onClick={(): void => clearForms()}
                        >
                            Submit
                        </Button>
                    </SubmitButtonContainer>
                    <MobileSubmitButtonContainer>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            style={{ width: '100%' }}
                            disabled={!submitEnabled()}
                            onClick={(): void => clearForms()}
                        >
                            Submit
                        </Button>
                    </MobileSubmitButtonContainer>
                </StyledCard>
            </ContainerWrapper>
        </Root>
    );
};
