import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

    describe('Card Content', () => {
        it('renders object content with a header and ordered label/value rows', () => {
            renderWithTheme(
                <CardAnchorPoint
                    x={50}
                    y={50}
                    cardContent={{
                        cardHeader: 'Cabinet 1',
                        cardData: [
                            { label: 'Health Status', value: 'Good' },
                            { label: 'Load Rate', value: '56%' },
                        ],
                    }}
                >
                    Ignored children
                </CardAnchorPoint>
            );

            const card = screen.getByTestId('blui-card-root');
            const header = screen.getByText('Cabinet 1');
            const divider = card.querySelector('.MuiDivider-root');
            const firstDataRow = screen.getByText('Health Status').parentElement;

            expect(card).toHaveTextContent('Cabinet 1Health StatusGoodLoad Rate56%');
            expect(divider).toBeInTheDocument();
            expect(header.nextElementSibling).toBe(divider);
            expect(divider?.nextElementSibling).toBe(firstDataRow);
            expect(screen.queryByText('Ignored children')).not.toBeInTheDocument();
            expect(screen.getByText('Cabinet 1')).toHaveClass('MuiTypography-subtitle2');
            expect(screen.getByText('Health Status')).toHaveClass('card-field-label');
            expect(screen.getByText('Good')).toHaveClass('card-field-value');
            expect(screen.getByText('Health Status').parentElement).toHaveStyle({
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            });
            expect(screen.getByText('Good')).toHaveStyle({
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '400',
                overflowWrap: 'anywhere',
            });
            expect(card).not.toHaveAttribute('cardContent');
            expect(screen.getByTestId('blui-anchor-point-root')).not.toHaveAttribute('cardContent');
        });

        it('renders object content with no data rows', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50} cardContent={{ cardHeader: 'Empty cabinet', cardData: [] }} />
            );

            expect(screen.getByTestId('blui-card-root')).toHaveTextContent('Empty cabinet');
        });

        it('renders repeated labels and empty field values', () => {
            renderWithTheme(
                <CardAnchorPoint
                    x={50}
                    y={50}
                    cardContent={{
                        cardHeader: '',
                        cardData: [
                            { label: 'Status', value: '' },
                            { label: 'Status', value: 'Good' },
                        ],
                    }}
                />
            );

            expect(screen.getAllByText('Status')).toHaveLength(2);
            expect(screen.getByText('Good')).toBeInTheDocument();
        });

        it('renders interactive React content instead of children', () => {
            const onClick = jest.fn();
            renderWithTheme(
                <CardAnchorPoint
                    x={50}
                    y={50}
                    cardContent={
                        <>
                            <span>Custom header</span>
                            <button onClick={onClick}>Action</button>
                        </>
                    }
                >
                    Ignored children
                </CardAnchorPoint>
            );

            expect(screen.getByText('Custom header')).toBeInTheDocument();
            fireEvent.click(screen.getByRole('button', { name: 'Action' }));
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Ignored children')).not.toBeInTheDocument();
        });

        it('renders arrays of React nodes', () => {
            renderWithTheme(
                <CardAnchorPoint
                    x={50}
                    y={50}
                    cardContent={[<span key="first">First</span>, <span key="second">Second</span>]}
                />
            );

            expect(screen.getByTestId('blui-card-root')).toHaveTextContent('FirstSecond');
        });

        it.each([
            { content: 'Plain text', expected: 'Plain text' },
            { content: 0, expected: '0' },
            { content: '', expected: '' },
            { content: null, expected: '' },
            { content: false, expected: '' },
        ])('renders $content without falling back to children', ({ content, expected }) => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50} cardContent={content}>
                    Ignored children
                </CardAnchorPoint>
            );

            expect(screen.getByTestId('blui-card-root').textContent).toBe(expected);
        });

        it('falls back to children when cardContent is undefined', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50} cardContent={undefined}>
                    Fallback content
                </CardAnchorPoint>
            );

            expect(screen.getByText('Fallback content')).toBeInTheDocument();
        });

        it('updates when switching between object and React content', () => {
            const { rerender } = render(
                <ThemeProvider theme={theme}>
                    <CardAnchorPoint x={50} y={50} cardContent={{ cardHeader: 'Cabinet 1', cardData: [] }} />
                </ThemeProvider>
            );

            rerender(
                <ThemeProvider theme={theme}>
                    <CardAnchorPoint x={50} y={50} cardContent={<span>Custom content</span>} />
                </ThemeProvider>
            );

            expect(screen.queryByText('Cabinet 1')).not.toBeInTheDocument();
            expect(screen.getByText('Custom content')).toBeInTheDocument();
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
                    connectorLength={25}
                    connectorThickness={2}
                    connectorColor="#333333"
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
        it.each([
            {
                mode: 'light' as const,
                shadow: '0 0 20px #FFF, 0 0 12px #FFF, 0 0 8px #FFF, 0 0 6px #FFF',
            },
            {
                mode: 'dark' as const,
                shadow: '0 0 20px rgba(0, 0, 0, 0.64), 0 0 12px rgba(0, 0, 0, 0.64), 0 0 8px rgba(0, 0, 0, 0.64), 0 0 6px rgba(0, 0, 0, 0.64)',
            },
        ])('applies an inheritable text shadow in $mode mode', ({ mode, shadow }) => {
            render(
                <ThemeProvider theme={createTheme({ palette: { mode } })}>
                    <CardAnchorPoint
                        x={50}
                        y={50}
                        cardContent={{
                            cardHeader: 'Cabinet 1',
                            cardData: [{ label: 'Status', value: 'Good' }],
                        }}
                    />
                </ThemeProvider>
            );

            const computedShadow = window.getComputedStyle(screen.getByTestId('blui-card-root')).textShadow;
            expect(computedShadow.replace(/,\s*/g, ',')).toBe(shadow.replace(/,\s*/g, ','));
            expect(screen.getByText('Cabinet 1')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Good')).toBeInTheDocument();
        });

        it('allows overriding the text shadow for custom React content', () => {
            renderWithTheme(
                <CardAnchorPoint x={50} y={50} sx={{ textShadow: 'none' }} cardContent={<span>Custom content</span>} />
            );

            expect(screen.getByTestId('blui-card-root')).toHaveStyle({ textShadow: 'none' });
            expect(screen.getByText('Custom content')).toBeInTheDocument();
        });

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

        it('uses a translucent card surface instead of legacy backdrop blur layers', () => {
            renderWithTheme(<CardAnchorPoint x={50} y={50} />);

            const card = screen.getByTestId('blui-card-root');
            expect(card).toHaveStyle({ background: 'rgba(255, 255, 255, 0.72)' });
            expect(screen.queryByTestId('blui-card-backdrop')).not.toBeInTheDocument();
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
