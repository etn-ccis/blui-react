import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { Dashboard } from '../../pages/contextual-page-templates/Dashboard';

describe('App bar example', () => {
    afterEach(cleanup);
    test('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <Dashboard />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
