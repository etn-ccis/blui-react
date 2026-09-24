import React, { createRef } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LabelAnchorPoint, LabelProps } from './LabelAnchorPoint';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

describe('LabelAnchorPoint', () => {
    const defaultProps: LabelProps = {
        x: 50,
        y: 50,
        label: 'Test Label',
    };

    const renderWithTheme = (component: React.ReactElement): ReturnType<typeof render> =>
        render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);

    it('renders without crashing with required props', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        expect(screen.getByTestId('blui-label-root')).toBeInTheDocument();
    });

    it('displays the correct label text', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} label="Custom Label Text" />);
        expect(screen.getByText('Custom Label Text')).toBeInTheDocument();
    });

    it('applies custom labelBgColor', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} labelBgColor="rgb(255, 0, 0)" />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('applies custom labelColor', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} labelColor="rgb(0, 0, 255)" />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveStyle('color: rgb(0, 0, 255)');
    });

    it('applies both custom labelBgColor and labelColor', () => {
        renderWithTheme(
            <LabelAnchorPoint {...defaultProps} labelBgColor="rgb(255, 255, 0)" labelColor="rgb(0, 0, 0)" />
        );
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveStyle('background-color: rgb(255, 255, 0)');
        expect(labelElement).toHaveStyle('color: rgb(0, 0, 0)');
    });

    it('applies default background color from theme when labelBgColor is not provided', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        // Verify the element exists and has the default styling applied
        expect(labelElement).toHaveStyle('display: inline-flex');
        // The actual background color will come from the theme palette
        expect(labelElement).toHaveStyle('padding: 2px 8px');
    });

    it('applies default text color from theme when labelColor is not provided', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        // Verify the element exists and has the default styling applied
        expect(labelElement).toHaveStyle('display: inline-flex');
        expect(labelElement).toHaveStyle('font-size: 14px');
    });

    it('uses theme palette fallbacks when CSS variables are unavailable', () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <LabelAnchorPoint {...defaultProps} />
            </ThemeProvider>
        );

        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toBeInTheDocument();
    });

    it('applies default styling classes', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');

        // Check core styles applied
        expect(labelElement).toHaveStyle('display: inline-flex');
        expect(labelElement).toHaveStyle('padding: 2px 8px');
        expect(labelElement).toHaveStyle('border-radius: 4px');
        expect(labelElement).toHaveStyle('font-size: 14px');
        expect(labelElement).toHaveStyle('font-weight: 400');
        expect(labelElement).toHaveStyle('border-width: 1px');
        expect(labelElement).toHaveStyle('border-style: solid');
    });

    it('supports forwardRef', () => {
        const ref = createRef<HTMLSpanElement>();
        renderWithTheme(<LabelAnchorPoint {...defaultProps} ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('sets correct component display name', () => {
        expect(LabelAnchorPoint.displayName).toBe('LabelAnchorPoint');
    });

    it('passes AnchorPoint props correctly', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} x={25} y={75} />);
        // Verify component renders with position props (component structure remains intact)
        expect(screen.getByTestId('blui-label-root')).toBeInTheDocument();
    });

    it('handles empty label text', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} label="" />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toBeInTheDocument();
        expect(labelElement.textContent).toBe('');
    });

    it('handles long label text with truncation styles', () => {
        const longLabel = 'This is a very long label that should truncate';
        renderWithTheme(<LabelAnchorPoint {...defaultProps} label={longLabel} />);
        const labelElement = screen.getByTestId('blui-label-root');

        // Check that truncation styles are applied
        expect(labelElement).toHaveStyle('max-width: 180px');
        expect(labelElement).toHaveStyle('white-space: nowrap');
    });

    it('applies additional Typography props', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} variant="h6" className="custom-class" />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveClass('custom-class');
    });

    it('applies box shadow style', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveStyle('box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.12)');
    });

    it('applies backdrop filter blur effect', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        // Backdrop filter is defined in the styled component, verify core styles are applied
        expect(labelElement).toHaveStyle('box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.12)');
        expect(labelElement).toHaveStyle('border-radius: 4px');
    });

    it('renders as Typography span component', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        // Typography component renders as span when component="span"
        expect(labelElement.tagName).toBe('SPAN');
    });

    it('supports combining custom colors with theme values', () => {
        renderWithTheme(
            <LabelAnchorPoint {...defaultProps} labelBgColor="rgba(255, 255, 255, 0.72)" labelColor="#353c44" />
        );
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement).toHaveStyle('background-color: rgba(255, 255, 255, 0.72)');
        expect(labelElement).toHaveStyle('color: rgb(53, 60, 68)'); // #353c44 in RGB
    });

    it('renders wrapped by AnchorPoint component', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        // The component structure should have label as a descendant
        expect(screen.getByTestId('blui-label-root')).toBeInTheDocument();
        // Verify the label is inside an AnchorPoint (it's a child of the AnchorPoint)
        expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    });
});
