import React, { forwardRef, useEffect } from 'react';
import { Box, BoxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    getHorizontalStackedBarUtilityClass,
    HorizontalStackedBarClasses,
    HorizontalStackedBarClassKey,
} from './HorizontalStackedBarClasses';
import { cx } from '@emotion/css';
import { Legend } from './Legend';
import { HorizontalBar } from './HorizontalBar';

const useUtilityClasses = (ownerState: HorizontalStackedBarProps): Record<HorizontalStackedBarClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
        legendContainer: ['legendContainer'],
        barContainer: ['barContainer'],
    };

    return composeClasses(slots, getHorizontalStackedBarUtilityClass, classes);
};

export type HorizontalStackedBarItem = {
    /** The label of the item */
    label: string;

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

    /** Background color for both legend and bar */
    backgroundColor?: string;

    /** The count to display in the legend */
    count: number;

    /** The variant of the horizontal stacked bar item
     *
     * Default: none
     */
    variant?: 'failed' | 'success' | 'pending' | 'info' | 'canceled';
};

export type HorizontalStackedBarProps = Omit<BoxProps, 'onChange'> & {
    /** Custom classes for default style overrides */
    classes?: HorizontalStackedBarClasses;

    /** Array of data items to render */
    data: HorizontalStackedBarItem[];

    /** Callback when selection changes
     *
     * @param selectedLabel - The label of the selected item, or empty string if deselected
     */
    onChange?: (selectedLabel: string) => void;

    /** Controlled selected status */
    selectedStatus?: string;

    /** When true, legend items with count === 0 are not rendered.
     * @default false
     */
    hideEmptyCategories?: boolean;
};

const Root = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: '68px',
});

const LegendContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const BarContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2px',
    height: '8px',
});

const HorizontalStackedBarRender: React.ForwardRefRenderFunction<unknown, HorizontalStackedBarProps> = (
    props: HorizontalStackedBarProps,
    ref: any
) => {
    const generatedClasses = useUtilityClasses(props);
    const {
        className: userClassName,
        data,
        onChange,
        selectedStatus: controlledSelectedStatus,
        hideEmptyCategories = false,
        ...otherProps
    } = props;

    const [internalSelectedStatus, setInternalSelectedStatus] = React.useState<string>('');
    const [totalCount, setTotalCount] = React.useState<number>(0);
    const isControlled = controlledSelectedStatus !== undefined;
    const selectedStatus = isControlled ? controlledSelectedStatus : internalSelectedStatus;

    const handleSelectionChange = (label: string): void => {
        const newSelection = selectedStatus !== label ? label : '';

        if (!isControlled) {
            setInternalSelectedStatus(newSelection);
        }

        onChange?.(newSelection);
    };

    useEffect(() => {
        const sum = data.reduce((acc, item) => acc + item.count, 0);
        setTotalCount(sum);
    }, [data]);

    return (
        <Root
            ref={ref}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-horizontal-stacked-bar-root'}
            {...otherProps}
        >
            <LegendContainer className={generatedClasses.legendContainer}>
                {(hideEmptyCategories ? data.filter((item) => item.count > 0) : data).map((item) => (
                    <Legend
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        disabledIcon={item.disabledIcon}
                        count={item.count}
                        variant={item.variant}
                        backgroundColor={item.backgroundColor}
                        selectedStatus={selectedStatus}
                        onClick={(): void => handleSelectionChange(item.label)}
                    />
                ))}
            </LegendContainer>
            <BarContainer className={generatedClasses.barContainer}>
                {data
                    .filter((item) => item.count > 0)
                    .map((item) => (
                        <HorizontalBar
                            key={item.label}
                            name={item.label}
                            color={item.backgroundColor}
                            variant={item.variant}
                            barPercentage={(item.count / totalCount) * 100}
                            selectedStatus={selectedStatus}
                            onClick={(): void => handleSelectionChange(item.label)}
                        />
                    ))}
            </BarContainer>
        </Root>
    );
};

export const HorizontalStackedBar = forwardRef(HorizontalStackedBarRender);

HorizontalStackedBar.displayName = 'HorizontalStackedBar';
