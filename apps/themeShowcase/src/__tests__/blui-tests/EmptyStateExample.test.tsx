import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { EmptyStateExample } from '../../components/brightlayer-ui/data-display/EmptyState';

describe('Empty state example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <EmptyStateExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
