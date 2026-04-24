import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { Check, Clear } from '@mui/icons-material';
import { memo, useMemo } from 'react';

const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'boolean') return val ? '✓' : '✗';
    if (typeof val === 'object') {
        if (Array.isArray(val)) return `[${val.length} items]`;
        return `{${Object.keys(val).length} fields}`;
    }
    return val.toString();
};

const formatKey = (key: string): string => key.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

export const ProtocolArrayRowTooltip = memo(
    ({ data, children }: { data: any; children: React.ReactNode }): JSX.Element => {
        const theme = useTheme();

        const getTooltipContent = (): JSX.Element => {
            if (Array.isArray(data)) {
                return (
                    <Box sx={{ p: 0.5 }}>
                        {data.slice(0, 10).map((item, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    py: 0.5,
                                    display: 'flex',
                                    gap: 1,
                                    borderBottom:
                                        idx < Math.min(data.length, 10) - 1
                                            ? `1px solid ${theme.palette.divider}`
                                            : 'none',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.primary.light,
                                        fontWeight: 600,
                                        minWidth: 20,
                                    }}
                                >
                                    {idx + 1}.
                                </Typography>
                                {typeof item === 'object' && !Array.isArray(item) ? (
                                    <Box sx={{ flex: 1 }}>
                                        {Object.entries(item).map(([key, val], i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    mb: i < Object.keys(item).length - 1 ? 0.25 : 0,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {formatKey(key)}:
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: theme.palette.common.white }}
                                                >
                                                    {formatValue(val)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="caption" sx={{ color: theme.palette.common.white }}>
                                        {formatValue(item)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                        {data.length > 10 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontStyle: 'italic',
                                    mt: 1,
                                    display: 'block',
                                }}
                            >
                                ... and {data.length - 10} more
                            </Typography>
                        )}
                    </Box>
                );
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const entries = Object.entries(data).filter(([_, val]) => val !== null && val !== undefined && val !== '');

            return (
                <Box sx={{ p: 0.5 }}>
                    {entries.map(([key, val], idx) => (
                        <Box
                            key={key}
                            sx={{
                                py: 0.5,
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                borderBottom: idx < entries.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 600,
                                    minWidth: 100,
                                }}
                            >
                                {formatKey(key)}:
                            </Typography>
                            {typeof val === 'boolean' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {val ? (
                                        <>
                                            <Check sx={{ fontSize: 14, color: theme.palette.success.main }} />
                                            <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                                                Yes
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Clear sx={{ fontSize: 14, color: theme.palette.error.main }} />
                                            <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                                                No
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.common.white,
                                        fontWeight: 500,
                                    }}
                                >
                                    {formatValue(val)}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            );
        };

        const tooltipContent = useMemo(() => getTooltipContent(), [data]);

        return (
            <Tooltip
                title={tooltipContent}
                arrow
                placement="top"
                slotProps={{
                    tooltip: { sx: { bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' } },
                    arrow: {
                        sx: {
                            color: 'background.paper',
                            '&:before': {
                                border: '1px solid',
                                borderColor: 'divider',
                            },
                        },
                    },
                }}
            >
                <span>{children}</span>
            </Tooltip>
        );
    },
    (prevProps, nextProps) =>
        // Custom comparison - only re-render if data actually changed
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
);
