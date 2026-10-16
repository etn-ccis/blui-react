import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
                '& .MuiFormControlLabel-label': {
                    color: theme.vars.palette.action.disabled,
                },
                '& .MuiCheckbox-root, & .MuiRadio-root': {
                    color: theme.vars.palette.action.disabled,
                },
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFormControlLabel'];
