import React, { forwardRef, ReactNode } from 'react';
import { Box, SxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { cx } from '@emotion/css';
import { AnchorPointClasses, AnchorPointClassKey, getAnchorPointUtilityClass } from './AnchorPointClasses';

export type AnchorPointVariant = 'marker' | 'label' | 'card';

// Base props shared across all variants
type AnchorPointProps = {
    /**
     * Horizontal anchor position as a percentage of the image width (0-100)
     */
    x: number;

    /**
     * Vertical anchor position as a percentage of the image height (0-100)
     */
    y: number;

    /**
     * Style override slots
     */
    classes?: AnchorPointClasses;

    /**
     * MUI sx override applied to the root wrapper
     */
    sx?: SxProps;

    /**
     * `HotspotAnchor` instances
     */
    children?: ReactNode;
};

const useUtilityClasses = (ownerState: AnchorPointProps): Record<AnchorPointClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        marker: ['marker'],
        connector: ['connector'],
        content: ['content'],
    };

    return composeClasses(slots, getAnchorPointUtilityClass, classes);
};

type RootProps = Pick<AnchorPointProps, 'x' | 'y'>;

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['x', 'y'].includes(prop.toString()),
})<RootProps>(({ x, y }) => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
}));

const AnchorPointRender: React.ForwardRefRenderFunction<HTMLDivElement, AnchorPointProps> = (
    props: AnchorPointProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const { x, y, sx, children, ...otherProps } = props;

    const generatedClasses = useUtilityClasses(props);

    return (
        <Root
            ref={ref}
            x={x}
            y={y}
            className={cx(generatedClasses.root)}
            sx={sx}
            data-testid="blui-anchor-point-root"
            {...otherProps}
        >
            {children}
        </Root>
    );
};

/**
 * [AnchorPoint](https://brightlayer-ui-components.github.io/react/components/anchor-point) component
 *
 * Positioned at `x`/`y` percentage coordinates relative to its containing image (see `ImageAnnotator`).
 * The `variant` prop controls the visual appearance at the coordinate and whether a connector line is drawn.
 */
export const AnchorPoint = forwardRef(AnchorPointRender);

AnchorPoint.displayName = 'AnchorPoint';
