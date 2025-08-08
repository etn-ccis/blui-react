import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ContextualAction } from '.';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

describe('Contextual action appbar', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ContextualAction />
                </Provider>
            </ThemeProvider>
        );
    });
});
