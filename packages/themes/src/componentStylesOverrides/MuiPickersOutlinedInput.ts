import { BLUIColors } from '@brightlayer-ui/colors';
import { Components, Theme, CssVarsTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

const MuiPickersOutlinedInput: NonNullable<
    Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme>['MuiPickersOutlinedInput']
> = {
    styleOverrides: {
        root: ({ theme }) => ({
            '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: theme.vars.palette.error.main,
            },
            '&.Mui-error:hover:not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: theme.vars.palette.error.main,
            },
            '&.Mui-disabled .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: theme.vars.palette.divider,
            },
            ...theme.applyStyles('dark', {
                '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.error.dark,
                },
                '&.Mui-error:hover:not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.error.dark,
                },
                '&.Mui-disabled .MuiPickersOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.divider,
                },
                '&.MuiPickersInputBase-colorPrimary.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline':
                    {
                        borderColor: BLUIColors.blue[200],
                    },
                '&.MuiPickersInputBase-colorSecondary.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline':
                    {
                        borderColor: BLUIColors.lightBlue[500],
                    },
                '&.Mui-focused.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
                    borderColor: theme.vars.palette.error.dark,
                },
            }),
        }),
        notchedOutline: ({ theme }) => ({
            borderColor: theme.vars.palette.divider,
        }),
    },
};

export default MuiPickersOutlinedInput;
