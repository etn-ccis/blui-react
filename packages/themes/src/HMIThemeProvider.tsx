import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { blueThemes } from './hmiBlueMergedTheme';
import GlobalSizeVariables from './hmiTheme/GlobalSizeVariables';

type HMIThemeProviderProps = {
    size?: string;
    mode?: 'light' | 'dark';
    theme?: object;
    children: React.ReactNode;
};

const HMIThemeProvider: React.FC<HMIThemeProviderProps> = ({
    size = 's',
    mode = 'light',
    theme = blueThemes,
    children,
}) => (
    <div data-size={size}>
        <ThemeProvider key={mode} theme={theme} defaultMode={mode}>
            <CssBaseline />
            <GlobalSizeVariables />
            {children}
        </ThemeProvider>
    </div>
);

export default HMIThemeProvider;
