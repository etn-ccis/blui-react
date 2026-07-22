import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

export default {
    styleOverrides: {
        paper: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiMenu'];
