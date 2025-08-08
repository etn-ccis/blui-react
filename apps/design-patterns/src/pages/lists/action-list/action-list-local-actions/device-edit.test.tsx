import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { DeviceEdit } from './device-edit';
import { createStore } from 'redux';
import { Reducer } from '../../../../redux/reducers';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const store = createStore(Reducer());

describe('Action list local', () => {
    afterEach(cleanup);
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <DeviceEdit
                        open={false}
                        handleClose={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                        subTitle={''}
                        updateSubTitle={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                </Provider>
            </ThemeProvider>
        );
    });
});
