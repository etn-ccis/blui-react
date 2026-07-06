import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: theme.vars.palette.primary.main,
            boxShadow: theme.vars.palette.shadows.level2,
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiBottomNavigation'];
