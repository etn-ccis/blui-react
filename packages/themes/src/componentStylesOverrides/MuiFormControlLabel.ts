import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            '&:hover': {
                backgroundColor: Color(BLUIColors.highlight).alpha(0.08).string(),
            },
            ...theme.applyStyles('dark', {
                '&:hover': {
                    backgroundColor: Color(BLUIColors.highlightBlue).alpha(0.2).string(),
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFormControlLabel'];
