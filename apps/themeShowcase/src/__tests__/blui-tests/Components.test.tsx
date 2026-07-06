import '@testing-library/jest-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '../../contexts/AppContext';
import renderer from 'react-test-renderer';
import { RTLThemeProvider } from '../../components/RTLProvider';
import * as components from '../../components/brightlayer-ui/data-display/index';

Object.keys(components).forEach((componentName) => {
    const Component = components[componentName as keyof typeof components];
    describe(`Component: ${componentName}`, () => {
        test(`${componentName} renders examples correctly`, () => {
            const tree = renderer
                .create(
                    <AppProvider>
                        <RTLThemeProvider>
                            <CssBaseline />
                            <Component />
                        </RTLThemeProvider>
                    </AppProvider>
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
