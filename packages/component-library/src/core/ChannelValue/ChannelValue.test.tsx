import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChannelValue } from './ChannelValue';
import Menu from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

describe('ChannelValue', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={'test'} />
            </ThemeProvider>
        );
        expect(screen.getByText('test')).toBeTruthy();
    });
    it('should render value properly', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={1} />
            </ThemeProvider>
        );
        expect(screen.getByText('1')).toBeTruthy();
    });
    it('should render icon properly', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue icon={<Menu />} value={1} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('MenuIcon')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy();
    });
    it('should render units properly', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={1} units={'X'} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-channel-value-units')).toBeTruthy();
        expect(screen.getByText('1')).toBeTruthy();
    });

    // Test case for line 93: Value component with isPrefix=true (margin left styling)
    it('should apply prefix styling when prefix is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={100} units={'$'} prefix={true} />
            </ThemeProvider>
        );
        const valueElement = screen.getByTestId('blui-channel-value-value');
        expect(valueElement).toBeTruthy();
        expect(screen.getByText('100')).toBeTruthy();
        expect(screen.getByText('$')).toBeTruthy();
    });

    // Test case for line 125: applyPrefix function with unitSpace='hide'
    it('should handle unitSpace="hide" with prefix', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={100} units={'$'} prefix={true} unitSpace="hide" />
            </ThemeProvider>
        );
        expect(screen.getByText('100')).toBeTruthy();
        // Units should still be rendered when unitSpace is 'hide', but without spacing
        expect(screen.getByTestId('blui-channel-value-units')).toBeTruthy();
        expect(screen.getByText('$')).toBeTruthy();
    });

    // Test case for line 125: applyPrefix function with unitSpace='show'
    it('should handle unitSpace="show" with prefix', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={100} units={'Hz'} prefix={true} unitSpace="show" />
            </ThemeProvider>
        );
        expect(screen.getByText('100')).toBeTruthy();
        expect(screen.getByTestId('blui-channel-value-units')).toBeTruthy();
        expect(screen.getByText('Hz')).toBeTruthy();
    });

    // Test case for line 170: prefix && getUnitElement() conditional rendering
    it('should render units as prefix when prefix=true', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={25} units={'%'} prefix={true} />
            </ThemeProvider>
        );
        const root = screen.getByTestId('blui-channel-value-root-test');
        const unitsElement = screen.getByTestId('blui-channel-value-units');
        const valueElement = screen.getByTestId('blui-channel-value-value');

        expect(root).toBeTruthy();
        expect(unitsElement).toBeTruthy();
        expect(valueElement).toBeTruthy();
        expect(screen.getByText('%')).toBeTruthy();
        expect(screen.getByText('25')).toBeTruthy();
    });

    // Additional test for suffix rendering (!prefix && getUnitElement())
    it('should render units as suffix when prefix=false', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={25} units={'%'} prefix={false} />
            </ThemeProvider>
        );
        const root = screen.getByTestId('blui-channel-value-root-test');
        const unitsElement = screen.getByTestId('blui-channel-value-units');
        const valueElement = screen.getByTestId('blui-channel-value-value');

        expect(root).toBeTruthy();
        expect(unitsElement).toBeTruthy();
        expect(valueElement).toBeTruthy();
        expect(screen.getByText('%')).toBeTruthy();
        expect(screen.getByText('25')).toBeTruthy();
    });

    // Test case to cover the getUnitElement when units is not provided
    it('should not render units element when units prop is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={42} prefix={true} />
            </ThemeProvider>
        );
        expect(screen.getByText('42')).toBeTruthy();
        expect(screen.queryByTestId('blui-channel-value-units')).toBeNull();
    });

    // Test case for applySuffix logic (complement to applyPrefix)
    it('should handle suffix units with special characters', () => {
        render(
            <ThemeProvider theme={theme}>
                <ChannelValue value={75} units={'%'} prefix={false} />
            </ThemeProvider>
        );
        expect(screen.getByText('75')).toBeTruthy();
        expect(screen.getByTestId('blui-channel-value-units')).toBeTruthy();
        expect(screen.getByText('%')).toBeTruthy();
    });
});
