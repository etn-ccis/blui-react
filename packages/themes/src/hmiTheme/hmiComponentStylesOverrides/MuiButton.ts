import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            textTransform: 'none',
            height: 'var(--blui-button-height)',
            borderRadius: 'var(--blui-button-radius)',
            padding: `0 var(--blui-button-padding)`,
            fontSize: 'var(--blui-button-text)',
            display: 'flex',
            gap: '8px',
            ...theme.applyStyles('dark', {
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: BLUIColors.black[400],
                },
            }),
        }),
        iconSizeMedium: ({ theme }) => ({
            '& > *:nth-of-type(1)': {
                fontSize: 'var(--blui-button-icon)',
            },
            ...theme.applyStyles('dark', {
                '& > *:nth-of-type(1)': {
                    fontSize: 'var(--blui-button-icon)',
                },
            }),
        }),
        contained: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.text.primary,
            '& .MuiButton-disableElevation:not(.MuiButton-containedPrimary):not(.MuiButton-containedSecondary)': {
                backgroundColor: BLUIColors.white[500],
                '&:hover': {
                    backgroundColor: BLUIColors.white[300],
                },
                '&.Mui-disabled': {
                    borderWidth: 'var(--blui-disabled-button-border-width)',
                },
            },
            '&:hover': {
                backgroundColor: Color(BLUIColors.black[500]).alpha(0.05).string(),
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                border: `1px solid ${Color(BLUIColors.black[500]).alpha(0.12).string()}`,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.black[500],
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: BLUIColors.black[400],
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: BLUIColors.black[400],
                },
            }),
        }),
        containedPrimary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.primary.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: BLUIColors.blue[300],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.primary.light,
                borderWidth: 'var(--blui-disabled-button-border-width)',
                color: BLUIColors.blue[200],
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.primary.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: BLUIColors.blue[300],
                },
                '&.Mui-disabled': {
                    borderWidth: 'var(--blui-disabled-button-border-width)',
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: BLUIColors.black[400],
                },
            }),
        }),
        containedSecondary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.secondary.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: BLUIColors.lightBlue[300],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.primary.light,
                borderWidth: 'var(--blui-disabled-button-border-width)',
                color: BLUIColors.blue[200],
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.secondary.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: BLUIColors.lightBlue[300],
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: BLUIColors.black[400],
                },
            }),
        }),
        containedSuccess: ({ theme }) => ({
            backgroundColor: theme.vars.palette.success.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: theme.vars.palette.success.dark,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.success.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.success.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.success.main,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        containedWarning: ({ theme }) => ({
            backgroundColor: theme.vars.palette.warning.main,
            color: theme.vars.palette.warning.contrastText ?? '#fff',
            '&:hover': {
                backgroundColor: theme.vars.palette.warning.dark,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.warning.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.warning.dark,
                color: theme.vars.palette.warning.contrastText ?? '#fff',
                '&:hover': {
                    backgroundColor: theme.vars.palette.warning.main,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        containedError: ({ theme }) => ({
            backgroundColor: theme.vars.palette.error.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: theme.vars.palette.error.dark,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.error.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.error.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.error.main,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        containedInfo: ({ theme }) => ({
            backgroundColor: theme.vars.palette.info.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: theme.vars.palette.info.dark,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.info.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.info.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.info.main,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        containedAlternateWarning: ({ theme }: { theme: Theme & CssVarsTheme }) => ({
            backgroundColor: theme.vars.palette.warningAlternate.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: theme.vars.palette.warningAlternate.dark,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.warningAlternate.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.warningAlternate.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.warningAlternate.main,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        outlinedAlternateWarning: ({ theme }: { theme: Theme & CssVarsTheme }) => ({
            borderColor: theme.vars.palette.warningAlternate.main,
            color: theme.vars.palette.warningAlternate.main,
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.warningAlternate.main} / 0.05)`,
            },
            '&.Mui-disabled': {
                borderColor: theme.vars.palette.warningAlternate.light,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.warningAlternate.dark,
                color: theme.vars.palette.warningAlternate.dark,
                '&:hover': {
                    backgroundColor: `rgba(${theme.vars.palette.warningAlternate.dark} / 0.2)`,
                },
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        textAlternateWarning: ({ theme }: { theme: Theme & CssVarsTheme }) => ({
            color: theme.vars.palette.warningAlternate.main,
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.warningAlternate.main} / 0.05)`,
            },
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                color: theme.vars.palette.warningAlternate.dark,
                '&:hover': {
                    backgroundColor: `rgba(${theme.vars.palette.warningAlternate.dark} / 0.2)`,
                },
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        outlined: ({ theme }) => ({
            '&:hover': {
                backgroundColor: Color(BLUIColors.black[500]).alpha(0.05).string(),
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: Color(BLUIColors.black[50]).alpha(0.1).string(),
                },
                '&.Mui-disabled': {
                    borderColor: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    color: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    backgroundColor: 'transparent',
                },
            }),
        }),
        outlinedInherit: ({ theme }) => ({
            borderColor: theme.vars.palette.divider,
            '&:hover': {
                backgroundColor: Color(BLUIColors.black[500]).alpha(0.05).string(),
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            ...theme.applyStyles('dark', {
                borderColor: BLUIColors.black[200],
                '&:hover': {
                    backgroundColor: Color(BLUIColors.black[50]).alpha(0.1).string(),
                },
                '&.Mui-disabled': {
                    borderColor: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    color: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    backgroundColor: 'transparent',
                },
            }),
        }),
        outlinedPrimary: ({ theme }) => ({
            borderColor: theme.vars.palette.primary.main,
            '&.Mui-disabled': {
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.primary.main} / 0.05)`,
            },
            ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.primary.main,
                '&:hover': {
                    backgroundColor: `rgba(${theme.vars.palette.primary.dark} / 0.2)`,
                },
                '&.Mui-disabled': {
                    borderColor: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    color: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    backgroundColor: 'transparent',
                },
            }),
        }),
        outlinedSecondary: ({ theme }) => ({
            borderColor: theme.vars.palette.secondary.main,
            '&.Mui-disabled': {
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.secondary.main} / 0.05)`,
            },
            ...theme.applyStyles('dark', {
                '&:not(.Mui-disabled)': {
                    borderColor: theme.vars.palette.secondary.main,
                    '&:hover': {
                        backgroundColor: `rgba(${theme.vars.palette.secondary.dark} / 0.2)`,
                    },
                },
                '&.Mui-disabled': {
                    borderColor: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    color: Color(BLUIColors.black[300]).alpha(0.36).string(),
                    backgroundColor: 'transparent',
                },
            }),
        }),
        text: ({ theme }) => ({
            '&.Mui-disabled': {
                color: theme.vars.palette.action.disabled,
            },
            '&:hover': {
                backgroundColor: Color(BLUIColors.black[500]).alpha(0.05).string(),
            },
            ...theme.applyStyles('dark', {
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                },
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
            }),
        }),
        textPrimary: ({ theme }) => ({
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.primary.main} / 0.05)`,
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: `rgba(${theme.vars.palette.primary.dark} / 0.2)`,
                },
            }),
        }),
        textSecondary: ({ theme }) => ({
            '&:hover': {
                backgroundColor: `rgba(${theme.vars.palette.secondary.main} / 0.05)`,
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: `rgba(${theme.vars.palette.secondary.dark} / 0.2)`,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiButton'];
