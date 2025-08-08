import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { TreeStructureList } from '.';
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
                <TreeStructureList />
            </Provider>
        </ThemeProvider>
    );

describe('Action list with button panel', () => {
    afterEach(cleanup);
    it('should render', () => {
        createRenderer();
        expect(screen.getByText('Tree Structure')).toBeInTheDocument();
        expect(screen.getByText('Folder Structure')).toBeInTheDocument();
    });
});
