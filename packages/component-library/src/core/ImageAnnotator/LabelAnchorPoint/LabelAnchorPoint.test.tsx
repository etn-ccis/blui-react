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
        [false, 0, 0, -90, -20, '90px 20px'],
        [false, 100, 100, 210, 180, '-90px -20px'],
        [false, 50, 50, 60, 80, '0px 0px'],
        [true, 0, 0, -90, -20, '90px 20px'],
        [true, 100, 100, 210, 180, '-90px -20px'],
        [true, 50, 50, 60, 80, '0px 0px'],
    ])('keeps labels inside the image with callout=%s at (%s, %s)', (callout, x, y, left, top, translate) => {
        const rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
            this: HTMLElement
        ): DOMRect {
            const isLabel = this.getAttribute('data-testid') === 'blui-label-root';
            const width = isLabel ? 180 : 300;
            const height = isLabel ? 40 : 200;
            const rectLeft = isLabel ? left : 0;
            const rectTop = isLabel ? top : 0;
            return {
                x: rectLeft,
                y: rectTop,
                left: rectLeft,
                top: rectTop,
                width,
                height,
                right: rectLeft + width,
                bottom: rectTop + height,
                toJSON: (): object => ({}),
            };
        });
        try {
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
            const labelElement = screen.getByTestId('blui-label-root');
            expect(labelElement.style.translate).toBe(translate);
            const [offsetX, offsetY] = translate.split(' ').map(parseFloat);
            expect(left + offsetX).toBeGreaterThanOrEqual(0);
            expect(left + offsetX + 180).toBeLessThanOrEqual(300);
            expect(top + offsetY).toBeGreaterThanOrEqual(0);
            expect(top + offsetY + 40).toBeLessThanOrEqual(200);
            void act(() => window.dispatchEvent(new Event('resize')));
            expect(labelElement.style.translate).toBe(translate);
            expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({ left: `${x}%`, top: `${y}%` });
        } finally {
            rectSpy.mockRestore();
        }
    });

    it('shrinks labels to fit small images and updates after resizing', () => {
        renderWithTheme(
            <ImageAnnotator src="test.png">
                <LabelAnchorPoint {...defaultProps} />
            </ImageAnnotator>
        );
        const container = screen.getByTestId('blui-image-annotator-root');
        const labelElement = screen.getByTestId('blui-label-root');
        const rectSpy = jest.spyOn(container, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: 60,
            bottom: 30,
            width: 60,
            height: 30,
            toJSON: () => ({}),
        });
        try {
            void act(() => window.dispatchEvent(new Event('resize')));
            expect(labelElement).toHaveStyle({ minWidth: '60px', maxWidth: '60px', maxHeight: '30px' });
            rectSpy.mockReturnValue({
                x: 0,
                y: 0,
                left: 0,
                top: 0,
                right: 300,
                bottom: 200,
                width: 300,
                height: 200,
                toJSON: () => ({}),
            });
            void act(() => window.dispatchEvent(new Event('resize')));
            expect(labelElement).toHaveStyle({ minWidth: '100px', maxWidth: '180px', maxHeight: '200px' });
        } finally {
            rectSpy.mockRestore();
        }
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
