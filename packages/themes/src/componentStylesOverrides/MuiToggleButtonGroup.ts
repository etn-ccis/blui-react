import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            '&.MuiToggleButtonGroup-horizontal > .MuiToggleButtonGroup-grouped:not(:first-child)': {
                marginLeft: 0,
            },
            '&.MuiToggleButtonGroup-vertical > .MuiToggleButtonGroup-grouped:not(:first-child)': {
                marginTop: 0,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.background.paper,
                '&.MuiToggleButtonGroup-horizontal > .MuiToggleButtonGroup-grouped:not(:first-child)': {
                    marginLeft: 0,
                },
                '&.MuiToggleButtonGroup-vertical > .MuiToggleButtonGroup-grouped:not(:first-child)': {
                    marginTop: 0,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiToggleButtonGroup'];
