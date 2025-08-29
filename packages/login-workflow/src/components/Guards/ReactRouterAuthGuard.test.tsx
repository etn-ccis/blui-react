import React, { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactRouterAuthGuard } from './ReactRouterAuthGuard';
import { Box } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

describe('ReactRouterAuthGuard', () => {
    describe('when user is authenticated', () => {
        it('renders children when isAuthenticated is true', () => {
            render(
                <BrowserRouter>
                    <ReactRouterAuthGuard isAuthenticated={true} fallBackUrl="/login">
                        <Box>Test</Box>
                    </ReactRouterAuthGuard>
                </BrowserRouter>
            );

            expect(screen.getByText('Test')).toBeInTheDocument();
        });

        it('renders children without crashing when no children provided and user is authenticated', () => {
            render(
                <BrowserRouter>
                    <ReactRouterAuthGuard isAuthenticated={true} fallBackUrl="/login" />
                </BrowserRouter>
            );

            // Should not crash when no children are provided
            expect(screen.queryByText('Test')).not.toBeInTheDocument();
        });
    });
});