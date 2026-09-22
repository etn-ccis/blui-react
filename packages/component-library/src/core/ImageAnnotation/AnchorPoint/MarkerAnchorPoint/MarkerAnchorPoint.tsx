import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { AnchorPoint, AnchorPointProps } from '../AnchorPoint';

export type MarkerProps = AnchorPointProps & {
    /**
     * Any icon element placed at the marker position.
     */
    icon: React.JSX.Element;

    /**
     * Width and height of the icon bounding box in px.
     * @default 24
     */
    iconSize?: number;

    /**
     * Color of the marker icon container.
     */
    color?: 'neutral' | 'primary' | 'success' | 'error' | 'warning';
};

const getBackgroundColor = (color?: MarkerProps['color'], theme?: any): string => {
    switch (color) {
        case 'primary':
            return theme.vars?.palette?.primary?.main ?? theme.palette.primary.main;
        case 'success':
            return theme.vars?.palette?.success?.main ?? theme.palette.success.main;
        case 'error':
            return theme.vars?.palette?.error?.main ?? theme.palette.error.main;
        case 'warning':
            return theme.vars?.palette?.warning?.main ?? theme.palette.warning.main;
        case 'neutral':
        default:
            return theme.vars?.palette?.background?.paper ?? theme.palette.background.paper;
    }
};

const getIconColor = (color?: MarkerProps['color'], theme?: any): string => {
    switch (color) {
        case 'primary':
            return theme.vars?.palette?.primary?.contrastText ?? theme.palette.primary.contrastText;
        case 'success':
            return theme.vars?.palette?.success?.contrastText ?? theme.palette.success.contrastText;
        case 'error':
            return theme.vars?.palette?.error?.contrastText ?? theme.palette.error.contrastText;
        case 'warning':
            return theme.vars?.palette?.warning?.contrastText ?? theme.palette.warning.contrastText;
        case 'neutral':
        default:
            return theme.vars?.palette?.text?.primary ?? theme.palette.text.primary;
    }
};

const Icon = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'iconSize',
})<Pick<MarkerProps, 'iconSize' | 'color'>>(({ theme, iconSize, color }) => ({
    display: 'flex',
    width: iconSize ?? 40,
    height: iconSize ?? 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '80px',
    border: `1px solid ${theme.vars?.palette?.divider ?? theme.palette.divider}`,
    backgroundColor: getBackgroundColor(color, theme),
    boxShadow: theme.vars?.palette.shadows.level1 ?? theme.shadows[1],
    color: getIconColor(color, theme),
    '& .MuiSvgIcon-root': {
        fontSize: iconSize,
    },
}));

const MarkerRender: React.ForwardRefRenderFunction<unknown, MarkerProps> = (props: MarkerProps, ref: any) => {
    const { icon, iconSize, color, ...otherProps } = props;

    return (
        <AnchorPoint {...props}>
            <Icon ref={ref} data-testid="blui-marker-root" iconSize={iconSize} color={color} {...otherProps}>
                {icon}
            </Icon>
        </AnchorPoint>
    );
};

/**
 * [Marker](https://brightlayer-ui-components.github.io/react/components/marker) component
 *
 * Renders an icon inside a fixed-size bounding box for placement in a scene annotation.
 */
export const MarkerAnchorPoint = forwardRef(MarkerRender);

MarkerAnchorPoint.displayName = 'MarkerAnchorPoint';
