import React, { forwardRef } from 'react';
import { Box, BoxProps, styled, Typography, unstable_composeClasses as composeClasses } from '@mui/material';
import { getLegendUtilityClass, LegendClasses, LegendClassKey } from './LegendClasses';
import { cx } from '@emotion/css';

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
     * Default: none
     */
    icon: React.JSX.Element;

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

    variant?: 'failed' | 'success' | 'pending' | 'warning' | 'info' | 'cancelled';
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'backgroundColor',
})<Pick<LegendProps, 'selectedStatus' | 'label' | 'backgroundColor'>>(({ selectedStatus, label, backgroundColor }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '4px',
    padding: '8px',
    cursor: 'pointer',
    color: selectedStatus && selectedStatus === label ? '#ffff' : '',
    background: selectedStatus && selectedStatus === label ? backgroundColor : '',
    transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
}));

const Icon = styled(Box, {
    shouldForwardProp: (prop) =>
        !['iconSize', 'iconBackgroundColor', 'isSelected', 'legendBackgroundColor'].includes(prop.toString()),
})<{ iconColor: string; isSelected: boolean; legendBackgroundColor?: string }>(
    ({ iconColor, isSelected, legendBackgroundColor }) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2px',
        color: !isSelected && legendBackgroundColor ? legendBackgroundColor : iconColor,
        borderRadius: '4px',
        transition: 'background-color 0.2s ease-in-out',
    })
);

const LegendRender: React.ForwardRefRenderFunction<unknown, LegendProps> = (props: LegendProps, ref: any) => {
    const generatedClasses = useUtilityClasses(props);
    const {
        className: userClassName,
        icon,
        iconColor,
        count,
        label,
        selectedStatus,
        backgroundColor,
        onClick,
        ...otherProps
    } = props;

    const [selectedState, setSelectedState] = React.useState<string | undefined>(selectedStatus);

    React.useEffect(() => {
        setSelectedState(selectedStatus);
    }, [selectedStatus]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        setSelectedState(selectedState !== label ? label : '');
        onClick?.(event);
    };

    return (
        <Root
            ref={ref}
            selectedStatus={selectedState}
            label={label}
            backgroundColor={backgroundColor}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-horizontal-bar-root'}
            onClick={handleClick}
            {...otherProps}
        >
            <Icon
                iconColor={iconColor}
                isSelected={selectedState === label}
                legendBackgroundColor={backgroundColor}
                className={generatedClasses.icon}
            >
                {icon}
            </Icon>
            <Typography variant="body2" className={generatedClasses.count} sx={{ fontSize: '14px', fontWeight: 600 }}>
                {count}
            </Typography>
            <Typography
                variant="subtitle2"
                className={generatedClasses.label}
                sx={{ fontSize: '14px', fontWeight: 400 }}
            >
                {label}
            </Typography>
        </Root>
    );
};

export const Legend = forwardRef(LegendRender);

Legend.displayName = 'Legend';
