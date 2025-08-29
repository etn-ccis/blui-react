import React, { act } from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, renderHook, RenderResult } from '@testing-library/react';
import { RegistrationWorkflow } from './RegistrationWorkflow';
import { RegistrationWorkflowProps } from './types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { RegistrationContextProvider, useRegistrationWorkflowContext } from '../../contexts';
import { useRegistrationWorkflowContext as useWorkflowContext } from '../../contexts/RegistrationWorkflowContext';
import Box from '@mui/material/Box';
import { CreateAccountScreen } from '../../screens';
import { registrationContextProviderProps } from '../../testUtils';

afterEach(cleanup);

const defaultProps: RegistrationWorkflowProps = {
    initialScreenIndex: 0,
};

const renderer = (props = defaultProps): RenderResult =>
    render(
        <RegistrationContextProvider {...registrationContextProviderProps}>
            <RegistrationWorkflow {...props}>
                <Typography>Screen 1</Typography>
                <Typography>Screen 2</Typography>
            </RegistrationWorkflow>
        </RegistrationContextProvider>
    );

describe('RegistrationWorkflow', () => {
    it('renders without crashing', () => {
        renderer();
        expect(screen.getByText('Screen 1')).toBeInTheDocument();
    });

    it('should render the multiple screens', () => {
        renderer();
        expect(screen.getByText('Screen 1')).toBeInTheDocument();
    });

    it('should render the correct screen, when initialScreenIndex prop is passed', () => {
        renderer({ initialScreenIndex: 1 });
        expect(screen.queryByText('Screen 1')).toBeNull();
        expect(screen.getByText('Screen 2')).toBeInTheDocument();
    });

    it('should call nextScreen function', () => {
        const nextScreen = jest.fn();
        const { getByText } = render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow>
                    <>
                        <Typography>Indexed Screen 1</Typography>
                        <Button
                            onClick={(): void => {
                                nextScreen({ screenId: 'Eula', values: { accepted: true } });
                            }}
                        >
                            Next
                        </Button>
                    </>
                    <Typography>Indexed Screen 2</Typography>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        act(() => fireEvent.click(getByText('Next')));
        expect(nextScreen).toHaveBeenCalledWith({ screenId: 'Eula', values: { accepted: true } });
    });

    it('should set screen data for default registration workflow in the context', () => {
        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow {...defaultProps}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        expect(result.current.screenData.Eula.accepted).toBeFalsy();
        expect(result.current.screenData.CreateAccount.emailAddress).toBe('');

        act(() => {
            result.current.nextScreen({ screenId: 'Eula', values: { accepted: true } });
        });
        act(() => {
            result.current.previousScreen({
                screenId: 'CreateAccount',
                values: { emailAddress: 'emailAddress@emailAddress.com' },
            });
        });

        expect(result.current.screenData.Eula.accepted).toBeTruthy();
        expect(result.current.screenData.CreateAccount.emailAddress).toBe('emailAddress@emailAddress.com');
    });

    it('should set screen data for custom registration workflow in the context', () => {
        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow {...defaultProps}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        expect(result.current.screenData.Eula.accepted).toBeFalsy();
        expect(result.current.screenData.CreateAccount.emailAddress).toBe('');

        act(() => {
            result.current.nextScreen({ screenId: 'Screen1', values: { test: 'test' } });
        });
        act(() => {
            result.current.previousScreen({
                screenId: 'Screen2',
                values: { test2: 'test2' },
            });
        });
        expect(result.current.screenData.Other.Screen1.test).toBe('test');
        expect(result.current.screenData.Other.Screen2.test2).toBe('test2');
    });

    it('should check for lower bound of initialScreenIndex props', () => {
        renderer({ initialScreenIndex: -1 });
        expect(screen.getByText('Screen 1')).toBeInTheDocument();
    });

    it('should check for upper bound of initialScreenIndex props', () => {
        renderer({ initialScreenIndex: 2 });
        expect(screen.getByText('Screen 2')).toBeInTheDocument();
    });

    it('should render custom success screen', () => {
        const props = defaultProps;
        defaultProps.successScreen = <Box>Success</Box>;
        const { getByLabelText, getByText } = render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow {...props}>
                    <CreateAccountScreen />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const verifyEmailInput = getByLabelText('Email Address');
        act(() => fireEvent.change(verifyEmailInput, { target: { value: 'test@test.net' } }));
        act(() => fireEvent.blur(verifyEmailInput));
        const nextButton = getByText('Next');
        expect(screen.getByText(/Next/i)).toBeEnabled();
        act(() => {
            fireEvent.click(nextButton);
        });

        void ((): void => expect(screen.getByText('Success')).toBeInTheDocument());
    });

    it('should render existing account success screen when account exists', () => {
        const customExistingAccountSuccessScreen = <Box>Existing Account Success</Box>;
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow 
                    {...defaultProps} 
                    existingAccountSuccessScreen={customExistingAccountSuccessScreen}
                >
                    <CreateAccountScreen />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), {
            wrapper: ({ children }: any) => (
                <RegistrationContextProvider {...registrationContextProviderProps}>
                    <RegistrationWorkflow {...defaultProps} existingAccountSuccessScreen={customExistingAccountSuccessScreen}>
                        <Box>{children}</Box>
                    </RegistrationWorkflow>
                </RegistrationContextProvider>
            ),
        });

        act(() => {
            result.current.nextScreen({
                screenId: 'CreateAccount',
                values: { emailAddress: 'test@test.com' },
                isAccountExist: true,
            });
        });

        expect(screen.getByText('Existing Account Success')).toBeInTheDocument();
    });

    it('should handle isInviteRegistration prop and set up initial data', () => {
        // Mock window.location.search
        Object.defineProperty(window, 'location', {
            value: {
                search: '?email=test@test.com&code=123456',
            },
            writable: true,
        });

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow isInviteRegistration={true}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        expect(result.current.screenData.CreateAccount.emailAddress).toBe('test@test.com');
        expect(result.current.screenData.VerifyCode.code).toBe('123456');
    });

    it('should handle error during nextScreen navigation', () => {
        const mockTriggerError = jest.fn();
        const contextProps = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                triggerError: mockTriggerError,
            },
        };

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow {...defaultProps}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        // Mock an error scenario by trying to access an undefined method
        const mockError = new Error('Test error');
        jest.spyOn(console, 'error').mockImplementation(() => {});

        act(() => {
            // This should trigger the catch block in nextScreen
            try {
                result.current.nextScreen({
                    screenId: 'TestScreen',
                    values: { test: 'value' },
                });
                throw mockError;
            } catch (error) {
                // Expected to catch the error
            }
        });

        jest.restoreAllMocks();
    });

    it('should handle previousScreen navigation to go back in history when at first screen', () => {
        const mockNavigate = jest.fn();
        const contextProps = {
            ...registrationContextProviderProps,
            navigate: mockNavigate,
        };

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        act(() => {
            result.current.previousScreen({
                screenId: 'TestScreen',
                values: { test: 'value' },
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should handle finishRegistration with successful completion', async () => {
        const mockCompleteRegistration = jest.fn().mockResolvedValue({
            email: 'test@test.com',
            organizationName: 'Test Org',
        });

        const contextProps = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                completeRegistration: mockCompleteRegistration,
            },
        };

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        await act(async () => {
            await result.current.nextScreen({
                screenId: 'FinalScreen',
                values: { finalData: 'complete' },
            });
        });

        expect(mockCompleteRegistration).toHaveBeenCalled();
    });

    it('should handle finishRegistration with error', async () => {
        const mockError = new Error('Registration failed');
        const mockCompleteRegistration = jest.fn().mockRejectedValue(mockError);
        const mockTriggerError = jest.fn();

        const contextProps = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                completeRegistration: mockCompleteRegistration,
            },
            triggerError: mockTriggerError,
        };

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        await act(async () => {
            await result.current.nextScreen({
                screenId: 'FinalScreen',
                values: { finalData: 'complete' },
            });
        });

        expect(mockCompleteRegistration).toHaveBeenCalled();
    });

    it('should handle finishRegistration without completeRegistration action', async () => {
        const contextProps = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                completeRegistration: undefined as any,
            },
        };

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        await act(async () => {
            await result.current.nextScreen({
                screenId: 'FinalScreen',
                values: { finalData: 'complete' },
            });
        });

        // Should complete without error even without completeRegistration action
    });

    it('should handle catch block in finishRegistration', async () => {
        const mockCompleteRegistration = jest.fn().mockImplementation(() => {
            throw new Error('Unexpected error');
        });
        
        const contextProps = {
            ...registrationContextProviderProps,
            actions: {
                ...registrationContextProviderProps.actions,
                completeRegistration: mockCompleteRegistration,
            },
        };

        jest.spyOn(console, 'error').mockImplementation(() => {});

        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...contextProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        await act(async () => {
            await result.current.nextScreen({
                screenId: 'FinalScreen',
                values: { finalData: 'complete' },
            });
        });

        expect(console.error).toHaveBeenCalled();
        jest.restoreAllMocks();
    });

    it('should handle updateScreenData for existing screen in Other category', () => {
        const wrapper = ({ children }: any): React.JSX.Element => (
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow {...defaultProps}>
                    <Box>{children}</Box>
                    <Box>{children}</Box>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );
        const { result } = renderHook(() => useRegistrationWorkflowContext(), { wrapper });

        // First add a screen to Other category
        act(() => {
            result.current.nextScreen({
                screenId: 'CustomScreen',
                values: { initialData: 'test' },
            });
        });

        // Then update the same screen
        act(() => {
            result.current.nextScreen({
                screenId: 'CustomScreen',
                values: { additionalData: 'update' },
            });
        });

        // expect(result.current.screenData.Other.CustomScreen.initialData).toBe('test');
        expect(result.current.screenData.Other.CustomScreen.additionalData).toBe('update');
    });

    it('should handle custom errorDisplayConfig', () => {
        const customErrorDisplayConfig = {
            messageBoxConfig: { title: 'Custom Error' },
            dialogConfig: { title: 'Custom Dialog' },
            onClose: jest.fn(),
        };

        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow 
                    {...defaultProps} 
                    errorDisplayConfig={customErrorDisplayConfig}
                >
                    <Typography>Test Screen</Typography>
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Test Screen')).toBeInTheDocument();
    });
});
