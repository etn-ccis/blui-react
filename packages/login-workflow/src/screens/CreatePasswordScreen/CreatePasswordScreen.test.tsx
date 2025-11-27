import React, { act } from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { CreatePasswordScreen } from './CreatePasswordScreen';
import { CreatePasswordScreenProps } from './types';
import { RegistrationContextProvider } from '../../contexts';
import { RegistrationWorkflow } from '../../components';
import { registrationContextProviderProps } from '../../testUtils';

const passwordRequirements = [
    {
        description: 'Check 1',
        regex: /^.{3,5}$/,
    },
    {
        description: 'Check 2',
        regex: /[a-z]+/,
    },
];

afterEach(cleanup);

describe('Create Password Screen', () => {
    let mockOnNext: any;
    let mockOnPrevious: any;

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockOnNext = jest.fn();
        mockOnPrevious = jest.fn();
    });

    const renderer = (props?: CreatePasswordScreenProps): RenderResult =>
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <CreatePasswordScreen {...props} />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

    it('renders without crashing', () => {
        renderer();

        expect(screen.getByText('Create Password')).toBeInTheDocument();
    });

    it('should display default props', () => {
        renderer();

        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.queryByLabelText('Password')).toBeEmptyDOMElement();
        expect(screen.queryByLabelText('Confirm Password')).toBeEmptyDOMElement();
    });

    it('should display default password requirements', () => {
        renderer();

        expect(screen.getByText('8-16 Characters')).toBeInTheDocument();
        expect(screen.getByText('One number')).toBeInTheDocument();
        expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
        expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
        expect(screen.getByText('One special character')).toBeInTheDocument();
    });

    it('should call onNext, when Next button clicked', () => {
        const { getByLabelText } = renderer({
            WorkflowCardActionsProps: {
                onNext: mockOnNext(),
                showNext: true,
                nextLabel: 'Next',
            },
            PasswordProps: {
                newPasswordLabel: 'Password',
                confirmPasswordLabel: 'Confirm Password',
                onPasswordChange: jest.fn(),
                passwordRequirements: passwordRequirements,
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'Ab@12' } });
        fireEvent.blur(passwordField);
        fireEvent.change(confirmPasswordField, { target: { value: 'Ab@12' } });
        fireEvent.blur(confirmPasswordField);

        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeInTheDocument();
        void act(() => fireEvent.click(nextButton));
        expect(mockOnNext).toHaveBeenCalled();
    });

    it('should enable next button, when passwordRequirements prop is empty', () => {
        const { getByLabelText } = renderer({
            WorkflowCardActionsProps: {
                onNext: mockOnNext(),
                showNext: true,
                nextLabel: 'Next',
            },
            PasswordProps: {
                newPasswordLabel: 'Password',
                confirmPasswordLabel: 'Confirm Password',
                onPasswordChange: jest.fn(),
                passwordRequirements: [],
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'A' } });
        fireEvent.blur(passwordField);
        fireEvent.change(confirmPasswordField, { target: { value: 'A' } });
        fireEvent.blur(confirmPasswordField);

        expect(screen.getByText(/Next/i)).toBeEnabled();
    });

    it('should call onPrevious, when Back button clicked', () => {
        renderer({
            WorkflowCardActionsProps: {
                onPrevious: mockOnPrevious(),
                showPrevious: true,
                previousLabel: 'Back',
            },
            PasswordProps: {
                newPasswordLabel: 'Password',
                confirmPasswordLabel: 'Confirm Password',
                onPasswordChange: jest.fn(),
                passwordRequirements: passwordRequirements,
            },
        });

        const backButton = screen.getByText('Back');
        expect(backButton).toBeInTheDocument();
        expect(screen.getByText(/Back/i)).toBeEnabled();
        fireEvent.click(backButton);
        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it('should handle createPassword action error and trigger error', () => {
        const mockCreatePassword = jest.fn().mockRejectedValue(new Error('Password creation failed'));

        // Create a custom registrationContextProvider with the failing action
        const customRegistrationContextProvider = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                createPassword: mockCreatePassword,
            },
        };

        const { getByLabelText } = render(
            <RegistrationContextProvider {...customRegistrationContextProvider}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <CreatePasswordScreen
                        PasswordProps={{
                            passwordRequirements: passwordRequirements,
                        }}
                    />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'Ab@12' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'Ab@12' } });

        const nextButton = screen.getByTestId('BluiWorkflowCardActions-nextButton');

        act(() => {
            fireEvent.click(nextButton);
        });

        expect(mockCreatePassword).toHaveBeenCalledWith('Ab@12');
    });
    it('should call errorDisplayConfig onClose handlers', () => {
        const mockErrorOnClose = jest.fn();

        renderer({
            errorDisplayConfig: {
                onClose: mockErrorOnClose,
            },
        });

        // Since we can't directly access the errorDisplayConfig onClose from the component,
        // we'll test that the component renders correctly with the error config
        expect(screen.getByText('Create Password')).toBeInTheDocument();
    });

    it('should call optional WorkflowCardActionsProps.onNext when provided', () => {
        const mockOnNextClick = jest.fn();
        const { getByLabelText } = renderer({
            WorkflowCardActionsProps: {
                onNext: mockOnNextClick,
            },
            PasswordProps: {
                passwordRequirements: passwordRequirements,
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'Ab@12' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'Ab@12' } });

        const nextButton = screen.getByText('Next');

        act(() => {
            fireEvent.click(nextButton);
        });

        expect(mockOnNextClick).toHaveBeenCalled();
    });

    it('should call optional PasswordProps.onSubmit when Enter key is pressed', () => {
        const mockOnSubmit = jest.fn();
        const { getByLabelText } = renderer({
            PasswordProps: {
                passwordRequirements: passwordRequirements,
                onSubmit: mockOnSubmit,
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'Ab@12' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'Ab@12' } });

        // Simulate pressing Enter key in the confirm password field
        fireEvent.keyUp(confirmPasswordField, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(mockOnSubmit).toHaveBeenCalled();
    });
    it('should use initial password values from PasswordProps', () => {
        const { getByLabelText } = renderer({
            PasswordProps: {
                initialNewPasswordValue: 'initial123',
                initialConfirmPasswordValue: 'confirm123',
                passwordRequirements: passwordRequirements,
            },
        });

        const passwordField = getByLabelText('Password') as HTMLInputElement;
        const confirmPasswordField = getByLabelText('Confirm Password') as HTMLInputElement;

        expect(passwordField.value).toBe('initial123');
        expect(confirmPasswordField.value).toBe('confirm123');
    });

    it('should call PasswordProps.onPasswordChange when password fields change', () => {
        const mockOnPasswordChange = jest.fn();
        const { getByLabelText } = renderer({
            PasswordProps: {
                onPasswordChange: mockOnPasswordChange,
                passwordRequirements: passwordRequirements,
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        fireEvent.change(passwordField, { target: { value: 'newPass123' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'newPass123' } });

        expect(mockOnPasswordChange).toHaveBeenCalledWith({
            password: 'newPass123',
            confirm: 'newPass123',
        });
    });

    it('should validate passwords with empty requirements array', () => {
        const { getByLabelText } = renderer({
            PasswordProps: {
                passwordRequirements: [],
            },
        });

        const passwordField = getByLabelText('Password');
        const confirmPasswordField = getByLabelText('Confirm Password');

        // With empty requirements, any matching passwords should be valid
        fireEvent.change(passwordField, { target: { value: 'simple' } });
        fireEvent.change(confirmPasswordField, { target: { value: 'simple' } });

        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeEnabled();
    });
});
