import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

const DarkPressed = Color(BLUIColors.highlight).alpha(0.36).string();

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            textTransform: 'none',
            ...theme.applyStyles('dark', {
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
                },
            }),
        }),
        icon: ({ theme }) => ({
            '&.MuiButton-sizeMedium': {
                '& > *:nth-of-type(1)': {
                    fontSize: '1.125rem',
                },
            },
            ...theme.applyStyles('dark', {
                '& > *:nth-of-type(1)': {
                    fontSize: '1.125rem',
                },
            }),
        }),
        contained: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.text.primary,
            boxShadow: theme.vars.palette.shadows.level1,
            '& .MuiButton-disableElevation:not(.MuiButton-containedPrimary):not(.MuiButton-containedSecondary)': {
                backgroundColor: BLUIColors.white[500],
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&.Mui-disabled': {
                    borderWidth: 0,
                },
            },
            '&:hover': {
                boxShadow: theme.vars.palette.shadows.level2,
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
                boxShadow: theme.vars.palette.shadows.level1,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                border: `1px solid ${Color(BLUIColors.black[500]).alpha(0.12).string()}`,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.black[500],
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
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
            '&:active': {
                backgroundColor: BLUIColors.blue[700],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.primary.light,
                borderWidth: 0,
                color: BLUIColors.blue[200],
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.primary.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: BLUIColors.blue[300],
                },
                '&:active': {
                    backgroundColor: BLUIColors.blue[200],
                },
                '&.Mui-disabled': {
                    borderWidth: 0,
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
            '&:active': {
                backgroundColor: BLUIColors.lightBlue[500],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.primary.light,
                borderWidth: 0,
                color: BLUIColors.blue[200],
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.secondary.dark,
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: BLUIColors.lightBlue[300],
                },
                '&:active': {
                    backgroundColor: BLUIColors.lightBlue[200],
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: BLUIColors.black[400],
                },
            }),
        }),
        outlined: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
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
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[50],
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: Color(BLUIColors.black[500]).alpha(0.12).string(),
            },
            ...theme.applyStyles('dark', {
                borderColor: BLUIColors.black[200],
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
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
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.primary.main,
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
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
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            ...theme.applyStyles('dark', {
                '&:not(.Mui-disabled)': {
                    borderColor: theme.vars.palette.secondary.main,
                    '&:hover': {
                        backgroundColor: theme.vars.palette.action.hover,
                    },
                    '&:active': {
                        backgroundColor: DarkPressed,
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
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            ...theme.applyStyles('dark', {
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                },
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
                },
            }),
        }),
        textPrimary: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
                },
            }),
        }),
        textSecondary: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: BLUIColors.blue[100],
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: DarkPressed,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiButton'];
