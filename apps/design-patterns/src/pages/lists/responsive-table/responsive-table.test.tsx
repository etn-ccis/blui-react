import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ResponsiveTable } from '.';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { createTheme, ThemeProvider } from '@mui/material';
import * as BLUIThemes from '@brightlayer-ui/react-themes';
const theme = createTheme(BLUIThemes.blue);

const store = createStore(Reducer());

describe('Responsive table', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ResponsiveTable />
                </Provider>
            </ThemeProvider>
        );
    });
});
