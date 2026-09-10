import React, { forwardRef, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export type MarkerProps = {
    /**
     * Any icon element placed at the marker position.
     */
    children?: ReactNode;

    /**
     * Width and height of the icon bounding box in px.
     * @default 24
     */
    iconSize?: number;
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'iconSize',
})(({ theme }) => ({
    display: 'flex',
    width: '40px',
    height: '40px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '80px',
    border: '1px solid rgba(255, 255, 255, 0.50)',
    background: 'rgba(255, 255, 255, 0.72)',
    boxShadow: theme.vars.palette.shadows.level1,
}));

const MarkerRender: React.ForwardRefRenderFunction<HTMLDivElement, MarkerProps> = (
    props: MarkerProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const { children, ...otherProps } = props;

    return (
        <Root ref={ref} data-testid="blui-marker-root" {...otherProps}>
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
