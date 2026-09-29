import { cx } from '@emotion/css';
import { styled } from '@mui/material/styles';
import { AnchorDot, AnchorDotProps } from './AnchorDot';
import React, { forwardRef, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Box, SxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { AnchorPointClasses, AnchorPointClassKey, getAnchorPointUtilityClass } from './AnchorPointClasses';

export type AnchorPointVariant = 'marker' | 'label' | 'card';

// Base props shared across all variants
type AnchorPointBaseProps = {
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
     * Color of the anchor dot. Accepts `default`, `blue`, or any CSS color string.
     */
    anchorDotColor?: AnchorDotProps['anchorDotColor'];
};

type AnchorPointDirection = 'top' | 'bottom' | 'down' | 'left' | 'right';

const oppositeDirection: Record<AnchorPointDirection, AnchorPointDirection> = {
    top: 'bottom',
    bottom: 'top',
    down: 'top',
    left: 'right',
    right: 'left',
};

type AnchorPointCalloutProps = {
    /**
     * Enables the connector between the anchor point and its content.
     */
    callout: true;

    /**
     * Direction of the callout relative to the anchor point.
     */
    direction?: AnchorPointDirection;

    /**
     * Length of the callout connector line in pixels.
     */
    connectorLength?: number;

    /**
     * Color of the callout connector line. Can be a single color or a gradient defined by two colors.
     */
    connectorColor?: string | [string, string];

    /**
     * Width of the callout connector line in pixels.
     */
    connectorThickness?: number;

    /**
     * Automatically flips the callout to the opposite direction if it would overflow the image boundaries.
     */
    autoFlip?: boolean;
};

type AnchorPointWithoutCalloutProps = {
    /**
     * Optional callout boolean associated with the anchor point.
     */
    callout?: false;

    /**
     * These props cannot be passed when callout is false.
     */
    direction?: never;
    connectorLength?: never;
    connectorColor?: never;
    connectorThickness?: never;
    autoFlip?: never;
};

export type AnchorPointProps = AnchorPointBaseProps & (AnchorPointCalloutProps | AnchorPointWithoutCalloutProps);

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

type RootProps = Pick<AnchorPointProps, 'x' | 'y'> & { callout: boolean };

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['x', 'y', 'callout'].includes(prop.toString()),
})<RootProps>(({ x, y, callout }) => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    ...(callout && { width: '18px', height: '18px' }),
}));

const Dot = styled(AnchorDot)(() => ({
    position: 'absolute',
    inset: '-2px',
    flexShrink: 0,
}));

// fades from opaque near the anchor dot to translucent near the callout content, per Figma
const defaultLineColor: [string, string] = ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.24)'];

const Connector = styled(Box, {
    shouldForwardProp: (prop) =>
        !['direction', 'connectorLength', 'connectorColor', 'connectorThickness'].includes(prop.toString()),
})(
    ({
        direction,
        connectorLength = 120,
        connectorColor = defaultLineColor,
        connectorThickness = 2,
    }: {
        direction: AnchorPointDirection;
        connectorLength?: number;
        connectorColor?: string | [string, string];
        connectorThickness?: number;
    }) => ({
        width: direction === 'left' || direction === 'right' ? `${connectorLength}px` : `${connectorThickness}px`,
        height: direction === 'left' || direction === 'right' ? `${connectorThickness}px` : `${connectorLength}px`,
        ...(Array.isArray(connectorColor)
            ? {
                  background: `linear-gradient(to ${direction === 'down' ? 'bottom' : direction}, ${connectorColor[0]}, ${connectorColor[1]})`,
              }
            : { backgroundColor: connectorColor }),
        filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.40))',
        flexShrink: 0,
    })
);

const CalloutContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'direction',
})<{ direction: AnchorPointDirection }>(({ direction }) => ({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    ...(direction === 'right' && {
        left: 'calc(100% + 4px)',
        top: '50%',
        transform: 'translateY(-50%)',
        flexDirection: 'row',
    }),
    ...(direction === 'left' && {
        right: 'calc(100% + 4px)',
        top: '50%',
        transform: 'translateY(-50%)',
        flexDirection: 'row-reverse',
    }),
    ...(direction === 'top' && {
        bottom: 'calc(100% + 4px)',
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: 'column-reverse',
    }),
    ...((direction === 'bottom' || direction === 'down') && {
        top: 'calc(100% + 4px)',
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: 'column',
    }),
}));

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
        direction = 'right',
        connectorLength = 120,
        connectorColor,
        connectorThickness,
        autoFlip = true,
        anchorDotColor,
        ...otherProps
    } = props;
    const generatedClasses = useUtilityClasses({ ...props, classes });

    const contentRef = useRef<HTMLDivElement>(null);
    const [effectiveDirection, setEffectiveDirection] = useState<AnchorPointDirection>(direction);

    useLayoutEffect((): (() => void) | undefined => {
        if (!callout || !autoFlip) {
            setEffectiveDirection(direction);
            return undefined;
        }

        const isHorizontal = direction === 'left' || direction === 'right';

        const checkOverflow = (): void => {
            const contentEl = contentRef.current;
            // the anchor root (dot + content) is the content's parent, sized independently of the callout direction
            const anchorRootEl = contentEl?.parentElement;
            const container = anchorRootEl?.closest('[data-testid="blui-image-annotator-root"]');
            if (!contentEl || !anchorRootEl || !container) return;

            const contentRect = contentEl.getBoundingClientRect();
            const anchorRect = anchorRootEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // content size doesn't change when flipping to the opposite side, only its position does
            if (isHorizontal) {
                const anchorCenterX = anchorRect.left + anchorRect.width / 2;
                const spaceRight = containerRect.right - anchorCenterX;
                const spaceLeft = anchorCenterX - containerRect.left;
                const fitsPreferred =
                    direction === 'right' ? contentRect.width <= spaceRight : contentRect.width <= spaceLeft;
                const fitsOpposite =
                    direction === 'right' ? contentRect.width <= spaceLeft : contentRect.width <= spaceRight;

                if (fitsPreferred) setEffectiveDirection(direction);
                else if (fitsOpposite) setEffectiveDirection(oppositeDirection[direction]);
                // neither side fits: keep whichever side has more room to minimize overflow
                else setEffectiveDirection(spaceRight >= spaceLeft ? 'right' : 'left');
            } else {
                const anchorCenterY = anchorRect.top + anchorRect.height / 2;
                const spaceBottom = containerRect.bottom - anchorCenterY;
                const spaceTop = anchorCenterY - containerRect.top;
                const isBottomLike = direction === 'bottom' || direction === 'down';
                const fitsPreferred = isBottomLike ? contentRect.height <= spaceBottom : contentRect.height <= spaceTop;
                const fitsOpposite = isBottomLike ? contentRect.height <= spaceTop : contentRect.height <= spaceBottom;

                if (fitsPreferred) setEffectiveDirection(direction);
                else if (fitsOpposite) setEffectiveDirection(oppositeDirection[direction]);
                else
                    setEffectiveDirection(spaceBottom >= spaceTop ? (direction === 'down' ? 'down' : 'bottom') : 'top');
            }
        };

        checkOverflow();

        const contentEl = contentRef.current;
        const anchorRootEl = contentEl?.parentElement;
        const container = anchorRootEl?.closest('[data-testid="blui-image-annotator-root"]');
        // ResizeObserver also catches container size changes from async image loads, not just window resizes
        const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(checkOverflow) : undefined;
        if (container) resizeObserver?.observe(container);
        if (anchorRootEl) resizeObserver?.observe(anchorRootEl);
        // re-evaluate if the callout content itself resizes (e.g., label/card content changes post-mount)
        if (contentEl) resizeObserver?.observe(contentEl);
        window.addEventListener('resize', checkOverflow);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, [callout, autoFlip, direction, x, y]);

    return (
        <Root
            ref={ref}
            x={x}
            y={y}
            callout={callout}
            className={cx(generatedClasses.root)}
            sx={sx}
            data-testid="blui-anchor-point-root"
            {...otherProps}
        >
            {callout ? (
                <>
                    <Dot anchorDotColor={anchorDotColor} />
                    <CalloutContent ref={contentRef} direction={effectiveDirection}>
                        <Connector
                            direction={effectiveDirection}
                            connectorLength={connectorLength}
                            connectorColor={connectorColor}
                            connectorThickness={connectorThickness}
                        />
                        {children}
                    </CalloutContent>
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
