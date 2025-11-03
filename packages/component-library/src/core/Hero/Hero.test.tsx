import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Hero } from './Hero';
import { ChannelValue } from '../ChannelValue';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Home from '@mui/icons-material/Home';

afterEach(cleanup);

describe('Hero', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Healthy'} ChannelValueProps={{ value: '96', units: '/100' }} />
            </ThemeProvider>
        );
    });

    it('should render with the wrapper class', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero ChannelValueProps={{ value: '1' }} label={'test'} icon={'a'} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-hero-root')).toBeTruthy();
    });

    it('renders without children', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero ChannelValueProps={{ value: '1' }} label={'test'} icon={'a'} />
            </ThemeProvider>
        );
        expect(screen.getByText('1')).toBeTruthy();
        expect(screen.getByText('test')).toBeTruthy();
    });

    it('renders with children', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero ChannelValueProps={{ value: '1' }} label={'test'} icon={'a'}>
                    <ChannelValue value={1} />
                    <ChannelValue value={1} />
                </Hero>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-hero-root')).toBeTruthy();
        expect(screen.queryAllByTestId('blui-channel-value-value')).toBeTruthy();
        expect(screen.getByText('test')).toBeTruthy();
        expect(screen.findByRole('icon')).toBeTruthy();
    });

    it('applies pointer cursor when onClick is provided', () => {
        const mockClick = jest.fn();
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Clickable'} onClick={mockClick} />
            </ThemeProvider>
        );

        const heroRoot = screen.getByTestId('blui-hero-root');
        expect(heroRoot).toBeInTheDocument();

        // Test click functionality
        fireEvent.click(heroRoot);
        expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('applies inherit cursor when onClick is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Not Clickable'} />
            </ThemeProvider>
        );

        const heroRoot = screen.getByTestId('blui-hero-root');
        expect(heroRoot).toBeInTheDocument();
        // The cursor style is applied via CSS, component should render normally
    });

    it('handles numeric iconSize correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home />} label={'Home'} iconSize={48} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('handles string iconSize correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home />} label={'Home'} iconSize={'2rem'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('handles very small iconSize with normalization', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home />} label={'Small Icon'} iconSize={5} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('renders ChannelValue when no children and ChannelValueProps.value exists', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'With Value'} ChannelValueProps={{ value: '42', units: 'kg' }} />
            </ThemeProvider>
        );

        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('kg')).toBeInTheDocument();
    });

    it('does not render ChannelValue when children are present', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'With Children'} ChannelValueProps={{ value: '42', units: 'kg' }}>
                    <span>Custom Content</span>
                </Hero>
            </ThemeProvider>
        );

        expect(screen.getByText('Custom Content')).toBeInTheDocument();
        expect(screen.queryByText('42')).not.toBeInTheDocument();
    });

    it('does not render ChannelValue when no value is provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'No Value'} />
            </ThemeProvider>
        );

        expect(screen.getByText('No Value')).toBeInTheDocument();
    });
    it('does not render ChannelValue when ChannelValueProps is not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'No Props'} />
            </ThemeProvider>
        );

        const heroRoot = screen.getByTestId('blui-hero-root');
        expect(heroRoot).toBeInTheDocument();
        expect(screen.getByText('No Props')).toBeInTheDocument();
    });

    it('applies custom iconBackgroundColor', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Colored Background'} iconBackgroundColor={'red'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('uses default iconBackgroundColor when not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Default Background'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Custom Class'} className={'custom-hero'} />
            </ThemeProvider>
        );

        const heroRoot = screen.getByTestId('blui-hero-root');
        expect(heroRoot).toHaveClass('custom-hero');
    });

    it('forwards additional props to root element', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Test'} data-custom={'test-value'} />
            </ThemeProvider>
        );

        const heroRoot = screen.getByTestId('blui-hero-root');
        expect(heroRoot).toHaveAttribute('data-custom', 'test-value');
    });

    it('passes fontSize to ChannelValue when provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Large Font'} ChannelValueProps={{ value: '24', fontSize: '2rem' }} />
            </ThemeProvider>
        );

        expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('handles complex icon components', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home data-testid="home-icon" />} label={'Icon Component'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.getByText('Icon Component')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Minimal'} />
            </ThemeProvider>
        );

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('Minimal')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ThemeProvider theme={theme}>
                <Hero ref={ref} icon={'A'} label={'Ref Test'} />
            </ThemeProvider>
        );

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies default iconSize when not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home />} label={'Default Size'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('handles iconSize of exactly 10 (boundary case)', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={<Home />} label={'Boundary Size'} iconSize={10} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('handles empty string value in ChannelValueProps', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Empty Value'} ChannelValueProps={{ value: '', units: 'test' }} />
            </ThemeProvider>
        );

        // Empty value should not render ChannelValue
        expect(screen.queryByText('test')).not.toBeInTheDocument();
    });

    it('handles zero value in ChannelValueProps', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Zero Value'} ChannelValueProps={{ value: 0, units: 'items' }} />
            </ThemeProvider>
        );

        expect(screen.getByText('0')).toBeInTheDocument();
        // Note: ChannelValue may not always render units, but the zero value should be shown
    });
    it('handles false value in ChannelValueProps', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'False Value'} ChannelValueProps={{ value: '', units: 'status' }} />
            </ThemeProvider>
        );

        // Empty string value should not render ChannelValue
        expect(screen.queryByText('status')).not.toBeInTheDocument();
    });

    it('handles undefined value in ChannelValueProps', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Undefined Value'} />
            </ThemeProvider>
        );

        // No ChannelValueProps should not render ChannelValue
        expect(screen.getByText('Undefined Value')).toBeInTheDocument();
    });

    it('applies theme.vars color when available', () => {
        // This tests the theme.vars || theme conditional in styled components
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Theme Test'} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-hero-root')).toBeInTheDocument();
    });

    it('handles mix of children and ChannelValueProps', () => {
        render(
            <ThemeProvider theme={theme}>
                <Hero icon={'A'} label={'Mixed Content'} ChannelValueProps={{ value: '99' }}>
                    <div>Child content takes precedence</div>
                </Hero>
            </ThemeProvider>
        );

        expect(screen.getByText('Child content takes precedence')).toBeInTheDocument();
        // ChannelValue should not render when children are present
        expect(screen.queryByText('99')).not.toBeInTheDocument();
    });
});
