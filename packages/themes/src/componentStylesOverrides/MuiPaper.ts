import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme, ownerState }) => {
            const variant = ownerState?.variant;
            if (variant && variant !== 'elevation') {
                return { boxShadow: 'none' };
            }

            const elevation = ownerState?.elevation ?? 0;
            if (elevation >= 8) {
                return {
                    backgroundImage: 'none',
                    boxShadow: theme.vars.palette.shadows.level3,
                    border: `1px solid ${theme.vars.palette.divider}`,
                };
            }
            if (elevation >= 3) {
                return { backgroundImage: 'none', boxShadow: theme.vars.palette.shadows.level2 };
            }
            if (elevation >= 1) {
                return { backgroundImage: 'none', boxShadow: theme.vars.palette.shadows.level1 };
            }
            return { backgroundImage: 'none', boxShadow: 'none' };
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiPaper'];
