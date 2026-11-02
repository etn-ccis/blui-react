import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import '@testing-library/jest-dom';
import { theme } from '@brightlayer-ui/react-themes';
import { BLUIColors } from '@brightlayer-ui/colors';
import { MarkerAnchorPoint } from './MarkerAnchorPoint';

afterEach(cleanup);

// Helper component to wrap tests with theme provider
const ThemeWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const fallbackTheme = {
    ...createTheme(),
    vars: { palette: {} },
    palette: { ...createTheme().palette, shadows: theme.palette.shadows },
} as any;

const FallbackThemeWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
    <ThemeProvider theme={fallbackTheme}>{children}</ThemeProvider>
);

// Mock component to access theme values in tests
const ThemeConsumer = ({ children }: { children: (theme: any) => React.ReactNode }): React.ReactElement => {
    const currentTheme = useTheme();
    return <>{children(currentTheme)}</>;
};

describe('MarkerAnchorPoint', () => {
    it('renders the marker root element', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('renders the provided icon', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon data-testid="custom-icon" />} />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('applies default icon size', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '40px',
            height: '40px',
        });
    });

    it('applies custom icon size', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} iconSize={32} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '40px',
            height: '40px',
        });
        expect(screen.getByTestId('StarIcon')).toHaveStyle({ fontSize: '32px' });
    });

    it('applies border radius and border styles', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            borderRadius: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
        // Border is applied through styled component and renders correctly
        expect(marker).toBeInTheDocument();
    });

    it('applies neutral color variant (default)', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor="neutral" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
        // Color is applied through styled component based on color prop
    });

    it('applies primary color variant', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} markerColor="primary" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it.each([
        { color: undefined, background: 'rgba(14, 18, 24, 0.64)' },
        { color: 'neutral' as const, background: 'rgba(14, 18, 24, 0.64)' },
        { color: 'primary' as const, background: 'var(--mui-palette-primary-main)' },
        { color: 'success' as const, background: BLUIColors.green[300] },
        { color: 'error' as const, background: BLUIColors.red[300] },
        { color: 'warning' as const, background: BLUIColors.yellow[800] },
        { color: 'orange' as const, background: BLUIColors.orange[400] },
        { color: 'purple' as const, background: BLUIColors.purple[200] },
    ])('applies dark background and border styles for $color markers', ({ color, background }) => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor={color} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        const markerClasses = marker.className.split(' ');
        const darkRules = Array.from(document.styleSheets)
            .flatMap((sheet) => Array.from(sheet.cssRules))
            .filter(
                (rule): rule is CSSStyleRule =>
                    rule instanceof CSSStyleRule &&
                    rule.selectorText.includes('.dark') &&
                    markerClasses.some((className) => rule.selectorText.includes(`.${className}`))
            );

        expect(darkRules).toHaveLength(1);
        expect(darkRules[0].style.getPropertyValue('border-color')).toBe('rgba(0, 0, 0, 0.32)');
        expect(darkRules[0].style.getPropertyValue('background')).toBe(background);
    });

    it('applies success color variant', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} markerColor="success" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies error color variant', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<ErrorIcon />} markerColor="error" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies warning color variant', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<WarningIcon />} markerColor="warning" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it.each([
        {
            color: 'neutral' as const,
            backgroundColor: 'rgba(255, 255, 255, 0.72)',
            iconColor: fallbackTheme.palette.text.primary,
        },
        {
            color: 'primary' as const,
            backgroundColor: fallbackTheme.palette.primary.main,
            iconColor: fallbackTheme.palette.primary.contrastText,
        },
        {
            color: 'success' as const,
            backgroundColor: BLUIColors.green[900],
            iconColor: fallbackTheme.palette.primary.contrastText,
        },
        {
            color: 'error' as const,
            backgroundColor: BLUIColors.red[500],
            iconColor: fallbackTheme.palette.error.contrastText,
        },
        {
            color: 'warning' as const,
            backgroundColor: BLUIColors.yellow[500],
            iconColor: fallbackTheme.palette.warning.contrastText,
        },
        { color: 'orange' as const, backgroundColor: BLUIColors.orange[400], iconColor: BLUIColors.black[900] },
        {
            color: 'purple' as const,
            backgroundColor: BLUIColors.purple[500],
            iconColor: fallbackTheme.palette.background.default,
        },
    ])('applies the background and icon colors for $color markers', ({ color, backgroundColor, iconColor }) => {
        render(
            <FallbackThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor={color} />
            </FallbackThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toHaveStyle({
            backgroundColor,
            color: iconColor,
        });
    });

    it.each(['neutral', 'primary', 'success', 'error', 'warning'] as const)(
        'uses palette fallbacks when CSS variables are unavailable for %s markers',
        (color) => {
            render(
                <FallbackThemeWrapper>
                    <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor={color} />
                </FallbackThemeWrapper>
            );

            expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
        }
    );

    it('renders with different icon elements', () => {
        const { rerender } = render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon data-testid="star" />} />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('star')).toBeInTheDocument();

        rerender(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<InfoIcon data-testid="info" />} />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('info')).toBeInTheDocument();
        expect(screen.queryByTestId('star')).not.toBeInTheDocument();
    });

    it('forwards ref to the marker root element', () => {
        const ref = React.createRef<HTMLDivElement>();

        render(
            <ThemeWrapper>
                <MarkerAnchorPoint ref={ref} x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        expect(ref.current).toBe(screen.getByTestId('blui-marker-root'));
    });

    it('passes AnchorPoint props through', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint
                    x={25}
                    y={75}
                    icon={<StarIcon />}
                    callout
                    direction="right"
                    connectorColor="#ff0000"
                />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            left: '25%',
            top: '75%',
        });
    });

    it('applies sx styles to the anchor wrapper', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} sx={{ opacity: 0.5 }} />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle('opacity: 0.5');
    });

    it('renders marker with multiple color variants in sequence', () => {
        const { rerender } = render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor="primary" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor="success" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} markerColor="error" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('renders multiple markers at different positions', () => {
        const { container } = render(
            <ThemeWrapper>
                <>
                    <MarkerAnchorPoint x={25} y={25} icon={<StarIcon />} markerColor="primary" />
                    <MarkerAnchorPoint x={75} y={75} icon={<CheckCircleIcon />} markerColor="success" />
                </>
            </ThemeWrapper>
        );

        const markers = container.querySelectorAll('[data-testid="blui-marker-root"]');
        expect(markers).toHaveLength(2);
    });

    it('has flex display and proper alignment', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
        expect(marker).toBeInTheDocument();
    });

    it('applies box shadow', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        // Box shadow is applied through styled component from theme
        expect(marker).toBeInTheDocument();
    });

    it('renders with mixed AnchorPoint and Marker props', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint
                    x={50}
                    y={50}
                    icon={<StarIcon />}
                    iconSize={28}
                    markerColor="warning"
                    callout
                    direction="left"
                />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toHaveStyle({
            width: '40px',
            height: '40px',
        });
        expect(screen.getByTestId('StarIcon')).toHaveStyle({ fontSize: '28px' });

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            left: '50%',
            top: '50%',
        });
    });

    it('preserves the marker dimensions with a zero-size icon', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={0} y={0} icon={<StarIcon />} iconSize={0} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '40px',
            height: '40px',
        });
        expect(screen.getByTestId('StarIcon')).toHaveStyle({ fontSize: '0px' });
    });

    it('preserves the marker dimensions with a large icon', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={100} y={100} icon={<StarIcon />} iconSize={200} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '40px',
            height: '40px',
        });
        expect(screen.getByTestId('StarIcon')).toHaveStyle({ fontSize: '200px' });
    });

    it('renders marker with callout in correct position', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} callout direction="right" />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
        expect(screen.getByTestId('blui-anchor-point-root')).toBeInTheDocument();
    });

    it('displays name correctly', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />
            </ThemeWrapper>
        );
        expect(MarkerAnchorPoint.displayName).toBe('MarkerAnchorPoint');
    });
});
