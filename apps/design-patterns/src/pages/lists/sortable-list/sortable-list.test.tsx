import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { SortableList } from '.';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());
const createRenderer = (): any =>
    render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <SortableList />
            </Provider>
        </ThemeProvider>
    );

describe('Sortable List', () => {
    afterEach(cleanup);
    it('should render', () => {
        createRenderer();
        expect(screen.getByText('Sortable List')).toBeTruthy();
    });

    it('should render all the list items', () => {
        createRenderer();
        expect(screen.getByTestId('list')).toBeTruthy();
        expect(screen.getAllByTestId('infoListItem').length).toBe(3);
    });

    it('should display Sort button, when not sorting', () => {
        createRenderer();
        expect(screen.getByText('Sort')).toBeTruthy();
        expect(screen.queryByText('Done')).toBeNull();
    });
});
