/**
 Copyright (c) 2021-present, Eaton

 All rights reserved.

 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import './index.css';
import { MainRouter } from './router';
import { store } from './redux/store';
import { RTLThemeProvider } from './components/RTLProvider';
import '@brightlayer-ui/react-themes/open-sans';

const container = document.getElementById('root');

const root = createRoot(container!);
/* eslint-disable */
declare global {
    namespace React {
        interface DOMAttributes<T> {
            component?: string | undefined;
            disabled?: string | undefined;
            selected?: string | undefined;
            placeholder?: string | undefined;
            onPointerEnterCapture?: string | undefined;
            onPointerLeaveCapture?: string | undefined;
        }
    }
}

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RTLThemeProvider>
                <CssBaseline />
                <MainRouter />
            </RTLThemeProvider>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
