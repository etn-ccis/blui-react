import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerNavGroup } from './DrawerNavGroup';
import { DrawerNavItem } from '../DrawerNavItem';
import { DrawerRailItem } from '../DrawerRailItem';
import { DrawerContext } from '../DrawerContext';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';

afterEach(cleanup);

// Mock DrawerContext Provider for testing
const MockDrawerContext = ({ children, variant = 'persistent', open = true, activeItem = '' }: any): any => (
    <DrawerContext.Provider value={{ variant, open, activeItem, condensed: false }}>{children}</DrawerContext.Provider>
);

describe('DrawerNavGroup', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup />
                </MockDrawerContext>
            </ThemeProvider>
        );
    });

    it('renders with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-nav-group')).toBeInTheDocument();
    });

    it('renders title correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Navigation Group" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Navigation Group')).toBeInTheDocument();
    });

    it('renders title with custom color', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Colored Title" titleColor="red" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const titleElement = screen.getByText('Colored Title');
        expect(titleElement).toBeInTheDocument();
    });

    it('renders titleContent instead of title when provided', () => {
        const customTitleContent = <Box data-testid="custom-title">Custom Title Content</Box>;
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup titleContent={customTitleContent} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('renders with titleDivider by default', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="With Divider" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).toBeInTheDocument();
    });

    it('does not render divider when titleDivider is false', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Without Divider" titleDivider={false} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).not.toBeInTheDocument();
    });

    it('renders DrawerNavItem children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Navigation">
                        <DrawerNavItem itemID="nav1" title="Nav Item 1" />
                        <DrawerNavItem itemID="nav2" title="Nav Item 2" />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Nav Item 1')).toBeInTheDocument();
        expect(screen.getByText('Nav Item 2')).toBeInTheDocument();
    });

    it('renders DrawerRailItem children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Rail Navigation">
                        <DrawerRailItem itemID="rail1" title="Rail Item 1" icon={<Home />} />
                        <DrawerRailItem itemID="rail2" title="Rail Item 2" icon={<Settings />} />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-nav-group')).toBeInTheDocument();
    });

    it('renders items from items prop as DrawerNavItems', () => {
        const items = [
            { itemID: 'item1', title: 'Item 1' },
            { itemID: 'item2', title: 'Item 2' },
        ];
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Items List" items={items} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders items as DrawerRailItems when variant is rail', () => {
        const railItems = [
            { itemID: 'rail1', title: 'Rail 1', icon: <Home /> },
            { itemID: 'rail2', title: 'Rail 2', icon: <Settings /> },
        ];
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext variant="rail">
                    <DrawerNavGroup items={railItems} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-nav-group')).toBeInTheDocument();
    });

    it('warns when DrawerRailItem is missing required icon prop', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const railItems: any[] = [
            { itemID: 'rail1', title: 'Rail 1' }, // Missing icon - using any[] to bypass TypeScript checking
        ];
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext variant="rail">
                    <DrawerNavGroup items={railItems} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(consoleSpy).toHaveBeenCalledWith("Missing required prop 'icon' in DrawerRailItem.");
        consoleSpy.mockRestore();
    });

    it('warns when DrawerNavItem is missing required title prop', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const navItems: any[] = [
            { itemID: 'nav1' }, // Missing title - using any[] to bypass TypeScript checking for this test
        ];
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup items={navItems} />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(consoleSpy).toHaveBeenCalledWith("Missing required prop 'title' in DrawerNavItem.");
        consoleSpy.mockRestore();
    });

    it('applies inherited style props to children', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Styled Group" backgroundColor="lightblue" itemFontColor="red" divider={true}>
                        <DrawerNavItem itemID="styled1" title="Styled Item" />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Styled Item')).toBeInTheDocument();
    });

    it('handles activeItem and sets active hierarchy', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="active1">
                    <DrawerNavGroup title="Active Group">
                        <DrawerNavItem itemID="active1" title="Active Item" />
                        <DrawerNavItem itemID="inactive1" title="Inactive Item" />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Active Item')).toBeInTheDocument();
        expect(screen.getByText('Inactive Item')).toBeInTheDocument();
    });

    it('does not show title in rail variant', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext variant="rail">
                    <DrawerNavGroup title="Rail Title">
                        <DrawerRailItem itemID="rail1" title="Rail Item" icon={<Home />} />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        // In rail variant, the subheader is not rendered
        expect(screen.queryByText('Rail Title')).not.toBeInTheDocument();
    });

    it('does not show divider in rail variant', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext variant="rail">
                    <DrawerNavGroup title="Rail Group">
                        <DrawerRailItem itemID="rail1" title="Rail Item" icon={<Home />} />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).not.toBeInTheDocument();
    });

    it('hides title when drawer is closed', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerNavGroup title="Hidden Title" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const titleElement = screen.getByText('Hidden Title');
        expect(titleElement.parentElement).toHaveStyle('color: transparent');
    });

    it('passes backgroundColor prop correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup backgroundColor="lightgreen" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const navGroup = container.querySelector('[data-testid="blui-drawer-nav-group"]');
        expect(navGroup).toHaveStyle('background-color: lightgreen');
    });

    it('handles mixed children types correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Mixed Group">
                        <DrawerNavItem itemID="nav1" title="Nav Item" />
                        <DrawerRailItem itemID="rail1" title="Rail Item" icon={<Settings />} />
                        <Box data-testid="custom-element">Custom Element</Box>
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Nav Item')).toBeInTheDocument();
        // Custom element should be filtered out by findChildByType
        expect(screen.queryByTestId('custom-element')).not.toBeInTheDocument();
    });

    it('handles nested navigation items correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup title="Nested Group">
                        <DrawerNavItem itemID="parent1" title="Parent Item">
                            <DrawerNavItem itemID="child1" title="Child Item" />
                        </DrawerNavItem>
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByText('Parent Item')).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup className="custom-nav-group" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const navGroup = container.querySelector('[data-testid="blui-drawer-nav-group"]');
        expect(navGroup).toHaveClass('custom-nav-group');
    });

    it('forwards other props to the List component', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerNavGroup data-custom="test-value" />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const navGroup = screen.getByTestId('blui-drawer-nav-group');
        expect(navGroup).toHaveAttribute('data-custom', 'test-value');
    });

    it('handles activeHierarchy state changes correctly', () => {
        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="item1">
                    <DrawerNavGroup title="Hierarchy Group">
                        <DrawerNavItem itemID="item1" title="Active Item" />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByText('Active Item')).toBeInTheDocument();

        // Change active item
        rerender(
            <ThemeProvider theme={theme}>
                <MockDrawerContext activeItem="item2">
                    <DrawerNavGroup title="Hierarchy Group">
                        <DrawerNavItem itemID="item1" title="Active Item" />
                        <DrawerNavItem itemID="item2" title="New Active Item" />
                    </DrawerNavGroup>
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByText('New Active Item')).toBeInTheDocument();
    });
});
