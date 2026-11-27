import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        colorPrimary: ({ theme }) => ({
            backgroundColor: BLUIColors.blue[100],
            ...theme.applyStyles('dark', {
                backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.7)`,
            }),
        }),
        colorSecondary: ({ theme }) => ({
            backgroundColor: BLUIColors.lightBlue[100],
            ...theme.applyStyles('dark', {
                backgroundColor: `rgba(${theme.vars.palette.secondary.darkChannel} / 0.7)`,
            }),
        }),
        dashed: ({ theme }) => ({
            variants: [
                {
                    props: { color: 'primary' },
                    style: theme.applyStyles('dark', {
                        backgroundImage: `radial-gradient(rgba(${theme.vars.palette.primary.mainChannel} / 0.5) 0%, rgba(${theme.vars.palette.primary.mainChannel} / 0.7) 16%, transparent 42%)`,
                    }),
                },
                {
                    props: { color: 'secondary' },
                    style: theme.applyStyles('dark', {
                        backgroundImage: `radial-gradient(rgba(${theme.vars.palette.secondary.darkChannel} / 0.5) 0%, rgba(${theme.vars.palette.secondary.darkChannel} / 0.7) 16%, transparent 42%)`,
                    }),
                },
            ],
        }),
        bar: ({ theme }) => ({
            variants: [
                {
                    props: { color: 'primary' },
                    style: theme.applyStyles('dark', {
                        backgroundColor: theme.vars.palette.primary.main,
                    }),
                },
                {
                    props: { color: 'secondary' },
                    style: theme.applyStyles('dark', {
                        backgroundColor: theme.vars.palette.secondary.dark,
                    }),
                },
            ],
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiLinearProgress'];
