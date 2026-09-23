import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import '@testing-library/jest-dom';
import { MarkerAnchorPoint } from './MarkerAnchorPoint';

afterEach(cleanup);

// Mock component to access theme values in tests
const ThemeConsumer = ({ children }: { children: (theme: any) => React.ReactNode }): React.ReactElement => {
    const theme = useTheme();
    return <>{children(theme)}</>;
};

describe('MarkerAnchorPoint', () => {
    it('renders the marker root element', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />);

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('renders the provided icon', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon data-testid="custom-icon" />} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('applies default icon size', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '40px',
            height: '40px',
        });
    });

    it('applies custom icon size', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} iconSize={32} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '32px',
            height: '32px',
        });
    });

    it('applies border radius and border styles', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            borderRadius: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
        const style = window.getComputedStyle(marker);
        expect(style.border).toBeTruthy();
    });

    it('applies neutral color variant (default)', () => {
        render(
            <ThemeConsumer>
                {() => <MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="neutral" />}
            </ThemeConsumer>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
        const style = window.getComputedStyle(marker);
        expect(style.color).toBeTruthy();
    });

    it('applies primary color variant', () => {
        render(
            <ThemeConsumer>
                {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} color="primary" />}
            </ThemeConsumer>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies success color variant', () => {
        render(
            <ThemeConsumer>
                {() => <MarkerAnchorPoint x={50} y={50} icon={<CheckCircleIcon />} color="success" />}
            </ThemeConsumer>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies error color variant', () => {
        render(
            <ThemeConsumer>
                {() => <MarkerAnchorPoint x={50} y={50} icon={<ErrorIcon />} color="error" />}
            </ThemeConsumer>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('applies warning color variant', () => {
        render(
            <ThemeConsumer>
                {() => <MarkerAnchorPoint x={50} y={50} icon={<WarningIcon />} color="warning" />}
            </ThemeConsumer>
        );

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
    });

    it('renders with different icon elements', () => {
        const { rerender } = render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon data-testid="star" />} />);

        expect(screen.getByTestId('star')).toBeInTheDocument();

        rerender(<MarkerAnchorPoint x={50} y={50} icon={<InfoIcon data-testid="info" />} />);

        expect(screen.getByTestId('info')).toBeInTheDocument();
        expect(screen.queryByTestId('star')).not.toBeInTheDocument();
    });

    it('forwards ref to the marker root element', () => {
        const ref = React.createRef<HTMLDivElement>();

        render(<MarkerAnchorPoint ref={ref} x={50} y={50} icon={<StarIcon />} />);

        expect(ref.current).toBe(screen.getByTestId('blui-marker-root'));
    });

    it('passes AnchorPoint props through', () => {
        render(<MarkerAnchorPoint x={25} y={75} icon={<StarIcon />} callout direction="right" lineColor="#ff0000" />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            left: '25%',
            top: '75%',
        });
    });

    it('applies sx styles to the marker', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} sx={{ opacity: 0.5 }} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle('opacity: 0.5');
    });

    it('renders marker with multiple color variants in sequence', () => {
        const { rerender } = render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="primary" />);

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="success" />);

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();

        rerender(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} color="error" />);

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('renders multiple markers at different positions', () => {
        const { container } = render(
            <>
                <MarkerAnchorPoint x={25} y={25} icon={<StarIcon />} color="primary" />
                <MarkerAnchorPoint x={75} y={75} icon={<CheckCircleIcon />} color="success" />
            </>
        );

        const markers = container.querySelectorAll('[data-testid="blui-marker-root"]');
        expect(markers).toHaveLength(2);
    });

    it('has flex display and proper alignment', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
    });

    it('applies box shadow', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} />);

        const marker = screen.getByTestId('blui-marker-root');
        const style = window.getComputedStyle(marker);
        expect(style.boxShadow).toBeTruthy();
    });

    it('renders with mixed AnchorPoint and Marker props', () => {
        render(
            <MarkerAnchorPoint
                x={50}
                y={50}
                icon={<StarIcon />}
                iconSize={28}
                color="warning"
                callout
                direction="left"
            />
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
        render(<MarkerAnchorPoint x={0} y={0} icon={<StarIcon />} iconSize={0} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '0px',
            height: '0px',
        });
    });

    it('handles edge case with large dimensions', () => {
        render(<MarkerAnchorPoint x={100} y={100} icon={<StarIcon />} iconSize={200} />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toHaveStyle({
            width: '200px',
            height: '200px',
        });
    });

    it('renders marker with callout in correct position', () => {
        render(<MarkerAnchorPoint x={50} y={50} icon={<StarIcon />} callout direction="right" />);

        const marker = screen.getByTestId('blui-marker-root');
        expect(marker).toBeInTheDocument();
        expect(screen.getByTestId('blui-anchor-point-root')).toBeInTheDocument();
    });

    it('displays name correctly', () => {
        expect(MarkerAnchorPoint.displayName).toBe('MarkerAnchorPoint');
    });
});
