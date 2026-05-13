import React, { forwardRef } from 'react';
import { Box, BoxProps, styled, unstable_composeClasses as composeClasses } from '@mui/material';
import { getHorizontalBarUtilityClass, HorizontalBarClasses, HorizontalBarClassKey } from './HorizontalBarClasses';
import { cx } from '@emotion/css';

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
    color: string;
};

const Root = styled(
    Box,
    {}
)<Pick<HorizontalBarProps, 'selectedStatus' | 'name' | 'barPercentage' | 'color'>>(
    ({ selectedStatus, name, barPercentage, color }) => ({
        height: selectedStatus && selectedStatus === name ? '8px' : '4px',
        width: `${barPercentage}%`,
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
    const {
        className: userClassName,
        selectedStatus,
        name,
        barPercentage,
        color = '#727E84',
        onClick,
        ...otherProps
    } = props;

    const [selectedState, setSelectedState] = React.useState<string | undefined>(selectedStatus);

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
            color={color}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-horizontal-bar-root'}
            onClick={handleClick}
            {...otherProps}
        ></Root>
    );
};

export const HorizontalBar = forwardRef(HorizontalBarRender);

HorizontalBar.displayName = 'HorizontalBar';
