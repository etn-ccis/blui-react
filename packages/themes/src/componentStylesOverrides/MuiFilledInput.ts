import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: Color(BLUIColors.textFieldContainer).alpha(0.2).string(),
            '&:hover': {
                '@media (hover: none)': {
                    backgroundColor: BLUIColors.white[400],
                },
                backgroundColor: BLUIColors.white[400],
            },
            '&.Mui-focused': {
                backgroundColor: Color(BLUIColors.textFieldContainer).alpha(0.2).string(),
            },
            '&.Mui-disabled': {
                color: `rgba(${theme.vars.palette.text.primary} / 0.3)`,
                backgroundColor: BLUIColors.white[100],
                pointerEvents: 'none',
            },
            ...theme.applyStyles('dark', {
                backgroundColor: Color(BLUIColors.textFieldContainer).alpha(0.1).string(),
                '&:hover': {
                    backgroundColor: BLUIColors.black[600],
                },
                '&.Mui-focused': {
                    backgroundColor: Color(BLUIColors.textFieldContainer).alpha(0.1).string(),
                },
                '&.Mui-disabled': {
                    color: theme.vars.palette.text.disabled,
                    backgroundColor: Color(BLUIColors.black[800]).alpha(0.5).string(),
                    pointerEvents: 'none',
                },
            }),
        }),
        input: ({ theme }) => ({
            '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 30px ${theme.vars.palette.background.default} inset`,
            },
            ...theme.applyStyles('dark', {
                '&:-webkit-autofill': {
                    WebkitBoxShadow: `0 0 0 100px ${BLUIColors.black[800]} inset`,
                },
            }),
        }),
        underline: ({ theme }) => ({
            '&:before': {
                borderBottomColor: theme.vars.palette.divider,
            },
            '&.Mui-error:not(.Mui-focused):after': {
                borderBottomWidth: 1,
            },
            '&.Mui-disabled:before': {
                borderBottomColor: theme.vars.palette.divider,
                borderBottomStyle: 'solid',
            },
            ...theme.applyStyles('dark', {
                '&:before': {
                    borderBottomColor: theme.vars.palette.divider,
                },
                '&:after': {
                    borderBottomColor: theme.vars.palette.primary.dark,
                },
                '&.Mui-error.Mui-focused:after': {
                    borderBottomColor: theme.vars.palette.error.dark,
                },
                '&.Mui-error:not(.Mui-focused):after': {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.vars.palette.error.dark,
                },
                '&.Mui-error:not(.Mui-focused):hover:after': {
                    borderBottomColor: theme.vars.palette.error.main,
                },
                '&.Mui-disabled:before': {
                    borderBottomStyle: 'solid',
                },
                '&.MuiFilledInput-colorSecondary:not(.Mui-error):after': {
                    borderBottomColor: theme.vars.palette.secondary.dark,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFilledInput'];
