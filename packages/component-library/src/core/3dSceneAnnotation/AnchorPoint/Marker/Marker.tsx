import React, { forwardRef, ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export type MarkerProps = BoxProps & {
    /**
     * Any icon element placed at the marker position.
     */
    children: ReactNode;

    /**
     * Width and height of the icon bounding box in px.
     * @default 24
     */
    iconSize?: number;
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'iconSize',
})<Pick<MarkerProps, 'iconSize'>>(({ iconSize }) => ({
    alignItems: 'center',
    display: 'flex',
    height: iconSize,
    justifyContent: 'center',
    lineHeight: 1,
    width: iconSize,
}));

const MarkerRender: React.ForwardRefRenderFunction<HTMLDivElement, MarkerProps> = (
    props: MarkerProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const { children, iconSize = 24, ...otherProps } = props;

    return (
        <Root ref={ref} iconSize={iconSize} data-testid="blui-marker-root" {...otherProps}>
            {children}
        </Root>
    );
};

/**
 * [Marker](https://brightlayer-ui-components.github.io/react/components/marker) component
 *
 * Renders an icon inside a fixed-size bounding box for placement in a scene annotation.
 */
export const Marker = forwardRef(MarkerRender);

Marker.displayName = 'Marker';
