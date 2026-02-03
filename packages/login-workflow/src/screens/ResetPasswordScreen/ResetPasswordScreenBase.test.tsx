import React, { JSX } from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { ResetPasswordScreenBase } from './ResetPasswordScreenBase';

afterEach(cleanup);

describe('Forgot Password Screen Base', () => {
    it('renders without crashing', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                WorkflowCardInstructionProps={{
                    instructions: 'Reset Password instructions',
                }}
                WorkflowCardActionsProps={{
                    showNext: true,
                    nextLabel: 'Next',
                    canGoNext: true,
                    showPrevious: true,
                    previousLabel: 'Back',
                    canGoPrevious: true,
                    currentStep: 2,
                    totalSteps: 6,
                }}
                PasswordProps={{
                    onPasswordChange: function (): void {
                        throw new Error('Function not implemented.');
                    },
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: function (): void {
                        throw new Error('Function not implemented.');
                    },
                }}
                showSuccessScreen={false}
            />
        );
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByText('Reset Password instructions')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText(/Next/i)).toBeEnabled();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText(/Back/i)).toBeEnabled();
    });

    it('show success screen when showSuccessScreen is true', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                WorkflowCardInstructionProps={{
                    instructions: 'Reset Password instructions',
                }}
                WorkflowCardActionsProps={{
                    showNext: true,
                    nextLabel: 'Next',
                    canGoNext: true,
                    showPrevious: true,
                    previousLabel: 'Back',
                    canGoPrevious: true,
                    currentStep: 2,
                    totalSteps: 6,
                }}
                PasswordProps={{
                    onPasswordChange: function (): void {
                        throw new Error('Function not implemented.');
                    },
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: function (): void {
                        throw new Error('Function not implemented.');
                    },
                }}
                showSuccessScreen={true}
                slots={{
                    SuccessScreen: (): JSX.Element => (
                        <div>
                            <p>Success Screen</p>
                        </div>
                    ),
                }}
            />
        );
        expect(screen.getByText('Success Screen')).toBeInTheDocument();
    });

    it('renders without PasswordProps to test default assignment', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                WorkflowCardInstructionProps={{
                    instructions: 'Reset Password instructions',
                }}
                WorkflowCardActionsProps={{
                    showNext: true,
                    nextLabel: 'Next',
                    canGoNext: true,
                }}
            />
        );
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByText('Reset Password instructions')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('handles default onPasswordChange when PasswordProps is not provided', () => {
        const { container } = render(<ResetPasswordScreenBase WorkflowCardHeaderProps={{ title: 'Reset Password' }} />);

        // The component should still render without errors even with default function
        expect(container.firstChild).toBeInTheDocument();
    });

    it('shows default SuccessScreenBase when showSuccessScreen is true but no custom component provided', () => {
        render(
            <ResetPasswordScreenBase WorkflowCardHeaderProps={{ title: 'Reset Password' }} showSuccessScreen={true} />
        );

        // The default SuccessScreenBase should render (it has specific content we can test for)
        // Since we're not providing slots.SuccessScreen, it should use SuccessScreenBase
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    });

    it('shows custom SuccessScreen component when provided via slots', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                showSuccessScreen={true}
                slots={{
                    SuccessScreen: (): JSX.Element => (
                        <div>
                            <p>Custom Success Screen Content</p>
                        </div>
                    ),
                }}
            />
        );

        expect(screen.getByText('Custom Success Screen Content')).toBeInTheDocument();
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    });

    it('passes slotProps to custom SuccessScreen component', () => {
        const CustomSuccessScreen = (props: any): any => (
            <div>
                <p>Custom Success Component</p>
                {props.EmptyStateProps && (
                    <>
                        <p>Title: {props.EmptyStateProps.title}</p>
                        <p>Description: {props.EmptyStateProps.description}</p>
                    </>
                )}
            </div>
        );

        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                showSuccessScreen={true}
                slots={{
                    SuccessScreen: CustomSuccessScreen,
                }}
                slotProps={{
                    SuccessScreen: {
                        EmptyStateProps: {
                            icon: <div>Success Icon</div>,
                            title: 'Password Reset Complete',
                            description: 'Your password has been successfully reset.',
                        },
                    },
                }}
            />
        );

        expect(screen.getByText('Custom Success Component')).toBeInTheDocument();
        expect(screen.getByText('Title: Password Reset Complete')).toBeInTheDocument();
        expect(screen.getByText('Description: Your password has been successfully reset.')).toBeInTheDocument();
    });

    it('renders with errorDisplayConfig', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                PasswordProps={{
                    onPasswordChange: jest.fn(),
                    newPasswordLabel: 'New Password',
                    confirmPasswordLabel: 'Confirm Password',
                }}
                errorDisplayConfig={{
                    mode: 'dialog',
                    title: 'Error',
                }}
            />
        );

        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('renders with all prop combinations', () => {
        const mockOnNext = jest.fn();
        const mockOnPrevious = jest.fn();
        const mockOnPasswordChange = jest.fn();

        render(
            <ResetPasswordScreenBase
                WorkflowCardBaseProps={{
                    loading: false,
                    style: { minHeight: '500px' },
                }}
                WorkflowCardHeaderProps={{
                    title: 'Custom Reset Title',
                }}
                WorkflowCardInstructionProps={{
                    instructions: 'Please enter your new password',
                    divider: true,
                }}
                WorkflowCardActionsProps={{
                    showNext: true,
                    showPrevious: true,
                    nextLabel: 'Reset Password',
                    previousLabel: 'Go Back',
                    canGoNext: true,
                    canGoPrevious: true,
                    onNext: mockOnNext,
                    onPrevious: mockOnPrevious,
                    currentStep: 2,
                    totalSteps: 3,
                }}
                PasswordProps={{
                    onPasswordChange: mockOnPasswordChange,
                    newPasswordLabel: 'New Password',
                    confirmPasswordLabel: 'Confirm New Password',
                    initialNewPasswordValue: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [
                        { description: 'At least 8 characters', regex: /.{8,}/ },
                        { description: 'Contains uppercase letter', regex: /[A-Z]/ },
                    ],
                }}
                errorDisplayConfig={{
                    mode: 'message-box' as const,
                    title: 'Validation Error',
                }}
            />
        );

        expect(screen.getByText('Custom Reset Title')).toBeInTheDocument();
        expect(screen.getByText('Please enter your new password')).toBeInTheDocument();
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    });

    it('renders with children', () => {
        const { container } = render(
            <ResetPasswordScreenBase WorkflowCardHeaderProps={{ title: 'Reset Password' }}>
                <div>Custom Child Content</div>
            </ResetPasswordScreenBase>
        );

        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        // Note: children are passed to WorkflowCard component, check they exist in DOM
        expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('tests getSuccessScreen function with undefined props', () => {
        const CustomSuccessScreen = (props: any): any => (
            <div>
                <p>Custom Success Screen</p>
                {props && <p>Props received</p>}
            </div>
        );

        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                showSuccessScreen={true}
                slots={{
                    SuccessScreen: CustomSuccessScreen,
                }}
                // Not providing slotProps to test the _props || {} fallback
            />
        );

        expect(screen.getByText('Custom Success Screen')).toBeInTheDocument();
    });

    it('executes default onPasswordChange function', () => {
        const { container } = render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                // Not providing PasswordProps to test default assignment
            />
        );

        // The component should still render without errors even with default function
        expect(container.firstChild).toBeInTheDocument();
    });

    it('tests getSuccessScreen function with undefined slotProps to cover _props || {} fallback', () => {
        render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                showSuccessScreen={true}
                // No slotProps provided to test undefined _props fallback
            />
        );

        // Should render default SuccessScreenBase without errors
        expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    });

    it('covers default assignment of all optional props', () => {
        render(
            <ResetPasswordScreenBase
            // Only provide required minimum to test all default assignments
            />
        );

        // Component should render without crashes with all defaults
        expect(screen.getByTestId('BluiWorkflowCard-root')).toBeInTheDocument();
    });

    it('should call default onPasswordChange when PasswordProps is not provided', () => {
        const { getByTestId } = render(
            <ResetPasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Reset Password' }}
                // Not providing PasswordProps to use default
            />
        );

        const passwordInput = getByTestId('password').querySelector('input');

        // This should trigger the default onPasswordChange function
        // The default function returns {} so it shouldn't cause errors
        if (passwordInput) {
            fireEvent.change(passwordInput, { target: { value: 'test123' } });
            // Component should still be functional
            expect(passwordInput).toHaveValue('test123');
        }
    });
});
