import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: BLUIColors.black[900],
            color: BLUIColors.black[50],
            boxShadow: theme.vars.palette.shadows.level2,
            '& .MuiButton-text.MuiButton-colorPrimary': {
                color: BLUIColors.blue[200],
            },
            '& .MuiButton-text.MuiButton-colorSecondary': {
                color: BLUIColors.lightBlue[200],
            },
            ...theme.applyStyles('dark', {
                color: BLUIColors.black[500],
                backgroundColor: BLUIColors.black[50],
                '& .MuiButton-text.MuiButton-colorPrimary': {
                    color: theme.vars.palette.primary.main,
                },
                '& .MuiButton-text.MuiButton-colorSecondary': {
                    color: theme.vars.palette.secondary.main,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiSnackbarContent'];
