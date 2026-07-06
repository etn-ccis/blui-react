import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { InfoListItemExample } from '../../components/brightlayer-ui/data-display/InfoListItem';

describe('Info list item example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <InfoListItemExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
