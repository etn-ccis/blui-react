import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { Legend } from './Legend';

afterEach(cleanup);

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const renderWithTheme = (ui: React.ReactElement, customTheme = theme): ReturnType<typeof render> =>
    render(<ThemeProvider theme={customTheme}>{ui}</ThemeProvider>);

describe('Legend', () => {
    // ─── Rendering ────────────────────────────────────────────────────────────

    it('renders without crashing', () => {
        renderWithTheme(<Legend label="Failed" count={10} />);
    });

    it('renders root with data-testid blui-horizontal-bar-root', () => {
        renderWithTheme(<Legend label="Failed" count={10} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders the label text', () => {
        renderWithTheme(<Legend label="Warning" count={5} />);
        expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('renders the count value', () => {
        renderWithTheme(<Legend label="Info" count={42} />);
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders count of 0', () => {
        renderWithTheme(<Legend label="Empty" count={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('applies custom className to root', () => {
        renderWithTheme(<Legend label="X" count={1} className="my-legend" />);
        expect(screen.getByTestId('blui-horizontal-bar-root').classList).toContain('my-legend');
    });

    it('applies classes prop to root slot', () => {
        renderWithTheme(<Legend label="X" count={1} classes={{ root: 'custom-root' }} />);
        expect(screen.getByTestId('blui-horizontal-bar-root').classList).toContain('custom-root');
    });

    it('passes additional BoxProps (e.g. aria-label) to root', () => {
        renderWithTheme(<Legend label="X" count={1} aria-label="legend item" />);
        expect(screen.getByLabelText('legend item')).toBeInTheDocument();
    });

    // ─── Variant filled icons (count > 0) ────────────────────────────────────

    it('renders filled Error icon for variant="failed" with count > 0', () => {
        renderWithTheme(<Legend label="Failed" count={10} variant="failed" />);
        expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
    });

    it('renders filled Cancel icon for variant="canceled" with count > 0', () => {
        renderWithTheme(<Legend label="Canceled" count={5} variant="canceled" />);
        expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
    });

    it('renders filled CheckCircle icon for variant="success" with count > 0', () => {
        renderWithTheme(<Legend label="Success" count={5} variant="success" />);
        expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    });

    it('renders filled PlayCircle icon for variant="info" with count > 0', () => {
        renderWithTheme(<Legend label="Info" count={5} variant="info" />);
        expect(screen.getByTestId('PlayCircleIcon')).toBeInTheDocument();
    });

    it('renders filled Pending icon for variant="pending" with count > 0', () => {
        renderWithTheme(<Legend label="Pending" count={5} variant="pending" />);
        expect(screen.getByTestId('PendingIcon')).toBeInTheDocument();
    });

    it('renders filled Warning icon for variant="warning" with count > 0', () => {
        renderWithTheme(<Legend label="Warning" count={5} variant="warning" />);
        expect(screen.getByTestId('WarningIcon')).toBeInTheDocument();
    });

    // ─── Variant outline icons (count === 0) ──────────────────────────────────

    it('renders outline ErrorOutline icon for variant="failed" with count === 0', () => {
        renderWithTheme(<Legend label="Failed" count={0} variant="failed" />);
        expect(screen.getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
    });

    it('renders outline CancelOutlined icon for variant="canceled" with count === 0', () => {
        renderWithTheme(<Legend label="Canceled" count={0} variant="canceled" />);
        expect(screen.getByTestId('CancelOutlinedIcon')).toBeInTheDocument();
    });

    it('renders outline CheckCircleOutline icon for variant="success" with count === 0', () => {
        renderWithTheme(<Legend label="Success" count={0} variant="success" />);
        expect(screen.getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();
    });

    it('renders outline PlayCircleOutline icon for variant="info" with count === 0', () => {
        renderWithTheme(<Legend label="Info" count={0} variant="info" />);
        expect(screen.getByTestId('PlayCircleOutlineIcon')).toBeInTheDocument();
    });

    it('renders outline PendingOutlined icon for variant="pending" with count === 0', () => {
        renderWithTheme(<Legend label="Pending" count={0} variant="pending" />);
        expect(screen.getByTestId('PendingOutlinedIcon')).toBeInTheDocument();
    });

    it('renders outline WarningOutlined icon for variant="warning" with count === 0', () => {
        renderWithTheme(<Legend label="Warning" count={0} variant="warning" />);
        expect(screen.getByTestId('WarningOutlinedIcon')).toBeInTheDocument();
    });

    // ─── variant="canceled" dark/light theme color branch ────────────────────

    it('renders canceled variant in light theme without crashing', () => {
        renderWithTheme(<Legend label="Canceled" count={5} variant="canceled" />);
        expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
    });

    it('renders canceled variant in dark theme without crashing', () => {
        renderWithTheme(<Legend label="Canceled" count={5} variant="canceled" />, darkTheme);
        expect(screen.getByTestId('CancelIcon')).toBeInTheDocument();
    });

    it('renders canceled outline in dark theme when count === 0', () => {
        renderWithTheme(<Legend label="Canceled" count={0} variant="canceled" />, darkTheme);
        expect(screen.getByTestId('CancelOutlinedIcon')).toBeInTheDocument();
    });

    // ─── displayIcon logic: count > 0 branches ────────────────────────────────

    it('uses custom icon when count > 0 (icon ?? variantIcon → icon wins)', () => {
        renderWithTheme(<Legend label="X" count={5} icon={<span data-testid="custom-icon">★</span>} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('custom icon overrides variant icon when count > 0', () => {
        renderWithTheme(
            <Legend label="X" count={5} variant="failed" icon={<span data-testid="custom-icon">★</span>} />
        );
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('ErrorIcon')).not.toBeInTheDocument();
    });

    it('falls back to variant icon when count > 0 and no custom icon provided', () => {
        renderWithTheme(<Legend label="X" count={5} variant="failed" />);
        expect(screen.getByTestId('ErrorIcon')).toBeInTheDocument();
    });

    it('renders no icon when count > 0 and neither icon nor variant are provided', () => {
        renderWithTheme(<Legend label="X" count={5} />);
        // Only count and label text should be in DOM; no SVG icons
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('X')).toBeInTheDocument();
    });

    // ─── displayIcon logic: count === 0 branches ─────────────────────────────

    it('uses disabledIcon when count === 0 and disabledIcon is provided', () => {
        renderWithTheme(<Legend label="X" count={0} disabledIcon={<span data-testid="disabled-icon">◯</span>} />);
        expect(screen.getByTestId('disabled-icon')).toBeInTheDocument();
    });

    it('disabledIcon takes precedence over icon when count === 0', () => {
        renderWithTheme(
            <Legend
                label="X"
                count={0}
                icon={<span data-testid="active-icon">●</span>}
                disabledIcon={<span data-testid="disabled-icon">◯</span>}
            />
        );
        expect(screen.getByTestId('disabled-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('active-icon')).not.toBeInTheDocument();
    });

    it('falls back to icon when count === 0 and disabledIcon is not provided', () => {
        renderWithTheme(<Legend label="X" count={0} icon={<span data-testid="active-icon">●</span>} />);
        expect(screen.getByTestId('active-icon')).toBeInTheDocument();
    });

    it('falls back to variant outline icon when count === 0 and neither disabledIcon nor icon given', () => {
        renderWithTheme(<Legend label="X" count={0} variant="failed" />);
        expect(screen.getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
    });

    it('renders no icon when count === 0 and no icon props or variant provided', () => {
        renderWithTheme(<Legend label="X" count={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('X')).toBeInTheDocument();
    });

    // ─── finalBackgroundColor branches ───────────────────────────────────────

    it('uses custom backgroundColor (takes precedence over variant color)', () => {
        renderWithTheme(<Legend label="X" count={5} variant="failed" backgroundColor="#00FF00" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('uses variant color when no custom backgroundColor is provided', () => {
        renderWithTheme(<Legend label="X" count={5} variant="warning" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('finalBackgroundColor is undefined when no backgroundColor and no variant', () => {
        renderWithTheme(<Legend label="X" count={5} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── iconColor prop ───────────────────────────────────────────────────────

    it('renders with iconColor prop without crashing', () => {
        renderWithTheme(<Legend label="X" count={5} iconColor="#AABBCC" icon={<span data-testid="icon">★</span>} />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    // ─── selectedStatus prop ──────────────────────────────────────────────────

    it('renders correctly with selectedStatus matching label (active state)', () => {
        renderWithTheme(<Legend label="Failed" count={10} selectedStatus="Failed" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders correctly with selectedStatus not matching label (inactive state)', () => {
        renderWithTheme(<Legend label="Failed" count={10} selectedStatus="Success" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders correctly with selectedStatus as empty string', () => {
        renderWithTheme(<Legend label="Failed" count={10} selectedStatus="" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders correctly with selectedStatus=undefined', () => {
        renderWithTheme(<Legend label="Failed" count={10} selectedStatus={undefined} />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders selected state with variant and backgroundColor', () => {
        renderWithTheme(<Legend label="Failed" count={10} variant="failed" selectedStatus="Failed" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── Click interactions ───────────────────────────────────────────────────

    it('calls onClick when clicked with count > 0', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Failed" count={10} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when clicked with count === 0 (early return)', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Empty" count={0} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not throw when clicked without an onClick prop (count > 0)', () => {
        renderWithTheme(<Legend label="Failed" count={10} />);
        expect(() => fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'))).not.toThrow();
    });

    it('does not throw when clicked without an onClick prop (count === 0)', () => {
        renderWithTheme(<Legend label="Empty" count={0} />);
        expect(() => fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'))).not.toThrow();
    });

    it('selects item on first click (selectedState: undefined → label)', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Failed" count={10} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('deselects item on second click (selectedState: label → "")', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Failed" count={10} onClick={handleClick} />);
        const el = screen.getByTestId('blui-horizontal-bar-root');
        fireEvent.click(el); // select
        fireEvent.click(el); // deselect
        expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('passes the event object to the onClick handler', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Failed" count={5} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('blui-horizontal-bar-root'));
        expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    });

    it('does not change selection state when count === 0 is clicked multiple times', () => {
        const handleClick = jest.fn();
        renderWithTheme(<Legend label="Empty" count={0} onClick={handleClick} />);
        const el = screen.getByTestId('blui-horizontal-bar-root');
        fireEvent.click(el);
        fireEvent.click(el);
        expect(handleClick).not.toHaveBeenCalled();
    });

    // ─── useEffect: selectedStatus prop synchronisation ───────────────────────

    it('updates internal selectedState when selectedStatus changes to matching label', () => {
        const { rerender } = renderWithTheme(<Legend label="Failed" count={10} selectedStatus="other" />);
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <Legend label="Failed" count={10} selectedStatus="Failed" />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('clears internal selectedState when selectedStatus changes to empty string', () => {
        const { rerender } = renderWithTheme(<Legend label="Failed" count={10} selectedStatus="Failed" />);
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <Legend label="Failed" count={10} selectedStatus="" />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('clears internal selectedState when selectedStatus changes to undefined', () => {
        const { rerender } = renderWithTheme(<Legend label="Failed" count={10} selectedStatus="Failed" />);
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <Legend label="Failed" count={10} selectedStatus={undefined} />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('updates when selectedStatus changes from undefined to a label', () => {
        const { rerender } = renderWithTheme(<Legend label="Failed" count={10} selectedStatus={undefined} />);
        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <Legend label="Failed" count={10} selectedStatus="Failed" />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    // ─── forwardRef ───────────────────────────────────────────────────────────

    it('forwards ref to the root element', () => {
        const ref = React.createRef<HTMLDivElement>();
        renderWithTheme(<Legend ref={ref} label="X" count={5} />);
        expect(ref.current).not.toBeNull();
    });

    // ─── Edge cases ───────────────────────────────────────────────────────────

    it('renders all six variant types without crashing', () => {
        const variants = ['failed', 'success', 'pending', 'warning', 'info', 'canceled'] as const;
        variants.forEach((v) => {
            const { unmount } = renderWithTheme(<Legend label={v} count={5} variant={v} />);
            unmount();
        });
    });

    it('renders all six variant outline types without crashing', () => {
        const variants = ['failed', 'success', 'pending', 'warning', 'info', 'canceled'] as const;
        variants.forEach((v) => {
            const { unmount } = renderWithTheme(<Legend label={v} count={0} variant={v} />);
            unmount();
        });
    });

    it('renders selected state with no variant or backgroundColor (finalBackgroundColor undefined)', () => {
        renderWithTheme(<Legend label="X" count={5} selectedStatus="X" />);
        expect(screen.getByTestId('blui-horizontal-bar-root')).toBeInTheDocument();
    });

    it('renders with all props specified simultaneously', () => {
        renderWithTheme(
            <Legend
                label="Test"
                count={7}
                variant="warning"
                backgroundColor="#FF0000"
                iconColor="#00FF00"
                selectedStatus="Test"
                icon={<span data-testid="full-icon">●</span>}
                disabledIcon={<span data-testid="full-disabled-icon">◯</span>}
                onClick={jest.fn()}
                classes={{ root: 'all-props' }}
            />
        );
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByTestId('full-icon')).toBeInTheDocument();
    });
});
