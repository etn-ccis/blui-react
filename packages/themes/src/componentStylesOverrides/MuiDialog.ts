import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        paper: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level3,
            border: `1px solid ${Color(BLUIColors.gray[900]).alpha(0.12).string()}`,
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiDialog'];
