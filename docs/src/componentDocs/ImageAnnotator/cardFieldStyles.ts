import { Theme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';

export const cardFieldStyles = (theme: Theme): Record<string, any> => ({
    '& .card-field-label, & .card-field-value': {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: 1,
        letterSpacing: 0,
        minWidth: 0,
        overflowWrap: 'anywhere',
    },
    '& .card-field-label': {
        color: BLUIColors.gray[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[200] }),
    },
    '& .card-field-value': {
        textAlign: 'right',
        color: BLUIColors.black[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[50] }),
    },
});

export const cardFieldStylesSnippet = `const cardFieldStyles = (theme) => ({
    '& .card-field-label, & .card-field-value': {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: 1,
        letterSpacing: 0,
        minWidth: 0,
        overflowWrap: 'anywhere',
    },
    '& .card-field-label': {
        color: BLUIColors.gray[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[200] }),
    },
    '& .card-field-value': {
        textAlign: 'right',
        color: BLUIColors.black[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[50] }),
    },
});`;
