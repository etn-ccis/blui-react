import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import baseOverride from '../../componentStylesOverrides/MuiInputBase';

const baseRoot = baseOverride!.styleOverrides!.root as (args: any) => object;
const baseInput = baseOverride!.styleOverrides!.input as (args: any) => object;

export default {
    ...baseOverride,
    styleOverrides: {
        ...baseOverride!.styleOverrides,
        root: (args: Parameters<typeof baseRoot>[0]) => ({
            height: 'var(--blui-input-inner-height)',
            borderRadius: 'var(--blui-input-radius)',
            ...baseRoot(args),
        }),
        input: (args: Parameters<typeof baseInput>[0]) => ({
            fontSize: 'var(--blui-input-text, 24px)',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            padding: 'var(--blui-input-padding)',
            ...baseInput(args),
        }),
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiInputBase'];
