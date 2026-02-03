import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { blueThemes } from '@brightlayer-ui/react-themes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ComponentPreviewPage } from './pages/componentPreviewPage';
import { DrawerContext } from './contexts/drawerContextProvider';
import { store } from './redux/store';

test('renders welcome text', () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={blueThemes}>
                        <DrawerContext.Provider
                            value={{
                                drawerOpen: true,
                                setDrawerOpen: vitest.fn(),
                            }}
                        >
                            <ComponentPreviewPage title="App Bar" />
                        </DrawerContext.Provider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </Provider>
    );
    const bluiText = screen.getByText(/App Bar/i);
    expect(bluiText).toBeInTheDocument();
});
