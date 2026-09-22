import React, { forwardRef, ReactNode } from 'react';
import { Box, SxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { cx } from '@emotion/css';
import { AnchorPointClasses, AnchorPointClassKey, getAnchorPointUtilityClass } from './AnchorPointClasses';

export type AnchorPointVariant = 'marker' | 'label' | 'card';

// Base props shared across all variants
export type AnchorPointProps = {
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
     * Anchor content (e.g., `<Marker />`, `<Label />`, or `<Card />`).
     */
    children?: ReactNode;

    /**
     * Optional callout boolean associated with the anchor point.
     */
    callout?: boolean;
    direction?: 'top' | 'down' | 'left' | 'right';
    lineLength?: number;
    lineColor?: string | [string, string];
    lineWidth?: number;
    autoFlip?: boolean;
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
    gap: '4px',
}));

const Dot = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '18px',
    height: '18px',
    flexShrink: 0,
    borderRadius: '50%',
    backgroundColor: '#353c44',
    border: '1px solid rgba(255, 255, 255, 0.72)',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.24), 0 1px 4px rgba(0, 0, 0, 0.32)',
    filter: 'blur(1px)',
}));

const Connector = styled(Box)(
    ({
        lineLength = 120,
        lineColor,
        lineWidth = 1,
    }: {
        lineLength?: number;
        lineColor?: string | [string, string];
        lineWidth?: number;
    }) => ({
        width: `${lineLength}px`,
        height: `${lineWidth}px`,
        backgroundColor: lineColor ?? '#fff',
        filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.40))',
    })
);

const AnchorPointRender: React.ForwardRefRenderFunction<HTMLDivElement, AnchorPointProps> = (
    props: AnchorPointProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const {
        x,
        y,
        sx,
        children,
        classes = {},
        callout = false,
        // direction = 'right',
        lineLength = 120,
        lineColor,
        lineWidth,
        // autoFlip,
        ...otherProps
    } = props;
    const generatedClasses = useUtilityClasses({ ...props, classes });

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
            {callout ? (
                <>
                    <Dot>
                        <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fff' }} />
                    </Dot>
                    <Connector lineLength={lineLength} lineColor={lineColor} lineWidth={lineWidth} />
                    {children}
                </>
            ) : (
                children
            )}
        </Root>
    );
};

/**
 * [AnchorPoint](https://brightlayer-ui-components.github.io/react/components/anchor-point) component
 *
 * Positioned at `x`/`y` percentage coordinates relative to its containing image (see `ImageAnnotator`).
 */
export const AnchorPoint = forwardRef(AnchorPointRender);

AnchorPoint.displayName = 'AnchorPoint';
