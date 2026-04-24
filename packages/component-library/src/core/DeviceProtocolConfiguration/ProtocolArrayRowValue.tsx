/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, Box, Chip, useTheme, Tooltip } from '@mui/material';
import { Check, Clear } from '@mui/icons-material';
import { ProtocolArrayRowTooltip } from './ProtocolArrayRowTooltip';
import { memo } from 'react';

type ProtocolArrayRowValueProps = {
    value: any;
    hasError?: boolean;
};

const getSummaryText = (obj: Record<string, any>): string => {
    const entries = Object.entries(obj).filter(([_, val]) => val !== null && val !== undefined && val !== '');

    // Check if it's a flags/boolean object (most values are booleans)
    const booleanCount = entries.filter(([_, val]) => typeof val === 'boolean').length;
    const isFlagsObject = booleanCount > entries.length / 2;

    if (isFlagsObject) {
        const trueCount = entries.filter(([_, val]) => val === true).length;
        return `${trueCount} of ${entries.length} enabled`;
    }

    return `${entries.length} field${entries.length !== 1 ? 's' : ''}`;
};

export const ProtocolArrayRowValue = memo(({ value, hasError = false }: ProtocolArrayRowValueProps): JSX.Element => {
    const theme = useTheme();

    // Null/undefined
    if (value === null || value === undefined || value === '') {
        return (
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                —
            </Typography>
        );
    }

    // Boolean
    if (typeof value === 'boolean') {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {value ? (
                    <>
                        <Check sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                            Yes
                        </Typography>
                    </>
                ) : (
                    <>
                        <Clear sx={{ fontSize: 16, color: theme.palette.error.main }} />
                        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                            No
                        </Typography>
                    </>
                )}
            </Box>
        );
    }

    // Primitives
    if (typeof value !== 'object') {
        return (
            <Typography
                title={value.toString()} // Little hack to show full value on hover
                variant="body2"
                noWrap
                sx={{
                    color: hasError ? theme.palette.error.main : theme.palette.text.primary,
                    fontWeight: 500,
                }}
            >
                {value.toString()}
            </Typography>
        );
    }

    // Arrays
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return (
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>
                    Empty
                </Typography>
            );
        }

        return (
            <ProtocolArrayRowTooltip data={value}>
                <Chip
                    label={`${value.length} item${value.length !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        bgcolor: `${theme.palette.primary.light}20`,
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        cursor: 'help',
                    }}
                />
            </ProtocolArrayRowTooltip>
        );
    }

    // Objects
    const entries = Object.entries(value).filter(([_, val]) => val !== null && val !== undefined && val !== '');

    if (entries.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>
                Empty
            </Typography>
        );
    }

    const summaryText = getSummaryText(value);

    return (
        <ProtocolArrayRowTooltip data={value}>
            <Chip
                label={summaryText}
                size="small"
                sx={{
                    height: 22,
                    fontSize: '0.75rem',
                    bgcolor: theme.palette.grey[200],
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    cursor: 'help',
                    maxWidth: 200,
                    '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }}
            />
        </ProtocolArrayRowTooltip>
    );
});
