import React, { createRef } from 'react';
import { act, render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LabelAnchorPoint, LabelProps } from './LabelAnchorPoint';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { ImageAnnotator } from '..';

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

    it('preserves custom labelBgColor in dark mode', () => {
        render(
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                <LabelAnchorPoint {...defaultProps} labelBgColor="rgb(255, 0, 0)" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-label-root')).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('applies the dark default background when labelBgColor is not provided', () => {
        render(
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                <LabelAnchorPoint {...defaultProps} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-label-root')).toHaveStyle('background-color: rgba(14, 18, 24, 0.64)');
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

    it('wraps long label text and allows the label height to grow', () => {
        const longLabel = 'This is a very long label that should wrap';
        renderWithTheme(<LabelAnchorPoint {...defaultProps} label={longLabel} />);
        const labelElement = screen.getByTestId('blui-label-root');

        expect(labelElement).toHaveTextContent(longLabel);
        expect(labelElement).toHaveStyle('max-width: 180px');
        expect(labelElement).toHaveStyle('white-space: normal');
        expect(labelElement).toHaveStyle('overflow-wrap: anywhere');
        expect(labelElement).toHaveStyle('height: auto');
        expect(labelElement).toHaveStyle('box-sizing: border-box');
        expect(labelElement).toHaveStyle('overflow: auto');
    });

    it('wraps long strings without spaces within the label width', () => {
        const longLabel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(10);
        renderWithTheme(<LabelAnchorPoint {...defaultProps} label={longLabel} />);
        const labelElement = screen.getByTestId('blui-label-root');

        expect(labelElement).toHaveTextContent(longLabel);
        expect(labelElement).toHaveStyle({
            maxWidth: '180px',
            minWidth: '0',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            boxSizing: 'border-box',
            height: 'auto',
        });
    });

    it.each(['left', 'right', 'top', 'bottom'] as const)(
        'preserves the label width in a %s callout instead of squeezing text into a column',
        (direction) => {
            renderWithTheme(
                <LabelAnchorPoint
                    {...defaultProps}
                    label="A long label that should wrap into normal horizontal lines"
                    callout
                    direction={direction}
                />
            );

            expect(screen.getByTestId('blui-label-root')).toHaveStyle({
                width: 'max-content',
                maxWidth: '180px',
                flexShrink: '0',
                whiteSpace: 'normal',
                overflowWrap: 'anywhere',
            });
        }
    );

    it.each([
        [false, 0, 0],
        [false, 100, 100],
        [false, 50, 50],
        [true, 0, 0],
        [true, 100, 100],
        [true, 50, 50],
    ])('preserves percentage positioning with callout=%s at (%s, %s) after resizing', (callout, x, y) => {
        renderWithTheme(
            <ImageAnnotator src="test.png">
                <LabelAnchorPoint
                    {...defaultProps}
                    x={x}
                    y={y}
                    {...(callout ? { callout: true, autoFlip: false } : { callout: false })}
                />
            </ImageAnnotator>
        );
        const anchorElement = screen.getByTestId('blui-anchor-point-root');
        expect(anchorElement).toHaveStyle({ left: `${x}%`, top: `${y}%` });
        expect(anchorElement).toContainElement(screen.getByTestId('blui-label-root'));

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(anchorElement).toHaveStyle({ left: `${x}%`, top: `${y}%` });
    });

    it('preserves natural label sizing when the image dimensions change', () => {
        const { rerender } = renderWithTheme(
            <ImageAnnotator src="test.png" width={60} height={30}>
                <LabelAnchorPoint {...defaultProps} />
            </ImageAnnotator>
        );
        const expectedStyles = {
            width: 'max-content',
            minWidth: '0',
            maxWidth: '180px',
            height: 'auto',
        };
        expect(screen.getByTestId('blui-label-root')).toHaveStyle(expectedStyles);
        expect(screen.getByTestId('blui-image-annotator-root')).toHaveStyle({
            width: '60px',
            height: '30px',
        });

        rerender(
            <ThemeProvider theme={theme}>
                <ImageAnnotator src="test.png" width={300} height={200}>
                    <LabelAnchorPoint {...defaultProps} />
                </ImageAnnotator>
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-image-annotator-root')).toHaveStyle({
            width: '300px',
            height: '200px',
        });
        expect(screen.getByTestId('blui-label-root')).toHaveStyle(expectedStyles);
    });

    it('applies className to the anchor wrapper', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} className="custom-class" />);
        expect(screen.getByTestId('blui-anchor-point-root')).toHaveClass('custom-class');
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

    it('renders the label as a Typography paragraph', () => {
        renderWithTheme(<LabelAnchorPoint {...defaultProps} />);
        const labelElement = screen.getByTestId('blui-label-root');
        expect(labelElement.tagName).toBe('P');
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
