// @ts-nocheck
import React, { EffectCallback, useEffect, useState, memo, useRef, useMemo, useCallback } from 'react';
import { EventResponse, SmpValueQuality } from './types/EdgeX';
import { useEdgeXMessageBus } from './contexts/EdgeXMessageBusContext';
import EdgeXAPI from './api/EdgeXAPI';
import { Error, Warning } from '@mui/icons-material';
import { alpha, Box, Skeleton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { ChannelValue, Spacer } from '@brightlayer-ui/react-components';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';
import { DeviceResource } from './schemas/DeviceProfileSchema';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Filler, ChartOptions } from 'chart.js';
import ChartStreaming from '@aziham/chartjs-plugin-streaming';
import 'chartjs-adapter-date-fns';

ChartJS.register(LinearScale, PointElement, LineElement, Filler, ChartStreaming);

type RealtimeValueProps = {
    device?: DeviceConfiguration;
    res: DeviceResource;
};

type RealtimeValueTooltipProps = {
    quality: SmpValueQuality[];
};

//const ANIMATION_TIME_MS = 150;
const STREAMING_DURATION_MS = 30_000; // How much time of data the chart shows
const STREAMING_DELAY_MS = 2_000; // Delay so upcoming values are known before plotting

const getQualityIcon = (quality: SmpValueQuality[]): JSX.Element | undefined => {
    const theme = useTheme();

    if (quality.length > 0) {
        let qualityProblemIcon = <Warning htmlColor={theme.palette.warning.dark} />;
        if (quality.includes('Communication Failure') || quality.includes('Server Error')) {
            qualityProblemIcon = <Error htmlColor={theme.palette.error.dark} />;
        }
        return qualityProblemIcon;
    }

    return undefined;
};

const RealtimeValueTooltip = ({ quality }: RealtimeValueTooltipProps): JSX.Element => {
    const hasQualityProblem = quality.length > 0;
    const qualityProblemIcon = getQualityIcon(quality);
    return (
        <Stack>
            {hasQualityProblem && (
                <Stack flexDirection="row" alignItems="center" gap="5px">
                    {qualityProblemIcon}
                    <Stack>
                        {quality.map((flag, index) => (
                            <Typography
                                color={['Communication Failure', 'Server Error'].includes(flag) ? 'error' : 'warning'}
                                key={index}
                                variant="body2"
                            >
                                {flag}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>
            )}
            {quality.includes('Server Error') && (
                <Typography color="error" variant="body2" fontStyle="italic">
                    The core-command service could not be reached. Please try again later or contact support if the
                    issue persists.
                </Typography>
            )}
        </Stack>
    );
};

export const RealtimeValueCell = memo<RealtimeValueProps>(
    ({ device, res }: RealtimeValueProps) => {
        const { bus } = useEdgeXMessageBus();
        const theme = useTheme();
        const [currentReading, setCurrentReading] = useState<string | undefined>();
        const [qualityFlags, setQualityFlags] = useState<SmpValueQuality[]>([]);
        const [timestamp, setTimestamp] = useState<Date>(new Date());
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const [hasChartData, setHasChartData] = useState<boolean>(false);
        const chartRef = useRef<ChartJS<'line'>>(null);
        const pendingDataRef = useRef<Array<{ x: number; y: number }>>([]);
        const isLoadingRef = useRef<boolean>(true);
        const hasChartDataRef = useRef<boolean>(false);

        const updateCurrentValue = useCallback((message: EventResponse): void => {
            let parsedReading = '-';
            let numericValue: number | null = null;
            let dataTimestamp: Date | null = null;

            if (message?.event.readings.length > 0) {
                const reading = message.event.readings[0];

                const valueType = reading.valueType.toLowerCase();

                // Extract value
                if (valueType.includes('float')) {
                    // For float types, parse and limit to 2 decimal places for display
                    const floatValue = Number.parseFloat(reading.value);
                    parsedReading = floatValue.toFixed(2);
                    numericValue = floatValue;
                } else if (valueType.includes('int')) {
                    // For integer types, parse as integer
                    numericValue = Number.parseInt(reading.value, 10);
                    parsedReading = reading.value;
                } else if (valueType === 'bool') {
                    // For boolean, convert to True/False and use 1/0 for charting
                    const value = reading.value.toLowerCase() === 'true';
                    numericValue = value ? 1 : 0;
                    parsedReading = value ? 'True' : 'False';
                } else {
                    // For other types, use the raw value
                    parsedReading = reading.value;
                }

                // Extract quality
                if (message.event?.tags && 'smp-value-quality' in message.event.tags) {
                    const quality = message.event.tags['smp-value-quality'] as SmpValueQuality[];
                    setQualityFlags(quality);
                }

                // Extract timestamp
                dataTimestamp = new Date(reading.origin / 1_000_000);
                setTimestamp(dataTimestamp);
            }

            setCurrentReading(parsedReading);

            // Update chart data using push model - streaming plugin handles scrolling and cleanup
            // Use browser time (Date.now()) for the x-coordinate so the streaming plugin's
            // realtime window (anchored to browser clock) always contains the data point.
            // Device timestamps may have clock skew relative to the browser.
            if (numericValue !== null) {
                const point = { x: Date.now(), y: numericValue };
                if (chartRef.current) {
                    const chart = chartRef.current;
                    const data = chart.data.datasets[0].data;
                    // Remove synthetic trailing point before adding real data
                    // to avoid jarring vertical lines when the value differs
                    if (data.length > 0) {
                        const lastPoint = data[data.length - 1] as { x: number; y: number; synthetic?: boolean };
                        if (lastPoint.synthetic) {
                            data.pop();
                        }
                    }
                    data.push(point);
                    chart.update('quiet');
                } else {
                    // Chart not mounted yet (still loading) - buffer for later
                    pendingDataRef.current.push(point);
                }
                if (!hasChartDataRef.current) {
                    hasChartDataRef.current = true;
                    setHasChartData(true);
                }
            }

            if (isLoadingRef.current) {
                isLoadingRef.current = false;
                setIsLoading(false);
            }
        }, []);

        useEffect((): ReturnType<EffectCallback> => {
            if (!device) {
                return;
            }

            setIsLoading(true);
            isLoadingRef.current = true;
            setHasChartData(false);
            hasChartDataRef.current = false;
            pendingDataRef.current = [];

            // Get current value through REST API
            void EdgeXAPI.getCommandEvent(device, res.name)
                .then(updateCurrentValue)
                .catch((error) => {
                    setCurrentReading('-');
                    setQualityFlags(['Server Error']);
                    setIsLoading(false);
                    console.error(`Failed to fetch initial value for ${device.name} - ${res.name}:`, error);
                });

            // Subscribe for updates
            bus.subscribeToResource(device.serviceName, device.profileName, device.name, res.name, updateCurrentValue);

            // Cleanup
            return () => {
                bus.unsubscribeResource(
                    device.serviceName,
                    device.profileName,
                    device.name,
                    res.name,
                    updateCurrentValue
                );
            };
        }, [device, res.name, bus, updateCurrentValue]);

        const chartOptions: ChartOptions<'line'> = useMemo(
            () => ({
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    streaming: {
                        duration: STREAMING_DURATION_MS,
                        delay: STREAMING_DELAY_MS,
                        frameRate: 30,
                    },
                },
                scales: {
                    x: {
                        type: 'realtime' as const,
                        display: false,
                        realtime: {
                            duration: STREAMING_DURATION_MS,
                            delay: STREAMING_DELAY_MS,
                            refresh: STREAMING_DELAY_MS - 100,
                            onRefresh: (chart: ChartJS): void => {
                                const dataset = chart.data.datasets[0];
                                if (dataset && dataset.data.length > 0) {
                                    const now = Date.now();
                                    const lastPoint = dataset.data[dataset.data.length - 1] as {
                                        x: number;
                                        y: number;
                                        synthetic?: boolean;
                                    };

                                    if (lastPoint.synthetic) {
                                        // Update the existing synthetic point in place
                                        lastPoint.x = now;
                                    } else if (now - lastPoint.x >= STREAMING_DELAY_MS / 2.0) {
                                        // Only add a synthetic point if the last real point is stale
                                        dataset.data.push({ x: now, y: lastPoint.y, synthetic: true } as any);
                                    }
                                }
                            },
                        },
                        ticks: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },
                    y: {
                        display: false,
                        suggestedMin: 0,
                        type: 'linear',
                        grace: '25%',
                        ticks: {
                            display: false,
                        },
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },
                },
                elements: {
                    point: { radius: 0, hitRadius: 0, hoverRadius: 0 },
                    line: {
                        tension: 0.1,
                    },
                },
                layout: { autoPadding: false, padding: 0 },
                interaction: {
                    intersect: false,
                },
            }),
            []
        );

        // Flush any data points that were buffered before the chart mounted
        useEffect(() => {
            if (chartRef.current && pendingDataRef.current.length > 0) {
                const chart = chartRef.current;
                chart.data.datasets[0].data.push(...pendingDataRef.current);
                pendingDataRef.current = [];
                chart.update('quiet');
            }
        }, [isLoading]);

        // Update chart colors when quality flags change
        useEffect(() => {
            if (chartRef.current) {
                const chart = chartRef.current;
                const hasError =
                    qualityFlags.includes('Communication Failure') || qualityFlags.includes('Server Error');
                const hasWarning = qualityFlags.length > 0 && !hasError;

                const color = hasError ? theme.palette.error : hasWarning ? theme.palette.warning : theme.palette.info;
                const borderColor = alpha(color.main, 0.4);
                const gradientTopColor = alpha(color.dark, 0.4);

                chart.data.datasets[0].borderColor = borderColor;
                // Store gradient color for use in backgroundColor function
                (chart as any).gradientTopColor = gradientTopColor;

                chart.update('none'); // Update without animation
            }
        }, [qualityFlags, theme]);

        const data = useMemo(
            () => ({
                datasets: [
                    {
                        data: [] as Array<{ x: number; y: number }>,
                        fill: 'start', // always show the fill from the bottom of the chart
                        backgroundColor: (context: any): any => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;

                            if (!chartArea) {
                                return 'transparent';
                            }

                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            // Use stored gradient color or default
                            const topColor = chart.gradientTopColor ?? alpha(theme.palette.info.dark, 0.3);
                            gradient.addColorStop(0, topColor);
                            gradient.addColorStop(1, 'transparent');

                            return gradient;
                        },
                        borderColor: alpha(theme.palette.info.main, 0.3),
                        borderWidth: 1.5,
                        stepped: res.properties.valueType === 'Bool' ? true : false,
                    },
                ],
            }),
            [res.properties.valueType, theme]
        );

        const qualityIcon = getQualityIcon(qualityFlags);
        const tooltip = <RealtimeValueTooltip quality={qualityFlags} />;
        /*
    const style = flashing
        ? { backgroundColor: 'rgba(0, 123, 194, 0.2)' }
        : { transition: `background-color ${ANIMATION_TIME_MS}ms linear` };
    */

        return (
            <Tooltip
                title={tooltip}
                placement="right"
                arrow
                disableHoverListener={qualityFlags.length === 0}
                slotProps={{
                    tooltip: {
                        sx: {
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: qualityIcon?.props.htmlColor ?? 'primary.dark',
                        },
                    },
                    arrow: {
                        sx: {
                            color: 'background.paper',
                            '&:before': {
                                border: '1px solid',
                                borderColor: qualityIcon?.props.htmlColor ?? 'primary.dark',
                            },
                        },
                    },
                }}
            >
                {isLoading ? (
                    <Stack flexDirection="row" alignItems="center" width="100%" height={56} sx={{ p: 1 }}>
                        <Stack flexDirection="column" alignItems="flex-start" gap={0.5}>
                            <Skeleton variant="text" width={80} height={20} />
                            <Skeleton variant="text" width={70} height={16} />
                        </Stack>
                        <Spacer />
                        <Stack flexDirection="row" alignItems="center" gap={1}>
                            <Skeleton variant="text" width={60} height={24} />
                        </Stack>
                    </Stack>
                ) : (
                    <Box sx={{ position: 'relative', width: '100%', height: 56 }}>
                        {/* Background chart */}
                        {
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: hasChartData ? 1 : 0,
                                    pointerEvents: 'none',
                                    transition: 'opacity 300ms ease-in-out',
                                }}
                            >
                                <Line ref={chartRef} data={data} options={chartOptions} />
                            </Box>
                        }

                        {/* Foreground content */}
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            width="100%"
                            height="100%"
                            sx={{ /*...style,*/ p: 1, position: 'relative', zIndex: 1 }}
                        >
                            <Stack flexDirection="column" alignItems="flex-start">
                                <Typography variant="body2" color="textSecondary" fontWeight={700}>
                                    {timestamp.toLocaleTimeString()}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {timestamp.toLocaleDateString()}
                                </Typography>
                            </Stack>
                            <Spacer />
                            <ChannelValue
                                value={currentReading ?? '-'}
                                units={res.properties?.units}
                                icon={qualityIcon}
                                sx={{
                                    '& .BluiChannelValue-icon': {
                                        fontSize: '24px',
                                    },
                                }}
                            />
                        </Stack>
                    </Box>
                )}
            </Tooltip>
        );
    },
    // Custom comparator: only re-render when the values we actually use change.
    // Prevents re-renders from new object identity when other rows are added/deleted.
    (prev, next) =>
        prev.device === next.device &&
        prev.res.name === next.res.name &&
        prev.res.properties?.valueType === next.res.properties?.valueType &&
        prev.res.properties?.units === next.res.properties?.units
);

RealtimeValueCell.displayName = 'RealtimeValue';
