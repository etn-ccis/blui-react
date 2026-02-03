import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerSubheader } from './DrawerSubheader';
import { DrawerContext } from '../DrawerContext';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Box from '@mui/material/Box';

afterEach(cleanup);

// Mock DrawerContext Provider for testing
const MockDrawerContext = ({ children, open = true }: { children: React.ReactNode; open?: boolean }): any => (
    <DrawerContext.Provider value={{ variant: 'persistent', open, activeItem: '', condensed: false }}>
        {children}
    </DrawerContext.Provider>
);

describe('DrawerSubheader', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader />
                </MockDrawerContext>
            </ThemeProvider>
        );
    });

    it('renders with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader />
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-sub-header')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader>
                        <Box data-testid="custom-content">Custom Subheader Content</Box>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-content')).toBeInTheDocument();
        expect(screen.getByText('Custom Subheader Content')).toBeInTheDocument();
    });

    it('renders divider by default', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader>
                        <div>Content</div>
                    </DrawerSubheader>
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
                    <DrawerSubheader divider={false}>
                        <div>Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).not.toBeInTheDocument();
    });

    it('shows content when drawer is open', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={true}>
                    <DrawerSubheader>
                        <div data-testid="visible-content">Visible Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: inherit');
        expect(screen.getByTestId('visible-content')).toBeInTheDocument();
    });

    it('hides content when drawer is closed and hideContentOnCollapse is true (default)', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerSubheader>
                        <div data-testid="hidden-content">Hidden Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: hidden');
    });

    it('shows content when drawer is closed but hideContentOnCollapse is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerSubheader hideContentOnCollapse={false}>
                        <div data-testid="always-visible-content">Always Visible Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: inherit');
        expect(screen.getByTestId('always-visible-content')).toBeInTheDocument();
    });

    it('applies hideContentOnCollapse true explicitly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerSubheader hideContentOnCollapse={true}>
                        <div data-testid="explicit-hidden-content">Explicitly Hidden Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: hidden');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader ref={ref}>
                        <div>Content with ref</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveAttribute('data-testid', 'blui-drawer-sub-header');
    });

    it('forwards other BoxProps correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader
                        className="custom-subheader"
                        style={{ backgroundColor: 'lightblue' }}
                        data-custom="test-value"
                    >
                        <div>Content with props</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveClass('custom-subheader');
        expect(subheader).toHaveStyle('background-color: lightblue');
        expect(subheader).toHaveAttribute('data-custom', 'test-value');
    });

    it('handles multiple children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader>
                        <div data-testid="child-1">Child 1</div>
                        <div data-testid="child-2">Child 2</div>
                        <span data-testid="child-3">Child 3</span>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
        expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('works without DrawerContext (uses default values)', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerSubheader>
                    <div data-testid="no-context-content">No Context Content</div>
                </DrawerSubheader>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        // Should use default open=true from useDrawerContext
        expect(subheader).toHaveStyle('visibility: inherit');
        expect(screen.getByTestId('no-context-content')).toBeInTheDocument();
    });

    it('renders without children', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader />
                </MockDrawerContext>
            </ThemeProvider>
        );
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toBeInTheDocument();
        expect(subheader).toBeEmptyDOMElement();
    });

    it('combines divider and hideContentOnCollapse props correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerSubheader divider={false} hideContentOnCollapse={false}>
                        <div data-testid="combined-props-content">Combined Props Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Content should be visible
        const subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: inherit');

        // Divider should not be present
        const divider = container.querySelector('.MuiDivider-root');
        expect(divider).not.toBeInTheDocument();

        expect(screen.getByTestId('combined-props-content')).toBeInTheDocument();
    });

    it('handles complex nested content', () => {
        render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext>
                    <DrawerSubheader>
                        <Box sx={{ p: 2 }}>
                            <div data-testid="nested-container">
                                <span>Nested Span</span>
                                <Box data-testid="nested-box">Nested Box Content</Box>
                            </div>
                        </Box>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );

        expect(screen.getByTestId('nested-container')).toBeInTheDocument();
        expect(screen.getByTestId('nested-box')).toBeInTheDocument();
        expect(screen.getByText('Nested Span')).toBeInTheDocument();
        expect(screen.getByText('Nested Box Content')).toBeInTheDocument();
    });

    it('handles drawer state changes correctly', () => {
        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={true}>
                    <DrawerSubheader>
                        <div data-testid="state-change-content">State Change Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Initially visible
        let subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: inherit');

        // Change to closed
        rerender(
            <ThemeProvider theme={theme}>
                <MockDrawerContext open={false}>
                    <DrawerSubheader>
                        <div data-testid="state-change-content">State Change Content</div>
                    </DrawerSubheader>
                </MockDrawerContext>
            </ThemeProvider>
        );

        // Should be hidden
        subheader = screen.getByTestId('blui-drawer-sub-header');
        expect(subheader).toHaveStyle('visibility: hidden');
    });
});
