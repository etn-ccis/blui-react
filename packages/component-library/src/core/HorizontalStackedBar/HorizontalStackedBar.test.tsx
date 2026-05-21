import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { HorizontalStackedBar, HorizontalStackedBarItem } from './HorizontalStackedBar';

afterEach(cleanup);

const renderWithTheme = (ui: React.ReactElement): ReturnType<typeof render> =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

/** Mixed data: Failed(10), Success(20), Pending(0) — total 30 */
const defaultData: HorizontalStackedBarItem[] = [
    { label: 'Failed', variant: 'failed', count: 10 },
    { label: 'Success', variant: 'success', count: 20 },
    { label: 'Pending', variant: 'pending', count: 0 },
];

/** Helper: return all bar elements inside the BarContainer */
const getBars = (container: HTMLElement): NodeListOf<Element> => {
    const barContainer = container.querySelector('.BluiHorizontalStackedBar-barContainer');
    return (
        barContainer?.querySelectorAll('[data-testid="blui-horizontal-bar-root"]') ??
        ([] as unknown as NodeListOf<Element>)
    );
};

/** Helper: return all legend elements inside the LegendContainer */
const getLegends = (container: HTMLElement): NodeListOf<Element> => {
    const legendContainer = container.querySelector('.BluiHorizontalStackedBar-legendContainer');
    return (
        legendContainer?.querySelectorAll('[data-testid="blui-horizontal-bar-root"]') ??
        ([] as unknown as NodeListOf<Element>)
    );
};

describe('HorizontalStackedBar', () => {
    // ─── Rendering ────────────────────────────────────────────────────────────

    it('renders without crashing', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} />);
    });

    it('renders root with correct data-testid', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();
    });

    it('renders with custom className applied to root', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} className="my-bar" />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root').classList).toContain('my-bar');
    });

    it('renders with classes prop applied to root', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} classes={{ root: 'custom-root' }} />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root').classList).toContain('custom-root');
    });

    it('passes additional BoxProps (e.g. aria-label) to root', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} aria-label="status chart" />);
        expect(screen.getByLabelText('status chart')).toBeInTheDocument();
    });

    it('renders with an empty data array', () => {
        renderWithTheme(<HorizontalStackedBar data={[]} />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();
    });

    it('renders with a single item', () => {
        renderWithTheme(<HorizontalStackedBar data={[{ label: 'Only', count: 100, variant: 'info' }]} />);
        expect(screen.getByText('Only')).toBeInTheDocument();
    });

    it('renders all five variant types without crashing', () => {
        const allVariants: HorizontalStackedBarItem[] = [
            { label: 'Failed', variant: 'failed', count: 10 },
            { label: 'Success', variant: 'success', count: 20 },
            { label: 'Pending', variant: 'pending', count: 30 },
            { label: 'Info', variant: 'info', count: 50 },
            { label: 'Canceled', variant: 'canceled', count: 60 },
        ];
        renderWithTheme(<HorizontalStackedBar data={allVariants} />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();
    });

    // ─── Legend rendering ─────────────────────────────────────────────────────

    it('renders labels for all items by default (hideEmptyCategories=false)', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} />);
        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('Success')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders count values for all items', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} />);
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders all 3 legend items when hideEmptyCategories=false', () => {
        const { container } = renderWithTheme(<HorizontalStackedBar data={defaultData} hideEmptyCategories={false} />);
        expect(getLegends(container).length).toBe(3);
    });

    it('hides zero-count legend items when hideEmptyCategories=true', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} hideEmptyCategories />);
        expect(screen.queryByText('Pending')).not.toBeInTheDocument();
    });

    it('renders only non-zero legend items when hideEmptyCategories=true', () => {
        const { container } = renderWithTheme(<HorizontalStackedBar data={defaultData} hideEmptyCategories />);
        expect(getLegends(container).length).toBe(2);
    });

    it('still shows non-zero items when hideEmptyCategories=true', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} hideEmptyCategories />);
        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    // ─── Bar rendering ────────────────────────────────────────────────────────

    it('renders bars only for items with count > 0', () => {
        const { container } = renderWithTheme(<HorizontalStackedBar data={defaultData} />);
        // Failed(10), Success(20) = 2 bars; Pending(0) excluded
        expect(getBars(container).length).toBe(2);
    });

    it('renders no bars when all counts are zero', () => {
        const { container } = renderWithTheme(
            <HorizontalStackedBar
                data={[
                    { label: 'A', count: 0 },
                    { label: 'B', count: 0 },
                ]}
            />
        );
        expect(getBars(container).length).toBe(0);
    });

    it('renders one bar when only one item has count > 0', () => {
        const { container } = renderWithTheme(
            <HorizontalStackedBar
                data={[
                    { label: 'X', count: 0 },
                    { label: 'Y', count: 50 },
                ]}
            />
        );
        expect(getBars(container).length).toBe(1);
    });

    it('bar count is unaffected by hideEmptyCategories flag', () => {
        const { container: c1 } = renderWithTheme(<HorizontalStackedBar data={defaultData} hideEmptyCategories />);
        const { container: c2 } = renderWithTheme(
            <HorizontalStackedBar data={defaultData} hideEmptyCategories={false} />
        );
        expect(getBars(c1).length).toBe(getBars(c2).length);
    });

    // ─── totalCount computation (useEffect) ──────────────────────────────────

    it('computes totalCount from data on mount', () => {
        // Bars render without crashing — confirms totalCount was computed
        const { container } = renderWithTheme(
            <HorizontalStackedBar
                data={[
                    { label: 'A', count: 40 },
                    { label: 'B', count: 60 },
                ]}
            />
        );
        expect(getBars(container).length).toBe(2);
    });

    it('recomputes totalCount when data prop changes', () => {
        const data1: HorizontalStackedBarItem[] = [{ label: 'X', count: 10 }];
        const data2: HorizontalStackedBarItem[] = [
            { label: 'X', count: 30 },
            { label: 'Y', count: 70 },
        ];
        const { rerender, container } = renderWithTheme(<HorizontalStackedBar data={data1} />);
        expect(getBars(container).length).toBe(1);

        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <HorizontalStackedBar data={data2} />
                </ThemeProvider>
            );
        });
        expect(getBars(container).length).toBe(2);
        expect(screen.getByText('Y')).toBeInTheDocument();
    });

    // ─── Uncontrolled selection ───────────────────────────────────────────────

    it('calls onChange with label on first legend click (uncontrolled)', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        fireEvent.click(screen.getByText('Failed'));
        expect(handleChange).toHaveBeenCalledWith('Failed');
    });

    it('calls onChange with empty string on second click (deselect, uncontrolled)', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        fireEvent.click(screen.getByText('Failed')); // select
        fireEvent.click(screen.getByText('Failed')); // deselect
        expect(handleChange).toHaveBeenNthCalledWith(1, 'Failed');
        expect(handleChange).toHaveBeenNthCalledWith(2, '');
    });

    it('switches selection to a different item (uncontrolled)', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        fireEvent.click(screen.getByText('Failed'));
        fireEvent.click(screen.getByText('Success'));
        expect(handleChange).toHaveBeenNthCalledWith(1, 'Failed');
        expect(handleChange).toHaveBeenNthCalledWith(2, 'Success');
    });

    it('does not call onChange when a zero-count legend item is clicked', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        fireEvent.click(screen.getByText('Pending')); // count === 0
        expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not throw when clicked without an onChange prop', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} />);
        expect(() => fireEvent.click(screen.getByText('Failed'))).not.toThrow();
    });

    // ─── Controlled selection ─────────────────────────────────────────────────

    it('renders correctly with a controlled selectedStatus', () => {
        renderWithTheme(<HorizontalStackedBar data={defaultData} selectedStatus="Failed" />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();
    });

    it('calls onChange with label when a controlled legend is clicked', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} selectedStatus="" onChange={handleChange} />);
        fireEvent.click(screen.getByText('Success'));
        expect(handleChange).toHaveBeenCalledWith('Success');
    });

    it('calls onChange with empty string when the active controlled item is clicked (deselect)', () => {
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} selectedStatus="Success" onChange={handleChange} />);
        fireEvent.click(screen.getByText('Success'));
        expect(handleChange).toHaveBeenCalledWith('');
    });

    it('does not update internal state in controlled mode', () => {
        // Controlled: internal state stays at default; only onChange fires
        const handleChange = jest.fn();
        renderWithTheme(<HorizontalStackedBar data={defaultData} selectedStatus="Failed" onChange={handleChange} />);
        fireEvent.click(screen.getByText('Success'));
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith('Success');
    });

    it('switches controlled selectedStatus via rerender', () => {
        const { rerender } = renderWithTheme(<HorizontalStackedBar data={defaultData} selectedStatus="Failed" />);
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();

        act(() => {
            rerender(
                <ThemeProvider theme={theme}>
                    <HorizontalStackedBar data={defaultData} selectedStatus="Success" />
                </ThemeProvider>
            );
        });
        expect(screen.getByTestId('blui-horizontal-stacked-bar-root')).toBeInTheDocument();
    });

    // ─── Bar segment click triggers selection ─────────────────────────────────

    it('triggers onChange when a bar segment is clicked', () => {
        const handleChange = jest.fn();
        const { container } = renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        const firstBar = getBars(container)[0] as HTMLElement;
        fireEvent.click(firstBar);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('deselects via bar click when same bar is clicked twice', () => {
        const handleChange = jest.fn();
        const { container } = renderWithTheme(<HorizontalStackedBar data={defaultData} onChange={handleChange} />);
        const firstBar = getBars(container)[0] as HTMLElement;
        fireEvent.click(firstBar); // select
        fireEvent.click(firstBar); // deselect
        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange).toHaveBeenNthCalledWith(2, '');
    });

    // ─── Item-level props ─────────────────────────────────────────────────────

    it('renders custom icon prop on legend item', () => {
        const data: HorizontalStackedBarItem[] = [
            { label: 'Custom', count: 5, icon: <span data-testid="custom-icon">★</span> },
        ];
        renderWithTheme(<HorizontalStackedBar data={data} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders disabledIcon when item count is 0', () => {
        const data: HorizontalStackedBarItem[] = [
            { label: 'Empty', count: 0, disabledIcon: <span data-testid="disabled-icon">◯</span> },
        ];
        renderWithTheme(<HorizontalStackedBar data={data} />);
        expect(screen.getByTestId('disabled-icon')).toBeInTheDocument();
    });

    it('renders item with custom backgroundColor without crashing', () => {
        const data: HorizontalStackedBarItem[] = [{ label: 'Colored', count: 15, backgroundColor: '#AB12CD' }];
        renderWithTheme(<HorizontalStackedBar data={data} />);
        expect(screen.getByText('Colored')).toBeInTheDocument();
    });

    it('renders item with both icon and disabledIcon (count > 0 uses icon)', () => {
        const data: HorizontalStackedBarItem[] = [
            {
                label: 'Both',
                count: 5,
                icon: <span data-testid="active-icon">●</span>,
                disabledIcon: <span data-testid="disabled-icon">◯</span>,
            },
        ];
        renderWithTheme(<HorizontalStackedBar data={data} />);
        expect(screen.getByTestId('active-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('disabled-icon')).not.toBeInTheDocument();
    });

    // ─── forwardRef ───────────────────────────────────────────────────────────

    it('forwards ref to the root element', () => {
        const ref = React.createRef<HTMLDivElement>();
        renderWithTheme(<HorizontalStackedBar ref={ref} data={defaultData} />);
        expect(ref.current).not.toBeNull();
        expect(ref.current?.getAttribute('data-testid')).toBe('blui-horizontal-stacked-bar-root');
    });
});
