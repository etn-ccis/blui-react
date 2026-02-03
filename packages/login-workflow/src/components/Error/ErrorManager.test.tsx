import React from 'react';
import '@testing-library/jest-dom';
import { render, cleanup, screen, RenderResult, fireEvent } from '@testing-library/react';
import ErrorManager from './ErrorManager';
import { ErrorManagerProps } from './types';
import { RegistrationContextProvider } from '../../contexts';
import { RegistrationWorkflow } from '../../components';
import { registrationContextProviderProps } from '../../testUtils';

afterEach(cleanup);

const renderer = (props?: ErrorManagerProps): RenderResult =>
    render(
        <RegistrationContextProvider {...registrationContextProviderProps}>
            <RegistrationWorkflow initialScreenIndex={0}>
                <ErrorManager {...props} />
            </RegistrationWorkflow>
        </RegistrationContextProvider>
    );

describe('ErrorManager', () => {
    it('renders without crashing', () => {
        render(<ErrorManager error={'Error Message'} dialogConfig={{ title: 'Error Title' }} />);
        const errorManager = screen.getByText('Error Message');
        expect(errorManager).toBeInTheDocument();
    });

    it('should render children when no error is present', () => {
        renderer({
            children: <div data-testid="test-child">Test Child</div>,
        });

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render children when error is empty string', () => {
        renderer({
            error: '',
            children: <div data-testid="test-child">Test Child</div>,
        });

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should render dialog mode with error when error is present', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
            title: 'Test Error Title',
            children: <div data-testid="test-child">Test Child</div>,
        });

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
        expect(screen.getByText('Test Error Title')).toBeInTheDocument();
    });

    it('should use default title "Error" when no title is provided in dialog mode', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
        });

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should use dialogConfig title when provided', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
            title: 'Default Title',
            dialogConfig: {
                title: 'Dialog Config Title',
            },
        });

        expect(screen.getByText('Dialog Config Title')).toBeInTheDocument();
    });

    it('should use dialogConfig dismissLabel when provided', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
            dialogConfig: {
                dismissLabel: 'Custom Close',
            },
        });

        expect(screen.getByText('Custom Close')).toBeInTheDocument();
    });

    it('should call onClose when dialog is dismissed', () => {
        const mockOnClose = jest.fn();

        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
            onClose: mockOnClose,
        });

        const closeButton = screen.getByText('Okay');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render message-box mode with error at top position', () => {
        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                title="Test Error Title"
                messageBoxConfig={{ position: 'top' }}
            >
                <div data-testid="test-child">Test Child</div>
            </ErrorManager>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
        expect(screen.getByText('Test Error Title')).toBeInTheDocument();
    });

    it('should render message-box mode with error at bottom position', () => {
        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                title="Test Error Title"
                messageBoxConfig={{ position: 'bottom' }}
            >
                <div data-testid="test-child">Test Child</div>
            </ErrorManager>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
        expect(screen.getByText('Test Error Title')).toBeInTheDocument();
    });

    it('should use messageBoxConfig title when provided', () => {
        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                title="Default Title"
                messageBoxConfig={{
                    title: 'Message Box Title',
                }}
            />
        );

        expect(screen.getByText('Message Box Title')).toBeInTheDocument();
    });

    it('should handle messageBoxConfig with custom styling and colors', () => {
        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                messageBoxConfig={{
                    backgroundColor: '#ff0000',
                    fontColor: '#ffffff',
                    dismissible: false,
                    sx: { padding: 2 },
                }}
            />
        );

        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('should handle mode="none" and render only children', () => {
        render(
            <ErrorManager mode="none" error="Test Error Message">
                <div data-testid="test-child">Test Child</div>
            </ErrorManager>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.queryByText('Test Error Message')).not.toBeInTheDocument();
    });

    it('should use custom translation function when provided', () => {
        const mockT = jest.fn((key: string) => `Translated: ${key}`) as any;

        renderer({
            mode: 'dialog',
            error: 'error.key',
            title: 'title.key',
            t: mockT,
        });

        expect(mockT).toHaveBeenCalledWith('title.key', undefined);
        expect(mockT).toHaveBeenCalledWith('error.key', undefined);
    });

    it('should pass errorOptions and titleOptions to translation function', () => {
        const mockT = jest.fn((key: string, options?: any) => `${key}-${JSON.stringify(options)}`) as any;
        const errorOptions = { count: 1 };
        const titleOptions = { name: 'test' };

        renderer({
            mode: 'dialog',
            error: 'error.key',
            title: 'title.key',
            errorOptions,
            titleOptions,
            t: mockT,
        });

        expect(mockT).toHaveBeenCalledWith('title.key', titleOptions);
        expect(mockT).toHaveBeenCalledWith('error.key', errorOptions);
    });
    it('should handle default messageBoxConfig position as top', () => {
        render(
            <ErrorManager mode="message-box" error="Test Error Message" messageBoxConfig={{}}>
                <div data-testid="test-child">Test Child</div>
            </ErrorManager>
        );

        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('should render with dialogConfig sx styling', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
            dialogConfig: {
                sx: { maxWidth: 400 },
            },
        });

        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('should handle dismissible message box', () => {
        const mockOnClose = jest.fn();

        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                onClose={mockOnClose}
                messageBoxConfig={{
                    dismissible: true,
                }}
            />
        );

        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('should handle non-dismissible message box', () => {
        render(
            <ErrorManager
                mode="message-box"
                error="Test Error Message"
                messageBoxConfig={{
                    dismissible: false,
                }}
            />
        );

        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('should use default onClose function when none provided', () => {
        renderer({
            mode: 'dialog',
            error: 'Test Error Message',
        });

        const closeButton = screen.getByText('Okay');
        expect(closeButton).toBeInTheDocument();

        // Should not throw error when clicking without onClose provided
        fireEvent.click(closeButton);
    });

    it('should render without error when all props are undefined', () => {
        render(<ErrorManager />);

        // Component should render without crashing
        expect(document.body).toBeInTheDocument();
    });
});
