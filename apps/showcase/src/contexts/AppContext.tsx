import React, { createContext, useContext, useMemo, useReducer, type Dispatch } from 'react';

// ---------- State shape ----------
export type AppState = {
    theme: 'light' | 'dark';
    direction: 'ltr' | 'rtl';
    drawerOpen: boolean;
    pageTitle: string;
};

const initialState: AppState = {
    theme: 'light',
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
    | { type: 'SET_LIGHT_THEME' }
    | { type: 'SET_DARK_THEME' }
    | { type: 'TOGGLE_THEME' }
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
        case 'SET_LIGHT_THEME':
            return { ...state, theme: 'light' };
        case 'SET_DARK_THEME':
            return { ...state, theme: 'dark' };
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
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
const DirectionContext = createContext<'ltr' | 'rtl'>('ltr');
const DrawerContext = createContext<boolean>(true);
const PageTitleContext = createContext<string>('Showcase');
const ThemeContext = createContext<'light' | 'dark'>('light');
const AppDispatchContext = createContext<Dispatch<AppAction>>(() => {});

// ---------- Provider ----------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Memoize dispatch so it never causes re-renders on its own
    const stableDispatch = useMemo(() => dispatch, []);

    return (
        <AppDispatchContext.Provider value={stableDispatch}>
            <DirectionContext.Provider value={state.direction}>
                <DrawerContext.Provider value={state.drawerOpen}>
                    <PageTitleContext.Provider value={state.pageTitle}>
                        <ThemeContext.Provider value={state.theme}>{children}</ThemeContext.Provider>
                    </PageTitleContext.Provider>
                </DrawerContext.Provider>
            </DirectionContext.Provider>
        </AppDispatchContext.Provider>
    );
};

// ---------- Granular Hooks ----------
export const useDirection = (): 'ltr' | 'rtl' => useContext(DirectionContext);
export const useDrawerOpen = (): boolean => useContext(DrawerContext);
export const usePageTitle = (): string => useContext(PageTitleContext);
export const useThemeMode = (): 'light' | 'dark' => useContext(ThemeContext);
export const useAppDispatch = (): Dispatch<AppAction> => useContext(AppDispatchContext);

// ---------- Convenience (reads all — use sparingly) ----------
export const useAppState = (): AppState => ({
    direction: useDirection(),
    drawerOpen: useDrawerOpen(),
    pageTitle: usePageTitle(),
    theme: useThemeMode(),
});
