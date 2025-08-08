import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';

import { SearchBar, searchResults } from '.';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

describe('Search bar', () => {
    afterEach(cleanup);
    it('renders without crashing', (): void => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <SearchBar />
                </Provider>
            </ThemeProvider>
        );
    });

    it('returns the correct number of results when the query string matches', (): void => {
        const queries = [
            { text: 'e', results: 5 },
            { text: 'apple', results: 2 },
            { text: 'watermelon', results: 1 },
            { text: 'pear', results: 0 },
        ];
        queries.forEach(({ text }, index): void => {
            expect(searchResults(text).length).toBe(
                //@ts-ignore
                queries[index].results
            );
        });
    });
});
