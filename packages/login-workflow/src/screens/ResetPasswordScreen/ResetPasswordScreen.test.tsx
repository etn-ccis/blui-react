import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, RenderResult, waitFor, act } from '@testing-library/react';
import { ResetPasswordScreen } from './ResetPasswordScreen';
import { AuthContextProvider } from '../../contexts';
import { ResetPasswordScreenProps } from './types';
import { authContextProviderProps } from '../../testUtils';

afterEach(cleanup);

describe('Reset Password Screen', () => {
    let mockOnNext: any;
    let mockOnPrevious: any;

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockOnNext = jest.fn();
        mockOnPrevious = jest.fn();
    });

    const renderer = (props?: ResetPasswordScreenProps): RenderResult =>
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <BrowserRouter>
                    <ResetPasswordScreen {...props} />
                </BrowserRouter>
            </AuthContextProvider>
        );

    it('renders without crashing', async () => {
        renderer();
        await waitFor(() => expect(screen.getByText('Reset Password')).toBeInTheDocument);
    });

    it('should update values when passed as props', async () => {
        renderer({ WorkflowCardHeaderProps: { title: 'Test Title' } });
        expect(screen.queryByText('Reset Password')).toBeNull();
        await waitFor(() => expect(screen.getByText('Test Title')).toBeInTheDocument);
    });

    it('should show success screen, when okay button is clicked', async () => {
        const { getByLabelText, getByTestId } = renderer({
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: jest.fn(),
                passwordRequirements: [],
            },
            WorkflowCardActionsProps: {
                canGoNext: true,
                nextLabel: 'Next',
            },
        });

        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'Abc@1234' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@1234' } });
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => expect(screen.getByText('Your password was successfully reset.')));
        const doneButton = getByTestId('BluiWorkflowCardActions-nextButton');
        fireEvent.click(doneButton);
    });

    it('should call handleNext callback function', () => {
        const { getByLabelText } = renderer({
            showSuccessScreen: false,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: jest.fn(),
                passwordRequirements: [],
            },
            WorkflowCardActionsProps: {
                canGoNext: true,
                nextLabel: 'Next',
                onNext: mockOnNext(),
            },
        });

        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'Abc@1234' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@1234' } });
        fireEvent.click(screen.getByText('Next'));
        expect(mockOnNext).toHaveBeenCalled();
    });

    it('should show loader, when loading prop is passed to WorkflowCardBaseProps', async () => {
        renderer({ WorkflowCardBaseProps: { loading: true } });
        await waitFor(() => expect(screen.getByTestId('blui-spinner')).toBeInTheDocument);
    });

    it('should call onNext, when Next button clicked', async () => {
        const { getByLabelText } = renderer({
            WorkflowCardActionsProps: {
                onNext: mockOnNext(),
                showNext: true,
                nextLabel: 'Next',
            },
        });
        await waitFor(() => expect(screen.getByText('Reset Password')).toBeInTheDocument);
        const passwordField = getByLabelText('New Password');
        const confirmPasswordField = getByLabelText('Confirm New Password');
        fireEvent.change(passwordField, { target: { value: 'Abcd@123' } });
        fireEvent.blur(passwordField);
        fireEvent.change(confirmPasswordField, { target: { value: 'Abcd@123' } });
        fireEvent.blur(confirmPasswordField);
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeInTheDocument();
        await act(async () => {
            expect(await screen.findByText('Next')).toBeEnabled();
            fireEvent.click(nextButton);
        });
        expect(mockOnNext).toHaveBeenCalled();
    });

    it('should call onPrevious, when Back button clicked', async () => {
        renderer({
            WorkflowCardActionsProps: {
                onPrevious: mockOnPrevious(),
                showPrevious: true,
                previousLabel: 'Back',
            },
        });
        await waitFor(() => expect(screen.getByText('Reset Password')).toBeInTheDocument);

        const backButton = screen.getByText('Back');
        expect(backButton).toBeInTheDocument();
        await act(async () => {
            expect(await screen.findByText('Back')).toBeEnabled();
            fireEvent.click(backButton);
        });
        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it('should render with custom header props', () => {
        renderer({
            WorkflowCardHeaderProps: {
                title: 'Custom Reset Title',
            },
        });
        // await waitFor(() => expect(screen.getByText('Custom Reset Title')).toBeInTheDocument());
        expect(screen.getByText('Custom Reset Title')).toBeInTheDocument();
    });

    it('should render with custom instruction props', () => {
        renderer({
            WorkflowCardInstructionProps: {
                instructions: 'Custom password reset instructions',
            },
        });
        expect(screen.getByText('Custom password reset instructions')).toBeInTheDocument();
    });

    it('should handle PasswordProps onPasswordChange callback', async () => {
        const mockOnPasswordChange = jest.fn();
        const { getByLabelText } = renderer({
            PasswordProps: {
                onPasswordChange: mockOnPasswordChange,
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
            },
        });

        const newPasswordInput = getByLabelText('New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'TestPass123!' } });

        expect(mockOnPasswordChange).toHaveBeenCalledWith({
            password: 'TestPass123!',
            confirm: '',
        });
    });

    // it('should handle PasswordProps onSubmit callback', async () => {
    //     const mockOnSubmit = jest.fn();
    //     const { getByLabelText } = renderer({
    //         PasswordProps: {
    //             onSubmit: mockOnSubmit,
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');

    //     fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123!' } });

    //     // Trigger submit by pressing Enter
    //     fireEvent.keyDown(confirmPasswordInput, { key: 'Enter', code: 'Enter' });

    //     await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
    // });

    // it('should render with custom password requirements', async () => {
    //     const customRequirements = [
    //         { regex: '^.{8,}$', description: 'At least 8 characters' },
    //         { regex: '[A-Z]', description: 'One uppercase letter' },
    //     ];

    //     renderer({
    //         PasswordProps: {
    //             passwordRequirements: customRequirements,
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     await waitFor(() => expect(screen.getByText('At least 8 characters')).toBeInTheDocument());
    //     expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    // });

    // it('should handle empty password requirements array', async () => {
    //     const { getByLabelText } = renderer({
    //         PasswordProps: {
    //             passwordRequirements: [],
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');

    //     fireEvent.change(newPasswordInput, { target: { value: 'any' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'any' } });

    //     await waitFor(() => expect(screen.getByText('Next')).toBeEnabled());
    // });

    // it('should disable Next button when passwords do not match', async () => {
    //     const { getByLabelText } = renderer({
    //         PasswordProps: {
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');

    //     fireEvent.change(newPasswordInput, { target: { value: 'Password123!' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });

    //     await waitFor(() => expect(screen.getByText('Next')).toBeDisabled());
    // });

    // it('should render with initial password values', async () => {
    //     const { getByLabelText } = renderer({
    //         PasswordProps: {
    //             initialNewPasswordValue: 'InitialPass123!',
    //             initialConfirmPasswordValue: 'InitialPass123!',
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     const newPasswordInput = getByLabelText('New Password') as HTMLInputElement;
    //     const confirmPasswordInput = getByLabelText('Confirm New Password') as HTMLInputElement;

    //     await waitFor(() => {
    //         expect(newPasswordInput.value).toBe('InitialPass123!');
    //         expect(confirmPasswordInput.value).toBe('InitialPass123!');
    //     });
    // });

    // it('should render with custom action button labels', async () => {
    //     renderer({
    //         WorkflowCardActionsProps: {
    //             nextLabel: 'Custom Next',
    //             previousLabel: 'Custom Back',
    //             showNext: true,
    //             showPrevious: true,
    //         },
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByText('Custom Next')).toBeInTheDocument();
    //         expect(screen.getByText('Custom Back')).toBeInTheDocument();
    //     });
    // });

    // it('should handle showSuccessScreen prop set to false', async () => {
    //     const { getByLabelText } = renderer({
    //         showSuccessScreen: false,
    //         PasswordProps: {
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');

    //     fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123!' } });
    //     fireEvent.click(screen.getByText('Next'));

    //     // Should not show success screen
    //     await waitFor(() => {
    //         expect(screen.queryByText('Your password was successfully reset.')).not.toBeInTheDocument();
    //     });
    // });

    // it('should render with custom slots and slotProps', async () => {
    //     const CustomSuccessScreen = () => <div>Custom Success Component</div>;

    //     renderer({
    //         slots: {
    //             SuccessScreen: CustomSuccessScreen,
    //         },
    //         slotProps: {
    //             SuccessScreen: {
    //                 EmptyStateProps: {
    //                     title: 'Custom Success Title',
    //                     description: 'Custom Success Description',
    //                 },
    //             },
    //         },
    //     });

    //     await waitFor(() => expect(screen.getByText('Reset Password')).toBeInTheDocument());
    // });

    // it('should handle error display config with custom onClose', async () => {
    //     const mockOnClose = jest.fn();

    //     renderer({
    //         errorDisplayConfig: {
    //             onClose: mockOnClose,
    //         },
    //     });

    //     await waitFor(() => expect(screen.getByText('Reset Password')).toBeInTheDocument());
    // });

    // it('should render with custom password labels', async () => {
    //     renderer({
    //         PasswordProps: {
    //             newPasswordLabel: 'Enter New Password',
    //             confirmPasswordLabel: 'Confirm Your Password',
    //             passwordNotMatchError: 'Passwords do not match!',
    //         },
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByLabelText('Enter New Password')).toBeInTheDocument();
    //         expect(screen.getByLabelText('Confirm Your Password')).toBeInTheDocument();
    //     });
    // });

    // it('should handle Next button being disabled when passwords are empty', async () => {
    //     renderer({
    //         PasswordProps: {
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //         },
    //     });

    //     await waitFor(() => expect(screen.getByText('Next')).toBeDisabled());
    // });

    // it('should handle Back button navigation to login', async () => {
    //     renderer({
    //         WorkflowCardActionsProps: {
    //             showPrevious: true,
    //             previousLabel: 'Back',
    //         },
    //     });

    //     const backButton = await screen.findByText('Back');
    //     fireEvent.click(backButton);

    //     // The component should navigate to login (tested via auth context mock)
    //     expect(backButton).toBeInTheDocument();
    // });
});
