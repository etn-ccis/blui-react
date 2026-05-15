import React, { createContext, useContext, useReducer, type Dispatch } from 'react';

// ---------- State shape ----------
export type AppState = {
    direction: 'ltr' | 'rtl';
    drawerOpen: boolean;
    pageTitle: string;
};

const initialState: AppState = {
    direction: 'ltr',
    drawerOpen: true,
    pageTitle: 'Showcase',
};

// ---------- Actions ----------
export type AppAction =
    | { type: 'CHANGE_PAGE_TITLE'; payload: string }
    | { type: 'OPEN_DRAWER' }
    | { type: 'CLOSE_DRAWER' }
    | { type: 'TOGGLE_DRAWER' }
    | { type: 'SET_DIR_LTR' }
    | { type: 'SET_DIR_RTL' }
    | { type: 'TOGGLE_DIR' };

// ---------- Reducer ----------
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'CHANGE_PAGE_TITLE':
            return { ...state, pageTitle: action.payload };
        case 'OPEN_DRAWER':
            return { ...state, drawerOpen: true };
        case 'CLOSE_DRAWER':
            return { ...state, drawerOpen: false };
        case 'TOGGLE_DRAWER':
            return { ...state, drawerOpen: !state.drawerOpen };
        case 'SET_DIR_LTR':
            return { ...state, direction: 'ltr' };
        case 'SET_DIR_RTL':
            return { ...state, direction: 'rtl' };
        case 'TOGGLE_DIR':
            return { ...state, direction: state.direction === 'ltr' ? 'rtl' : 'ltr' };
        default:
            return state;
    }
}

// ---------- Split Contexts (prevents cascading re-renders) ----------
const DirectionContext = createContext<'ltr' | 'rtl' | undefined>(undefined);
const DrawerContext = createContext<boolean | undefined>(undefined);
const PageTitleContext = createContext<string | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

// ---------- Provider ----------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppDispatchContext.Provider value={dispatch}>
            <DirectionContext.Provider value={state.direction}>
                <DrawerContext.Provider value={state.drawerOpen}>
                    <PageTitleContext.Provider value={state.pageTitle}>{children}</PageTitleContext.Provider>
                </DrawerContext.Provider>
            </DirectionContext.Provider>
        </AppDispatchContext.Provider>
    );
};

// ---------- Granular Hooks ----------
function useRequiredContext<T>(context: React.Context<T | undefined>, name: string): T {
    const value = useContext(context);
    if (value === undefined) {
        throw new Error(`${name} must be used within an <AppProvider>`);
    }
    return value;
}

export const useDirection = (): 'ltr' | 'rtl' => useRequiredContext(DirectionContext, 'useDirection');
export const useDrawerOpen = (): boolean => useRequiredContext(DrawerContext, 'useDrawerOpen');
export const useCurrentPageTitle = (): string => useRequiredContext(PageTitleContext, 'useCurrentPageTitle');
export const useAppDispatch = (): Dispatch<AppAction> => useRequiredContext(AppDispatchContext, 'useAppDispatch');

// ---------- Convenience (reads all — use sparingly) ----------
export const useAppState = (): AppState => ({
    direction: useDirection(),
    drawerOpen: useDrawerOpen(),
    pageTitle: useCurrentPageTitle(),
});
