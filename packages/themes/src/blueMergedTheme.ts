import { createTheme } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { typography } from './shared';
import MuiAvatar from './componentStylesOverrides/MuiAvatar';
import MuiAppBar from './componentStylesOverrides/MuiAppBar';
import MuiBottomNavigation from './componentStylesOverrides/MuiBottomNavigation';
import MuiButton from './componentStylesOverrides/MuiButton';
import MuiChip from './componentStylesOverrides/MuiChip';
import MuiDrawer from './componentStylesOverrides/MuiDrawer';
import MuiMenu from './componentStylesOverrides/MuiMenu';
import MuiDialog from './componentStylesOverrides/MuiDialog';
import MuiLinearProgress from './componentStylesOverrides/MuiLinearProgress';
import MuiCircularProgress from './componentStylesOverrides/MuiCircularProgress';
import MuiSwitch from './componentStylesOverrides/MuiSwitch';
import MuiTab from './componentStylesOverrides/MuiTab';
import MuiTabs from './componentStylesOverrides/MuiTabs';
import MuiInputBase from './componentStylesOverrides/MuiInputBase';
import MuiFilledInput from './componentStylesOverrides/MuiFilledInput';
import MuiFormLabel from './componentStylesOverrides/MuiFormLabel';
import MuiFormHelperText from './componentStylesOverrides/MuiFormHelperText';
import MuiToggleButton from './componentStylesOverrides/MuiToggleButton';
// shared overrides (identical between themes)
import MuiBottomNavigationAction from './componentStylesOverrides/MuiBottomNavigationAction';
import MuiBadge from './componentStylesOverrides/MuiBadge';
import MuiBackdrop from './componentStylesOverrides/MuiBackdrop';
import MuiButtonGroup from './componentStylesOverrides/MuiButtonGroup';
import MuiCheckbox from './componentStylesOverrides/MuiCheckbox';
import MuiButtonBase from './componentStylesOverrides/MuiButtonBase';
import MuiFab from './componentStylesOverrides/MuiFab';
import MuiListItem from './componentStylesOverrides/MuiListItem';
import MuiListSubheader from './componentStylesOverrides/MuiListSubheader';
import MuiMobileStepper from './componentStylesOverrides/MuiMobileStepper';
import MuiSlider from './componentStylesOverrides/MuiSlider';
import MuiSnackbarContent from './componentStylesOverrides/MuiSnackbarContent';
import MuiStepConnector from './componentStylesOverrides/MuiStepConnector';
import MuiStep from './componentStylesOverrides/MuiStep';
import MuiStepIcon from './componentStylesOverrides/MuiStepIcon';
import MuiStepLabel from './componentStylesOverrides/MuiStepLabel';
import MuiTableCell from './componentStylesOverrides/MuiTableCell';
import MuiTableHead from './componentStylesOverrides/MuiTableHead';
import MuiTableRow from './componentStylesOverrides/MuiTableRow';
import MuiTableSortLabel from './componentStylesOverrides/MuiTableSortLabel';
import MuiTooltip from './componentStylesOverrides/MuiTooltip';
import MuiInput from './componentStylesOverrides/MuiInput';
import MuiOutlinedInput from './componentStylesOverrides/MuiOutlinedInput';
import MuiToggleButtonGroup from './componentStylesOverrides/MuiToggleButtonGroup';
import { BlueLightThemeColors, BlueDarkThemeColors } from './blueColorScheme';

const Spacing = 8;

export const blueThemes = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    direction: 'ltr',
    typography: typography,
    spacing: Spacing,
    colorSchemes: {
        light: {
            palette: {
                mode: 'light',
                ...BlueLightThemeColors,
            },
        },
        dark: {
            palette: {
                mode: 'dark',
                ...BlueDarkThemeColors,
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
    },
});
