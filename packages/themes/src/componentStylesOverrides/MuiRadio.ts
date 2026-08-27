import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import { BLUIColors } from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&:hover': {
                backgroundColor: theme.vars.palette.action.hover,
            },
            '&:active': {
                backgroundColor: Color(BLUIColors.pressed).alpha(0.16).string(),
            },
            '.MuiFormControlLabel-root &:hover': {
                backgroundColor: 'transparent',
            },
            '&.MuiRadio-highlight': {
                backgroundColor: theme.vars.palette.action.highlight,
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiRadio'];
