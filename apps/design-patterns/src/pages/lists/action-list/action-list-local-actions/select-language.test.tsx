import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { LanguageSelect } from './select-language';
import { createStore } from 'redux';
import { Reducer } from '../../../../redux/reducers';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import * as BLUIThemes from '@brightlayer-ui/react-themes';
const theme = createTheme(BLUIThemes.blue);

const store = createStore(Reducer());

describe('Local action scorecard', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <LanguageSelect
                        language={''}
                        updateLanguage={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                </Provider>
            </ThemeProvider>
        );
    });
});
