import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MultiselectList } from '.';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Reducer } from '../../../redux/reducers';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

const createRenderer = (): any =>
    render(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <MultiselectList />
            </Provider>
        </ThemeProvider>
    );

describe('Multiselect List', () => {
    afterEach(cleanup);
    it('should render', () => {
        createRenderer();
        expect(screen.getByText('Multiselect List')).toBeInTheDocument();
    });

    it('should render 5 items by default', () => {
        createRenderer();
        expect(screen.getAllByTestId('infoListItem').length).toBe(5);
    });
});
