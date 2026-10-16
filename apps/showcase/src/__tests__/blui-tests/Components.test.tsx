import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import { render } from '@testing-library/react';
import { RTLThemeProvider } from '../../components/RTLProvider';
import * as components from '../../components/brightlayer-ui/data-display/index';

Object.keys(components).forEach((componentName) => {
    const Component = components[componentName as keyof typeof components];
    describe(`Component: ${componentName}`, () => {
        test(`${componentName} renders examples correctly`, () => {
            const { asFragment } = render(
                <AppProvider>
                    <RTLThemeProvider>
                        <CssBaseline />
                        <Component />
                    </RTLThemeProvider>
                </AppProvider>
            );
            expect(asFragment()).toMatchSnapshot();
        });
    });
});
