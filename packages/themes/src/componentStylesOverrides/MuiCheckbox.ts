import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '.MuiFormControlLabel-root &:hover': {
                backgroundColor: 'transparent',
            },
            '&.MuiCheckbox-highlight': {
                backgroundColor: theme.vars.palette.action.highlight,
            },
            ...theme.applyStyles('light', {
                color: theme.vars.palette.action.active,
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiCheckbox'];
