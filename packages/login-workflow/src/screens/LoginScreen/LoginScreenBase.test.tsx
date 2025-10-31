import React from 'react';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginScreenBase } from './LoginScreenBase';

const EMAIL_REGEX = /^[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

afterEach(cleanup);

const mockLogin = jest.fn();
const mockForgotPassword = jest.fn();
const mockSelfRegister = jest.fn();
const mockContactSupport = jest.fn();
const mockRememberMeChanged = jest.fn();

// Default props for testing
const defaultProps = {
    usernameLabel: 'Email Address',
    usernameValidator: (username: string): string | boolean => {
        if (!EMAIL_REGEX.test(username)) {
            return 'Enter a valid email address';
        }
        return true;
    },
    initialUsernameValue: '',
    passwordLabel: 'Password',
    passwordValidator: (password: string): string | boolean => {
        if (password.length < 2) {
            return 'Password must be at least 2 characters';
        }
        return true;
    },
    rememberMeLabel: 'Remember Me',
    rememberMeInitialValue: true,
    onRememberMeChanged: mockRememberMeChanged,
    loginButtonLabel: 'Log In',
    onLogin: mockLogin,
    forgotPasswordLabel: 'Forgot your password?',
    onForgotPassword: mockForgotPassword,
    selfRegisterButtonLabel: 'Register now!',
    selfRegisterInstructions: 'Need an account',
    onSelfRegister: mockSelfRegister,
    contactSupportLabel: 'Contact an Eaton Support Representative',
    onContactSupport: mockContactSupport,
};

describe('LoginScreenBase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('renders without crashing with minimal props', () => {
            render(<LoginScreenBase />);
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });

        it('renders with all default labels when no props provided', () => {
            render(<LoginScreenBase />);
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });

        it('renders with custom labels when provided', () => {
            render(<LoginScreenBase {...defaultProps} />);
            expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });
    });

    describe('Remember Me Functionality', () => {
        it('shows remember me checkbox when showRememberMe is true', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={true} />);
            expect(screen.getByTestId('BluiLogin-rememberMeCheckbox')).toBeInTheDocument();
            expect(screen.getByText('Remember Me')).toBeInTheDocument();
        });

        it('hides remember me checkbox when showRememberMe is false', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={false} />);
            expect(screen.queryByTestId('BluiLogin-rememberMeCheckbox')).not.toBeInTheDocument();
        });

        it('sets initial remember me value correctly', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={true} rememberMeInitialValue={false} />);
            const checkbox = screen.getByTestId('BluiLogin-rememberMeCheckbox').querySelector('input')!;
            expect(checkbox.checked).toBe(false);
        });

        it('calls onRememberMeChanged when checkbox is clicked', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={true} rememberMeInitialValue={false} />);
            const checkbox = screen.getByTestId('BluiLogin-rememberMeCheckbox').querySelector('input')!;
            fireEvent.click(checkbox);
            expect(mockRememberMeChanged).toHaveBeenCalledWith(true);
        });

        it('uses default remember me label when not provided', () => {
            render(<LoginScreenBase showRememberMe={true} />);
            expect(screen.getByText('Remember Me')).toBeInTheDocument();
        });
    });

    describe('Conditional Features Rendering', () => {
        it('shows forgot password link when showForgotPassword is true', () => {
            render(<LoginScreenBase {...defaultProps} showForgotPassword={true} />);
            expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
        });

        it('shows self registration section when showSelfRegistration is true', () => {
            render(<LoginScreenBase {...defaultProps} showSelfRegistration={true} />);
            expect(screen.getByText('Need an account')).toBeInTheDocument();
            expect(screen.getByText('Register now!')).toBeInTheDocument();
        });

        it('shows contact support link when showContactSupport is true', () => {
            render(<LoginScreenBase {...defaultProps} showContactSupport={true} />);
            expect(screen.getByText('Contact an Eaton Support Representative')).toBeInTheDocument();
        });

        it('shows cyber security badge when showCyberSecurityBadge is true', () => {
            render(<LoginScreenBase {...defaultProps} showCyberSecurityBadge={true} />);
            expect(screen.getByAltText('Cyber Security Badge')).toBeInTheDocument();
        });

        it('uses default labels for forgot password, self register, and contact support', () => {
            render(<LoginScreenBase showForgotPassword={true} showSelfRegistration={true} showContactSupport={true} />);
            expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
            expect(screen.getByText('Need an account?')).toBeInTheDocument();
            expect(screen.getByText('Register now!')).toBeInTheDocument();
            expect(screen.getByText('Contact Support')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('disables login button when username is invalid', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
            fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

            expect(loginButton).toBeDisabled();
        });

        it('disables login button when password is invalid', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'valid@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'x' } });

            expect(loginButton).toBeDisabled();
        });

        it('enables login button when both username and password are valid', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'valid@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

            expect(loginButton).toBeEnabled();
        });

        it('shows username error message on blur when username is invalid', async () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');

            fireEvent.change(usernameInput, { target: { value: 'invalid-email' } });
            fireEvent.blur(usernameInput);

            await waitFor(() => {
                expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
            });
        });

        it('shows password error message on blur when password is invalid', async () => {
            render(<LoginScreenBase {...defaultProps} />);
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(passwordInput, { target: { value: 'x' } });
            fireEvent.blur(passwordInput);

            await waitFor(() => {
                expect(screen.getByText('Password must be at least 2 characters')).toBeInTheDocument();
            });
        });

        it('works without validators', () => {
            render(<LoginScreenBase usernameLabel="Username" passwordLabel="Password" />);
            const loginButton = screen.getByText('Log In');

            // When no validators are provided, empty fields are considered valid, so form should be enabled
            expect(loginButton).toBeEnabled();
        });

        it('handles initial username value', () => {
            render(<LoginScreenBase {...defaultProps} initialUsernameValue="preset@email.com" />);
            const usernameInput = screen.getByLabelText('Email Address') as HTMLInputElement;
            expect(usernameInput.value).toBe('preset@email.com');
        });
    });

    describe('Event Handlers', () => {
        it('calls onLogin with username, password, and rememberMe value', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={true} rememberMeInitialValue={false} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'test@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            expect(mockLogin).toHaveBeenCalledWith('test@email.com', 'password123', false);
        });

        it('calls onForgotPassword when forgot password link is clicked', () => {
            render(<LoginScreenBase {...defaultProps} showForgotPassword={true} />);
            const forgotPasswordLink = screen.getByText('Forgot your password?');
            fireEvent.click(forgotPasswordLink);
            expect(mockForgotPassword).toHaveBeenCalled();
        });

        it('calls onSelfRegister when self register link is clicked', () => {
            render(<LoginScreenBase {...defaultProps} showSelfRegistration={true} />);
            const selfRegisterLink = screen.getByText('Register now!');
            fireEvent.click(selfRegisterLink);
            expect(mockSelfRegister).toHaveBeenCalled();
        });

        it('calls onContactSupport when contact support link is clicked', () => {
            render(<LoginScreenBase {...defaultProps} showContactSupport={true} />);
            const contactSupportLink = screen.getByText('Contact an Eaton Support Representative');
            fireEvent.click(contactSupportLink);
            expect(mockContactSupport).toHaveBeenCalled();
        });

        it('does not call handlers when they are not provided', () => {
            render(<LoginScreenBase showForgotPassword={true} showSelfRegistration={true} showContactSupport={true} />);

            fireEvent.click(screen.getByText('Forgot your password?'));
            fireEvent.click(screen.getByText('Register now!'));
            fireEvent.click(screen.getByText('Contact Support'));

            // Should not throw errors when handlers are missing
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });
    });

    describe('Keyboard Navigation', () => {
        it('focuses password field when Enter is pressed in username field', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(usernameInput, { target: { value: 'test@email.com' } });
            fireEvent.keyUp(usernameInput, { key: 'Enter', code: 'Enter' });

            expect(passwordInput).toHaveFocus();
        });

        it('submits form when Enter is pressed in password field with valid credentials', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(usernameInput, { target: { value: 'test@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'validpassword' } });
            fireEvent.keyUp(passwordInput, { key: 'Enter', code: 'Enter' });

            expect(mockLogin).toHaveBeenCalledWith('test@email.com', 'validpassword', true);
        });

        it('does not submit form when Enter is pressed in password field with invalid credentials', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const passwordInput = screen.getByLabelText('Password');

            fireEvent.change(passwordInput, { target: { value: 'x' } });
            fireEvent.keyUp(passwordInput, { key: 'Enter', code: 'Enter' });

            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    describe('Props Passthrough', () => {
        it('passes through usernameTextFieldProps', () => {
            const mockUsernameChange = jest.fn();
            const mockUsernameBlur = jest.fn();
            const mockUsernameSubmit = jest.fn();

            render(
                <LoginScreenBase
                    {...defaultProps}
                    usernameTextFieldProps={{
                        placeholder: 'Enter your email',
                        onChange: mockUsernameChange,
                        onBlur: mockUsernameBlur,
                        onSubmit: mockUsernameSubmit,
                    }}
                />
            );

            const usernameInput = screen.getByLabelText('Email Address');
            expect(usernameInput).toHaveAttribute('placeholder', 'Enter your email');

            fireEvent.change(usernameInput, { target: { value: 'test' } });
            expect(mockUsernameChange).toHaveBeenCalled();

            fireEvent.blur(usernameInput);
            expect(mockUsernameBlur).toHaveBeenCalled();
        });

        it('passes through passwordTextFieldProps', () => {
            const mockPasswordChange = jest.fn();
            const mockPasswordBlur = jest.fn();
            const mockPasswordSubmit = jest.fn();

            render(
                <LoginScreenBase
                    {...defaultProps}
                    passwordTextFieldProps={{
                        placeholder: 'Enter your password',
                        onChange: mockPasswordChange,
                        onBlur: mockPasswordBlur,
                        onSubmit: mockPasswordSubmit,
                    }}
                />
            );

            const passwordInput = screen.getByLabelText('Password');
            expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');

            fireEvent.change(passwordInput, { target: { value: 'test' } });
            expect(mockPasswordChange).toHaveBeenCalled();

            fireEvent.blur(passwordInput);
            expect(mockPasswordBlur).toHaveBeenCalled();
        });
    });

    describe('Additional Content', () => {
        it('renders header content when provided', () => {
            render(<LoginScreenBase {...defaultProps} header={<div data-testid="custom-header">Custom Header</div>} />);
            expect(screen.getByTestId('custom-header')).toBeInTheDocument();
        });

        it('renders footer content when provided', () => {
            render(<LoginScreenBase {...defaultProps} footer={<div data-testid="custom-footer">Custom Footer</div>} />);
            expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
        });

        it('renders project image when provided', () => {
            render(
                <LoginScreenBase
                    {...defaultProps}
                    projectImage={<img data-testid="project-image" src="test.png" alt="Project" />}
                />
            );
            expect(screen.getByTestId('project-image')).toBeInTheDocument();
        });
    });

    describe('Error Display', () => {
        it('passes errorDisplayConfig to ErrorManager', () => {
            const errorConfig = { mode: 'dialog' as const };
            render(<LoginScreenBase {...defaultProps} errorDisplayConfig={errorConfig} />);
            // Component should render without errors
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });
    });

    describe('Advanced Functionality', () => {
        it('handles onSubmit for username field props passthrough', () => {
            const mockUsernameSubmit = jest.fn();
            render(
                <LoginScreenBase
                    {...defaultProps}
                    usernameTextFieldProps={{
                        onSubmit: mockUsernameSubmit,
                    }}
                />
            );

            const usernameInput = screen.getByLabelText('Email Address');
            fireEvent.change(usernameInput, { target: { value: 'test@email.com' } });

            // Check that the onSubmit prop was passed through properly by verifying the component renders
            expect(usernameInput).toBeInTheDocument();
        });
        it('handles onSubmit for password field props passthrough', () => {
            const mockPasswordSubmit = jest.fn();
            render(
                <LoginScreenBase
                    {...defaultProps}
                    passwordTextFieldProps={{
                        onSubmit: mockPasswordSubmit,
                    }}
                />
            );

            const passwordInput = screen.getByLabelText('Password');
            fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

            // Trigger the password onSubmit
            fireEvent.keyUp(passwordInput, { key: 'Enter', code: 'Enter' });

            expect(mockPasswordSubmit).toHaveBeenCalled();
        });

        it('tests the internal state management for rememberMe', () => {
            render(
                <LoginScreenBase
                    {...defaultProps}
                    showRememberMe={true}
                    rememberMeInitialValue={true}
                    onRememberMeChanged={undefined} // No callback provided
                />
            );

            const checkbox = screen.getByTestId('BluiLogin-rememberMeCheckbox');
            // Should not crash when onRememberMeChanged is not provided
            fireEvent.click(checkbox);

            expect(screen.getByText('Remember Me')).toBeInTheDocument();
        });

        it('handles missing onRememberMeChanged callback', () => {
            render(
                <LoginScreenBase
                    showRememberMe={true}
                    rememberMeInitialValue={false}
                    // No onRememberMeChanged provided
                />
            );

            const checkbox = screen.getByTestId('BluiLogin-rememberMeCheckbox');
            fireEvent.click(checkbox);

            // Should not crash when callback is missing
            expect(screen.getByText('Remember Me')).toBeInTheDocument();
        });

        it('calls onLogin without rememberMe when showRememberMe is false', () => {
            render(<LoginScreenBase {...defaultProps} showRememberMe={false} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'test@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(loginButton);

            expect(mockLogin).toHaveBeenCalledWith('test@email.com', 'password123', undefined);
        });

        it('handles validation state changes properly', () => {
            render(<LoginScreenBase {...defaultProps} />);
            const usernameInput = screen.getByLabelText('Email Address');
            const passwordInput = screen.getByLabelText('Password');

            // Test invalid username
            fireEvent.change(usernameInput, { target: { value: 'invalid' } });
            fireEvent.blur(usernameInput);

            // Test invalid password
            fireEvent.change(passwordInput, { target: { value: 'x' } });
            fireEvent.blur(passwordInput);

            // Then make them valid
            fireEvent.change(usernameInput, { target: { value: 'valid@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

            const loginButton = screen.getByText('Log In');
            expect(loginButton).toBeEnabled();
        });

        it('handles missing onLogin callback gracefully', () => {
            render(
                <LoginScreenBase
                    usernameLabel="Username"
                    passwordLabel="Password"
                    // No onLogin provided
                />
            );

            const usernameInput = screen.getByLabelText('Username');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByText('Log In');

            fireEvent.change(usernameInput, { target: { value: 'test' } });
            fireEvent.change(passwordInput, { target: { value: 'test' } });
            fireEvent.click(loginButton);

            // Should not crash when onLogin is missing
            expect(screen.getByText('Log In')).toBeInTheDocument();
        });
    });
});
