import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { InAnAppBar } from '.';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

describe('Menu in an AppBar', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <InAnAppBar />
                </Provider>
            </ThemeProvider>
        );
    });
});
