import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            borderColor: theme.vars.palette.divider,
            '&::before': {
                backgroundColor: theme.vars.palette.divider,
            },
            '&.Mui-expanded': {
                borderColor: theme.vars.palette.divider,
                '&::before': {
                    opacity: 0,
                },
            },
            '&:first-of-type': {
                '&::before': {
                    display: 'none',
                },
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiAccordion'];
