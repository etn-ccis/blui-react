import { createSimpleLightPalette as createSimplePalette, createSimpleDarkPalette } from './shared';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';

export const BlueLightThemeColors = {
    primary: createSimplePalette(BLUIColors.blue),
    secondary: createSimplePalette(BLUIColors.lightBlue),
    error: createSimplePalette(BLUIColors.red),
    success: createSimplePalette(BLUIColors.green),
    info: createSimplePalette(BLUIColors.lightBlue),
    divider: Color(BLUIColors.black[500]).alpha(0.12).string(),
    warning: {
        light: BLUIColors.yellow[100],
        main: BLUIColors.yellow[500],
        dark: BLUIColors.yellow[900],
    },
    background: {
        default: BLUIColors.white[200],
        paper: BLUIColors.white[50],
    },
    text: {
        primary: BLUIColors.black[500],
        secondary: BLUIColors.gray[500],
        hint: BLUIColors.gray[500],
    },
    action: {
        active: BLUIColors.gray[500],
        disabled: Color(BLUIColors.black[500]).alpha(0.3).string(),
    },
};

export const BlueDarkThemeColors = {
    primary: createSimpleDarkPalette(BLUIColors.blue),
    secondary: createSimpleDarkPalette(BLUIColors.lightBlue),
    error: createSimpleDarkPalette(BLUIColors.red),
    success: createSimpleDarkPalette(BLUIColors.green),
    info: createSimpleDarkPalette(BLUIColors.lightBlue),
    divider: Color(BLUIColors.black[200]).alpha(0.36).string(),
    warning: {
        light: BLUIColors.yellow[100],
        main: BLUIColors.yellow[300],
        dark: BLUIColors.yellow[900],
    },
    background: {
        default: BLUIColors.darkBlack[900],
        paper: BLUIColors.darkBlack[500],
    },
    text: {
        primary: BLUIColors.black[50],
        secondary: BLUIColors.black[200],
        disabled: Color(BLUIColors.black[300]).alpha(0.36).string(),
        hint: Color(BLUIColors.black[300]).alpha(0.36).string(),
    },
    action: {
        hover: Color(BLUIColors.black[50]).alpha(0.1).string(),
        active: BLUIColors.black[200],
        disabled: Color(BLUIColors.black[300]).alpha(0.36).string(),
        disabledBackground: Color(BLUIColors.black[200]).alpha(0.24).string(),
    },
};
