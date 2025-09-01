import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { EulaScreenBase } from './EulaScreenBase';
import { RegistrationContextProvider } from '../../contexts';
import { EulaScreenProps } from './types';
import { RegistrationWorkflow } from '../../components';
import { registrationContextProviderProps } from '../../testUtils';
// Constants
import { SAMPLE_EULA } from '../../constants/index';

afterEach(cleanup);

const renderer = (props?: EulaScreenProps): RenderResult =>
    render(
        <RegistrationContextProvider {...registrationContextProviderProps}>
            <RegistrationWorkflow initialScreenIndex={0}>
                <EulaScreenBase {...props} />
            </RegistrationWorkflow>
        </RegistrationContextProvider>
    );

describe('Eula Screen Base', () => {
    describe('Basic rendering', () => {
        it('renders without crashing', () => {
            render(
                <EulaScreenBase
                    WorkflowCardHeaderProps={{ title: 'License Agreement' }}
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I have read and agree to the Terms & Conditions'}
                    initialCheckboxValue={false}
                    onEulaAcceptedChange={(accepted: boolean): boolean => accepted}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Next',
                        canGoNext: true,
                        showPrevious: true,
                        previousLabel: 'Back',
                        canGoPrevious: true,
                        currentStep: 0,
                        totalSteps: 6,
                    }}
                />
            );
            expect(screen.getByText('License Agreement')).toBeInTheDocument();
            expect(screen.getByText('I have read and agree to the Terms & Conditions')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
            expect(screen.getByText('Back')).toBeInTheDocument();
            expect(screen.getByText(/Back/i)).toBeEnabled();
        });

        it('renders with minimal props', () => {
            render(<EulaScreenBase />);
            // Should render without errors even with no props
        });

        it('renders with JSX content', () => {
            const jsxContent = <div data-testid="jsx-content">JSX EULA Content</div>;
            render(<EulaScreenBase eulaContent={jsxContent} checkboxLabel="Accept terms" />);
            expect(screen.getByTestId('jsx-content')).toBeInTheDocument();
            expect(screen.getByText('JSX EULA Content')).toBeInTheDocument();
        });

        it('renders with instructions', () => {
            render(
                <EulaScreenBase
                    WorkflowCardInstructionProps={{
                        instructions: 'Please read the following agreement carefully',
                    }}
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel="I accept"
                />
            );
            expect(screen.getByText('Please read the following agreement carefully')).toBeInTheDocument();
        });

        it('does not render instructions when not provided', () => {
            render(<EulaScreenBase eulaContent={SAMPLE_EULA} checkboxLabel="I accept" />);
            // Instructions should not be present
            expect(screen.queryByText('Please read the following agreement carefully')).not.toBeInTheDocument();
        });
    });

    describe('Checkbox functionality', () => {
        it('next button is disabled when eula not accepted', () => {
            render(
                <EulaScreenBase
                    WorkflowCardHeaderProps={{ title: 'License Agreement' }}
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I have read and agree to the Terms & Conditions'}
                    initialCheckboxValue={false}
                    onEulaAcceptedChange={(accepted: boolean): boolean => accepted}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Next',
                        canGoNext: true,
                        showPrevious: true,
                        previousLabel: 'Back',
                        canGoPrevious: true,
                        currentStep: 0,
                        totalSteps: 6,
                    }}
                />
            );
            expect(screen.getByText('Next')).toBeInTheDocument();
            expect(screen.getByText('Next')).not.toBeEnabled();
        });

        it('next button is enabled when eula accepted', () => {
            const { getByLabelText } = render(
                <EulaScreenBase
                    WorkflowCardHeaderProps={{ title: 'License Agreement' }}
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I have read and agree to the Terms & Conditions'}
                    initialCheckboxValue={false}
                    onEulaAcceptedChange={(accepted: boolean): boolean => accepted}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Next',
                        canGoNext: true,
                        showPrevious: true,
                        previousLabel: 'Back',
                        canGoPrevious: true,
                        currentStep: 0,
                        totalSteps: 6,
                    }}
                />
            );

            const checkboxLabel = getByLabelText('I have read and agree to the Terms & Conditions');
            fireEvent.click(checkboxLabel);

            expect(screen.getByText('Next')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeEnabled();
        });

        it('calls onEulaAcceptedChange when checkbox is clicked', () => {
            const mockOnEulaAcceptedChange = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    onEulaAcceptedChange={mockOnEulaAcceptedChange}
                />
            );

            const checkbox = getByLabelText('I accept the terms');
            fireEvent.click(checkbox);

            expect(mockOnEulaAcceptedChange).toHaveBeenCalledWith(true);
        });

        it('checkbox starts checked when initialCheckboxValue is true', () => {
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    initialCheckboxValue={true}
                />
            );

            const checkbox = getByLabelText('I accept the terms') as HTMLInputElement;
            expect(checkbox.checked).toBe(true);
        });

        it('checkbox starts unchecked when initialCheckboxValue is false', () => {
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    initialCheckboxValue={false}
                />
            );

            const checkbox = getByLabelText('I accept the terms') as HTMLInputElement;
            expect(checkbox.checked).toBe(false);
        });

        it('checkbox starts unchecked when initialCheckboxValue is not provided', () => {
            const { getByLabelText } = render(
                <EulaScreenBase eulaContent={SAMPLE_EULA} checkboxLabel={'I accept the terms'} />
            );

            const checkbox = getByLabelText('I accept the terms') as HTMLInputElement;
            expect(checkbox.checked).toBe(false);
        });
    });

    describe('Keyboard navigation', () => {
        it('handles Enter key when checkbox is checked', () => {
            const mockOnNext = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        onNext: mockOnNext,
                    }}
                />
            );

            const checkboxLabel = getByLabelText('I accept the terms');
            fireEvent.keyUp(checkboxLabel, { key: 'Enter' });

            expect(mockOnNext).toHaveBeenCalledWith({ accepted: true });
        });

        it('does not handle Enter key when checkbox is unchecked', () => {
            const mockOnNext = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    initialCheckboxValue={false}
                    WorkflowCardActionsProps={{
                        onNext: mockOnNext,
                    }}
                />
            );

            const checkboxLabel = getByLabelText('I accept the terms');
            fireEvent.keyUp(checkboxLabel, { key: 'Enter' });

            expect(mockOnNext).not.toHaveBeenCalled();
        });

        it('does not handle other keys', () => {
            const mockOnNext = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel={'I accept the terms'}
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        onNext: mockOnNext,
                    }}
                />
            );

            const checkboxLabel = getByLabelText('I accept the terms');
            fireEvent.keyUp(checkboxLabel, { key: 'Space' });

            expect(mockOnNext).not.toHaveBeenCalled();
        });
    });

    describe('HTML content rendering', () => {
        it('renders HTML content when html prop is true', () => {
            const htmlContent = '<div data-testid="html-content"><b>Bold EULA</b></div>';
            render(<EulaScreenBase eulaContent={htmlContent} html={true} checkboxLabel="I accept" />);

            expect(screen.getByTestId('html-content')).toBeInTheDocument();
            expect(screen.getByText('Bold EULA')).toBeInTheDocument();
        });

        it('renders plain text when html prop is false', () => {
            const plainContent = 'Plain text EULA content';
            render(<EulaScreenBase eulaContent={plainContent} html={false} checkboxLabel="I accept" />);

            expect(screen.getByText('Plain text EULA content')).toBeInTheDocument();
        });

        it('renders plain text when html prop is not provided', () => {
            const plainContent = 'Plain text EULA content';
            render(<EulaScreenBase eulaContent={plainContent} checkboxLabel="I accept" />);

            expect(screen.getByText('Plain text EULA content')).toBeInTheDocument();
        });

        it('sanitizes HTML content when html prop is true', () => {
            const maliciousHtml = '<script>alert("xss")</script><div data-testid="safe-content">Safe content</div>';
            render(<EulaScreenBase eulaContent={maliciousHtml} html={true} checkboxLabel="I accept" />);

            // Script should be sanitized out, but safe content should remain
            expect(screen.getByTestId('safe-content')).toBeInTheDocument();
            expect(screen.getByText('Safe content')).toBeInTheDocument();
            expect(document.querySelector('script')).not.toBeInTheDocument();
        });
    });

    describe('Refresh functionality', () => {
        it('displays refresh button when showRefreshButton is true', () => {
            render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel="I accept"
                    refreshConfig={{
                        showRefreshButton: true,
                        onRefresh: jest.fn(),
                    }}
                />
            );

            // Check for the refresh icon instead of text
            expect(screen.getByTestId('ReplaySharpIcon')).toBeInTheDocument();
        });

        it('displays custom refresh button label', () => {
            render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel="I accept"
                    refreshConfig={{
                        showRefreshButton: true,
                        refreshButtonLabel: 'Reload Content',
                        onRefresh: jest.fn(),
                    }}
                />
            );

            expect(screen.getByText('Reload Content')).toBeInTheDocument();
        });

        it('calls onRefresh when refresh button is clicked', () => {
            const mockOnRefresh = jest.fn();
            render(
                <EulaScreenBase
                    eulaContent={SAMPLE_EULA}
                    checkboxLabel="I accept"
                    refreshConfig={{
                        showRefreshButton: true,
                        refreshButtonLabel: 'Refresh Button',
                        onRefresh: mockOnRefresh,
                    }}
                />
            );

            const refreshArea = screen.getByTestId('ReplaySharpIcon').closest('div');
            fireEvent.click(refreshArea!);

            expect(mockOnRefresh).toHaveBeenCalled();
        });

        it('does not display refresh button when showRefreshButton is false', () => {
            render(
                <EulaScreenBase
                    eulaContent="Simple EULA text"
                    checkboxLabel="I accept"
                    refreshConfig={{
                        showRefreshButton: false,
                        onRefresh: jest.fn(),
                    }}
                />
            );

            expect(screen.queryByTestId('ReplaySharpIcon')).not.toBeInTheDocument();
            expect(screen.getByText('Simple EULA text')).toBeInTheDocument();
        });

        it('displays EULA content when refresh config is not provided', () => {
            render(<EulaScreenBase eulaContent="Simple EULA text" checkboxLabel="I accept" />);

            expect(screen.getByText('Simple EULA text')).toBeInTheDocument();
            expect(screen.queryByTestId('ReplaySharpIcon')).not.toBeInTheDocument();
        });
    });

    describe('Error handling', () => {
        it('renders with error display configuration', () => {
            render(
                <EulaScreenBase
                    eulaContent="Simple EULA text"
                    checkboxLabel="I accept"
                    errorDisplayConfig={{
                        mode: 'dialog',
                        title: 'Error occurred',
                    }}
                />
            );

            // Component should render without errors even with error config
            expect(screen.getByText('Simple EULA text')).toBeInTheDocument();
        });
    });

    describe('Integration with RegistrationWorkflow', () => {
        it('renders correctly within RegistrationWorkflow context', () => {
            renderer();
            // This test ensures the component works within the registration context
        });
    });

    describe('Workflow card actions integration', () => {
        it('handles onNext callback when provided', () => {
            const mockOnNext = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        onNext: mockOnNext,
                        showNext: true,
                        nextLabel: 'Continue',
                        canGoNext: true,
                    }}
                />
            );

            // Simulate Enter key press to trigger onNext
            const checkboxLabel = getByLabelText('I accept the terms');
            fireEvent.keyUp(checkboxLabel, { key: 'Enter' });

            expect(mockOnNext).toHaveBeenCalledWith({ accepted: true });
        });

        it('does not call onNext when no onNext callback is provided', () => {
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Continue',
                        canGoNext: true,
                    }}
                />
            );

            // This should not throw an error
            const checkboxLabel = getByLabelText('I accept the terms');
            fireEvent.keyUp(checkboxLabel, { key: 'Enter' });

            // No error should be thrown
        });

        it('passes canGoNext as false when checkbox is not accepted', () => {
            render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={false}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Continue',
                        canGoNext: true,
                    }}
                />
            );

            const nextButton = screen.getByText('Continue');
            expect(nextButton).toBeDisabled();
        });

        it('passes canGoNext as true when checkbox is accepted and canGoNext is true', () => {
            render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Continue',
                        canGoNext: true,
                    }}
                />
            );

            const nextButton = screen.getByText('Continue');
            expect(nextButton).toBeEnabled();
        });

        it('passes canGoNext as false when checkbox is accepted but canGoNext is false', () => {
            render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={true}
                    WorkflowCardActionsProps={{
                        showNext: true,
                        nextLabel: 'Continue',
                        canGoNext: false,
                    }}
                />
            );

            const nextButton = screen.getByText('Continue');
            expect(nextButton).toBeDisabled();
        });
    });

    describe('Callback handling', () => {
        it('handles undefined onEulaAcceptedChange gracefully', () => {
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={false}
                />
            );

            // This should not throw an error
            const checkbox = getByLabelText('I accept the terms');
            fireEvent.click(checkbox);

            // Checkbox state should still change
            expect((checkbox as HTMLInputElement).checked).toBe(true);
        });

        it('calls onEulaAcceptedChange with correct values on multiple clicks', () => {
            const mockOnEulaAcceptedChange = jest.fn();
            const { getByLabelText } = render(
                <EulaScreenBase
                    eulaContent="Test EULA"
                    checkboxLabel="I accept the terms"
                    initialCheckboxValue={false}
                    onEulaAcceptedChange={mockOnEulaAcceptedChange}
                />
            );

            const checkbox = getByLabelText('I accept the terms');

            // First click - check
            fireEvent.click(checkbox);
            expect(mockOnEulaAcceptedChange).toHaveBeenNthCalledWith(1, true);

            // Second click - uncheck
            fireEvent.click(checkbox);
            expect(mockOnEulaAcceptedChange).toHaveBeenNthCalledWith(2, false);

            expect(mockOnEulaAcceptedChange).toHaveBeenCalledTimes(2);
        });
    });
});
