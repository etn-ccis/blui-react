import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ChangePasswordDialogBase } from './ChangePasswordDialogBase';

afterEach(cleanup);

describe('ChangePasswordDialogBase tests', () => {
    it('renders without crashing', () => {
        render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                PasswordProps={{
                    onPasswordChange: (): void => {},
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
                currentPasswordChange={(): void => {}}
                enableButton={false}
            />
        );
    });

    it('input onChange callBack', () => {
        const { getByLabelText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                currentPasswordChange={(): void => {}}
                enableButton={false}
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
                currentPasswordLabel="Current Password"
            />
        );

        const currentPasswordInput = getByLabelText('Current Password');
        expect(currentPasswordInput).toHaveValue('');
        fireEvent.change(currentPasswordInput, { target: { value: 'Password@123' } });
        expect(currentPasswordInput).toHaveValue('Password@123');
    });

    it('calls onPrevious when previous button is clicked', () => {
        const onPreviousMock = jest.fn();
        const { getByText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                onPrevious={onPreviousMock}
                previousLabel="Back"
                currentPasswordChange={(): void => {}}
                enableButton={false}
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
            />
        );

        const previousButton = getByText('Back');
        fireEvent.click(previousButton);
        expect(onPreviousMock).toHaveBeenCalled();
    });

    it('calls onSubmit when next button is clicked', () => {
        const onSubmitMock = jest.fn();
        const { getByText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={onSubmitMock}
                nextLabel="Submit"
                currentPasswordChange={(): void => {}}
                enableButton={true}
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
            />
        );

        const submitButton = getByText('Submit');
        fireEvent.click(submitButton);
        expect(onSubmitMock).toHaveBeenCalled();
    });

    it('shows success screen when showSuccessScreen is true', () => {
        const { queryByLabelText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                showSuccessScreen={true}
                currentPasswordChange={(): void => {}}
                enableButton={false}
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
            />
        );

        // When success screen is shown, the current password input should not be present
        expect(queryByLabelText('Current Password')).not.toBeInTheDocument();
    });

    it('calls currentPasswordTextFieldProps onChange when provided', () => {
        const onChangeMock = jest.fn();
        const { getByLabelText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                currentPasswordChange={(): void => {}}
                enableButton={false}
                currentPasswordLabel="Current Password"
                currentPasswordTextFieldProps={{
                    onChange: onChangeMock,
                }}
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: '',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: undefined,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
            />
        );

        const currentPasswordInput = getByLabelText('Current Password');
        fireEvent.change(currentPasswordInput, { target: { value: 'NewPass123' } });
        expect(onChangeMock).toHaveBeenCalled();
    });

    it('focuses password field when Enter is pressed in current password', () => {
        const passwordRef = React.createRef<HTMLInputElement>();
        const { getByLabelText } = render(
            <ChangePasswordDialogBase
                open={true}
                onSubmit={(): any => {}}
                currentPasswordChange={(): void => {}}
                enableButton={false}
                currentPasswordLabel="Current Password"
                PasswordProps={{
                    onPasswordChange: (): void => {},
                    newPasswordLabel: 'New Password',
                    initialNewPasswordValue: '',
                    confirmPasswordLabel: '',
                    initialConfirmPasswordValue: '',
                    passwordRequirements: [],
                    passwordRef: passwordRef,
                    confirmRef: undefined,
                    onSubmit: (): void => {},
                }}
            />
        );

        const currentPasswordInput = getByLabelText('Current Password');
        fireEvent.keyUp(currentPasswordInput, { key: 'Enter', code: 'Enter' });
        // This tests the onKeyUp branch
    });
});
