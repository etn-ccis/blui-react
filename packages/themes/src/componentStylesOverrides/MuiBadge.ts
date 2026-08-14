import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

export default {
    styleOverrides: {
        colorError: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.red[300],
                color: BLUIColors.black[900],
            }),
        }),
        colorPrimary: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.primary.main,
                color: BLUIColors.blue[900],
            }),
        }),
        colorSecondary: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                backgroundColor: theme.vars.palette.secondary.dark,
                color: BLUIColors.white[50],
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiBadge'];
