import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { ActionList } from '.';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

describe('Action list', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ActionList />
                </Provider>
            </ThemeProvider>
        );
    });

    it('renders 10 items by default', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ActionList />
                </Provider>
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('infoListItem')).toHaveLength(10);
    });

    it('adds an item correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ActionList />
                </Provider>
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('infoListItem')).toHaveLength(10);
        fireEvent.click(screen.getByTestId('add-item-button'));
        expect(screen.getAllByTestId('infoListItem')).toHaveLength(11);
    });

    it('removes all and clears the list', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ActionList />
                </Provider>
            </ThemeProvider>
        );
        expect(screen.getAllByTestId('infoListItem')).toHaveLength(10);
        fireEvent.click(screen.getByTestId('remove-all-button'));
        expect(screen.queryAllByTestId('infoListItem')).toHaveLength(0);
    });
});
