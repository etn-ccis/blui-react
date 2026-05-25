import { createTheme } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { typography, createSimpleLightPalette as createSimplePalette, createSimpleDarkPalette } from './shared';
import * as BLUIColors from '@brightlayer-ui/colors';
import Color from 'color';
import MuiAvatar from './componentStylesOverrides/MuiAvatar';
import MuiAppBar from './componentStylesOverrides/MuiAppBar';
import MuiBottomNavigation from './componentStylesOverrides/MuiBottomNavigation';
import MuiBottomNavigationAction from './componentStylesOverrides/MuiBottomNavigationAction';
import MuiBadge from './componentStylesOverrides/MuiBadge';
import MuiBackdrop from './componentStylesOverrides/MuiBackdrop';
import MuiButton from './componentStylesOverrides/MuiButton';
import MuiButtonGroup from './componentStylesOverrides/MuiButtonGroup';
import MuiCheckbox from './componentStylesOverrides/MuiCheckbox';
import MuiButtonBase from './componentStylesOverrides/MuiButtonBase';
import MuiChip from './componentStylesOverrides/MuiChip';
import MuiDrawer from './componentStylesOverrides/MuiDrawer';
import MuiMenu from './componentStylesOverrides/MuiMenu';
import MuiDialog from './componentStylesOverrides/MuiDialog';
import MuiFab from './componentStylesOverrides/MuiFab';
import MuiListItem from './componentStylesOverrides/MuiListItem';
import MuiListSubheader from './componentStylesOverrides/MuiListSubheader';
import MuiMobileStepper from './componentStylesOverrides/MuiMobileStepper';
import MuiLinearProgress from './componentStylesOverrides/MuiLinearProgress';
import MuiCircularProgress from './componentStylesOverrides/MuiCircularProgress';
import MuiSlider from './componentStylesOverrides/MuiSlider';
import MuiSnackbarContent from './componentStylesOverrides/MuiSnackbarContent';
import MuiStepConnector from './componentStylesOverrides/MuiStepConnector';
import MuiStep from './componentStylesOverrides/MuiStep';
import MuiStepIcon from './componentStylesOverrides/MuiStepIcon';
import MuiStepLabel from './componentStylesOverrides/MuiStepLabel';
import MuiSwitch from './componentStylesOverrides/MuiSwitch';
import MuiTableCell from './componentStylesOverrides/MuiTableCell';
import MuiTableHead from './componentStylesOverrides/MuiTableHead';
import MuiTableRow from './componentStylesOverrides/MuiTableRow';
import MuiTableSortLabel from './componentStylesOverrides/MuiTableSortLabel';
import MuiTab from './componentStylesOverrides/MuiTab';
import MuiTabs from './componentStylesOverrides/MuiTabs';
import MuiTooltip from './componentStylesOverrides/MuiTooltip';
import MuiInputBase from './componentStylesOverrides/MuiInputBase';
import MuiInput from './componentStylesOverrides/MuiInput';
import MuiFilledInput from './componentStylesOverrides/MuiFilledInput';
import MuiOutlinedInput from './componentStylesOverrides/MuiOutlinedInput';
import MuiFormLabel from './componentStylesOverrides/MuiFormLabel';
import MuiFormHelperText from './componentStylesOverrides/MuiFormHelperText';
import MuiToggleButtonGroup from './componentStylesOverrides/MuiToggleButtonGroup';
import MuiToggleButton from './componentStylesOverrides/MuiToggleButton';
import MuiIconButton from './componentStylesOverrides/MuiIconButton';
import MuiRadio from './componentStylesOverrides/MuiRadio';
import MuiFormControlLabel from './componentStylesOverrides/MuiFormControlLabel';
import MuiCard from './componentStylesOverrides/MuiCard';

declare module '@mui/material/styles' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Palette {
        shadows: {
            level1: string;
            level2: string;
            level3: string;
        };
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface PaletteOptions {
        shadows?: {
            level1?: string;
            level2?: string;
            level3?: string;
        };
    }
}

// Light Theme Colors
const LightThemeColors = {
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
        hover: Color(BLUIColors.highlight).alpha(0.08).string(),
        active: BLUIColors.gray[500],
        disabled: Color(BLUIColors.black[500]).alpha(0.3).string(),
    },
};

// Dark Theme Colors
const DarkThemeColors = {
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
        hover: Color(BLUIColors.highlightBlue).alpha(0.2).string(),
        active: BLUIColors.black[200],
        disabled: Color(BLUIColors.black[300]).alpha(0.36).string(),
        disabledBackground: Color(BLUIColors.black[200]).alpha(0.24).string(),
    },
};

const Spacing = 8;

// light shadows
const lightShadows = {
    level1: '0 0 2px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 4px 0 rgba(0, 0, 0, 0.04)',
    level2: '0 0 6px 0 rgba(0, 0, 0, 0.04), 0 1px 4px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 0 rgba(0, 0, 0, 0.04)',
    level3: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 10px 32px 0 rgba(0, 0, 0, 0.12)',
};

// dark shadows
const darkShadows = {
    level1: '0 0 2px 0 rgba(0, 0, 0, 0.32), 0 1px 2px 0 rgba(0, 0, 0, 0.32), 0 1px 4px 0 rgba(0, 0, 0, 0.32)',
    level2: '0 0 6px 0 rgba(0, 0, 0, 0.32), 0 1px 4px 0 rgba(0, 0, 0, 0.32), 0 4px 8px 0 rgba(0, 0, 0, 0.32)',
    level3: '0 0 2px 0 rgba(0, 0, 0, 0.48), 0 8px 16px 0 rgba(0, 0, 0, 0.48), 0 10px 32px 0 rgba(0, 0, 0, 0.48)',
};

export const blueThemes = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    direction: 'ltr',
    typography: typography,
    spacing: Spacing,
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                ...LightThemeColors,
                shadows: lightShadows,
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                ...DarkThemeColors,
                shadows: darkShadows,
            },
        },
    },
    components: {
        MuiAvatar: MuiAvatar,
        MuiAppBar: MuiAppBar,
        MuiBottomNavigation: MuiBottomNavigation,
        MuiBottomNavigationAction: MuiBottomNavigationAction,
        MuiBadge: MuiBadge,
        MuiBackdrop: MuiBackdrop,
        MuiButton: MuiButton,
        MuiButtonGroup: MuiButtonGroup,
        MuiCheckbox: MuiCheckbox,
        MuiButtonBase: MuiButtonBase,
        MuiChip: MuiChip,
        MuiDrawer: MuiDrawer,
        MuiMenu: MuiMenu,
        MuiDialog: MuiDialog,
        MuiFab: MuiFab,
        MuiListItem: MuiListItem,
        MuiListSubheader: MuiListSubheader,
        MuiMobileStepper: MuiMobileStepper,
        MuiLinearProgress: MuiLinearProgress,
        MuiCircularProgress: MuiCircularProgress,
        MuiSlider: MuiSlider,
        MuiSnackbarContent: MuiSnackbarContent,
        MuiStepConnector: MuiStepConnector,
        MuiStep: MuiStep,
        MuiStepIcon: MuiStepIcon,
        MuiStepLabel: MuiStepLabel,
        MuiSwitch: MuiSwitch,
        MuiTableCell: MuiTableCell,
        MuiTableHead: MuiTableHead,
        MuiTableRow: MuiTableRow,
        MuiTableSortLabel: MuiTableSortLabel,
        MuiTab: MuiTab,
        MuiTabs: MuiTabs,
        MuiTooltip: MuiTooltip,
        MuiInputBase: MuiInputBase,
        MuiInput: MuiInput,
        MuiFilledInput: MuiFilledInput,
        MuiOutlinedInput: MuiOutlinedInput,
        MuiFormLabel: MuiFormLabel,
        MuiFormHelperText: MuiFormHelperText,
        MuiToggleButtonGroup: MuiToggleButtonGroup,
        MuiToggleButton: MuiToggleButton,
        MuiIconButton: MuiIconButton,
        MuiRadio: MuiRadio,
        MuiFormControlLabel: MuiFormControlLabel,
        MuiCard: MuiCard,
    },
});
