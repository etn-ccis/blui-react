import React from 'react';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginScreen } from './LoginScreen';
import { AuthContextProvider } from '../../contexts';
import { ProjectAuthUIActions } from './AuthUIActions';
import { authContextProviderProps } from '../../testUtils';

afterEach(cleanup);

describe('LoginScreen', () => {
    it('renders without crashing', () => {
        render(
            <AuthContextProvider actions={ProjectAuthUIActions()} language="en" navigate={jest.fn()} routeConfig={{}}>
                <LoginScreen
                    loginButtonLabel="Login"
                    forgotPasswordLabel="forgot password?"
                    selfRegisterButtonLabel="register"
                    contactSupportLabel="contact"
                />
            </AuthContextProvider>
        );
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeDisabled();
        expect(screen.getByText('forgot password?')).toBeInTheDocument();
        expect(screen.getByText('register')).toBeInTheDocument();
        expect(screen.getByText('contact')).toBeInTheDocument();
    });

    it('Login is disabled when the form is invalid', () => {
        const onLogin = jest.fn();
        render(
            <AuthContextProvider actions={ProjectAuthUIActions()} language="en" navigate={jest.fn()} routeConfig={{}}>
                <LoginScreen
                    onLogin={onLogin}
                    passwordLabel={'password'}
                    passwordTextFieldProps={{
                        label: 'password',
                    }}
                    loginButtonLabel="Login"
                    initialUsernameValue="test@email.com"
                />
            </AuthContextProvider>
        );

        screen.getByText('Login').click();
        expect(onLogin).not.toBeCalled();
    });

    it('calls onForgotPassword when the forgot password link is clicked', () => {
        const onForgotPassword = jest.fn();
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen onForgotPassword={onForgotPassword} forgotPasswordLabel="forgot password?" />
            </AuthContextProvider>
        );
        screen.getByText('forgot password?').click();
        expect(onForgotPassword).toHaveBeenCalled();
    });

    it('calls onSelfRegister when the sign up link is clicked', () => {
        const onSelfRegister = jest.fn();
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen onSelfRegister={onSelfRegister} selfRegisterButtonLabel="register" />
            </AuthContextProvider>
        );
        screen.getByText('register').click();
        expect(onSelfRegister).toHaveBeenCalled();
    });

    it('calls onContactSupport when the contact support link is clicked', () => {
        const onContactSupport = jest.fn();
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen onContactSupport={onContactSupport} contactSupportLabel="contact" />
            </AuthContextProvider>
        );
        screen.getByText('contact').click();
        expect(onContactSupport).toHaveBeenCalled();
    });

    it('should handle password visibility toggle', async () => {
        const user = userEvent.setup();

        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen />
            </AuthContextProvider>
        );

        const passwordField = screen.getByLabelText('Password');
        const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

        // Initially password should be hidden
        expect(passwordField).toHaveAttribute('type', 'password');

        // Click to show password
        await user.click(toggleButton);

        await waitFor(() => {
            expect(passwordField).toHaveAttribute('type', 'text');
        });

        // Click to hide password again
        await user.click(toggleButton);

        await waitFor(() => {
            expect(passwordField).toHaveAttribute('type', 'password');
        });
    });

    it('should handle remember me checkbox', async () => {
        const user = userEvent.setup();

        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen />
            </AuthContextProvider>
        );

        // Verify that the checkbox is present and can be interacted with
        const checkboxWrapper = screen.getByTestId('BluiLogin-rememberMeCheckbox');
        expect(checkboxWrapper).toBeInTheDocument();

        // Verify that clicking doesn't throw any errors
        await user.click(checkboxWrapper);

        // Check that the element is still there after clicking
        expect(checkboxWrapper).toBeInTheDocument();
    });

    it('should handle loading state', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen loading={true} />
            </AuthContextProvider>
        );

        const loginButton = screen.getByRole('button', { name: /log in/i });

        // Button should be disabled when loading
        expect(loginButton).toBeDisabled();

        // Should show loading spinner
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle custom labels and props', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen
                    usernameLabel="Custom Email"
                    passwordLabel="Custom Password"
                    loginButtonLabel="Custom Login"
                    rememberMeLabel="Custom Remember"
                    forgotPasswordLabel="Custom Forgot"
                    selfRegisterButtonLabel="Custom Register"
                    contactSupportLabel="Custom Support"
                />
            </AuthContextProvider>
        );

        expect(screen.getByLabelText('Custom Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Custom Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Custom Login' })).toBeInTheDocument();
        expect(screen.getByText('Custom Remember')).toBeInTheDocument();
        expect(screen.getByText('Custom Forgot')).toBeInTheDocument();
        expect(screen.getByText('Custom Register')).toBeInTheDocument();
        expect(screen.getByText('Custom Support')).toBeInTheDocument();
    });

    it('should handle conditional component visibility', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen
                    showRememberMe={false}
                    showForgotPassword={false}
                    showSelfRegistration={false}
                    showContactSupport={false}
                    showCyberSecurityBadge={false}
                />
            </AuthContextProvider>
        );

        // These elements should not be present
        expect(screen.queryByRole('checkbox', { name: /remember me/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/sign up/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/contact/i)).not.toBeInTheDocument();
    });

    it('should handle initial username value', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen initialUsernameValue="preloaded@example.com" />
            </AuthContextProvider>
        );

        const usernameField = screen.getByRole('textbox', { name: /email/i });
        expect(usernameField).toHaveValue('preloaded@example.com');
    });

    it('should handle remember me initial value', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen rememberMeInitialValue={true} />
            </AuthContextProvider>
        );

        const checkboxWrapper = screen.getByTestId('BluiLogin-rememberMeCheckbox');
        const checkbox = checkboxWrapper.querySelector('input[type="checkbox"]') as HTMLInputElement;
        expect(checkbox).toBeChecked();
    });

    it('should handle async login operation', async () => {
        const user = userEvent.setup();
        const mockAsyncLogin = jest.fn().mockResolvedValue(undefined);

        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen onLogin={mockAsyncLogin} />
            </AuthContextProvider>
        );

        const usernameField = screen.getByRole('textbox', { name: /email/i });
        const passwordField = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: /log in/i });

        await user.type(usernameField, 'test@example.com');
        await user.type(passwordField, 'password123');
        await user.click(loginButton);

        await waitFor(() => {
            expect(mockAsyncLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
        });
    });

    it('should handle text field props customization', () => {
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen
                    usernameTextFieldProps={{ placeholder: 'Enter your email' }}
                    passwordTextFieldProps={{ placeholder: 'Enter your password' }}
                />
            </AuthContextProvider>
        );

        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('should handle validation state clearing when input becomes valid', async () => {
        const user = userEvent.setup();

        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen />
            </AuthContextProvider>
        );

        const usernameField = screen.getByRole('textbox', { name: /email/i });

        // Type invalid email first
        await user.type(usernameField, 'invalid');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
        });

        // Clear and type valid email
        await user.clear(usernameField);
        await user.type(usernameField, 'valid@example.com');

        await waitFor(() => {
            expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
        });
    });

    it('should handle keyboard navigation between fields', async () => {
        const user = userEvent.setup();

        render(
            <AuthContextProvider {...authContextProviderProps}>
                <LoginScreen />
            </AuthContextProvider>
        );

        const usernameField = screen.getByRole('textbox', { name: /email/i });
        const passwordField = screen.getByLabelText('Password');

        // Focus username field and type
        await user.click(usernameField);
        await user.type(usernameField, 'test@example.com');

        // Tab to password field
        await user.tab();

        expect(passwordField).toHaveFocus();
    });
});
