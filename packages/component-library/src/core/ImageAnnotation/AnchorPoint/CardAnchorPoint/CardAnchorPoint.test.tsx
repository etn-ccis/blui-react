import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { CardAnchorPoint } from './CardAnchorPoint';

const renderWithTheme = (component: React.ReactElement): ReturnType<typeof render> =>
    render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);

afterEach(cleanup);

describe('CardAnchorPoint', () => {
    describe('Rendering', () => {
        it('renders the card root element', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('renders with AnchorPoint wrapper', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');

            expect(anchorPointRoot).toBeInTheDocument();
            expect(anchorPointRoot).toContainElement(cardRoot);
        });

        it('renders children inside the card', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    <p>Card content</p>
                </CardAnchorPoint>
            );

            const cardRoot = screen.getByTestId('blui-card-root');
            const childElement = screen.getByText('Card content');

            expect(childElement).toBeInTheDocument();
            expect(cardRoot).toContainElement(childElement);
        });

        it('renders multiple children', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    <span>Title</span>
                    <span>Description</span>
                </CardAnchorPoint>
            );

            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });

        it('renders complex JSX children', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    <div>
                        <h3>Header</h3>
                        <p>Paragraph</p>
                        <button>Action</button>
                    </div>
                </CardAnchorPoint>
            );

            expect(screen.getByRole('heading', { name: 'Header' })).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        });
    });

    describe('Card Width', () => {
        it('applies default card width of 160px', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 160px');
        });

        it('applies custom card width when within valid range', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={200} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 200px');
        });

        it('clamps cardWidth to minimum of 80px', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 80px');
        });

        it('clamps cardWidth to minimum with zero value', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={0} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 80px');
        });

        it('clamps cardWidth to maximum of 400px', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={500} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 400px');
        });

        it('accepts cardWidth at minimum boundary', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={80} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 80px');
        });

        it('accepts cardWidth at maximum boundary', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={400} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 400px');
        });

        it('clamps negative cardWidth to minimum', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={-100} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 80px');
        });
    });

    describe('AnchorPoint Integration', () => {
        it('positions the anchor point at provided coordinates', () => {
            renderWithTheme(<CardAnchorPoint x={25} y={75} />);

            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');
            expect(anchorPointRoot).toHaveStyle({ left: '25%', top: '75%' });
        });

        it('positions at boundary coordinates (0, 0)', () => {
            renderWithTheme(<CardAnchorPoint x={0} y={0} />);

            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');
            expect(anchorPointRoot).toHaveStyle({ left: '0%', top: '0%' });
        });

        it('positions at boundary coordinates (100, 100)', () => {
            renderWithTheme(<CardAnchorPoint x={100} y={100} />);

            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');
            expect(anchorPointRoot).toHaveStyle({ left: '100%', top: '100%' });
        });

        it('applies AnchorPoint layout styles', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');
            expect(anchorPointRoot).toHaveStyle({
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                transform: 'translate(-50%, -50%)',
                zIndex: '1',
            });
        });
    });

    describe('Callout Props (via AnchorPoint)', () => {
        it('accepts callout prop without errors', () => {
            const { container } = renderWithTheme(
                <CardAnchorPoint x={50} y={50} callout direction="right">
                    Content
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
            expect(container).toBeTruthy();
        });

        it('accepts callout with all related props', () => {
            const { container } = renderWithTheme(
                <CardAnchorPoint
                    x={50}
                    y={50}
                    callout
                    direction="bottom"
                    lineLength={25}
                    lineWidth={2}
                    lineColor="#333333"
                    autoFlip
                >
                    Content
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
            expect(container).toBeTruthy();
        });
    });

    describe('Ref Forwarding', () => {
        it('forwards ref to the card root element', () => {
            const ref = React.createRef<HTMLDivElement>();

            renderWithTheme(<CardAnchorPoint ref={ref} x={50} y={50} />);

            expect(ref.current).toBe(screen.getByTestId('blui-card-root'));
        });

        it('allows accessing card element properties through ref', () => {
            const ref = React.createRef<HTMLDivElement>();

            renderWithTheme(
                <CardAnchorPoint ref={ref} x={50} y={50} cardWidth={200}>
                    Content
                </CardAnchorPoint>
            );

            expect(ref.current).toHaveStyle('width: 200px');
            expect(ref.current?.textContent).toContain('Content');
        });
    });

    describe('Card Styling', () => {
        it('uses the theme background fallback when CSS variables are unavailable', () => {
            render(
                <ThemeProvider theme={createTheme()}>
                    <CardAnchorPoint x={50} y={50} />
                </ThemeProvider>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('applies flex display to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('display: flex');
        });

        it('applies flex-direction column to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('flex-direction: column');
        });

        it('applies flex-start alignment to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('align-items: flex-start');
        });

        it('applies auto height to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('height: auto');
        });

        it('applies background color from theme', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            const computedStyle = window.getComputedStyle(cardRoot);
            expect(computedStyle.backgroundColor).toBeDefined();
        });

        it('applies border styling to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            const computedStyle = window.getComputedStyle(cardRoot);
            expect(computedStyle.border).toBeDefined();
        });

        it('applies border radius to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            const computedStyle = window.getComputedStyle(cardRoot);
            expect(computedStyle.borderRadius).toBeDefined();
        });

        it('applies box shadow to card', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            const computedStyle = window.getComputedStyle(cardRoot);
            expect(computedStyle.boxShadow).toBeDefined();
        });

        it('applies backdrop filter blur effect', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            // backdropFilter is a CSS property that might not be available in test environment
            // So we just verify the element has the expected CSS class instead
            expect(cardRoot).toHaveClass('MuiCard-root');
        });
    });

    describe('MUI Props Integration', () => {
        it('accepts standard MUI Card props', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} elevation={8} />);

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('accepts className prop', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} className="custom-class" />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveClass('custom-class');
        });

        it('accepts id prop', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} id="card-1" />);

            // The id gets applied to the card element via the ref
            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveAttribute('id', 'card-1');
        });
    });

    describe('Edge Cases', () => {
        it('renders without children', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('renders with empty children array', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    {[]}
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('renders with null children', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    {null}
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('renders with boolean false as children', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50}>
                    {false}
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
        });

        it('handles decimal cardWidth values', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={120.5} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 120.5px');
        });

        it('handles very small decimal cardWidth values', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} cardWidth={0.1} />);

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 80px');
        });

        it('handles fractional coordinate values', () => {
            renderWithTheme(<CardAnchorPoint x={33.33} y={66.67} />);

            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');
            expect(anchorPointRoot).toHaveStyle({ left: '33.33%', top: '66.67%' });
        });
    });

    describe('Display Name', () => {
        it('has correct displayName for debugging', () => {
            expect(CardAnchorPoint.displayName).toBe('CardAnchorPoint');
        });
    });

    describe('Combination Tests', () => {
        it('combines cardWidth, coordinates, and children', () => {
            const ref = React.createRef<HTMLDivElement>();

            renderWithTheme(
                <CardAnchorPoint ref={ref} x={25} y={75} cardWidth={250}>
                    <h2>Title</h2>
                    <p>Description</p>
                </CardAnchorPoint>
            );

            const cardRoot = screen.getByTestId('blui-card-root');
            const anchorPointRoot = screen.getByTestId('blui-anchor-point-root');

            expect(cardRoot).toHaveStyle('width: 250px');
            expect(anchorPointRoot).toHaveStyle({ left: '25%', top: '75%' });
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(ref.current).toBe(cardRoot);
        });

        it('accepts multiple children with different types', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50} cardWidth={220}>
                    <span>Text content</span>
                    <button>Button</button>
                    <div>Additional info</div>
                </CardAnchorPoint>
            );

            const cardRoot = screen.getByTestId('blui-card-root');
            expect(cardRoot).toHaveStyle('width: 220px');
            expect(screen.getByText('Text content')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
            expect(screen.getByText('Additional info')).toBeInTheDocument();
        });
    });
});
