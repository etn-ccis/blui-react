import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Reducer } from '../../redux/reducers';
import { DynamicStepper } from '.';
import { createTheme, ThemeProvider } from '@mui/material';
import * as BLUIThemes from '@brightlayer-ui/react-themes';
const theme = createTheme(BLUIThemes.blue);

const store = createStore(Reducer());

describe('Dynamic stepper', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <DynamicStepper />
                </Provider>
            </ThemeProvider>
        );
    });

    it('should display Add a Step and Done button', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <DynamicStepper />
                </Provider>
            </ThemeProvider>
        );

        expect(screen.getAllByRole('button', { name: /step/i })).toHaveLength(2);
    });
});
