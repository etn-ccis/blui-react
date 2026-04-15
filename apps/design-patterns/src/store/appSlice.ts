import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
    drawerOpen: boolean;
};

const initialState: AppState = {
    drawerOpen: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        drawerToggled: (state, action: PayloadAction<boolean>) => {
            state.drawerOpen = action.payload;
        },
    },
});

export const { drawerToggled } = appSlice.actions;
export default appSlice.reducer;
