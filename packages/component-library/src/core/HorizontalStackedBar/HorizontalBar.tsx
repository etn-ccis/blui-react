import React, { forwardRef } from 'react';
import { Box, BoxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { getHorizontalBarUtilityClass, HorizontalBarClasses, HorizontalBarClassKey } from './HorizontalBarClasses';
import { cx } from '@emotion/css';
import { BLUIColors } from '@brightlayer-ui/colors';

const useUtilityClasses = (ownerState: HorizontalBarProps): Record<HorizontalBarClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
    };

    return composeClasses(slots, getHorizontalBarUtilityClass, classes);
};

export type HorizontalBarProps = BoxProps & {
    /** Custom classes for default style overrides */
    classes?: HorizontalBarClasses;

    /** The status of the bar, used for displaying the selection
     *
     * Default: none
     */
    selectedStatus?: string;

    /** The name of the state
     *
     * Default: none
     */
    name?: string;

    /** The width of the bar as a percentage
     *
     * Default: 100
     */
    barPercentage?: number;

    /** The color of the bar
     *
     * Default: (--primary-gray-500, #727E84);
     */
    color?: string;

    /** The variant of the horizontal bar item
     *
     * Default: none
     */
    variant?: 'failed' | 'success' | 'pending' | 'info' | 'canceled';
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['selectedStatus', 'name', 'barPercentage', 'color'].includes(prop as string),
})<Pick<HorizontalBarProps, 'selectedStatus' | 'name' | 'barPercentage' | 'color'>>(
    ({ selectedStatus, name, barPercentage, color }) => ({
        height: selectedStatus && selectedStatus === name ? '8px' : '4px',
        width: `${barPercentage}%`,
        minWidth: barPercentage && barPercentage > 0 ? '4px' : '0px',
        background: color,
        cursor: 'pointer',
        boxShadow: selectedStatus && selectedStatus === name ? '1px 1px 3px rgba(0, 0, 0, 0.25)' : 'none',
        transition: 'height 0.2s ease-in-out, box-shadow 0.2s ease-in-out, width 0.3s ease-in-out',
        '&:hover': {
            height: '8px',
            boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.25)',
        },
    })
);

const HorizontalBarRender: React.ForwardRefRenderFunction<unknown, HorizontalBarProps> = (
    props: HorizontalBarProps,
    ref: any
) => {
    const generatedClasses = useUtilityClasses(props);
    const variantColors: Record<string, string> = {
        failed: BLUIColors.red[500],
        canceled: BLUIColors.yellow[900],
        success: BLUIColors.green[700],
        pending: BLUIColors.gray[500],
        info: BLUIColors.lightBlue[500],
    };
    const {
        className: userClassName,
        selectedStatus,
        name,
        barPercentage,
        color,
        variant,
        onClick,
        ...otherProps
    } = props;

    const theme = useTheme();
    const [selectedState, setSelectedState] = React.useState<string | undefined>(selectedStatus);

    // Calculate final color: custom color takes precedence over variant color
    const variantColor = variant ? variantColors[variant] : undefined;
    const finalColor = color || variantColor || theme.vars.palette.text.secondary;

    React.useEffect(() => {
        setSelectedState(selectedStatus);
    }, [selectedStatus]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        setSelectedState(selectedState !== name ? name : '');
        onClick?.(event);
    };

    return (
        <Root
            ref={ref}
            selectedStatus={selectedState}
            name={name}
            barPercentage={barPercentage}
            color={finalColor}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-horizontal-bar-root'}
            onClick={handleClick}
            {...otherProps}
        ></Root>
    );
};

export const HorizontalBar = forwardRef(HorizontalBarRender);

HorizontalBar.displayName = 'HorizontalBar';
