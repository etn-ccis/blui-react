import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&.Mui-disabled': {
                border: `1px solid ${Color(BLUIColors.black[500]).alpha(0.12).string()}`,
            },
            '&.MuiButtonGroup-text > .MuiButtonGroup-grouped:not(:last-child).Mui-disabled': {
                ...theme.applyStyles('dark', {
                    borderColor: theme.vars.palette.divider,
                }),
            },
            '&.MuiButtonGroup-outlined.MuiButtonGroup-horizontal > .MuiButtonGroup-grouped:not(:last-of-type):hover': {
                borderRightColor: 'transparent',
            },
            '&.MuiButtonGroup-contained.MuiButtonGroup-horizontal > .MuiButtonGroup-grouped:not(:last-of-type)': {
                borderRightColor: theme.vars.palette.divider,
            },
            '&.MuiButtonGroup-text.MuiButtonGroup-colorPrimary > .MuiButtonGroup-grouped:not(:last-child).Mui-disabled':
                {
                    borderColor: theme.vars.palette.divider,
                },
            '&.MuiButtonGroup-text.MuiButtonGroup-colorSecondary > .MuiButtonGroup-grouped:not(:last-child).Mui-disabled':
                {
                    borderColor: theme.vars.palette.divider,
                },
        }),
        outlined: ({ theme }) => ({
            color: theme.vars.palette.text.primary,
        }),
        contained: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level1,
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiButtonGroup'];
