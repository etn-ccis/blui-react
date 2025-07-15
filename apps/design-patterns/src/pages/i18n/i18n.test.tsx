import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18N } from '.';
import { Reducer } from '../../redux/reducers';
import { english } from './translations/english';
import { createTheme, ThemeProvider } from '@mui/material';
import * as BLUIThemes from '@brightlayer-ui/react-themes';
const theme = createTheme(BLUIThemes.blue);

const store = createStore(Reducer());

describe('I18N', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <I18N />
                </Provider>
            </ThemeProvider>
        );
    });

    it('should cancel selected items', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <I18N />
                </Provider>
            </ThemeProvider>
        );

        const firstCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(firstCheckbox);

        expect(screen.getByTestId('deselect-all-button')).toBeTruthy();
        fireEvent.click(screen.getByTestId('deselect-all-button'));

        expect(screen.getAllByTestId('infoListItem')).toHaveLength(
            Object.keys(english.translations.FRUITS).length
        );
        expect(firstCheckbox).not.toBeFalsy();
    });
});
