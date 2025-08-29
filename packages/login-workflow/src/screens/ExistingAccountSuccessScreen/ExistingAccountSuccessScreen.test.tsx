import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExistingAccountSuccessScreen } from './ExistingAccountSuccessScreen';
import { RegistrationContextProvider } from '../../contexts';
import { registrationContextProviderProps } from '../../testUtils';

describe('ExistingAccountSuccessScreen', () => {
    let mockNavigate: jest.Mock;
    let mockOnDismiss: jest.Mock;
    let mockOnNext: jest.Mock;

    beforeEach(() => {
        mockNavigate = jest.fn();
        mockOnDismiss = jest.fn();
        mockOnNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen />
            </RegistrationContextProvider>
        );
    });

    // it('renders with default props and content', () => {
    //     render(
    //         <RegistrationContextProvider {...registrationContextProviderProps}>
    //             <ExistingAccountSuccessScreen />
    //         </RegistrationContextProvider>
    //     );

    //     // Check for default title and description
    //     expect(screen.getByText('Registration Complete')).toBeInTheDocument();
    //     expect(screen.getByText('Welcome!')).toBeInTheDocument();
    //     expect(screen.getByText('Your account already exists.')).toBeInTheDocument();
    //     expect(screen.getByText('Continue')).toBeInTheDocument();
    // });

    it('calls default onDismiss (navigate to login) when continue button is clicked', () => {
        const mockContext = {
            ...registrationContextProviderProps,
            navigate: mockNavigate,
            routeConfig: { LOGIN: '/login' },
        };

        render(
            <RegistrationContextProvider {...mockContext}>
                <ExistingAccountSuccessScreen />
            </RegistrationContextProvider>
        );

        const continueButton = screen.getByText('Continue');
        fireEvent.click(continueButton);

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('calls custom onDismiss when provided', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen onDismiss={mockOnDismiss} />
            </RegistrationContextProvider>
        );

        const continueButton = screen.getByText('Continue');
        fireEvent.click(continueButton);

        expect(mockOnDismiss).toHaveBeenCalled();
    });

    it('calls both onDismiss and WorkflowCardActionsProps.onNext when both are provided', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    onDismiss={mockOnDismiss}
                    WorkflowCardActionsProps={{
                        onNext: mockOnNext,
                    }}
                />
            </RegistrationContextProvider>
        );

        const continueButton = screen.getByText('Continue');
        fireEvent.click(continueButton);

        expect(mockOnDismiss).toHaveBeenCalled();
        expect(mockOnNext).toHaveBeenCalled();
    });

    it('renders with custom WorkflowCardHeaderProps', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    WorkflowCardHeaderProps={{
                        title: 'Custom Title',
                    }}
                />
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders with custom WorkflowCardActionsProps', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    WorkflowCardActionsProps={{
                        nextLabel: 'Custom Button',
                    }}
                />
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });

    it('renders with custom EmptyStateProps', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    EmptyStateProps={{
                        icon: <div>Custom Icon</div>,
                        title: 'Custom Empty State Title',
                        description: 'Custom Empty State Description',
                    }}
                />
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Custom Empty State Title')).toBeInTheDocument();
        expect(screen.getByText('Custom Empty State Description')).toBeInTheDocument();
        expect(screen.getByText('Custom Icon')).toBeInTheDocument();
    });

    // it('disables continue button when canDismiss is false', () => {
    //     render(
    //         <RegistrationContextProvider {...registrationContextProviderProps}>
    //             <ExistingAccountSuccessScreen canDismiss={false} />
    //         </RegistrationContextProvider>
    //     );

    //     const continueButton = screen.getByText('Continue');
    //     expect(continueButton).toBeDisabled();
    // });

    it('enables continue button when canDismiss is true', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen canDismiss={true} />
            </RegistrationContextProvider>
        );

        const continueButton = screen.getByText('Continue');
        expect(continueButton).toBeEnabled();
    });

    it('renders with custom loading state', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    WorkflowCardBaseProps={{
                        loading: true,
                    }}
                />
            </RegistrationContextProvider>
        );

        // The loading spinner should be visible
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // it('passes through other props to SuccessScreenBase', () => {
    //     render(
    //         <RegistrationContextProvider {...registrationContextProviderProps}>
    //             <ExistingAccountSuccessScreen
    //                 WorkflowCardBaseProps={{
    //                     sx: { backgroundColor: 'red' },
    //                 }}
    //             />
    //         </RegistrationContextProvider>
    //     );

    //     // Check that the component renders without crashing with custom sx props
    //     expect(screen.getByText('Welcome!')).toBeInTheDocument();
    // });

    // it('renders with custom background image', () => {
    //     render(
    //         <RegistrationContextProvider {...registrationContextProviderProps}>
    //             <ExistingAccountSuccessScreen
    //                 WorkflowCardBaseProps={{
    //                     backgroundImage: 'url(test-image.jpg)',
    //                 }}
    //             />
    //         </RegistrationContextProvider>
    //     );

    //     expect(screen.getByText('Welcome!')).toBeInTheDocument();
    // });

    it('renders with canDismiss as a function returning true', () => {
        const canDismissFunction = jest.fn().mockReturnValue(true);
        
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen canDismiss={canDismissFunction} />
            </RegistrationContextProvider>
        );

        const continueButton = screen.getByText('Continue');
        expect(continueButton).toBeEnabled();
    });

    // it('renders with canDismiss as a function returning false', () => {
    //     const canDismissFunction = jest.fn().mockReturnValue(false);
        
    //     render(
    //         <RegistrationContextProvider {...registrationContextProviderProps}>
    //             <ExistingAccountSuccessScreen canDismiss={canDismissFunction} />
    //         </RegistrationContextProvider>
    //     );

    //     const continueButton = screen.getByText('Continue');
    //     expect(continueButton).toBeDisabled();
    // });

    it('renders with custom dismissButtonLabel', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen dismissButtonLabel="Get Started" />
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders with WorkflowCardInstructionProps', () => {
        render(
            <RegistrationContextProvider {...registrationContextProviderProps}>
                <ExistingAccountSuccessScreen
                    WorkflowCardInstructionProps={{
                        instructions: 'Follow these steps to proceed',
                    }}
                />
            </RegistrationContextProvider>
        );

        expect(screen.getByText('Follow these steps to proceed')).toBeInTheDocument();
    });
});
