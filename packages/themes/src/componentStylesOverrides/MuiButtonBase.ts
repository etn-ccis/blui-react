import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&.MuiPickersDay-root': {
                backgroundColor: 'transparent',
                '&.Mui-selected': {
                    backgroundColor: theme.vars.palette.primary.main,
                },
                '&.Mui-selected.Mui-focusVisible': {
                    backgroundColor: theme.vars.palette.primary.main,
                },
                '&.Mui-selected:focus': {
                    backgroundColor: theme.vars.palette.primary.main,
                },
                '&.Mui-selected:hover': {
                    backgroundColor: theme.vars.palette.primary.main,
                },
            },
            '&.MuiPickersArrowSwitcher-button': {
                color: theme.vars.palette.primary.main,
            },
            '&.MuiMenuItem-root': {
                '&.Mui-selected': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&.Mui-selected:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiButtonBase'];
