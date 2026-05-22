import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import baseOverride from '../../componentStylesOverrides/MuiCircularProgress';

export default {
    ...baseOverride,
    styleOverrides: {
        ...baseOverride!.styleOverrides,
        root: {
            width: 'var(--blui-ring-chart-size)',
            height: 'var(--blui-ring-chart-size)',
        },
        svg: {
            width: 'var(--blui-ring-chart-size)',
            height: 'var(--blui-ring-chart-size)',
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiCircularProgress'];
