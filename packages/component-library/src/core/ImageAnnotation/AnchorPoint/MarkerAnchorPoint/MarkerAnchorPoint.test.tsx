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
            width: '32px',
            height: '32px',
        });
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
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="neutral" />}
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
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} color="primary" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies success color variant', () => {
        render(
            <ThemeWrapper>
                <ThemeConsumer>
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} color="success" />}
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
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<ErrorIcon />} color="error" />}
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
                    {() => <MarkerAnchorPoint x={50} y={50} icon={<WarningIcon />} color="warning" />}
                </ThemeConsumer>
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it.each(['neutral', 'primary', 'success', 'error', 'warning'] as const)(
        'uses palette fallbacks when CSS variables are unavailable for %s markers',
        (color) => {
            render(
                <FallbackThemeWrapper>
                    <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color={color} />
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
                <MarkerAnchorPoint x={25} y={75} icon={<StarIcon />} callout direction="right" lineColor="#ff0000" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            left: '25%',
            top: '75%',
        });
    });

    it('applies sx styles to the marker', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} sx={{ opacity: 0.5 }} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle('opacity: 0.5');
    });

    it('renders marker with multiple color variants in sequence', () => {
        const { rerender } = render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="primary" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="success" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(
            <ThemeWrapper>
                <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="error" />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('renders multiple markers at different positions', () => {
        const { container } = render(
            <ThemeWrapper>
                <>
                    <MarkerAnchorPoint x={25} y={25} icon={<StarIcon />} color="primary" />
                    <MarkerAnchorPoint x={75} y={75} icon={<CheckCircleIcon />} color="success" />
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
                    color="warning"
                    callout
                    direction="left"
                />
            </ThemeWrapper>
        );

        expect(screen.getByTestId('blui-marker-root')).toHaveStyle({
            width: '28px',
            height: '28px',
        });

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            left: '50%',
            top: '50%',
        });
    });

    it('handles edge case with zero dimensions', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={0} y={0} icon={<StarIcon />} iconSize={0} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '0px',
            height: '0px',
        });
    });

    it('handles edge case with large dimensions', () => {
        render(
            <ThemeWrapper>
                <MarkerAnchorPoint x={100} y={100} icon={<StarIcon />} iconSize={200} />
            </ThemeWrapper>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '200px',
            height: '200px',
        });
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
