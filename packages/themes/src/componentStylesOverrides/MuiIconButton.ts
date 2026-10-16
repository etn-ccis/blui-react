import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import { BLUIColors } from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            ...theme.applyStyles('light', {
                '&:active': {
                    backgroundColor: Color(BLUIColors.pressed).alpha(0.16).string(),
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiIconButton'];
