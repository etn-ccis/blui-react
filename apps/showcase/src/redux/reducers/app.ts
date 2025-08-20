import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../../__types__';

const initialState: AppState = {
    theme: 'light',
    direction: 'ltr',
    drawerOpen: true,
    pageTitle: 'Showcase',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        changePageTitle(state, action: PayloadAction<string>) {
            state.pageTitle = action.payload;
        },
        openDrawer(state) {
            state.drawerOpen = true;
        },
        closeDrawer(state) {
            state.drawerOpen = false;
        },
        toggleDrawer(state) {
            state.drawerOpen = !state.drawerOpen;
        },
        setLightTheme(state) {
            state.theme = 'light';
        },
        setDarkTheme(state) {
            state.theme = 'dark';
        },
        toggleTheme(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setDirLtr(state) {
            state.direction = 'ltr';
        },
        setDirRtl(state) {
            state.direction = 'rtl';
        },
        toggleDir(state) {
            state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr';
        },
    },
});

export const {
    changePageTitle,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setLightTheme,
    setDarkTheme,
    toggleTheme,
    setDirLtr,
    setDirRtl,
    toggleDir,
} = appSlice.actions;

export const AppReducer = appSlice.reducer;
