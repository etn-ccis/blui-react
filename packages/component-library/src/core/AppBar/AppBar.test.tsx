import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppBar } from './AppBar';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import Typography from '@mui/material/Typography';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
});

// Mock scroll events
Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
    });
});

describe('AppBar', () => {
    it('should render without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar />
            </ThemeProvider>
        );
    });

    it('should render Typography title', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar>
                    <Typography variant="h6">AppBar</Typography>
                </AppBar>
            </ThemeProvider>
        );
        const divElement = screen.getByText(/AppBar/i);
        expect(divElement).toBeTruthy();
    });

    it('should render at the correct default size', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="snap"></AppBar>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle(`height: 200px`);
    });

    it('should render at the correct collapsed height size', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed"></AppBar>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle(`height: 4rem`);
    });

    it('should render at the correct expanded height size', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded"></AppBar>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle(`height: 200px`);
    });

    it('should render with custom collapsedHeight', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed" collapsedHeight="80px" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle(`height: 80px`);
    });

    it('should render with custom expandedHeight', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" expandedHeight={300} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle(`height: 300px`);
    });

    it('should render with custom className', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar className="custom-class" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveClass('custom-class');
    });

    it('should render with custom style', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar style={{ backgroundColor: 'red' }} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toHaveStyle('background-color: red');
    });

    it('should render with background image', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar backgroundImage="test-image.jpg" />
            </ThemeProvider>
        );
        const appBar = screen.getByTestId('blui-appbar-root');
        expect(appBar).toBeInTheDocument();
    });

    it('should render with custom animation duration', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar animationDuration={500} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toBeInTheDocument();
    });

    it('should render with custom scrollThreshold', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar scrollThreshold={200} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-appbar-root')).toBeInTheDocument();
    });

    it('should apply correct classes based on variant', () => {
        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" />
            </ThemeProvider>
        );

        let appBar = screen.getByTestId('blui-appbar-root');
        expect(appBar).toHaveClass('BluiAppBar-root');
        expect(appBar).toHaveClass('Mui-expanded');

        rerender(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed" />
            </ThemeProvider>
        );

        appBar = screen.getByTestId('blui-appbar-root');
        expect(appBar).toHaveClass('BluiAppBar-root');
        expect(appBar).toHaveClass('BluiAppBar-collapsed');
    });

    it('should handle scroll events when variant is snap', () => {
        jest.useFakeTimers();

        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="snap" scrollThreshold={100} />
            </ThemeProvider>
        );

        // Simulate scroll past threshold
        Object.defineProperty(window, 'scrollY', {
            value: 150,
            writable: true,
        });

        act(() => {
            fireEvent.scroll(window);
        });

        // Advance timers to trigger the scroll handling
        act(() => {
            jest.advanceTimersByTime(100);
        });

        jest.useRealTimers();
    });

    it('should handle variant change from snap to collapsed', () => {
        jest.useFakeTimers();

        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <AppBar variant="snap" />
            </ThemeProvider>
        );

        rerender(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed" />
            </ThemeProvider>
        );

        // Advance timers to allow animations to complete
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        jest.useRealTimers();
    });

    it('should handle variant change from snap to expanded', () => {
        jest.useFakeTimers();

        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <AppBar variant="snap" />
            </ThemeProvider>
        );

        rerender(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" />
            </ThemeProvider>
        );

        // Advance timers to allow animations to complete
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        jest.useRealTimers();
    });

    it('should handle height changes when expanded', () => {
        jest.useFakeTimers();

        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" expandedHeight={200} />
            </ThemeProvider>
        );

        rerender(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" expandedHeight={300} />
            </ThemeProvider>
        );

        // Advance timers to allow effects to run
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        jest.useRealTimers();
    });

    it('should handle height changes when collapsed', () => {
        jest.useFakeTimers();

        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed" collapsedHeight="64px" />
            </ThemeProvider>
        );

        rerender(
            <ThemeProvider theme={theme}>
                <AppBar variant="collapsed" collapsedHeight="80px" />
            </ThemeProvider>
        );

        // Advance timers to allow effects to run
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        jest.useRealTimers();
    });

    it('should use custom scroll container when scrollContainerId is provided', () => {
        // Create a mock element
        const mockElement = document.createElement('div');
        mockElement.id = 'custom-scroll-container';
        mockElement.scrollTop = 0;
        document.body.appendChild(mockElement);

        render(
            <ThemeProvider theme={theme}>
                <AppBar scrollContainerId="custom-scroll-container" />
            </ThemeProvider>
        );

        expect(screen.getByTestId('blui-appbar-root')).toBeInTheDocument();

        // Clean up
        document.body.removeChild(mockElement);
    });

    it('should handle scroll container events', () => {
        jest.useFakeTimers();

        // Create a mock element
        const mockElement = document.createElement('div');
        mockElement.id = 'custom-scroll-container';
        mockElement.scrollTop = 0;
        document.body.appendChild(mockElement);

        render(
            <ThemeProvider theme={theme}>
                <AppBar scrollContainerId="custom-scroll-container" variant="snap" />
            </ThemeProvider>
        );

        // Simulate scroll event on custom container
        act(() => {
            fireEvent.scroll(mockElement);
        });

        // Advance timers
        act(() => {
            jest.advanceTimersByTime(100);
        });

        // Clean up
        document.body.removeChild(mockElement);
        jest.useRealTimers();
    });

    it('should render background image when provided and expanded', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" backgroundImage="test-bg.jpg" />
            </ThemeProvider>
        );

        const appBar = screen.getByTestId('blui-appbar-root');
        const backgroundDiv = appBar.querySelector('.BluiAppBar-background');
        expect(backgroundDiv).toBeInTheDocument();
        expect(backgroundDiv).toHaveClass('BluiAppBar-expandedBackground');
    });

    it('should not render background image when not provided', () => {
        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="expanded" />
            </ThemeProvider>
        );

        const appBar = screen.getByTestId('blui-appbar-root');
        const backgroundDiv = appBar.querySelector('.BluiAppBar-background');
        expect(backgroundDiv).not.toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
        const ref = React.createRef<HTMLElement>();

        render(
            <ThemeProvider theme={theme}>
                <AppBar ref={ref} />
            </ThemeProvider>
        );

        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('should handle scroll to top when at scroll position 0', () => {
        jest.useFakeTimers();

        render(
            <ThemeProvider theme={theme}>
                <AppBar variant="snap" scrollThreshold={100} />
            </ThemeProvider>
        );

        // First scroll past threshold
        Object.defineProperty(window, 'scrollY', {
            value: 150,
            writable: true,
        });

        act(() => {
            fireEvent.scroll(window);
        });

        // Then scroll back to top
        Object.defineProperty(window, 'scrollY', {
            value: 0,
            writable: true,
        });

        act(() => {
            fireEvent.scroll(window);
        });

        // Advance timers to trigger effects
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        jest.useRealTimers();
    });

    it('should apply custom classes when provided', () => {
        const customClasses = {
            root: 'custom-root',
            expanded: 'custom-expanded',
            collapsed: 'custom-collapsed',
            background: 'custom-background',
            expandedBackground: 'custom-expanded-background',
        };

        render(
            <ThemeProvider theme={theme}>
                <AppBar classes={customClasses} variant="expanded" />
            </ThemeProvider>
        );

        const appBar = screen.getByTestId('blui-appbar-root');
        expect(appBar).toHaveClass('custom-root');
        expect(appBar).toHaveClass('custom-expanded');
    });
});
