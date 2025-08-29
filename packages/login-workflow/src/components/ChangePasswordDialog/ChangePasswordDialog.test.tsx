import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, RenderResult, screen, waitFor } from '@testing-library/react';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { AuthContextProvider } from '../../contexts';
import { BrowserRouter } from 'react-router-dom';
import { ChangePasswordDialogProps } from './types';
import { authContextProviderProps } from '../../testUtils';

afterEach(cleanup);

describe('Change Password Dialog tests', () => {
    let updateFields: any;

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        updateFields = jest.fn();
    });

    const renderer = (props?: ChangePasswordDialogProps): RenderResult =>
        render(
            <AuthContextProvider {...authContextProviderProps}>
                <BrowserRouter>
                    <ChangePasswordDialog open {...props} />
                </BrowserRouter>
            </AuthContextProvider>
        );

    it('renders without crashing', () => {
        const { getByLabelText } = renderer({
            open: true,
            currentPasswordLabel: 'Current Password',
        });
        const currentPasswordInput = getByLabelText('Current Password');
        expect(currentPasswordInput).toHaveValue('');
        expect(screen.getByLabelText('Current Password')).not.toBeNull();
    });

    it('should display input field with passed prop', () => {
        const { getByLabelText } = renderer({
            open: true,
            currentPasswordLabel: 'Current Password',
        });

        const currentPasswordInput = getByLabelText('Current Password');
        expect(currentPasswordInput).toHaveValue('');
        fireEvent.change(currentPasswordInput, { target: { value: 'Abc@2023' } });
        expect(currentPasswordInput).toHaveValue('Abc@2023');
    });

    it('should display input fields with passed props', () => {
        const { getByLabelText } = renderer({
            open: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: updateFields,
                passwordRequirements: [],
            },
        });

        const newPasswordInput = getByLabelText('New Password');
        expect(newPasswordInput).toHaveValue('');
        const confirmPasswordInput = getByLabelText('Confirm New Password');
        expect(confirmPasswordInput).toHaveValue('');
        fireEvent.change(newPasswordInput, { target: { value: 'Abc@1234' } });
        expect(newPasswordInput).toHaveValue('Abc@1234');
        fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@1234' } });
        expect(confirmPasswordInput).toHaveValue('Abc@1234');
    });

    it('should show success screen, when okay button is clicked', async () => {
        const { getByLabelText } = renderer({
            open: true,
            showSuccessScreen: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: updateFields,
                passwordRequirements: [],
            },
        });

        const currentPasswordInput = getByLabelText('Current Password');
        fireEvent.change(currentPasswordInput, { target: { value: 'Abc@1234' } });
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'Abc@1234' } });
        expect(newPasswordInput).toHaveValue('Abc@1234');
        fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@1234' } });
        expect(confirmPasswordInput).toHaveValue('Abc@1234');

        fireEvent.click(screen.getByText('Okay'));
        expect(screen.getByText('Okay')).toBeEnabled();
        fireEvent.click(screen.getByText('Okay'));

        await waitFor(() => expect(screen.getByText('Your password was successfully reset.')));
    });

    it('should call onPrevious when previous button is clicked', () => {
        const onPrevious = jest.fn();
        renderer({
            open: true,
            onPrevious,
            currentPasswordLabel: 'Current Password',
        });

        const previousButton = screen.getByText('Back');
        fireEvent.click(previousButton);
        expect(onPrevious).toHaveBeenCalled();
    });

    it('should call currentPasswordChange when current password field changes', () => {
        const currentPasswordChange = jest.fn();
        const { getByLabelText } = renderer({
            open: true,
            currentPasswordChange,
            currentPasswordLabel: 'Current Password',
        });

        const currentPasswordInput = getByLabelText('Current Password');
        fireEvent.change(currentPasswordInput, { target: { value: 'test123' } });
        expect(currentPasswordChange).toHaveBeenCalledWith('test123');
    });

    it('should handle custom currentPasswordTextFieldProps', () => {
        const { getByLabelText } = renderer({
            open: true,
            currentPasswordLabel: 'Current Password',
            currentPasswordTextFieldProps: {
                placeholder: 'Enter current password',
            },
        });

        const currentPasswordInput = getByLabelText('Current Password');
        expect(currentPasswordInput).toHaveAttribute('placeholder', 'Enter current password');
    });

    // it('should handle error scenarios during password change', async () => {
    //     const mockChangePassword = jest.fn().mockRejectedValue(new Error('Password change failed'));
    //     const onFinish = jest.fn();
    //     const { getByLabelText } = renderer({
    //         open: true,
    //         onFinish,
    //         PasswordProps: {
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //             onPasswordChange: updateFields,
    //             passwordRequirements: [],
    //         },
    //     });

    //     // Mock the auth context to return the failing changePassword function
    //     const authContext = require('../../contexts/AuthContext/useAuthContext');
    //     jest.spyOn(authContext, 'useAuthContext').mockReturnValue({
    //         actions: { changePassword: mockChangePassword },
    //         navigate: jest.fn(),
    //         routeConfig: { LOGIN: '/login' },
    //     });

    //     const currentPasswordInput = getByLabelText('Current Password');
    //     fireEvent.change(currentPasswordInput, { target: { value: 'Abc@1234' } });
    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');
    //     fireEvent.change(newPasswordInput, { target: { value: 'Abc@5678' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@5678' } });

    //     fireEvent.click(screen.getByText('Okay'));

    //     await waitFor(() => {
    //         expect(mockChangePassword).toHaveBeenCalledWith('Abc@1234', 'Abc@5678');
    //     });
    // });

    // it('should handle showSuccessScreen set to false', async () => {
    //     const onFinish = jest.fn();
    //     const { getByLabelText } = renderer({
    //         open: true,
    //         showSuccessScreen: false,
    //         onFinish,
    //         PasswordProps: {
    //             newPasswordLabel: 'New Password',
    //             confirmPasswordLabel: 'Confirm New Password',
    //             onPasswordChange: updateFields,
    //             passwordRequirements: [],
    //         },
    //     });

    //     const currentPasswordInput = getByLabelText('Current Password');
    //     fireEvent.change(currentPasswordInput, { target: { value: 'Abc@1234' } });
    //     const newPasswordInput = getByLabelText('New Password');
    //     const confirmPasswordInput = getByLabelText('Confirm New Password');
    //     fireEvent.change(newPasswordInput, { target: { value: 'Abc@5678' } });
    //     fireEvent.change(confirmPasswordInput, { target: { value: 'Abc@5678' } });

    //     fireEvent.click(screen.getByText('Okay'));

    //     await waitFor(() => {
    //         expect(onFinish).toHaveBeenCalled();
    //     });
    // });

    it('should validate passwords with password requirements', () => {
        const passwordRequirements = [
            { regex: '^.{8,}$', description: 'At least 8 characters' },
            { regex: '.*[A-Z].*', description: 'One uppercase letter' },
            { regex: '.*[a-z].*', description: 'One lowercase letter' },
            { regex: '.*\\d.*', description: 'One number' },
        ];

        const { getByLabelText } = renderer({
            open: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: updateFields,
                passwordRequirements,
            },
        });

        const currentPasswordInput = getByLabelText('Current Password');
        fireEvent.change(currentPasswordInput, { target: { value: 'Abc@1234' } });
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');

        // Test with weak password
        fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
        expect(screen.getByText('Okay')).toBeDisabled();

        // Test with strong password
        fireEvent.change(newPasswordInput, { target: { value: 'Strong123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Strong123' } });
        expect(screen.getByText('Okay')).toBeEnabled();
    });

    it('should handle custom slots and slotProps', () => {
        const customSuccessScreen = jest.fn(() => <div>Custom Success Screen</div>);
        renderer({
            open: true,
            slots: {
                SuccessScreen: customSuccessScreen,
            },
            slotProps: {
                SuccessScreen: {
                    EmptyStateProps: {
                        title: 'Custom Success Title',
                        description: 'Custom Success Description',
                    },
                },
            },
        });

        // Component should render without errors
        expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    });

    it('should handle errorDisplayConfig onClose callback', () => {
        const onClose = jest.fn();
        renderer({
            open: true,
            errorDisplayConfig: {
                onClose,
            },
        });

        // Component should render without errors
        expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    });

    it('should handle PasswordProps callbacks', () => {
        const onPasswordChange = jest.fn();
        const onSubmit = jest.fn();
        const { getByLabelText } = renderer({
            open: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange,
                onSubmit,
                passwordRequirements: [],
            },
        });

        const newPasswordInput = getByLabelText('New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'Abc@1234' } });

        expect(onPasswordChange).toHaveBeenCalled();
    });

    it('should enable button when all passwords are valid and matching', () => {
        const { getByLabelText } = renderer({
            open: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: updateFields,
                passwordRequirements: [],
            },
        });

        const currentPasswordInput = getByLabelText('Current Password');
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');

        // Initially button should be disabled
        expect(screen.getByText('Okay')).toBeDisabled();

        // Fill all fields with valid matching passwords
        fireEvent.change(currentPasswordInput, { target: { value: 'CurrentPass123' } });
        fireEvent.change(newPasswordInput, { target: { value: 'NewPass123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123' } });

        // Button should now be enabled
        expect(screen.getByText('Okay')).toBeEnabled();
    });

    it('should disable button when passwords do not match', () => {
        const { getByLabelText } = renderer({
            open: true,
            PasswordProps: {
                newPasswordLabel: 'New Password',
                confirmPasswordLabel: 'Confirm New Password',
                onPasswordChange: updateFields,
                passwordRequirements: [],
            },
        });

        const currentPasswordInput = getByLabelText('Current Password');
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm New Password');

        fireEvent.change(currentPasswordInput, { target: { value: 'CurrentPass123' } });
        fireEvent.change(newPasswordInput, { target: { value: 'NewPass123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123' } });

        // Button should be disabled due to password mismatch
        expect(screen.getByText('Okay')).toBeDisabled();
    });

    it('should handle custom labels', () => {
        renderer({
            open: true,
            dialogTitle: 'Custom Dialog Title',
            dialogDescription: 'Custom dialog description',
            currentPasswordLabel: 'Custom Current Password',
            previousLabel: 'Custom Previous',
            nextLabel: 'Custom Next',
            PasswordProps: {
                newPasswordLabel: 'Custom New Password',
                confirmPasswordLabel: 'Custom Confirm Password',
                onPasswordChange: updateFields,
                passwordRequirements: [],
            },
        });

        expect(screen.getByText('Custom Dialog Title')).toBeInTheDocument();
        expect(screen.getByText('Custom dialog description')).toBeInTheDocument();
        expect(screen.getByLabelText('Custom Current Password')).toBeInTheDocument();
        expect(screen.getByText('Custom Previous')).toBeInTheDocument();
        expect(screen.getByText('Custom Next')).toBeInTheDocument();
        expect(screen.getByLabelText('Custom New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Custom Confirm Password')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
        renderer({
            open: true,
            loading: true,
        });

        // Component should render without errors even in loading state
        expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    });
});
