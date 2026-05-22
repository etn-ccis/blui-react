import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import baseOverride from '../../componentStylesOverrides/MuiFormLabel';

const baseRoot = baseOverride!.styleOverrides!.root as (args: any) => object;

export default {
    ...baseOverride,
    styleOverrides: {
        ...baseOverride!.styleOverrides,
        root: (args: Parameters<typeof baseRoot>[0]) => ({
            fontSize: 'var(--blui-caption-font-size, 18px)',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 1,
            ...baseRoot(args),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiFormLabel'];
