import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import Color from 'color';

const TextFieldContainerLight = Color(BLUIColors.textFieldContainer).alpha(0.2).string();
const TextFieldContainerDark = Color(BLUIColors.textFieldContainer).alpha(0.1).string();

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: TextFieldContainerLight,
            '&:hover': {
                '@media (hover: none)': {
                    backgroundColor: BLUIColors.white[400],
                },
                backgroundColor: BLUIColors.white[400],
            },
            '&.Mui-focused': {
                backgroundColor: TextFieldContainerLight,
            },
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
                backgroundColor: theme.vars.palette.action.disabledBackground,
                pointerEvents: 'none',
            },
            ...theme.applyStyles('dark', {
                backgroundColor: TextFieldContainerDark,
                '&:hover': {
                    backgroundColor: BLUIColors.black[600],
                },
                '&.Mui-focused': {
                    backgroundColor: TextFieldContainerDark,
                },
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    pointerEvents: 'none',
                },
            }),
        }),
        input: ({ theme }) => ({
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
                WebkitTextFillColor: theme.vars.palette.action.disabled,
            },
            '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 30px ${theme.vars.palette.background.default} inset`,
            },
            ...theme.applyStyles('dark', {
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                    WebkitTextFillColor: theme.vars.palette.action.disabled,
                },
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
                    borderBottomColor: theme.vars.palette.primary.main,
                },
                '&.Mui-error.Mui-focused:after': {
                    borderBottomColor: BLUIColors.red[300],
                },
                '&.Mui-error:not(.Mui-focused):after': {
                    borderBottomWidth: 1,
                    borderBottomColor: BLUIColors.red[300],
                },
                '&.Mui-error:not(.Mui-focused):hover:after': {
                    borderBottomColor: BLUIColors.red[300],
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
