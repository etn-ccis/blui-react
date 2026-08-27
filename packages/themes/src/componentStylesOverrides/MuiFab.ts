import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import Color from 'color';

const WhiteText = BLUIColors.white[50];
const FabHoverLight = Color(BLUIColors.colorHover).alpha(0.08).string();
const FabPressedLight = Color(BLUIColors.pressed).alpha(0.16).string();
const FabHoverDark = Color(BLUIColors.colorHoverDark).alpha(0.08).string();
const FabPressedDark = Color(BLUIColors.pressedDark).alpha(0.16).string();

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            textTransform: 'none',
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.text.primary,
            boxShadow: theme.vars.palette.shadows.level3,
            border: `1px solid ${Color(BLUIColors.gray[900]).alpha(0.12).string()}`,
            '&:hover': {
                backgroundColor: FabHoverLight,
            },
            '&:active': {
                backgroundColor: FabPressedLight,
            },
            '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.action.disabledBackground,
                border: `1px solid ${theme.vars.palette.action.disabled}`,
                color: theme.vars.palette.action.disabled,
            },
            ...theme.applyStyles('dark', {
                textTransform: 'none',
                backgroundColor: BLUIColors.black[500],
                color: WhiteText,
                '&:hover': {
                    backgroundColor: FabHoverDark,
                },
                '&:active': {
                    backgroundColor: FabPressedDark,
                },
                '&.Mui-disabled': {
                    backgroundColor: theme.vars.palette.action.disabledBackground,
                    border: `1px solid ${theme.vars.palette.action.disabled}`,
                    color: theme.vars.palette.action.disabled,
                },
            }),
        }),
        primary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.primary.main,
            color: WhiteText,
            '&:focus-visible': {
                boxShadow: theme.vars.palette.shadows.level3,
            },
            '&:active': {
                backgroundColor: BLUIColors.onPrimaryPressed,
            },
            '&:hover': {
                backgroundColor: BLUIColors.onPrimaryHover,
            },
            '&.MuiFab-extended': {
                backgroundColor: BLUIColors.blue[500],
                '&:focus-visible': {
                    boxShadow: theme.vars.palette.shadows.level3,
                },
                '&:active': {
                    backgroundColor: BLUIColors.onPrimaryPressed,
                },
                '&:hover': {
                    backgroundColor: BLUIColors.onPrimaryHover,
                },
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.primary.main,
                color: BLUIColors.blue[900],
                '&:focus-visible': {
                    boxShadow: theme.vars.palette.shadows.level3,
                },
                '&:active': {
                    backgroundColor: BLUIColors.onPrimaryPressedDark,
                },
                '&:hover': {
                    backgroundColor: BLUIColors.onPrimaryHoverDark,
                },
                '&.MuiFab-extended': {
                    backgroundColor: theme.vars.palette.primary.main,
                    '&:focus-visible': {
                        boxShadow: theme.vars.palette.shadows.level3,
                    },
                    '&:active': {
                        backgroundColor: BLUIColors.onPrimaryPressedDark,
                    },
                    '&:hover': {
                        backgroundColor: BLUIColors.onPrimaryHoverDark,
                    },
                },
            }),
        }),
        secondary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.secondary.main,
            color: WhiteText,
            '&:hover': {
                backgroundColor: BLUIColors.lightBlue[300],
            },
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.secondary.dark,
                color: WhiteText,
                '&:hover': {
                    backgroundColor: BLUIColors.lightBlue[300],
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFab'];
