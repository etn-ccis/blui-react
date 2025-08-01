import React, { ReactNode, forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import { ChannelValue, ChannelValueProps as ChannelValuePropsType } from '../ChannelValue';
import { cx } from '@emotion/css';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { getHeroUtilityClass, HeroClasses, HeroClassKey } from './HeroClasses';

const useUtilityClasses = (ownerState: HeroProps): Record<HeroClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
        icon: ['icon'],
        label: ['label'],
        values: ['values'],
    };

    return composeClasses(slots, getHeroUtilityClass, classes);
};

const normalizeIconSize = (size: number): number => Math.max(10, size);

export type HeroProps = BoxProps & {
    /** Custom classes for default style overrides */
    classes?: HeroClasses;
    /** The primary icon */
    icon: ReactNode;
    /** The color used behind the primary icon
     *
     * Default: 'transparent
     */
    iconBackgroundColor?: string;
    /** The size of the primary icon (min 10px)
     *
     * Default: 36
     */
    iconSize?: number | string;
    /** The text shown below the `ChannelValue` */
    label: string;
    /** Props to be passed through to ChannelValue child component */
    ChannelValueProps?: ChannelValuePropsType;
};

const Root = styled(
    Box,
    {}
)<Pick<HeroProps, 'onClick'>>(({ onClick, theme }) => ({
    fontSize: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: '1 1 0px',
    overflow: 'hidden',
    color: (theme.vars || theme).palette.text.primary,
    padding: `1rem ${theme.spacing()}`,
    cursor: onClick ? 'pointer' : 'inherit',
}));

const Icon = styled(Box, {
    shouldForwardProp: (prop) => !['iconSize', 'iconBackgroundColor'].includes(prop.toString()),
})<Pick<HeroProps, 'iconSize' | 'iconBackgroundColor'>>(({ iconSize, iconBackgroundColor, theme }) => ({
    lineHeight: 1,
    color: (theme.vars || theme).palette.text.secondary,
    marginBottom: '.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: `.25rem ${theme.spacing(0.5)}`,
    borderRadius: '50%',
    fontSize: typeof iconSize === 'number' ? normalizeIconSize(iconSize) : iconSize,
    height: typeof iconSize === 'number' ? Math.max(44, iconSize) : iconSize,
    width: typeof iconSize === 'number' ? Math.max(44, iconSize) : iconSize,
    backgroundColor: iconBackgroundColor,
}));

const Values = styled(
    Box,
    {}
)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: (theme.vars || theme).palette.text.primary,
    lineHeight: 1.2,
    maxWidth: '100%',
    overflow: 'hidden',
    fontSize: '1.25rem',
}));

const Label = styled(
    Typography,
    {}
)(() => ({
    fontSize: 'inherit',
    lineHeight: 1.2,
    letterSpacing: 0,
    fontWeight: 600,
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}));

const HeroRender: React.ForwardRefRenderFunction<unknown, HeroProps> = (props: HeroProps, ref: any) => {
    const generatedClasses = useUtilityClasses(props);
    const {
        className: userClassName,
        icon,
        label,
        ChannelValueProps,
        // ignore unused vars so that we can do prop transferring to the root element

        iconBackgroundColor = 'transparent',
        iconSize = 36,

        ...otherProps
    } = props;

    return (
        <Root
            ref={ref}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-hero-root'}
            {...otherProps}
        >
            <Icon className={generatedClasses.icon} iconSize={iconSize} iconBackgroundColor={iconBackgroundColor}>
                {icon}
            </Icon>
            <Values as={'span'} className={generatedClasses.values}>
                {!props.children && ChannelValueProps?.value && (
                    <ChannelValue fontSize={ChannelValueProps?.fontSize} {...ChannelValueProps} />
                )}
                {props.children}
            </Values>
            <Label variant={'body1'} color={'inherit'} className={generatedClasses.label}>
                {label}
            </Label>
        </Root>
    );
};
/**
 * [Hero](https://brightlayer-ui-components.github.io/react/components/hero) component
 *
 * The `<Hero>` component displays a particular icon, value/units, and a label. The icon property will accept any valid component - this will typically be a Material icon, [Brightlayer UI icon](https://github.com/etn-ccis/blui-icons), or [Progress Icon](https://github.com/etn-ccis/blui-progress-icons). It will also accept Text/Emoji values.
 */
export const Hero = forwardRef(HeroRender);

Hero.displayName = 'Hero';
