import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Reducer } from '../../redux/reducers';
import { DynamicStepper } from '.';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

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
