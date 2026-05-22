import { Components, Theme, CssVarsTheme } from '@mui/material/styles';

export default {
    styleOverrides: {
        root: () => ({
            fontSize: 'var(--blui-caption-font-size, 18px)',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 1,
            transform: 'translate(16px, 24px) scale(1)',
            '&.MuiInputLabel-shrink': {
                transform: 'translate(12px, -1.5px) scale(0.75)',
            },
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiInputLabel'];
