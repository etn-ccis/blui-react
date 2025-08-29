import React, { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactRouterGuestGuard } from './ReactRouterGuestGuard';
import { Box } from '@mui/material';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Mock Navigate component to capture navigation calls
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
        mockNavigate(to, { replace });
        return <div data-testid="navigate-mock">{`Navigating to: ${to}`}</div>;
    },
}));

describe('ReactRouterGuestGuard', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    describe('when user is not authenticated', () => {
        it('renders children when isAuthenticated is false', () => {
            render(
                <BrowserRouter>
                    <ReactRouterGuestGuard isAuthenticated={false} fallBackUrl="/login">
                        <Box>Test Content</Box>
                    </ReactRouterGuestGuard>
                </BrowserRouter>
            );

            expect(screen.getByText('Test Content')).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('renders null when isAuthenticated is false and no children provided', () => {
            render(
                <BrowserRouter>
                    <ReactRouterGuestGuard isAuthenticated={false} fallBackUrl="/login" />
                </BrowserRouter>
            );

            // Should not show any content or navigation
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('when user is authenticated', () => {
        it('redirects to fallBackUrl when isAuthenticated is true and no previous location', () => {
            render(
                <MemoryRouter>
                    <ReactRouterGuestGuard isAuthenticated={true} fallBackUrl="/dashboard">
                        <Box>Test Content</Box>
                    </ReactRouterGuestGuard>
                </MemoryRouter>
            );

            expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Navigating to: /dashboard');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });

        it('redirects to previous location when isAuthenticated is true and location.state.from exists', () => {
            render(
                <MemoryRouter initialEntries={[{ pathname: '/guest-page', state: { from: '/protected-page' } }]}>
                    <ReactRouterGuestGuard isAuthenticated={true} fallBackUrl="/dashboard">
                        <Box>Test Content</Box>
                    </ReactRouterGuestGuard>
                </MemoryRouter>
            );

            expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Navigating to: /protected-page');
            expect(mockNavigate).toHaveBeenCalledWith('/protected-page', { replace: true });
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });

        it('redirects with replace:true when isAuthenticated is true', () => {
            render(
                <MemoryRouter>
                    <ReactRouterGuestGuard isAuthenticated={true} fallBackUrl="/home">
                        <Box>Test Content</Box>
                    </ReactRouterGuestGuard>
                </MemoryRouter>
            );

            expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
        });
    });
});
