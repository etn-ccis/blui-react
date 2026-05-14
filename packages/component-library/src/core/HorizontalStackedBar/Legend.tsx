import React, { forwardRef } from 'react';
import { Box, BoxProps, Typography, unstable_composeClasses as composeClasses } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { getLegendUtilityClass, LegendClasses, LegendClassKey } from './LegendClasses';
import { cx } from '@emotion/css';
import {
    Error,
    Cancel,
    CheckCircle,
    PlayCircle,
    Pending,
    Warning,
    ErrorOutline,
    CancelOutlined,
    CheckCircleOutline,
    PlayCircleOutline,
    PendingOutlined,
    WarningOutlined,
} from '@mui/icons-material';

const VARIANT_ICONS: Record<string, React.JSX.Element> = {
    failed: <Error fontSize="medium" />,
    canceled: <Cancel fontSize="medium" />,
    success: <CheckCircle fontSize="medium" />,
    info: <PlayCircle fontSize="medium" />,
    pending: <Pending fontSize="medium" />,
    warning: <Warning fontSize="medium" />,
};

const VARIANT_OUTLINE_ICONS: Record<string, React.JSX.Element> = {
    failed: <ErrorOutline fontSize="medium" color="disabled" />,
    canceled: <CancelOutlined fontSize="medium" color="disabled" />,
    success: <CheckCircleOutline fontSize="medium" color="disabled" />,
    info: <PlayCircleOutline fontSize="medium" color="disabled" />,
    pending: <PendingOutlined fontSize="medium" color="disabled" />,
    warning: <WarningOutlined fontSize="medium" color="disabled" />,
};

const useUtilityClasses = (ownerState: LegendProps): Record<LegendClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
        icon: ['icon'],
        label: ['label'],
        count: ['count'],
    };

    return composeClasses(slots, getLegendUtilityClass, classes);
};

export type LegendProps = BoxProps & {
    /** Custom classes for default style overrides */
    classes?: LegendClasses;

    /** Icon to be shown in the legend
     *
     * Default: variant icon if variant is specified, otherwise none
     */
    icon?: React.JSX.Element;

    /** Icon to be shown in the legend when count === 0 (disabled state).
     * Falls back to `icon` when not provided.
     *
     * Default: none
     */
    disabledIcon?: React.JSX.Element;

    /** Icon color to be shown in the legend
     *
     * Default: none
     */
    iconColor?: string;

    /** The count of the item in the legend
     *
     * Default: 0
     */
    count: number;

    /** The label of the item in the legend
     *
     * Default: none
     */
    label: string;

    /** The status of the bar, used for displaying the selection
     *
     * Default: none
     */
    selectedStatus?: string;

    /** The background color of the legend item
     *
     * Default: none
     */
    backgroundColor?: string;

    /** The variant of the legend item
     *
     * Default: none
     */
    variant?: 'failed' | 'success' | 'pending' | 'warning' | 'info' | 'canceled';
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['finalBackgroundColor', 'selectedStatus', 'label', 'count'].includes(prop as string),
})<{ selectedStatus?: string; label: string; finalBackgroundColor?: string; count: number }>(
    ({ selectedStatus, label, finalBackgroundColor, count }) => ({
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '4px',
        padding: '8px',
        cursor: count !== 0 ? 'pointer' : 'default',
        color: selectedStatus && selectedStatus === label ? '#ffff' : '',
        background: selectedStatus && selectedStatus === label ? finalBackgroundColor : '',
        transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
        '&:hover':
            count !== 0 && selectedStatus !== label
                ? {
                      background: finalBackgroundColor ? `${finalBackgroundColor}1A` : 'rgba(0, 0, 0, 0.04)',
                  }
                : {},
    })
);

const Icon = styled(Box, {
    shouldForwardProp: (prop) => !['iconColor', 'isSelected', 'legendBackgroundColor'].includes(prop.toString()),
})<{ iconColor?: string; isSelected: boolean; legendBackgroundColor?: string }>(
    ({ iconColor, isSelected, legendBackgroundColor }) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2px',
        color: !isSelected && legendBackgroundColor ? legendBackgroundColor : iconColor || 'inherit',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease-in-out',
    })
);

const LegendRender: React.ForwardRefRenderFunction<unknown, LegendProps> = (props: LegendProps, ref: any) => {
    const generatedClasses = useUtilityClasses(props);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const variantColors: Record<string, string> = {
        failed: '#CA3C3D',
        canceled: isDark ? '#F2B741' : '#E57F0A',
        success: '#2CA618',
        pending: '#424E54',
        info: '#0075EE',
        warning: '#FF9800',
    };
    const {
        className: userClassName,
        icon,
        disabledIcon,
        iconColor,
        count,
        label,
        selectedStatus,
        backgroundColor,
        variant,
        onClick,
        ...otherProps
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (count === 0) return;
        onClick?.(event);
    };

    // Calculate final background color: custom backgroundColor takes precedence over variant color
    const variantColor = variant ? variantColors[variant] : undefined;
    const finalBackgroundColor = backgroundColor || variantColor;

    // Use provided icon or fall back to variant's default icon
    const variantIcon = variant ? (count === 0 ? VARIANT_OUTLINE_ICONS[variant] : VARIANT_ICONS[variant]) : undefined;
    const displayIcon = count === 0 ? (disabledIcon ?? icon ?? variantIcon) : (icon ?? variantIcon);

    return (
        <Root
            ref={ref}
            selectedStatus={selectedStatus}
            label={label}
            finalBackgroundColor={finalBackgroundColor}
            count={count}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-horizontal-bar-root'}
            onClick={handleClick}
            {...otherProps}
        >
            <Icon
                iconColor={iconColor}
                isSelected={selectedStatus === label}
                legendBackgroundColor={finalBackgroundColor}
                className={generatedClasses.icon}
            >
                {displayIcon}
            </Icon>
            <Typography
                variant="body2"
                className={generatedClasses.count}
                color={count === 0 ? 'textDisabled' : ''}
                sx={{ fontSize: '14px', fontWeight: 600 }}
            >
                {count}
            </Typography>
            <Typography
                variant="subtitle2"
                className={generatedClasses.label}
                color={count === 0 ? 'textDisabled' : ''}
                sx={{ fontSize: '14px', fontWeight: 400 }}
            >
                {label}
            </Typography>
        </Root>
    );
};

export const Legend = forwardRef(LegendRender);

Legend.displayName = 'Legend';
