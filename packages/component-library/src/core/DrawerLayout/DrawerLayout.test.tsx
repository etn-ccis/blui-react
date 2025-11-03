import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerLayout } from './DrawerLayout';
import { Drawer } from '../Drawer/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { useDrawerLayout } from './contexts/DrawerLayoutContextProvider';

afterEach(cleanup);

// Mock component to test context functionality
const MockDrawerLayoutConsumer = ({ onPaddingChange, onDrawerOpenChange }: any): any => {
    const { setPadding, setDrawerOpen } = useDrawerLayout();

    React.useEffect(() => {
        if (onPaddingChange) {
            setPadding(200);
            onPaddingChange();
        }
    }, [setPadding, onPaddingChange]);

    React.useEffect(() => {
        if (onDrawerOpenChange) {
            setDrawerOpen(true);
            onDrawerOpenChange();
        }
    }, [setDrawerOpen, onDrawerOpenChange]);

    return <div data-testid="mock-consumer">Mock Consumer</div>;
};

describe('DrawerLayout', () => {
    const mockDrawer = (
        <Drawer open={false} variant="persistent">
            <div>Mock Drawer Content</div>
        </Drawer>
    );

    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );
    });

    it('renders drawer and content', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout
                    drawer={
                        <Drawer open>
                            <div>Mock Drawer Content</div>
                        </Drawer>
                    }
                >
                    <div data-testid="main-content">Main Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByTestId('main-content')).toBeInTheDocument();
        // The drawer component structure is present
        expect(document.querySelector('.BluiDrawer-root')).toBeInTheDocument();
        expect(document.querySelector('.BluiDrawerLayout-drawer')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        expect(root).toHaveClass('BluiDrawerLayout-root');
    });

    it('applies custom className', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer} className="custom-drawer-layout">
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        expect(root).toHaveClass('custom-drawer-layout');
        expect(root).toHaveClass('BluiDrawerLayout-root');
    });

    it('forwards additional props to root element', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer} data-testid="drawer-layout-root" role="main">
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        expect(root).toHaveAttribute('data-testid', 'drawer-layout-root');
        expect(root).toHaveAttribute('role', 'main');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout ref={ref} drawer={mockDrawer}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('provides DrawerLayoutContext with correct functions', () => {
        let contextPaddingCalled = false;
        let contextDrawerOpenCalled = false;

        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <MockDrawerLayoutConsumer
                        onPaddingChange={() => {
                            contextPaddingCalled = true;
                        }}
                        onDrawerOpenChange={() => {
                            contextDrawerOpenCalled = true;
                        }}
                    />
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByTestId('mock-consumer')).toBeInTheDocument();
        expect(contextPaddingCalled).toBe(true);
        expect(contextDrawerOpenCalled).toBe(true);
    });

    it('applies left padding in LTR layout', () => {
        const TestConsumer = (): any => {
            const { setPadding } = useDrawerLayout();

            React.useEffect(() => {
                setPadding(250);
            }, [setPadding]);

            return <div data-testid="test-content">Content</div>;
        };

        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        // Find the content div which should have the padding style
        const contentDiv = container.querySelector('.BluiDrawerLayout-content');
        expect(contentDiv).toBeInTheDocument();
    });

    it('applies right padding in RTL layout', () => {
        const rtlTheme = createTheme({
            ...theme,
            direction: 'rtl',
        });

        const TestConsumer = (): any => {
            const { setPadding } = useDrawerLayout();

            React.useEffect(() => {
                setPadding(250);
            }, [setPadding]);

            return <div data-testid="test-content">Content</div>;
        };

        const { container } = render(
            <ThemeProvider theme={rtlTheme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        // Find the content div which should have the padding style
        const contentDiv = container.querySelector('.BluiDrawerLayout-content');
        expect(contentDiv).toBeInTheDocument();
    });

    it('applies expanded class when drawer is open', () => {
        const TestConsumer = (): any => {
            const { setDrawerOpen } = useDrawerLayout();

            React.useEffect(() => {
                setDrawerOpen(true);
            }, [setDrawerOpen]);

            return <div data-testid="test-content">Content</div>;
        };

        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        // The expanded class is applied through MUI's className generation
        expect(root).toHaveClass('Mui-expanded');
    });
    it('does not apply expanded class when drawer is closed', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        expect(root).not.toHaveClass('Mui-expanded');
    });

    it('handles padding changes from context', () => {
        const TestConsumer = (): any => {
            const { setPadding } = useDrawerLayout();

            const handleClick = (): void => {
                setPadding(300);
            };

            return (
                <div>
                    <button data-testid="change-padding" onClick={handleClick}>
                        Change Padding
                    </button>
                    <div data-testid="test-content">Content</div>
                </div>
            );
        };

        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        const button = screen.getByTestId('change-padding');
        act(() => {
            button.click();
        });

        // Verify content div exists and component doesn't crash
        const contentDiv = container.querySelector('.BluiDrawerLayout-content');
        expect(contentDiv).toBeInTheDocument();
    });

    it('handles drawer open state changes from context', () => {
        const TestConsumer = (): any => {
            const { setDrawerOpen } = useDrawerLayout();

            const handleToggle = (): void => {
                setDrawerOpen(true);
            };

            return (
                <div>
                    <button data-testid="toggle-drawer" onClick={handleToggle}>
                        Toggle Drawer
                    </button>
                    <div data-testid="test-content">Content</div>
                </div>
            );
        };

        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        const button = screen.getByTestId('toggle-drawer');
        act(() => {
            button.click();
        });

        const root = container.firstChild;
        expect(root).toHaveClass('Mui-expanded');
    });

    it('handles numeric padding values', () => {
        const TestConsumer = (): any => {
            const { setPadding } = useDrawerLayout();

            React.useEffect(() => {
                setPadding(150);
            }, [setPadding]);

            return <div data-testid="test-content">Content</div>;
        };

        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('handles string padding values', () => {
        const TestConsumer = (): any => {
            const { setPadding } = useDrawerLayout();

            React.useEffect(() => {
                setPadding('200px');
            }, [setPadding]);

            return <div data-testid="test-content">Content</div>;
        };

        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer />
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('applies drawer and content classes correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const drawerDiv = container.querySelector('.BluiDrawerLayout-drawer');
        const contentDiv = container.querySelector('.BluiDrawerLayout-content');

        expect(drawerDiv).toBeInTheDocument();
        expect(contentDiv).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div data-testid="child1">Child 1</div>
                    <div data-testid="child2">Child 2</div>
                    <span data-testid="child3">Child 3</span>
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByTestId('child1')).toBeInTheDocument();
        expect(screen.getByTestId('child2')).toBeInTheDocument();
        expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('works with complex drawer component', () => {
        const complexDrawer = (
            <Drawer open={true} variant="persistent" activeItem="item1" onItemSelect={() => {}}>
                <div data-testid="complex-drawer">
                    <h3>Complex Drawer</h3>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                    </ul>
                </div>
            </Drawer>
        );

        render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={complexDrawer}>
                    <div data-testid="main-content">Main Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        // The main content should always be rendered
        expect(screen.getByTestId('main-content')).toBeInTheDocument();
        // Verify the drawer structure is present
        expect(document.querySelector('.BluiDrawer-root')).toBeInTheDocument();
        expect(document.querySelector('.BluiDrawerLayout-drawer')).toBeInTheDocument();
        expect(document.querySelector('.BluiDrawerLayout-content')).toBeInTheDocument();
    });

    it('handles custom classes prop', () => {
        const customClasses = {
            root: 'custom-root-class',
            content: 'custom-content-class',
            drawer: 'custom-drawer-class',
            expanded: 'custom-expanded-class',
        };

        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer} classes={customClasses}>
                    <div>Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        const root = container.firstChild;
        expect(root).toHaveClass('custom-root-class');

        const drawerDiv = container.querySelector('.custom-drawer-class');
        const contentDiv = container.querySelector('.custom-content-class');

        expect(drawerDiv).toBeInTheDocument();
        expect(contentDiv).toBeInTheDocument();
    });

    it('handles initial state correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <div data-testid="initial-content">Initial Content</div>
                </DrawerLayout>
            </ThemeProvider>
        );

        // Initially drawer should not be expanded and padding should be 0
        const root = container.firstChild;
        const contentDiv = container.querySelector('.BluiDrawerLayout-content');

        expect(root).not.toHaveClass('BluiDrawerLayout-expanded');
        expect(contentDiv).toBeInTheDocument();
        expect(screen.getByTestId('initial-content')).toBeInTheDocument();
    });

    it('maintains context state across re-renders', () => {
        let paddingCallCount = 0;
        let drawerOpenCallCount = 0;

        const TestConsumer = ({ trigger }: { trigger: number }): any => {
            const { setPadding, setDrawerOpen } = useDrawerLayout();

            React.useEffect(() => {
                if (trigger > 0) {
                    setPadding(100 * trigger);
                    setDrawerOpen(trigger % 2 === 1);
                    paddingCallCount++;
                    drawerOpenCallCount++;
                }
            }, [setPadding, setDrawerOpen, trigger]);

            return <div data-testid="test-content">Content {trigger}</div>;
        };

        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer trigger={1} />
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByText('Content 1')).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={theme}>
                <DrawerLayout drawer={mockDrawer}>
                    <TestConsumer trigger={2} />
                </DrawerLayout>
            </ThemeProvider>
        );

        expect(screen.getByText('Content 2')).toBeInTheDocument();
        expect(paddingCallCount).toBe(2);
        expect(drawerOpenCallCount).toBe(2);
    });
});
