import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        paper: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level2,
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
        paperAnchorBottom: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiDrawer'];
