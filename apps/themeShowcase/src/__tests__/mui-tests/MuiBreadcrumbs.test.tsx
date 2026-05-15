import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { BreadcrumbsExample } from '../../components/material-ui/navigation/Breadcrumbs';

describe('Channel value example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <BreadcrumbsExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
