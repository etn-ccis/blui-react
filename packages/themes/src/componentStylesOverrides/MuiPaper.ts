import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import { BLUIColors } from '@brightlayer-ui/colors';
import Color from 'color';

export default {
    styleOverrides: {
        root: ({ theme, ownerState }: any) => {
            const elevation = ownerState?.elevation ?? 0;
            if (elevation >= 8) {
                return {
                    boxShadow: theme.vars.palette.shadows.level3,
                    border: `1px solid ${Color(BLUIColors.gray[900]).alpha(0.12).string()}`,
                };
            }
            if (elevation >= 3) {
                return { boxShadow: theme.vars.palette.shadows.level2 };
            }
            if (elevation >= 1) {
                return { boxShadow: theme.vars.palette.shadows.level1 };
            }
            return { boxShadow: 'none' };
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiPaper'];
