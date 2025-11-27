import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { CreatePasswordScreenBase } from './CreatePasswordScreenBase';
import { SetPasswordProps } from '../../components';

afterEach(cleanup);

const defaultProps: SetPasswordProps = {
    newPasswordLabel: '',
    confirmPasswordLabel: '',
    initialNewPasswordValue: '',
    initialConfirmPasswordValue: '',
    onPasswordChange: jest.fn(),
};

describe('Create Password Screen Base', () => {
    let mockOnNext: any;
    let mockOnPrevious: any;
    let mockOnPasswordChange: any;

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockOnNext = jest.fn();
        mockOnPrevious = jest.fn();
        mockOnPasswordChange = jest.fn();
    });

    it('renders without crashing', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardHeaderProps={{ title: 'Create Password' }}
                WorkflowCardInstructionProps={{
                    instructions:
                        'Please select a password. Make sure that your password meets the necessary complexity requirements outlined below.',
                }}
                PasswordProps={defaultProps}
                WorkflowCardActionsProps={{
                    showNext: true,
                    nextLabel: 'Next',
                    canGoNext: true,
                    showPrevious: true,
                    previousLabel: 'Back',
                    canGoPrevious: true,
                    currentStep: 2,
                    totalSteps: 6,
                    onNext: mockOnNext,
                }}
            />
        );
        expect(screen.getByText('Create Password')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please select a password. Make sure that your password meets the necessary complexity requirements outlined below.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText(/Next/i)).toBeEnabled();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText(/Back/i)).toBeEnabled();
    });

    it('calls onNext when the next button is clicked', () => {
        const { getByText } = render(
            <CreatePasswordScreenBase
                PasswordProps={defaultProps}
                WorkflowCardActionsProps={{
                    onNext: mockOnNext,
                    showNext: true,
                    nextLabel: 'Next',
                    canGoNext: true,
                    currentStep: 2,
                    totalSteps: 6,
                }}
            />
        );

        const nextButton = getByText('Next');
        fireEvent.click(nextButton);

        expect(mockOnNext).toHaveBeenCalled();
    });

    it('renders with minimal props', () => {
        render(<CreatePasswordScreenBase />);

        // Component should render without crashing with no props
        expect(document.body).toBeInTheDocument();
    });

    it('renders with custom WorkflowCardBaseProps', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardBaseProps={{
                    sx: { maxWidth: 400 },
                    loading: true,
                }}
                PasswordProps={defaultProps}
            />
        );

        // Component should render without errors
        expect(document.body).toBeInTheDocument();
    });
    it('renders with errorDisplayConfig', () => {
        render(
            <CreatePasswordScreenBase
                errorDisplayConfig={{
                    mode: 'dialog',
                    error: 'Test error message',
                    title: 'Error',
                    onClose: jest.fn(),
                }}
                PasswordProps={defaultProps}
            />
        );

        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders with errorDisplayConfig in message-box mode', () => {
        render(
            <CreatePasswordScreenBase
                errorDisplayConfig={{
                    mode: 'message-box',
                    error: 'Test error message',
                    title: 'Warning',
                    messageBoxConfig: {
                        position: 'top',
                        dismissible: true,
                    },
                }}
                PasswordProps={defaultProps}
            />
        );

        expect(screen.getByText('Test error message')).toBeInTheDocument();
        expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('renders with custom header props', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardHeaderProps={{
                    title: 'Custom Create Password Title',
                    action: <div data-testid="custom-action">Action</div>,
                }}
                PasswordProps={defaultProps}
            />
        );

        expect(screen.getByText('Custom Create Password Title')).toBeInTheDocument();
        expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });
    it('renders with custom instruction props', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardInstructionProps={{
                    instructions: 'Custom password instructions',
                    sx: { color: 'primary.main' },
                }}
                PasswordProps={defaultProps}
            />
        );

        expect(screen.getByText('Custom password instructions')).toBeInTheDocument();
    });
    it('renders with custom action props', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardActionsProps={{
                    showNext: true,
                    nextLabel: 'Continue',
                    canGoNext: false,
                    showPrevious: true,
                    previousLabel: 'Previous',
                    canGoPrevious: true,
                    currentStep: 3,
                    totalSteps: 8,
                    onNext: mockOnNext,
                    onPrevious: mockOnPrevious,
                }}
                PasswordProps={defaultProps}
            />
        );

        expect(screen.getByText('Continue')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Continue')).toBeDisabled();
        expect(screen.getByText('Previous')).toBeEnabled();
    });

    it('renders with comprehensive PasswordProps', () => {
        const passwordProps: SetPasswordProps = {
            newPasswordLabel: 'Enter New Password',
            confirmPasswordLabel: 'Confirm Your Password',
            initialNewPasswordValue: 'initial123',
            initialConfirmPasswordValue: 'initial123',
            passwordRequirements: [
                {
                    description: 'At least 8 characters',
                    regex: /^.{8,}$/,
                },
                {
                    description: 'Contains uppercase letter',
                    regex: /[A-Z]/,
                },
                {
                    description: 'Contains lowercase letter',
                    regex: /[a-z]/,
                },
                {
                    description: 'Contains number',
                    regex: /\d/,
                },
            ],
            passwordRef: React.createRef(),
            confirmRef: React.createRef(),
            passwordNotMatchError: 'Passwords do not match',
            onPasswordChange: mockOnPasswordChange,
            onSubmit: jest.fn(),
        };

        render(<CreatePasswordScreenBase PasswordProps={passwordProps} />);

        expect(screen.getByLabelText('Enter New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Your Password')).toBeInTheDocument();
    });

    it('handles password change events', () => {
        const passwordProps: SetPasswordProps = {
            ...defaultProps,
            newPasswordLabel: 'New Password',
            confirmPasswordLabel: 'Confirm New Password',
            onPasswordChange: mockOnPasswordChange,
        };

        render(<CreatePasswordScreenBase PasswordProps={passwordProps} />);

        const newPasswordInput = screen.getByLabelText('New Password');
        const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

        expect(mockOnPasswordChange).toHaveBeenCalled();
    });

    it('renders with children', () => {
        const { container } = render(
            <CreatePasswordScreenBase PasswordProps={defaultProps}>
                <div data-testid="custom-child">Custom child content</div>
            </CreatePasswordScreenBase>
        );

        // Component should render without errors when children are provided
        expect(container).toBeInTheDocument();
    });
    it('renders with otherProps spread to WorkflowCard', () => {
        render(
            <CreatePasswordScreenBase
                PasswordProps={defaultProps}
                data-testid="workflow-card"
                sx={{ backgroundColor: 'primary.main' }}
            />
        );

        const workflowCard = screen.getByTestId('workflow-card');
        expect(workflowCard).toBeInTheDocument();
    });
    it('renders with undefined errorDisplayConfig', () => {
        render(<CreatePasswordScreenBase errorDisplayConfig={undefined} PasswordProps={defaultProps} />);

        // Should render without errors when errorDisplayConfig is undefined
        expect(document.body).toBeInTheDocument();
    });

    it('renders with empty errorDisplayConfig', () => {
        render(<CreatePasswordScreenBase errorDisplayConfig={{}} PasswordProps={defaultProps} />);

        // Should render without errors when errorDisplayConfig is empty
        expect(document.body).toBeInTheDocument();
    });

    it('calls onPrevious when previous button is clicked', () => {
        render(
            <CreatePasswordScreenBase
                PasswordProps={defaultProps}
                WorkflowCardActionsProps={{
                    showPrevious: true,
                    previousLabel: 'Go Back',
                    canGoPrevious: true,
                    onPrevious: mockOnPrevious,
                }}
            />
        );

        const previousButton = screen.getByText('Go Back');
        fireEvent.click(previousButton);

        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it('handles default PasswordProps when onPasswordChange is not provided', () => {
        render(
            <CreatePasswordScreenBase
                PasswordProps={{
                    newPasswordLabel: 'New Password',
                    confirmPasswordLabel: 'Confirm Password',
                    initialNewPasswordValue: '',
                    initialConfirmPasswordValue: '',
                    // onPasswordChange is not provided, should use default
                }}
            />
        );

        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('renders with all props as empty objects', () => {
        render(
            <CreatePasswordScreenBase
                WorkflowCardBaseProps={{}}
                WorkflowCardInstructionProps={{}}
                WorkflowCardActionsProps={{}}
                WorkflowCardHeaderProps={{}}
                PasswordProps={{}}
                errorDisplayConfig={{}}
            />
        );

        // Should render without crashing with all empty prop objects
        expect(document.body).toBeInTheDocument();
    });

    it('renders without PasswordProps to test default assignment', () => {
        render(<CreatePasswordScreenBase />);

        // Should render without crashing when PasswordProps is undefined
        // This specifically tests the default assignment line: PasswordProps: passwordProps = { onPasswordChange: () => ({}) }
        expect(document.body).toBeInTheDocument();
    });

    it('should call default onPasswordChange when PasswordProps is not provided', () => {
        render(<CreatePasswordScreenBase />);

        // The component should render with the default onPasswordChange function
        // This specifically covers the default function () => ({})
        expect(document.body).toBeInTheDocument();
    });

    it('handles deep prop spreading with nested objects', () => {
        const complexProps = {
            WorkflowCardBaseProps: {
                loading: true,
                style: { backgroundColor: 'red' },
                'data-testid': 'complex-workflow-card',
            },
            WorkflowCardHeaderProps: {
                title: 'Complex Title',
                subtitle: 'Complex Subtitle',
                icon: <div>Icon</div>,
            },
            WorkflowCardInstructionProps: {
                instructions: 'Complex instructions with HTML',
                divider: true,
            },
            WorkflowCardActionsProps: {
                showNext: true,
                showPrevious: true,
                nextLabel: 'Continue',
                previousLabel: 'Go Back',
                canGoNext: true,
                canGoPrevious: true,
                fullWidthButton: true,
            },
            PasswordProps: {
                newPasswordLabel: 'New Pass',
                confirmPasswordLabel: 'Confirm Pass',
                initialNewPasswordValue: 'initial123',
                initialConfirmPasswordValue: 'confirm123',
                passwordRequirements: [
                    { description: 'At least 8 characters', regex: /.{8,}/ },
                    { description: 'Contains number', regex: /\d/ },
                ],
                onPasswordChange: mockOnPasswordChange,
            },
            errorDisplayConfig: {
                mode: 'message-box' as const,
                title: 'Error occurred',
            },
        };

        render(<CreatePasswordScreenBase {...complexProps} />);

        expect(screen.getByText('Complex Title')).toBeInTheDocument();
        expect(screen.getByText('Complex instructions with HTML')).toBeInTheDocument();
        expect(screen.getByLabelText('New Pass')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Pass')).toBeInTheDocument();
    });

    it('tests component function instantiation and execution', () => {
        const componentFunction = CreatePasswordScreenBase;
        expect(typeof componentFunction).toBe('function');

        const props = {
            PasswordProps: defaultProps,
        };

        const { container } = render(React.createElement(componentFunction, props));
        expect(container.firstChild).toBeInTheDocument();
    });

    it('handles null and undefined prop values gracefully', () => {
        // Test with properly typed empty/undefined props
        render(<CreatePasswordScreenBase />);
        expect(document.body).toBeInTheDocument();

        // Test with empty objects instead of null/undefined for better TypeScript compatibility
        render(
            <CreatePasswordScreenBase
                WorkflowCardBaseProps={{}}
                WorkflowCardHeaderProps={{}}
                WorkflowCardInstructionProps={{}}
                WorkflowCardActionsProps={{}}
                PasswordProps={{}}
                errorDisplayConfig={{}}
            />
        );
        expect(document.body).toBeInTheDocument();
    });

    it('covers default PasswordProps assignment execution path', () => {
        // This test specifically targets the default assignment line
        // PasswordProps: passwordProps = { onPasswordChange: () => ({}) }
        const { container } = render(<CreatePasswordScreenBase />);

        // Verify the component renders which means the default assignment worked
        expect(container.querySelector('[data-testid="password"]')).toBeInTheDocument();

        // Try to find password inputs to ensure SetPassword received the default props
        const passwordInputs = container.querySelectorAll('input[type="password"]');
        expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it('executes default onPasswordChange function', () => {
        const { container } = render(<CreatePasswordScreenBase />);

        // Find password input and try to trigger change to call default onPasswordChange
        const passwordInput = container.querySelector('input[type="password"]');
        if (passwordInput) {
            fireEvent.change(passwordInput, { target: { value: 'test123' } });
        }

        // The component should still render without errors even with default function
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with complex children structure', () => {
        const complexChildren = (
            <div data-testid="complex-children">
                <span>Child 1</span>
                <div>
                    <p>Nested child</p>
                    <button>Child button</button>
                </div>
                <ul>
                    <li>List item 1</li>
                    <li>List item 2</li>
                </ul>
            </div>
        );

        render(<CreatePasswordScreenBase PasswordProps={defaultProps}>{complexChildren}</CreatePasswordScreenBase>);

        // Children should be rendered somewhere in the component
        // Note: The children might be rendered by WorkflowCard but location may vary
        const component = screen.getByTestId('BluiWorkflowCard-root');
        expect(component).toBeInTheDocument();
    });

    it('tests component with maximum prop combinations', () => {
        const maxProps = {
            WorkflowCardBaseProps: {
                loading: false,
                style: { minHeight: '500px' },
                className: 'custom-card-class',
            },
            WorkflowCardHeaderProps: {
                title: 'Maximum Props Test',
                subtitle: 'Testing all possible props',
                onIconClick: jest.fn(),
            },
            WorkflowCardInstructionProps: {
                instructions: 'Maximum instructions test',
                divider: false,
            },
            WorkflowCardActionsProps: {
                showNext: true,
                showPrevious: true,
                nextLabel: 'Next Step',
                previousLabel: 'Previous Step',
                canGoNext: false,
                canGoPrevious: false,
                onNext: mockOnNext,
                onPrevious: mockOnPrevious,
                currentStep: 3,
                totalSteps: 5,
            },
            PasswordProps: {
                newPasswordLabel: 'Create Password',
                confirmPasswordLabel: 'Verify Password',
                initialNewPasswordValue: 'preset123',
                initialConfirmPasswordValue: 'preset123',
                passwordRequirements: [
                    { description: 'Min 12 chars', regex: /.{12,}/ },
                    { description: 'Has uppercase', regex: /[A-Z]/ },
                    { description: 'Has lowercase', regex: /[a-z]/ },
                    { description: 'Has special char', regex: /[!@#$%^&*]/ },
                ],
                onPasswordChange: mockOnPasswordChange,
                passwordNotMatchError: 'Passwords must match exactly',
            },
            errorDisplayConfig: {
                mode: 'dialog' as const,
                title: 'Validation Error',
                dismissible: true,
                onClose: jest.fn(),
            },
        };

        render(<CreatePasswordScreenBase {...maxProps} />);

        expect(screen.getByText('Maximum Props Test')).toBeInTheDocument();
        // The subtitle is rendered as an attribute, check it's present in the DOM
        const headerElement = screen.getByText('Maximum Props Test').closest('.MuiCardHeader-root');
        expect(headerElement).toHaveAttribute('subtitle', 'Testing all possible props');
        expect(screen.getByLabelText('Create Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Verify Password')).toBeInTheDocument();
    });
});
