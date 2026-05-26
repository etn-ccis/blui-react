import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level1,
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiCard'];
