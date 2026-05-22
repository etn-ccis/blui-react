import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: {
            width: 'var(--blui-normal-icon, 32px)',
            height: 'var(--blui-normal-icon, 32px)',
            margin: '16px',
            '& svg': {
                width: 'var(--blui-normal-icon, 32px)',
                height: 'var(--blui-normal-icon, 32px)',
            },
        },
        colorPrimary: ({ theme }: { theme: Theme }) => ({
            color: theme.vars.palette.primary.main,
        }),
        colorSecondary: ({ theme }: { theme: Theme }) => ({
            color: theme.vars.palette.secondary.main,
        }),
        colorSuccess: ({ theme }: { theme: Theme }) => ({
            color: theme.vars.palette.success.main,
        }),
        colorWarning: ({ theme }: { theme: Theme }) => ({
            color: theme.vars.palette.warning.main,
        }),
        colorError: ({ theme }: { theme: Theme }) => ({
            color: theme.vars.palette.error.main,
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiRadio'];
