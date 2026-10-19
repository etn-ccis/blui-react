import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { AnchorPoint, AnchorPointProps } from '../components';
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
const SUCCESS_BACKGROUND_LIGHT = BLUIColors.green[900];
const SUCCESS_BACKGROUND_DARK = BLUIColors.green[300];
const ERROR_BACKGROUND_LIGHT = BLUIColors.red[500];
const ERROR_BACKGROUND_DARK = BLUIColors.red[300];
const WARNING_BACKGROUND_LIGHT = BLUIColors.yellow[500];
const WARNING_BACKGROUND_DARK = BLUIColors.yellow[800];
const ORANGE_BACKGROUND_LIGHT = BLUIColors.orange[400];
const ORANGE_BACKGROUND_DARK = BLUIColors.orange[200];
const PURPLE_BACKGROUND_LIGHT = BLUIColors.purple[500];
const PURPLE_BACKGROUND_DARK = BLUIColors.purple[200];

const BORDER_COLOR_LIGHT = 'rgba(255, 255, 255, 0.50)';
const BORDER_COLOR_DARK = 'rgba(0, 0, 0, 0.32)';

const getBackgroundColor = (color: MarkerProps['color'], theme: any, isDark = false): string => {
    switch (color) {
        case 'primary':
            return theme.vars?.palette?.primary?.main ?? theme.palette.primary.main;
        case 'success':
            return isDark ? SUCCESS_BACKGROUND_DARK : SUCCESS_BACKGROUND_LIGHT;
        case 'error':
            return isDark ? ERROR_BACKGROUND_DARK : ERROR_BACKGROUND_LIGHT;
        case 'warning':
            return isDark ? WARNING_BACKGROUND_DARK : WARNING_BACKGROUND_LIGHT;
        case 'orange':
            return isDark ? ORANGE_BACKGROUND_DARK : ORANGE_BACKGROUND_LIGHT;
        case 'purple':
            return isDark ? PURPLE_BACKGROUND_DARK : PURPLE_BACKGROUND_LIGHT;
        case 'neutral':
        default:
            return isDark ? NEUTRAL_BACKGROUND_DARK : NEUTRAL_BACKGROUND_LIGHT;
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
    width: 40,
    height: 40,
    padding: iconSize - 12,
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
    ...theme.applyStyles('dark', {
        background: getBackgroundColor(color, theme, true),
        borderColor: BORDER_COLOR_DARK,
    }),
}));

const MarkerRender: React.ForwardRefRenderFunction<unknown, MarkerProps> = (props: MarkerProps, ref: any) => {
    const { icon, iconSize = 24, color, ...otherProps } = props;

    return (
        <AnchorPoint {...otherProps}>
            <Icon ref={ref} data-testid="blui-marker-root" iconSize={iconSize} color={color}>
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
