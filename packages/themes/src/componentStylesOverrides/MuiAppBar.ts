import { Theme, CssVarsTheme, Components } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

declare module '@mui/material/Paper' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface PaperPropsVariantOverrides {
        overlay: true;
    }
}

export default {
    variants: [
        {
            props: { variant: 'overlay', color: 'transparent' },
            style: ({ theme }): Record<string, any> => ({
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                boxShadow: 'none',
                overflow: 'visible',
                // Scrim extends 24px below the app bar per Figma (80px shadow over a 56px bar)
                '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 'calc(100% + 24px)',
                    zIndex: -1,
                    pointerEvents: 'none',
                },
                '&::before': {
                    background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.80) 20%, rgba(255, 255, 255, 0.64) 56%, rgba(255, 255, 255, 0.00) 100%)',
                    ...theme.applyStyles('dark', {
                        background:
                            'linear-gradient(180deg, rgba(0, 0, 0, 0.80) 20%, rgba(0, 0, 0, 0.64) 56%, rgba(0, 0, 0, 0.00) 100%)',
                    }),
                },
                // Progressive blur: strongest under the bar, fading to none at the bottom edge
                '&::after': {
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 100%)',
                    WebkitMaskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 100%)',
                },
            }),
        },
    ],
    styleOverrides: {
        root: ({ theme }) => ({
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
