import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        underline: ({ theme }) => ({
            '&:before': {
                borderBottomColor: theme.vars.palette.divider,
            },
            '&:not(.Mui-disabled):not(.Mui-error):hover:before': {
                borderBottomWidth: 1,
                borderBottomColor: BLUIColors.black[500],
            },
            '&.Mui-disabled:before': {
                borderBottomColor: theme.vars.palette.divider,
                borderBottomStyle: 'solid',
            },
            '&.Mui-error:not(.Mui-focused):after': {
                borderBottomWidth: 1,
                borderBottomColor: theme.vars.palette.error.main,
            },
            '&.Mui-error.Mui-focused:after': {
                borderBottomColor: theme.vars.palette.error.main,
            },
            '&.Mui-error:not(.Mui-focused)&:hover:after': {
                borderBottomColor: theme.vars.palette.error.main,
            },
            ...theme.applyStyles('dark', {
                '&:before': {
                    borderBottomColor: theme.vars.palette.divider,
                },
                '&:not(.Mui-disabled):not(.Mui-error):hover:before': {
                    borderBottomWidth: 1,
                    borderBottomColor: BLUIColors.black[200],
                },
                '&:after': {
                    borderBottomColor: theme.vars.palette.primary.main,
                },
                '&.Mui-error.Mui-focused:after': {
                    borderBottomColor: theme.vars.palette.error.dark,
                },
                '&.Mui-error:not(.Mui-focused):after': {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.vars.palette.error.dark,
                },
                '&.Mui-error:not(.Mui-focused):hover:after': {
                    borderBottomColor: theme.vars.palette.error.dark,
                },
                '&.MuiInput-colorSecondary:not(.Mui-error):after': {
                    borderBottomColor: theme.vars.palette.secondary.dark,
                },
                '&.Mui-disabled:before': {
                    borderBottomColor: theme.vars.palette.divider,
                    borderBottomStyle: 'solid',
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiInput'];
