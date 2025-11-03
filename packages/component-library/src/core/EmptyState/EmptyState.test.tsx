import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from './EmptyState';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

describe('EmptyState', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState
                    icon={<PersonIcon />}
                    title="Test"
                    description="Test Description"
                    actions={<Button> Test </Button>}
                />
            </ThemeProvider>
        );
    });

    it('renders root empty state', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeTruthy();
    });

    it('renders with icon', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('PersonIcon')).toBeTruthy();
    });

    it('renders with text', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" description="Test Description" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('renders with actions', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState
                    icon={<PersonIcon />}
                    title="Test"
                    description="Test Description"
                    actions={<Button> Test </Button>}
                />
            </ThemeProvider>
        );
        expect(screen.getByRole('button', { name: /test/i })).toBeTruthy();
    });

    // NEW TESTS TO IMPROVE BRANCH COVERAGE

    it('renders without optional description', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test Only" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test Only')).toBeTruthy();
        expect(screen.queryByText('Test Description')).toBeNull();
    });

    it('renders without optional actions', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" description="Description Only" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Description Only')).toBeTruthy();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('renders title as ReactNode instead of string', () => {
        const titleElement = <span data-testid="custom-title">Custom Title</span>;
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title={titleElement as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-title')).toBeInTheDocument();
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders description as ReactNode instead of string', () => {
        const descriptionElement = <span data-testid="custom-description">Custom Description</span>;
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" description={descriptionElement as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('custom-description')).toBeInTheDocument();
        expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('renders with custom classes', () => {
        const customClasses = {
            root: 'custom-root-class',
            icon: 'custom-icon-class',
            title: 'custom-title-class',
            description: 'custom-description-class',
            actions: 'custom-actions-class',
        };

        render(
            <ThemeProvider theme={theme}>
                <EmptyState
                    icon={<PersonIcon />}
                    title="Test"
                    description="Test Description"
                    actions={<Button>Test Action</Button>}
                    classes={customClasses}
                />
            </ThemeProvider>
        );

        const root = screen.getByTestId('blui-empty-state-root');
        expect(root).toHaveClass('custom-root-class');
    });

    it('handles undefined icon correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={null as any} title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles undefined title correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title={null as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeInTheDocument();
        expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    });

    it('handles undefined description correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" description={null as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles undefined actions correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={<PersonIcon />} title="Test" actions={null as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('renders with all props empty/null to test all conditional branches', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState icon={null as any} title={null as any} description={null as any} actions={null as any} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-empty-state-root')).toBeInTheDocument();
    });

    it('renders with additional props to test BoxProps inheritance', () => {
        render(
            <ThemeProvider theme={theme}>
                <EmptyState
                    icon={<PersonIcon />}
                    title="Test"
                    id="test-id"
                    className="test-class"
                    style={{ marginTop: '20px' }}
                    data-testid="custom-root"
                />
            </ThemeProvider>
        );
        const root = screen.getByTestId('custom-root');
        expect(root).toHaveAttribute('id', 'test-id');
        expect(root).toHaveClass('test-class');
        expect(root).toHaveStyle('margin-top: 20px');
    });

    it('renders correctly with dark theme to test theme.applyStyles branches', () => {
        const darkTheme = createTheme({
            palette: {
                mode: 'dark',
                text: {
                    primary: '#ffffff',
                    secondary: '#aaaaaa',
                },
            },
        });
        render(
            <ThemeProvider theme={darkTheme}>
                <EmptyState icon={<PersonIcon />} title="Dark Theme Test" description="This tests dark theme styling" />
            </ThemeProvider>
        );
        expect(screen.getByText('Dark Theme Test')).toBeInTheDocument();
        expect(screen.getByText('This tests dark theme styling')).toBeInTheDocument();
    });
});
