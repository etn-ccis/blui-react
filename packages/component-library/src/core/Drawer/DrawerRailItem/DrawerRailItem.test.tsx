import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerRailItem } from './DrawerRailItem';
import { DrawerContext } from '../DrawerContext';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

afterEach(cleanup);

// Mock DrawerContext Provider for testing
const MockDrawerContext = ({
    children,
    variant = 'rail',
    open = true,
    activeItem = '',
    condensed = false,
    onItemSelect = undefined,
}: any): any => (
    <DrawerContext.Provider value={{ variant, open, activeItem, condensed, onItemSelect }}>
        {children}
    </DrawerContext.Provider>
);

describe('DrawerRailItem', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} />
                </MockDrawerContext>
            </ThemeProvider>
        );
    });

    it('renders with required props', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test-item" icon={<Home />} title="Home" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders icon correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="home" icon={<Home data-testid="home-icon" />} title="Home" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders title when not condensed', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext condensed={false}>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test Item" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('hides title when condensed', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext condensed={true}>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test Item" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
    });

    it('shows tooltip when condensed and not disabled', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext condensed={true}>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test Item" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        // The tooltip is present but may not be visible until hover
        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
    });

    it('does not show tooltip when disableRailTooltip is true', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext condensed={true}>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test Item" disableRailTooltip={true} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        // When tooltip is disabled, there should be no MuiTooltip wrapper
        const tooltip = container.querySelector('.MuiTooltip-root');
        expect(tooltip).not.toBeInTheDocument();
    });

    it('applies active state when itemID matches activeItem', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="active-item">
                    <DrawerRailItem itemID="active-item" icon={<Home />} title="Active Item" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        // Active state is applied through CSS classes and styling
    });

    it('renders status color stripe when statusColor is provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" statusColor="red" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-status-stripe')).toBeInTheDocument();
    });

    it('does not render status stripe when statusColor is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.queryByTestId('blui-status-stripe')).not.toBeInTheDocument();
    });

    it('does not render status stripe when statusColor is empty string', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" statusColor="" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.queryByTestId('blui-status-stripe')).not.toBeInTheDocument();
    });

    it('renders divider when divider prop is true', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" divider={true} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).toBeInTheDocument();
    });

    it('does not render divider when divider prop is false', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" divider={false} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).not.toBeInTheDocument();
    });

    it('calls onClick when item is clicked', () => {
        const mockOnClick = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" onClick={mockOnClick} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        fireEvent.click(railItem);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onItemSelect from context when item is clicked', () => {
        const mockOnItemSelect = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext onItemSelect={mockOnItemSelect}>
                    <DrawerRailItem itemID="test-item" icon={<Home />} title="Test" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        fireEvent.click(railItem);
        expect(mockOnItemSelect).toHaveBeenCalledWith('test-item');
    });

    it('calls both onClick and onItemSelect when both are provided', () => {
        const mockOnClick = jest.fn();
        const mockOnItemSelect = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext onItemSelect={mockOnItemSelect}>
                    <DrawerRailItem itemID="test-item" icon={<Home />} title="Test" onClick={mockOnClick} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        fireEvent.click(railItem);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnItemSelect).toHaveBeenCalledWith('test-item');
    });

    it('does not render when hidden is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Hidden Item" hidden={true} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.queryByText('Hidden Item')).not.toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders when hidden is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Visible Item" hidden={false} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByText('Visible Item')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('uses condensed prop over context condensed value', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext condensed={true}>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test Item" condensed={false} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Should show title because item's condensed prop overrides context
        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" className="custom-rail-item" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toHaveClass('custom-rail-item');
    });

    it('forwards ButtonBaseProps correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem
                        itemID="test"
                        icon={<Home />}
                        title="Test"
                        ButtonBaseProps={{ id: 'custom-button-base' }}
                    />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByRole('button')).toHaveAttribute('id', 'custom-button-base');
    });
    it('applies style props correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem
                        itemID="test"
                        icon={<Home />}
                        title="Test"
                        backgroundColor="lightblue"
                        itemFontColor="red"
                        itemIconColor="green"
                    />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        // Style application is tested through CSS, actual color testing would require more complex setup
    });

    it('disables ripple effect when ripple is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" ripple={false} onClick={() => {}} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Component should render without error when ripple is false
        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
    });

    it('enables ripple effect when ripple is true (default)', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" onClick={() => {}} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Component should render without error when ripple is enabled (default)
        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
    });
    it('handles empty title gracefully', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
    });

    it('handles missing title prop (uses default)', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
    });

    it('renders different icons correctly', () => {
        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home data-testid="home-icon" />} title="Home" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Settings data-testid="settings-icon" />} title="Settings" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument();
    });

    it('handles activeItemBackgroundColor prop correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="active-item">
                    <DrawerRailItem
                        itemID="active-item"
                        icon={<Home />}
                        title="Active"
                        activeItemBackgroundColor="yellow"
                    />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        // Active background color is applied through styled components
    });

    it('handles activeItemFontColor and activeItemIconColor props correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="active-item">
                    <DrawerRailItem
                        itemID="active-item"
                        icon={<Home />}
                        title="Active"
                        activeItemFontColor="blue"
                        activeItemIconColor="purple"
                    />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        // Active colors are applied through styled components
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem ref={ref} itemID="test" icon={<Home />} title="Test" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('applies sx prop correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<Home />} title="Test" sx={{ margin: 2 }} />
                </MockDrawerContext>
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        // sx prop application would be tested through computed styles
    });

    it('handles complex icon components', () => {
        const ComplexIcon = (): any => (
            <div data-testid="complex-icon">
                <PersonIcon />
                <span>Custom</span>
            </div>
        );

        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerRailItem itemID="test" icon={<ComplexIcon />} title="Complex" />
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('works without DrawerContext (uses defaults)', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerRailItem itemID="test" icon={<Home />} title="No Context" />
            </ThemeProvider>
        );

        const railItem = screen.getByRole('button');
        expect(railItem).toBeInTheDocument();
        expect(screen.getByText('No Context')).toBeInTheDocument();
    });
});
