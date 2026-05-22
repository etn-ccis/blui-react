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
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiRadio'];
