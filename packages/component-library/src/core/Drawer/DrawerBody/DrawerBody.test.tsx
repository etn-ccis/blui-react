import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerBody } from './DrawerBody';
import { DrawerNavGroup } from '../DrawerNavGroup';
import { DrawerNavItem } from '../DrawerNavItem';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Box from '@mui/material/Box';

afterEach(cleanup);

describe('DrawerBody', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody />
            </ThemeProvider>
        );
    });

    it('renders with data-testid', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-body')).toBeInTheDocument();
    });

    // Test case for line 81-82: null/undefined children handling
    it('should handle null children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody>
                    {null}
                    {undefined}
                    {false && <div>Not rendered</div>}
                    <DrawerNavGroup title="Valid Group">
                        <DrawerNavItem itemID="test-item" title="Test Item" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-body')).toBeInTheDocument();
        expect(screen.getByText('Valid Group')).toBeInTheDocument();
    });

    // Additional test case to specifically target line 81-82: empty/falsy children
    it('should handle various falsy children correctly', () => {
        const EmptyComponent = (): React.JSX.Element | null => null;
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody>
                    {null}
                    {undefined}
                    {false}
                    {0}
                    {''}
                    <EmptyComponent />
                    <DrawerNavGroup title="Valid Group">
                        <DrawerNavItem itemID="test-item-2" title="Test Item" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-body')).toBeInTheDocument();
        expect(screen.getByText('Valid Group')).toBeInTheDocument();
    });

    // Test case for line 85: non-DrawerNavGroup children
    it('should render non-DrawerNavGroup children directly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody>
                    <Box data-testid="custom-child">Custom Element</Box>
                    <div data-testid="custom-div">Custom Div</div>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-child')).toBeInTheDocument();
        expect(screen.getByTestId('custom-div')).toBeInTheDocument();
        expect(screen.getByText('Custom Element')).toBeInTheDocument();
        expect(screen.getByText('Custom Div')).toBeInTheDocument();
    });

    // Test case for line 85-86: DrawerNavGroup children handling
    it('should process DrawerNavGroup children with inherited props', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody activeItemBackgroundColor="red" activeItemFontColor="blue" backgroundColor="white">
                    <DrawerNavGroup title="Navigation Group">
                        <DrawerNavItem itemID="nav-item-1" title="Nav Item 1" />
                        <DrawerNavItem itemID="nav-item-2" title="Nav Item 2" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByText('Navigation Group')).toBeInTheDocument();
        expect(screen.getByText('Nav Item 1')).toBeInTheDocument();
        expect(screen.getByText('Nav Item 2')).toBeInTheDocument();
    });

    // Test case for line 80: children.map with multiple children types
    it('should handle mixed children types correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody>
                    {null}
                    <DrawerNavGroup title="First Group">
                        <DrawerNavItem itemID="item-1" title="Item 1" />
                    </DrawerNavGroup>
                    <Box data-testid="spacer">Spacer</Box>
                    <DrawerNavGroup title="Second Group">
                        <DrawerNavItem itemID="item-2" title="Item 2" />
                    </DrawerNavGroup>
                    {undefined}
                    <div data-testid="footer">Footer Content</div>
                </DrawerBody>
            </ThemeProvider>
        );

        expect(screen.getByText('First Group')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByTestId('spacer')).toBeInTheDocument();
        expect(screen.getByText('Second Group')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    }); // Test case for prop inheritance to DrawerNavGroup
    it('should pass inherited style props to DrawerNavGroup children', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerBody chevron={true} divider={true} ripple={false} hidePadding={true}>
                    <DrawerNavGroup title="Styled Group">
                        <DrawerNavItem itemID="styled-item" title="Styled Item" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByText('Styled Group')).toBeInTheDocument();
        expect(screen.getByText('Styled Item')).toBeInTheDocument();
    });

    // Test case for edge case: child without type property
    it('should handle children without type property', () => {
        const TextComponent = () => <span>Text Component</span>;

        render(
            <ThemeProvider theme={theme}>
                <DrawerBody>
                    <TextComponent />
                    <DrawerNavGroup title="Normal Group">
                        <DrawerNavItem itemID="normal-item" title="Normal Item" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );
        expect(screen.getByText('Text Component')).toBeInTheDocument();
        expect(screen.getByText('Normal Group')).toBeInTheDocument();
    }); // Test case for backgroundColor prop
    it('should apply backgroundColor prop correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerBody backgroundColor="lightblue">
                    <DrawerNavGroup title="Test Group">
                        <DrawerNavItem itemID="test-item" title="Test Item" />
                    </DrawerNavGroup>
                </DrawerBody>
            </ThemeProvider>
        );

        const drawerBody = container.querySelector('[data-testid="blui-drawer-body"]');
        expect(drawerBody).toHaveStyle('background-color: lightblue');
    });
});
