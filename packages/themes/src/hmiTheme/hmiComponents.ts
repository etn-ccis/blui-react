import type {} from '@mui/material/themeCssVarsAugmentation';
import type { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import MuiAvatar from './hmiComponentStylesOverrides/MuiAvatar';
import MuiAppBar from './hmiComponentStylesOverrides/MuiAppBar';
import MuiBottomNavigation from './hmiComponentStylesOverrides/MuiBottomNavigation';
import MuiButton from './hmiComponentStylesOverrides/MuiButton';
import MuiChip from './hmiComponentStylesOverrides/MuiChip';
import MuiDrawer from './hmiComponentStylesOverrides/MuiDrawer';
import MuiLinearProgress from './hmiComponentStylesOverrides/MuiLinearProgress';
import MuiCircularProgress from './hmiComponentStylesOverrides/MuiCircularProgress';
import MuiSwitch from './hmiComponentStylesOverrides/MuiSwitch';
import MuiTab from './hmiComponentStylesOverrides/MuiTab';
import MuiTabs from './hmiComponentStylesOverrides/MuiTabs';
import MuiInputBase from './hmiComponentStylesOverrides/MuiInputBase';
import MuiFilledInput from './hmiComponentStylesOverrides/MuiFilledInput';
import MuiFormLabel from './hmiComponentStylesOverrides/MuiFormLabel';
import MuiFormHelperText from './hmiComponentStylesOverrides/MuiFormHelperText';
import MuiToggleButton from './hmiComponentStylesOverrides/MuiToggleButton';
import MuiRadio from './hmiComponentStylesOverrides/MuiRadio';
import MuiCard from './hmiComponentStylesOverrides/MuiCard';
import MuiInputLabel from './hmiComponentStylesOverrides/MuiInputLabel';
import MuiStepper from './hmiComponentStylesOverrides/MuiStepper';
// shared overrides (identical between themes)
import MuiBottomNavigationAction from '../componentStylesOverrides/MuiBottomNavigationAction';
import MuiBadge from '../componentStylesOverrides/MuiBadge';
import MuiBackdrop from '../componentStylesOverrides/MuiBackdrop';
import MuiButtonGroup from '../componentStylesOverrides/MuiButtonGroup';
import MuiCheckbox from '../componentStylesOverrides/MuiCheckbox';
import MuiButtonBase from '../componentStylesOverrides/MuiButtonBase';
import MuiFab from '../componentStylesOverrides/MuiFab';
import MuiListItem from '../componentStylesOverrides/MuiListItem';
import MuiListSubheader from '../componentStylesOverrides/MuiListSubheader';
import MuiMobileStepper from '../componentStylesOverrides/MuiMobileStepper';
import MuiSlider from '../componentStylesOverrides/MuiSlider';
import MuiSnackbarContent from '../componentStylesOverrides/MuiSnackbarContent';
import MuiStepConnector from '../componentStylesOverrides/MuiStepConnector';
import MuiStep from '../componentStylesOverrides/MuiStep';
import MuiStepIcon from '../componentStylesOverrides/MuiStepIcon';
import MuiStepLabel from '../componentStylesOverrides/MuiStepLabel';
import MuiTableCell from '../componentStylesOverrides/MuiTableCell';
import MuiTableHead from '../componentStylesOverrides/MuiTableHead';
import MuiTableRow from '../componentStylesOverrides/MuiTableRow';
import MuiTableSortLabel from '../componentStylesOverrides/MuiTableSortLabel';
import MuiTooltip from '../componentStylesOverrides/MuiTooltip';
import MuiInput from '../componentStylesOverrides/MuiInput';
import MuiOutlinedInput from '../componentStylesOverrides/MuiOutlinedInput';
import MuiToggleButtonGroup from '../componentStylesOverrides/MuiToggleButtonGroup';

declare module '@mui/material/styles' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Palette {
        statusBar: {
            default: string;
            alarm: string;
            warning: string;
            success: string;
            primary: string;
        };
        scrollbar: {
            button: string;
        };
        gauge: {
            progress: string;
            track: string;
            label: string;
        };
        bucketGauge: {
            alarm: string;
            warning: string;
            test: string;
            healthy: string;
        };
        warningAlternate: Palette['primary'];
        statusCountItem: {
            warning: string;
            warningText: string;
            errorText: string;
            info: string;
            infoText: string;
        };
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface PaletteOptions {
        statusBar?: {
            default: string;
            alarm: string;
            warning: string;
            success: string;
            primary: string;
        };
        scrollbar?: {
            button: string;
        };
        gauge?: {
            progress: string;
            track: string;
            label: string;
        };
        bucketGauge?: {
            alarm: string;
            warning: string;
            test: string;
            healthy: string;
        };
        warningAlternate?: PaletteOptions['primary'];
        statusCountItem?: {
            warning: string;
            warningText: string;
            errorText: string;
            info: string;
            infoText: string;
        };
    }
}

export const hmiComponentOverrides: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> = {
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
    MuiInputLabel: MuiInputLabel,
    MuiFilledInput: MuiFilledInput,
    MuiOutlinedInput: MuiOutlinedInput,
    MuiFormLabel: MuiFormLabel,
    MuiFormHelperText: MuiFormHelperText,
    MuiToggleButtonGroup: MuiToggleButtonGroup,
    MuiToggleButton: MuiToggleButton,
    MuiRadio: MuiRadio,
    MuiCard: MuiCard,
    MuiStepper: MuiStepper,
};
