import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: ({ theme }) => ({
            textTransform: 'initial',
            fontWeight: 400,
            fontSize: 'var(--blui-tab-text)',
            maxHeight: 'var(--blui-bar-height)',
            padding: '16px 8px',
            minWidth: '80px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',

            // Direct icon targeting for icon-only tabs
            '& > svg': {
                fontSize: 'var(--blui-tab-icon)',
                width: 'var(--blui-tab-icon)',
                height: 'var(--blui-tab-icon)',
            },

            // If you use icons in tabs, you can also add:
            '& .MuiTab-iconWrapper': {
                fontSize: 'var(--blui-tab-icon)',
                width: 'var(--blui-tab-icon)',
                height: 'var(--blui-tab-icon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 0,
                // Target direct SVG icons
                '& > svg': {
                    fontSize: 'var(--blui-tab-icon)',
                    width: 'var(--blui-tab-icon)',
                    height: 'var(--blui-tab-icon)',
                },
                // Target icons wrapped in Badge
                '& .MuiBadge-root': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': {
                        fontSize: 'var(--blui-tab-icon)',
                        width: 'var(--blui-tab-icon)',
                        height: 'var(--blui-tab-icon)',
                    },
                },
            },
            '&.Mui-selected': {
                fontWeight: 600,
            },
            ...theme.applyStyles('dark', {
                fontWeight: 400,
                '&.Mui-selected': {
                    fontWeight: 600,
                },
            }),
        }),
        textColorPrimary: ({ theme }) => ({
            ...theme.applyStyles('light', {
                color: theme.vars.palette.text.primary,
                opacity: 0.7,
                '&.Mui-selected': {
                    color: theme.vars.palette.primary.main,
                    opacity: 1,
                },
            }),
        }),
        textColorSecondary: ({ theme }) => ({
            ...theme.applyStyles('light', {
                color: theme.vars.palette.text.secondary,
                opacity: 0.7,
                '&.Mui-selected': {
                    color: theme.vars.palette.secondary.main,
                    opacity: 1,
                },
            }),
        }),
        textColorInherit: ({ theme }) => ({
            ...theme.applyStyles('dark', {
                color: theme.vars.palette.text.secondary,
                opacity: 1,
                '&.Mui-selected': {
                    color: theme.vars.palette.primary.main,
                },
            }),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiTab'];
