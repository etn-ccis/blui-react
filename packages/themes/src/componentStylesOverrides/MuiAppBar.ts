import { Theme, CssVarsTheme, Components } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            boxShadow: theme.vars.palette.shadows.level2,
            ...theme.applyStyles('dark', {
                backgroundImage: 'none',
            }),
        }),
        colorDefault: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.text.primary,
            ...theme.applyStyles('dark', {
                color: theme.vars.palette.text.primary,
                backgroundColor: BLUIColors.darkBlack[300],
            }),
        }),
        colorPrimary: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                color: theme.vars.palette.text.primary,
                backgroundColor: theme.vars.palette.primary.dark,
            }),
        }),
        colorSecondary: ({ theme }) => ({
            color: theme.vars.palette.background.paper,
            backgroundColor: theme.vars.palette.primary.dark,
            '& .MuiInputBase-root': {
                color: theme.vars.palette.background.paper,
            },
            '& .MuiSelect-icon': {
                color: theme.vars.palette.background.paper,
            },
            ...theme.applyStyles('dark', {
                color: theme.vars.palette.text.primary,
                backgroundColor: theme.vars.palette.background.paper,
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiAppBar'];
