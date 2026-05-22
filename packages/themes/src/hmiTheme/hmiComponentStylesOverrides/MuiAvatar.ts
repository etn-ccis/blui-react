import { Components, CssVarsTheme, Theme } from '@mui/material/styles';
import baseOverride from '../../componentStylesOverrides/MuiAvatar';

export default {
    ...baseOverride,
    styleOverrides: {
        ...baseOverride?.styleOverrides,
        root: {
            width: 'var(--blui-avatar-size)',
            height: 'var(--blui-avatar-size)',
            fontSize: 'var(--blui-avatar-text)',
            '& .MuiAvatar-icon': {
                fontSize: 'var(--blui-avatar-icon)',
            },
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiAvatar'];
