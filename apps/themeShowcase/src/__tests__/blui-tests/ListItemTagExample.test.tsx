import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { ListItemTagExample } from '../../components/brightlayer-ui/data-display/ListItemTag';

describe('List item tag example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <ListItemTagExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
