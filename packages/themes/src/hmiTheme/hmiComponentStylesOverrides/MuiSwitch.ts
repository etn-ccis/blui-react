import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import Color from 'color';

export default {
    styleOverrides: {
        root: {
            width: 'calc(var(--blui-toggle-track-width, 48px) + var(--blui-toggle-container-padding, 12px) * 2)',
            height: 'calc(var(--blui-toggle-track, 20px) + var(--blui-toggle-container-padding, 12px) * 2)',
            padding: 'var(--blui-toggle-container-padding, 12px)',
        },
        switchBase: ({ theme }) => ({
            color: theme.vars.palette.background.paper,
            padding: 0,
            top: '50%',
            left: 'var(--blui-toggle-container-padding, 12px)',
            transform: 'translateY(-50%)',
            transition: 'none',
            '&.Mui-checked + .MuiSwitch-track': {
                opacity: 'var(--blui-toggle-track-opacity, 0.38)',
            },
            '&.Mui-checked': {
                transform:
                    'translate(calc(var(--blui-toggle-track-width, 34px) - var(--blui-toggle-knob, 20px)), -50%)',
                color: theme.vars.palette.primary.main,
                '&.Mui-disabled': {
                    color: theme.vars.palette.secondary.main,
                    opacity: 'var(--blui-toggle-disabled-opacity, 0.8)',
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 'var(--blui-toggle-track-opacity, 0.38)',
                    backgroundColor: theme.vars.palette.secondary.main,
                },
            },
            ...theme.applyStyles('dark', {
                color: BLUIColors.black[300],
                '&.Mui-checked + .MuiSwitch-track': {
                    opacity: 'var(--blui-toggle-track-opacity, 0.38)',
                },
                '&.Mui-checked': {
                    color: theme.vars.palette.secondary.main,
                    '&.Mui-disabled': {
                        color: theme.vars.palette.primary.main,
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        backgroundColor: theme.vars.palette.primary.main,
                    },
                },
            }),
        }),
        colorPrimary: ({ theme }) => ({
            ...theme.applyStyles('light', {
                '&.Mui-disabled': {
                    color: Color(BLUIColors.white[50]).string(),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    backgroundColor: BLUIColors.black[300],
                },
                '&.Mui-checked': {
                    color: theme.vars.palette.primary.main,
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 'var(--blui-toggle-track-opacity, 0.38)',
                        backgroundColor: theme.vars.palette.primary.main,
                    },
                },
            }),
        }),
        colorSecondary: ({ theme }) => ({
            '&.Mui-disabled': {
                color: theme.vars.palette.background.paper,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 'var(--blui-toggle-track-opacity, 0.38)',
                backgroundColor: BLUIColors.black[100],
            },
            ...theme.applyStyles('dark', {
                '&.Mui-disabled': {
                    color: theme.vars.palette.Switch.defaultDisabledColor,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    backgroundColor: BLUIColors.black[300],
                    opacity: 'var(--blui-toggle-track-opacity, 0.38)',
                },
            }),
        }),
        track: ({ theme }) => ({
            backgroundColor: BLUIColors.black[100],
            opacity: 'var(--blui-toggle-track-opacity, 0.38)',
            height: 'var(--blui-toggle-track, 14px)',
            width: 'var(--blui-toggle-track-width, 34px)',
            borderRadius: 'var(--blui-toggle-track-radius, 32px)',
            ...theme.applyStyles('dark', {
                backgroundColor: BLUIColors.black[300],
                opacity: 'var(--blui-toggle-track-opacity, 0.38)',
            }),
        }),
        thumb: {
            width: 'var(--blui-toggle-knob, 20px)',
            height: 'var(--blui-toggle-knob, 20px)',
        },
    },
} as Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiSwitch'];
