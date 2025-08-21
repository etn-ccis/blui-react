/**
 Copyright (c) 2021-present, Eaton

 All rights reserved.

 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@brightlayer-ui/react-themes/open-sans';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Reducer } from './redux/reducers';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Provider store={store}>
                    <CssBaseline />
                    <App />
                </Provider>
            </BrowserRouter>
        </ThemeProvider>
    </StyledEngineProvider>
);
