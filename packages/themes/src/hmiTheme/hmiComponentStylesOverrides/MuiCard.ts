import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: {
            borderRadius: 'var(--blui-card-radius)',
        },
        header: {
            minHeight: 'var(--blui-card-header-footer)',
            fontSize: 'var(--blui-card-header-foot-text)',
        },
        footer: {
            minHeight: 'var(--blui-card-header-footer)',
            fontSize: 'var(--blui-card-header-foot-text)',
        },
        icon: {
            fontSize: 'var(--blui-card-header-footer-icon)',
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiCard'];
