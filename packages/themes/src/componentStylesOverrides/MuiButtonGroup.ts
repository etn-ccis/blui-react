import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: () => ({
            '&.Mui-disabled': {
                border: `1px solid ${Color(BLUIColors.black[500]).alpha(0.12).string()}`,
            },
        }),
        outlined: ({ theme }) => ({
            color: theme.vars.palette.text.primary,
        }),
        contained: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level1,
        }),
        groupedText: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                '&:not(:last-child).Mui-disabled': {
                    borderColor: theme.vars.palette.divider,
                },
            }),
        }),
        groupedOutlinedHorizontal: () => ({
            '&:not(:last-of-type)': {
                '&:hover': {
                    borderRightColor: 'transparent',
                },
            },
        }),
        groupedContainedHorizontal: ({ theme }) => ({
            '&:not(:last-of-type)': {
                borderRightColor: theme.vars.palette.divider,
            },
        }),
        groupedTextPrimary: ({ theme }) => ({
            '&:not(:last-child)': {
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.divider,
                },
            },
            ...theme.applyStyles('dark', {
                '&:not(:last-child).Mui-disabled': {
                    borderColor: theme.vars.palette.divider,
                },
            }),
        }),
        groupedTextSecondary: ({ theme }) => ({
            '&:not(:last-child)': {
                '&.Mui-disabled': {
                    borderColor: theme.vars.palette.divider,
                },
            },
            ...theme.applyStyles('dark', {
                '&:not(:last-child).Mui-disabled': {
                    borderColor: theme.vars.palette.divider,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiButtonGroup'];
