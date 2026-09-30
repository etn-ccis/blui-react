import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { AnchorPoint, AnchorPointProps } from '../AnchorPoint';
import { BLUIColors } from '@brightlayer-ui/colors';

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
    color?: 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'orange' | 'purple';
};

const NEUTRAL_BACKGROUND_LIGHT = 'rgba(255, 255, 255, 0.72)';
const NEUTRAL_BACKGROUND_DARK = 'rgba(14, 18, 24, 0.64)';
const BORDER_COLOR_LIGHT = 'rgba(255, 255, 255, 0.50)';
const BORDER_COLOR_DARK = 'rgba(0, 0, 0, 0.32)';

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
        case 'orange':
            return BLUIColors.orange[500];
        case 'purple':
            return BLUIColors.purple[500];
        case 'neutral':
        default:
            return NEUTRAL_BACKGROUND_LIGHT;
    }
};

const getIconColor = (color?: MarkerProps['color'], theme?: any): string => {
    switch (color) {
        case 'primary':
            return theme.vars?.palette?.primary?.contrastText ?? theme.palette.primary.contrastText;
        case 'success':
            return theme.vars?.palette?.primary?.contrastText ?? theme.palette.primary.contrastText;
        case 'error':
            return theme.vars?.palette?.error?.contrastText ?? theme.palette.error.contrastText;
        case 'warning':
            return theme.vars?.palette?.warning?.contrastText ?? theme.palette.warning.contrastText;
        case 'orange':
            return BLUIColors.black[900];
        case 'purple':
            return theme.vars?.palette?.background?.default ?? theme.palette.background.default;
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
    border: `1px solid ${BORDER_COLOR_LIGHT}`,
    background: getBackgroundColor(color, theme),
    boxShadow: theme.vars?.palette?.shadows?.level1 ?? theme.palette.shadows.level1,
    color: getIconColor(color, theme),
    '& .MuiSvgIcon-root': {
        fontSize: iconSize,
    },
    // CSS-variables themes resolve styles once, so the dark neutral value must come from a color-scheme selector
    ...(!color || color === 'neutral' ? theme.applyStyles('dark', { background: NEUTRAL_BACKGROUND_DARK }) : {}),
    ...theme.applyStyles('dark', { borderColor: BORDER_COLOR_DARK }),
}));

const MarkerRender: React.ForwardRefRenderFunction<unknown, MarkerProps> = (props: MarkerProps, ref: any) => {
    const { icon, iconSize, color, ...otherProps } = props;

    return (
        <AnchorPoint {...otherProps}>
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
