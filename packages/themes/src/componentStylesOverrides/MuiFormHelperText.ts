import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
            },
            '&.Mui-error': {
                color: theme.vars.palette.error.main,
            },
            ...theme.applyStyles('dark', {
                '&.Mui-error': {
                    color: theme.vars.palette.error.dark,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFormHelperText'];
