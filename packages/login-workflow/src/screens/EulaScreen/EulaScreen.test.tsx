import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, RenderResult, fireEvent, act, waitFor } from '@testing-library/react';
import { EulaScreen } from './EulaScreen';
import { RegistrationContextProvider } from '../../contexts';
import { EulaScreenProps } from './types';
import { RegistrationWorkflow } from '../../components';
import { registrationContextProviderProps } from '../../testUtils';
import { i18nRegistrationInstance } from '../../contexts/RegistrationContext/i18nRegistrationInstance';

afterEach(cleanup);

describe('Eula Screen', () => {
    let mockOnNext: any;
    let mockOnPrevious: any;

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        mockOnNext = jest.fn();
        mockOnPrevious = jest.fn();
    });

    const renderer = (props?: EulaScreenProps): RenderResult =>
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen {...props} />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

    it('renders without crashing', async () => {
        renderer();
        await waitFor(() => expect(screen.getByText('License Agreement')).toBeInTheDocument);
    });

    it('should update values when passed as props', async () => {
        renderer({ WorkflowCardHeaderProps: { title: 'Test Title' } });
        await waitFor(() => {
            expect(screen.queryByText('License Agreement')).toBeNull();
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });
    });

    it('should update content of Eula Screen when eulaContent prop set ', () => {
        renderer({ eulaContent: 'Test Eula Content' });
        expect(screen.getByText('Test Eula Content')).toBeInTheDocument();
    });

    it('should show button when html prop is true', () => {
        renderer({ html: true, eulaContent: '<button>Submit</button>' });
        expect(
            screen.getByRole('button', {
                name: /Submit/i,
            })
        ).toBeVisible();
    });

    it('should show button element as as a string when html prop is true', () => {
        renderer({ html: false, eulaContent: '<button>Submit</button>' });
        expect(screen.getByText('<button>Submit</button>')).toBeInTheDocument();
    });

    it('should call onNext, when Next button clicked', async () => {
        const { getByLabelText } = renderer({
            WorkflowCardActionsProps: {
                onNext: mockOnNext(),
                showNext: true,
                nextLabel: 'Next',
            },
        });
        await waitFor(() => expect(screen.getByText('License Agreement')).toBeInTheDocument);
        const checkboxLabel = getByLabelText('I have read and agree to the Terms & Conditions');
        fireEvent.click(checkboxLabel);
        fireEvent.change(checkboxLabel, { target: { accepted: true } });

        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeInTheDocument();
        await act(async () => {
            expect(await screen.findByText('Next')).toBeEnabled();
            fireEvent.click(nextButton);
        });
        expect(mockOnNext).toHaveBeenCalled();
    });

    it('should call onPrevious, when Back button clicked', () => {
        renderer({
            WorkflowCardActionsProps: {
                onPrevious: mockOnPrevious(),
                showPrevious: true,
                previousLabel: 'Back',
            },
        });

        const backButton = screen.getByText('Back');
        expect(backButton).toBeInTheDocument();
        expect(screen.getByText(/Back/i)).toBeEnabled();
        fireEvent.click(backButton);
        expect(mockOnPrevious).toHaveBeenCalled();
    });

    it('should throw error in eula and clicking refresh button should call loadEula', async () => {
        const loadFn = jest.fn().mockRejectedValue(new Error('qwertyuiop'));
        const { findByText } = render(
            <RegistrationContextProvider
                {...{
                    language: 'en',
                    i18n: i18nRegistrationInstance,
                    navigate: (): void => {},
                    routeConfig: {},
                    actions: {
                        loadEula: loadFn,
                        acceptEula: jest.fn(),
                        requestRegistrationCode: jest.fn(),
                        validateUserRegistrationRequest: jest.fn(),
                        createPassword: jest.fn(),
                        setAccountDetails: jest.fn(),
                        completeRegistration: jest.fn().mockImplementation(() => Promise.resolve()),
                    },
                }}
            >
                <RegistrationWorkflow>
                    <EulaScreen />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
        fireEvent.click(await findByText('Retry'));
        expect(loadFn).toBeCalled();
    }, 10000);

    it('should handle acceptEula action when EULA is accepted', async () => {
        const mockAcceptEula = jest.fn().mockResolvedValue(true);

        render(
            <RegistrationContextProvider
                language={'EN'}
                navigate={jest.fn()}
                routeConfig={{}}
                actions={{ acceptEula: mockAcceptEula }}
                i18n={i18nRegistrationInstance}
            >
                <RegistrationWorkflow>
                    <EulaScreen eulaContent="Test EULA" />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        // Check EULA checkbox
        const checkbox = screen.getByLabelText('I have read and agree to the Terms & Conditions');
        fireEvent.click(checkbox);

        // Click Next button
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockAcceptEula).toHaveBeenCalled();
        });
    });

    it('should not call acceptEula when EULA is not accepted', () => {
        const mockAcceptEula = jest.fn().mockResolvedValue(undefined);

        render(
            <RegistrationContextProvider
                {...{
                    ...registrationContextProviderProps,
                    actions: {
                        ...registrationContextProviderProps.actions,
                        acceptEula: mockAcceptEula,
                    },
                }}
            >
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen eulaContent="Test EULA" initialCheckboxValue={false} />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        const nextButton = screen.getByText('Next');
        act(() => {
            fireEvent.click(nextButton);
        });

        // Should not call acceptEula when checkbox is not checked
        expect(mockAcceptEula).not.toHaveBeenCalled();
    });

    it('should handle error during acceptEula action', async () => {
        const mockAcceptEula = jest.fn().mockRejectedValue(new Error('Accept EULA failed'));

        render(
            <RegistrationContextProvider
                language={'EN'}
                navigate={jest.fn()}
                routeConfig={{}}
                actions={{ acceptEula: mockAcceptEula }}
                i18n={i18nRegistrationInstance}
            >
                <RegistrationWorkflow>
                    <EulaScreen eulaContent="Test EULA" />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        // Check EULA checkbox
        const checkbox = screen.getByLabelText('I have read and agree to the Terms & Conditions');
        fireEvent.click(checkbox);

        // Click Next button
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        // Wait for error dialog to appear
        await waitFor(() => {
            expect(screen.getByText('Accept EULA failed')).toBeInTheDocument();
        });
    });

    it('should handle invite registration flow', async () => {
        const mockValidateUserRegistrationRequest = jest.fn().mockResolvedValue({
            codeValid: true,
            accountExists: false,
        });

        render(
            <RegistrationContextProvider
                {...{
                    ...registrationContextProviderProps,
                    actions: {
                        ...registrationContextProviderProps.actions,
                        validateUserRegistrationRequest: mockValidateUserRegistrationRequest,
                    },
                }}
            >
                <RegistrationWorkflow initialScreenIndex={0} isInviteRegistration={true}>
                    <EulaScreen eulaContent="Test EULA" initialCheckboxValue={true} />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        const nextButton = screen.getByText('Next');
        act(() => {
            fireEvent.click(nextButton);
        });

        await waitFor(() => {
            expect(mockValidateUserRegistrationRequest).toHaveBeenCalled();
        });
    });

    it('should handle updateEulaAcceptedStatus without onEulaAcceptedChange callback', () => {
        const { getByLabelText } = renderer({
            // Not providing onEulaAcceptedChange to test the optional chaining
        });

        const checkbox = getByLabelText('I have read and agree to the Terms & Conditions');
        // Should not throw error even without callback
        expect(() => fireEvent.click(checkbox)).not.toThrow();
    });

    it('should handle WorkflowCardActionsProps onNext callback', async () => {
        const mockWorkflowOnNext = jest.fn();

        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen
                        eulaContent="Test EULA"
                        initialCheckboxValue={true}
                        WorkflowCardActionsProps={{
                            onNext: mockWorkflowOnNext,
                        }}
                    />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        const nextButton = screen.getByText('Next');
        act(() => {
            fireEvent.click(nextButton);
        });

        await waitFor(() => {
            expect(mockWorkflowOnNext).toHaveBeenCalled();
        });
    });

    it('should handle WorkflowCardActionsProps onPrevious callback', () => {
        const mockWorkflowOnPrevious = jest.fn();

        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen
                        eulaContent="Test EULA"
                        WorkflowCardActionsProps={{
                            onPrevious: mockWorkflowOnPrevious,
                        }}
                    />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockWorkflowOnPrevious).toHaveBeenCalled();
    });

    it('should handle loadAndCacheEula with eulaContent provided vs loading', async () => {
        const mockLoadEula = jest.fn().mockResolvedValue('Loaded EULA content');

        // Test with provided content - should not call loadEula
        const { rerender } = render(
            <RegistrationContextProvider
                {...{
                    ...registrationContextProviderProps,
                    actions: {
                        ...registrationContextProviderProps.actions,
                        loadEula: mockLoadEula,
                    },
                }}
            >
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen eulaContent="Provided EULA content" />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Provided EULA content')).toBeInTheDocument();
        expect(mockLoadEula).not.toHaveBeenCalled();

        // Test without provided content - should call loadEula
        rerender(
            <RegistrationContextProvider
                {...{
                    ...registrationContextProviderProps,
                    actions: {
                        ...registrationContextProviderProps.actions,
                        loadEula: mockLoadEula,
                    },
                }}
            >
                <RegistrationWorkflow initialScreenIndex={0}>
                    <EulaScreen />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        await waitFor(() => {
            expect(mockLoadEula).toHaveBeenCalled();
        });
    });

    it('should handle checkbox disabled state due to EULA fetch error', async () => {
        const mockLoadEula = jest.fn().mockRejectedValue(new Error('Fetch failed'));

        render(
            <RegistrationContextProvider
                language={'EN'}
                navigate={jest.fn()}
                routeConfig={{}}
                actions={{ loadEula: mockLoadEula }}
                i18n={i18nRegistrationInstance}
            >
                <RegistrationWorkflow>
                    <EulaScreen />
                </RegistrationWorkflow>
            </RegistrationContextProvider>
        );

        // Wait for the effect to trigger and error to occur
        await waitFor(() => {
            expect(mockLoadEula).toHaveBeenCalled();
        });

        // Wait for error state to be set
        await waitFor(() => {
            const checkbox = screen.getByLabelText('I have read and agree to the Terms & Conditions');
            expect(checkbox).toBeDisabled();
        });
    });
});
