import React, { ReactNode, forwardRef } from 'react';
import { cx } from '@emotion/css';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ThreeLinerClasses, ThreeLinerClassKey, getThreeLinerUtilityClass } from './ThreeLinerClasses';
import { unstable_composeClasses as composeClasses } from '@mui/material';

const useUtilityClasses = (ownerState: ThreeLinerProps): Record<ThreeLinerClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        title: ['title'],
        subtitle: ['subtitle'],
        info: ['info'],
    };

    return composeClasses(slots, getThreeLinerUtilityClass, classes);
};

export type ThreeLinerProps = BoxProps & {
    /** First Line Content */
    title?: ReactNode;

    /** Second Line Content */
    subtitle?: ReactNode;

    /** Third Line Content */
    info?: ReactNode;

    /** Time in milliseconds to transition between states
     *
     * Default: theme.transitions.duration.standard
     */
    animationDuration?: number;

    /** Custom classes for default style overrides */
    classes?: Partial<ThreeLinerClasses>;
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['animationDuration'].includes(prop.toString()),
})<Pick<ThreeLinerProps, 'animationDuration'>>(({ animationDuration, theme }) => ({
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: theme.transitions.create(['all'], {
        duration: animationDuration || theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
    }),
}));

const Title = styled(Box, {
    shouldForwardProp: (prop) => !['animationDuration'].includes(prop.toString()),
})<Pick<ThreeLinerProps, 'animationDuration'>>(({ animationDuration, theme }) => ({
    fontSize: '1.875rem',
    transition: theme.transitions.create(['all'], {
        duration: animationDuration || theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
    }),
}));

const Subtitle = styled(Box, {
    shouldForwardProp: (prop) => !['animationDuration'].includes(prop.toString()),
})<Pick<ThreeLinerProps, 'animationDuration'>>(({ animationDuration, theme }) => ({
    fontSize: '1rem',
    transition: theme.transitions.create(['all'], {
        duration: animationDuration || theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
    }),
}));

const Info = styled(Box, {
    shouldForwardProp: (prop) => !['animationDuration'].includes(prop.toString()),
})<Pick<ThreeLinerProps, 'animationDuration'>>(({ animationDuration, theme }) => ({
    fontSize: '0.875rem',
    transition: theme.transitions.create(['all'], {
        duration: animationDuration || theme.transitions.duration.standard,
        easing: theme.transitions.easing.easeInOut,
    }),
    fontWeight: 300,
}));

const ThreeLinerRenderer: React.ForwardRefRenderFunction<unknown, ThreeLinerProps> = (
    props: ThreeLinerProps,
    ref: any
) => {
    const {
        title,
        subtitle,
        info,
        className: userClassName,
        // ignore unused vars so that we can do prop transferring to the root element

        animationDuration,
        ...otherProps
    } = props;
    const generatedClasses = useUtilityClasses(props);
    //const animationDuration = durationProp || theme.transitions.duration.standard;
    return (
        <Root
            ref={ref}
            {...otherProps}
            animationDuration={animationDuration}
            className={cx(generatedClasses.root, userClassName)}
        >
            <Title className={generatedClasses.title}>{title}</Title>
            <Subtitle className={generatedClasses.subtitle}>{subtitle}</Subtitle>
            <Info className={generatedClasses.info}>{info}</Info>
        </Root>
    );
};
/**
 * [ThreeLiner](https://brightlayer-ui-components.github.io/react/components/three-liner) component
 *
 * The `ThreeLiner` can display up to three lines of stylized text or other custom content. It is most commonly used within the context of a [`AppBar`](./AppBar.md) component where the text can grow / shrink as the App Bar is expanded and collapsed.
 */
export const ThreeLiner = forwardRef(ThreeLinerRenderer);
ThreeLiner.displayName = 'ThreeLiner';
