import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

const DarkPressed = Color(BLUIColors.highlight).alpha(0.36).string();
const PressedLight = Color(BLUIColors.pressed).alpha(0.16).string();
const PressedDark = Color(BLUIColors.pressedDark).alpha(0.16).string();

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
                backgroundColor: PressedLight,
                boxShadow: theme.vars.palette.shadows.level1,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.action.disabledBackground,
                color: theme.vars.palette.action.disabled,
                borderWidth: 0,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.black[500],
                color: BLUIColors.white[50],
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: PressedDark,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
                    borderWidth: 0,
                },
            }),
        }),
        containedPrimary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.primary.main,
            color: BLUIColors.white[50],
            '&:hover': {
                backgroundColor: BLUIColors.onPrimaryHover,
            },
            '&:active': {
                backgroundColor: BLUIColors.onPrimaryPressed,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.action.disabledBackground,
                borderWidth: 0,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.primary.main,
                color: BLUIColors.blue[900],
                '&:hover': {
                    backgroundColor: BLUIColors.onPrimaryHoverDark,
                },
                '&:active': {
                    backgroundColor: BLUIColors.onPrimaryPressedDark,
                },
                '&.Mui-disabled': {
                    borderWidth: 0,
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    color: theme.vars.palette.action.disabled,
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
                backgroundColor: theme.vars.palette.action.disabledBackground,
                borderWidth: 0,
                color: theme.vars.palette.action.disabled,
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
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        outlined: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: PressedLight,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: theme.vars.palette.action.disabled,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: PressedDark,
                },
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.action.disabled,
                    color: theme.vars.palette.action.disabled,
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
                backgroundColor: PressedLight,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.background.paper,
                borderColor: theme.vars.palette.action.disabled,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                borderColor: BLUIColors.black[200],
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: PressedDark,
                },
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.action.disabled,
                    color: theme.vars.palette.action.disabled,
                    backgroundColor: 'transparent',
                },
            }),
        }),
        outlinedPrimary: ({ theme }) => ({
            borderColor: theme.vars.palette.primary.main,
            '&.Mui-disabled': {
                borderColor: theme.vars.palette.action.disabled,
                color: theme.vars.palette.action.disabled,
            },
            '&:hover': {
                backgroundColor: Color(BLUIColors.colorHover).alpha(0.08).string(),
            },
            '&:active': {
                backgroundColor: Color(BLUIColors.pressed).alpha(0.16).string(),
            },
            ...theme.applyStyles('dark', {
                borderColor: theme.vars.palette.primary.main,
                '&:hover': {
                    backgroundColor: Color(BLUIColors.colorHoverDark).alpha(0.08).string(),
                },
                '&:active': {
                    backgroundColor: Color(BLUIColors.pressedDark).alpha(0.16).string(),
                    borderColor: BLUIColors.onPrimaryPressedDark,
                },
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.action.disabled,
                    color: theme.vars.palette.action.disabled,
                    backgroundColor: 'transparent',
                },
            }),
        }),
        outlinedSecondary: ({ theme }) => ({
            borderColor: theme.vars.palette.secondary.main,
            '&.Mui-disabled': {
                borderColor: theme.vars.palette.action.disabled,
                color: theme.vars.palette.action.disabled,
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
                    borderColor: theme.vars.palette.action.disabled,
                    color: theme.vars.palette.action.disabled,
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
                backgroundColor: PressedLight,
            },
            ...theme.applyStyles('dark', {
                '&.Mui-disabled': {
                    color: theme.vars.palette.action.disabled,
                },
                '&:hover': {
                    backgroundColor: theme.vars.palette.action.hover,
                },
                '&:active': {
                    backgroundColor: PressedDark,
                },
            }),
        }),
        textPrimary: ({ theme }) => ({
            '&:hover': {
                backgroundColor: Color(BLUIColors.colorHover).alpha(0.08).string(),
            },
            '&:active': {
                backgroundColor: Color(BLUIColors.pressed).alpha(0.16).string(),
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: Color(BLUIColors.colorHoverDark).alpha(0.08).string(),
                },
                '&:active': {
                    backgroundColor: Color(BLUIColors.pressedDark).alpha(0.16).string(),
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
