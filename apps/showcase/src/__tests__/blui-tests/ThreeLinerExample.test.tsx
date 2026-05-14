import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { RTLThemeProvider } from '../../components/RTLProvider';
import { ThreeLinerExample } from '../../components/brightlayer-ui/data-display/ThreeLiner';

describe('Three liner example', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <AppProvider>
                <RTLThemeProvider>
                    <CssBaseline />
                    <ThreeLinerExample />
                </RTLThemeProvider>
            </AppProvider>
        );
    });
});
