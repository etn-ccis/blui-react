import { createSimpleLightPalette as createSimplePalette } from '../shared';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';
import { BlueLightThemeColors, BlueDarkThemeColors } from '../blueColorScheme';

export const HmiLightThemeColors = {
    ...BlueLightThemeColors,
    warningAlternate: createSimplePalette(BLUIColors.orange),
    scrollbar: {
        button: BLUIColors.white[50],
    },
    statusBar: {
        default: BLUIColors.white[200],
        alarm: BLUIColors.red[900],
        warning: BLUIColors.gold[700],
        success: BLUIColors.green[700],
        primary: BLUIColors.blue[700],
    },
    gauge: {
        progress: BLUIColors.green[700],
        track: Color('#178E0B').alpha(0.1).string(), //@TODO: Verify track color included in BLUIColors
        label: BLUIColors.green[700],
    },
    bucketGauge: {
        alarm: BLUIColors.red[500],
        warning: BLUIColors.yellow[500],
        test: BLUIColors.black[500],
        healthy: BLUIColors.green[700],
    },
    statusCountItem: {
        warning: BLUIColors.yellow[500],
        //need to confirm with design team as this color variant is not defined in theme.
        warningText: '#634107',
        errorText: BLUIColors.white[50],
        info: BLUIColors.black[50],
        infoText: BLUIColors.black[500],
    },
};

export const HmiDarkThemeColors = {
    ...BlueDarkThemeColors,
    warningAlternate: createSimplePalette(BLUIColors.orange),
    scrollbar: {
        button: BLUIColors.black[600],
    },
    statusBar: {
        default: BLUIColors.darkBlack[800],
        alarm: BLUIColors.red[900],
        warning: BLUIColors.gold[700],
        success: BLUIColors.green[500],
        primary: BLUIColors.blue[700],
    },
    gauge: {
        progress: BLUIColors.green[500],
        track: Color(BLUIColors.green[500]).alpha(0.2).string(),
        label: BLUIColors.green[500],
    },
    bucketGauge: {
        alarm: BLUIColors.red[500],
        warning: BLUIColors.yellow[600],
        test: BLUIColors.white[50],
        healthy: BLUIColors.green[500],
    },
    statusCountItem: {
        warning: BLUIColors.yellow[600],
        warningText: '#634107',
        errorText: BLUIColors.white[50],
        info: BLUIColors.black[700],
        infoText: BLUIColors.black[100],
    },
};
