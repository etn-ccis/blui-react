import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import baseOverride from '../../componentStylesOverrides/MuiToggleButton';

const baseRoot = baseOverride!.styleOverrides!.root as (args: any) => object;

export default {
    ...baseOverride,
    styleOverrides: {
        ...baseOverride!.styleOverrides,
        root: (args: Parameters<typeof baseRoot>[0]) => ({
            height: 'var(--blui-segmented-button-height, 56px)',
            padding: '0 var(--blui-segmented-button-padding, 24px)',
            ...baseRoot(args),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiToggleButton'];
