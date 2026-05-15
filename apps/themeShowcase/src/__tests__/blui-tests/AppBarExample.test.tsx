import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { BLUIAppBarExample } from '../../components/brightlayer-ui/surfaces/AppBar';

describe('App bar example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <BLUIAppBarExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
