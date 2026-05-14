import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { HorizontalBar } from './HorizontalBar';

afterEach(cleanup);

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (ui: React.ReactElement, customTheme = theme): ReturnType<typeof render> =>
    render(<ThemeProvider theme={customTheme}>{ui}</ThemeProvider>);

describe('HorizontalBar', () => {
    // ─── Rendering ───────────────────────────────────────────────────────────

    it('renders without crashing', () => {
        renderWithTheme(<HorizontalBar />);
    });

    it('renders with data-testid blui-horizontal-bar-root', () => {
        renderWithTheme(<HorizontalBar />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with a name prop', () => {
        renderWithTheme(<HorizontalBar name="failed" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with a barPercentage prop', () => {
        renderWithTheme(<HorizontalBar barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with barPercentage of 0', () => {
        renderWithTheme(<HorizontalBar barPercentage={0} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with a custom className', () => {
        renderWithTheme(<HorizontalBar className="custom-class" />);
        const bar = screen.getByTestId('blui-horizontal-bar-root');
        expect(bar.classList).toContain('custom-class');
    });

    it('applies additional BoxProps (e.g. aria-label)', () => {
        renderWithTheme(<HorizontalBar aria-label="status bar" />);
        expect(screen.getByLabelText('status bar')).toBeInTheDocument();
    });

    // ─── Variant colors (light theme) ────────────────────────────────────────

    it('renders with variant="failed" without crashing', () => {
        renderWithTheme(<HorizontalBar variant="failed" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="success" without crashing', () => {
        renderWithTheme(<HorizontalBar variant="success" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="pending" without crashing', () => {
        renderWithTheme(<HorizontalBar variant="pending" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="warning" without crashing', () => {
        renderWithTheme(<HorizontalBar variant="warning" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="info" without crashing', () => {
        renderWithTheme(<HorizontalBar variant="info" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="canceled" in light mode without crashing', () => {
        renderWithTheme(<HorizontalBar variant="canceled" barPercentage={40} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with variant="canceled" in dark mode without crashing', () => {
        renderWithTheme(<HorizontalBar variant="canceled" barPercentage={40} />, darkTheme);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with a custom color prop without crashing', () => {
        renderWithTheme(<HorizontalBar color="#FF0000" barPercentage={30} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('custom color overrides variant color (both provided)', () => {
        // Both supplied — component resolves finalColor = color || variantColor, so custom wins
        renderWithTheme(<HorizontalBar color="#AABBCC" variant="failed" barPercentage={30} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('falls back to #727E84 when neither color nor variant is provided', () => {
        renderWithTheme(<HorizontalBar barPercentage={25} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── Selection state ──────────────────────────────────────────────────────

    it('renders with selectedStatus matching name (active state)', () => {
        renderWithTheme(<HorizontalBar name="failed" selectedStatus="failed" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with selectedStatus not matching name (inactive state)', () => {
        renderWithTheme(<HorizontalBar name="failed" selectedStatus="success" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with selectedStatus as empty string (no selection)', () => {
        renderWithTheme(<HorizontalBar name="failed" selectedStatus="" barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── Click interactions ───────────────────────────────────────────────────

    it('calls onClick when the bar is clicked', () => {
        const handleClick = jest.fn();
        renderWithTheme(<HorizontalBar name="failed" barPercentage={50} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when clicked without an onClick prop', () => {
        renderWithTheme(<HorizontalBar name="failed" barPercentage={50} />);
        expect(() => fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'))).not.toThrow();
    });

    it('selects bar on first click (internal state toggle: unset → name)', () => {
        const handleClick = jest.fn();
        renderWithTheme(
            <HorizontalBar name="warning" barPercentage={40} onClick={handleClick} selectedStatus={undefined} />
        );
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('deselects bar on second click (internal state toggle: name → "")', () => {
        const handleClick = jest.fn();
        const bar = renderWithTheme(<HorizontalBar name="info" barPercentage={40} onClick={handleClick} />);
        const el = bar.getByTestId('blui-horizontal-bar-root');
        fireEvent.click(el); // select
        fireEvent.click(el); // deselect
        expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('passes event object to onClick handler', () => {
        const handleClick = jest.fn();
        renderWithTheme(<HorizontalBar name="success" barPercentage={60} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    });

    // ─── selectedStatus prop synchronisation (useEffect) ─────────────────────

    it('updates internal selectedState when selectedStatus prop changes', () => {
        const { rerender } = renderWithTheme(
            <HorizontalBar name="pending" selectedStatus="other" barPercentage={30} />
        );
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();

        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <HorizontalBar name="pending" selectedStatus="pending" barPercentage={30} />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('clears internal selectedState when selectedStatus changes to empty string', () => {
        const { rerender } = renderWithTheme(
            <HorizontalBar name="pending" selectedStatus="pending" barPercentage={30} />
        );
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <HorizontalBar name="pending" selectedStatus="" barPercentage={30} />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('clears internal selectedState when selectedStatus changes to undefined', () => {
        const { rerender } = renderWithTheme(
            <HorizontalBar name="pending" selectedStatus="pending" barPercentage={30} />
        );
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <HorizontalBar name="pending" selectedStatus={undefined} barPercentage={30} />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── forwardRef ───────────────────────────────────────────────────────────

    it('forwards ref to the root element', () => {
        const ref = React.createRef<HTMLDivElement>();
        renderWithTheme(<HorizontalBar ref={ref} name="failed" barPercentage={50} />);
        expect(ref.current).not.toBeNull();
    });

    // ─── Edge cases ───────────────────────────────────────────────────────────

    it('renders without name prop', () => {
        renderWithTheme(<HorizontalBar barPercentage={50} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders without barPercentage prop (undefined)', () => {
        renderWithTheme(<HorizontalBar name="failed" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with barPercentage=100', () => {
        renderWithTheme(<HorizontalBar name="failed" barPercentage={100} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('handles all variant types in a single render pass', () => {
        const variants = ['failed', 'success', 'pending', 'warning', 'info', 'canceled'] as const;
        const { unmount } = renderWithTheme(
            <>
                {variants.map((v) => (
                    <HorizontalBar key={v} variant={v} name={v} barPercentage={16} />
                ))}
            </>
        );
        const bars = screen.getAllByTestId('blui-horizontal-bar-root');
        expect(bars).toHaveLength(variants.length);
        unmount();
    });

    it('renders selected bar alongside unselected bars', () => {
        renderWithTheme(
            <>
                <HorizontalBar name="failed" selectedStatus="failed" barPercentage={30} />
                <HorizontalBar name="success" selectedStatus="failed" barPercentage={70} />
            </>
        );
        const bars = screen.getAllByTestId('blui-horizontal-bar-root');
        expect(bars).toHaveLength(2);
    });

    it('passes classes prop without crashing', () => {
        renderWithTheme(<HorizontalBar classes={{ root: 'custom-root' }} barPercentage={50} />);
        const bar = screen.getByTestId('blui-horizontal-bar-root');
        expect(bar.classList).toContain('custom-root');
    });
});
