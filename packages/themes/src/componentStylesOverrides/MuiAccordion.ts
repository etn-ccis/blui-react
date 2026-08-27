import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&.Mui-expanded + .MuiAccordion-root:not(.Mui-expanded)': {
                borderTop: 0,
            },
            '&.Mui-expanded + .MuiAccordion-root:not(.Mui-expanded)::before': {
                display: 'none',
            },
            '&.Mui-disabled .MuiAccordionSummary-root': {
                opacity: 1,
                color: theme.vars.palette.action.disabled,
            },
            '&.Mui-disabled .MuiAccordionSummary-content': {
                color: theme.vars.palette.action.disabled,
            },
            '&.Mui-disabled .MuiAccordionSummary-content .MuiTypography-root': {
                color: theme.vars.palette.action.disabled,
            },
            '&.Mui-disabled .MuiAccordionSummary-expandIconWrapper': {
                opacity: 1,
                color: theme.vars.palette.action.disabled,
            },
            '&.Mui-disabled .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
                color: theme.vars.palette.action.disabled,
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiAccordion'];
