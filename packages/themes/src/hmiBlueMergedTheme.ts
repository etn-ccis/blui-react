import { createTheme } from '@mui/material';
import { typography } from './shared';
import { hmiComponentOverrides } from './hmiTheme/hmiComponents';
import { HmiLightThemeColors, HmiDarkThemeColors } from './hmiTheme/hmiBlueColorScheme';

const Spacing = 8;

export const blueThemes = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    direction: 'ltr',
    typography: typography,
    spacing: Spacing,
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                ...HmiLightThemeColors,
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                ...HmiDarkThemeColors,
            },
        },
    },
    components: hmiComponentOverrides,
});
