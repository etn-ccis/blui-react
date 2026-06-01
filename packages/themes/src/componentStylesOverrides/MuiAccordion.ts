import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: () => ({
            '&.Mui-expanded + .MuiAccordion-root:not(.Mui-expanded)': {
                borderTop: 0,
            },
            '&.Mui-expanded + .MuiAccordion-root:not(.Mui-expanded)::before': {
                display: 'none',
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiAccordion'];
