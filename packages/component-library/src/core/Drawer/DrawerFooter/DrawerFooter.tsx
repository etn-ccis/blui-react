import React, { forwardRef } from 'react';
import Divider from '@mui/material/Divider';
import { useDrawerContext } from '../DrawerContext';
import { styled, Theme, SxProps } from '@mui/material/styles';
import { cx } from '@emotion/css';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import drawerFooterClasses, {
    DrawerFooterClasses,
    DrawerFooterClassKey,
    getDrawerFooterUtilityClass,
} from './DrawerFooterClasses';
import Box, { BoxProps } from '@mui/material/Box';

const useUtilityClasses = (ownerState: DrawerFooterProps): Record<DrawerFooterClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        hidden: ['hidden'],
    };

    return composeClasses(slots, getDrawerFooterUtilityClass, classes);
};

export type DrawerFooterProps = BoxProps & {
    /** Custom classes for default style overrides */
    classes?: DrawerFooterClasses;
    /** The color used for the background  */
    backgroundColor?: string;
    /** Optional divider which appears above footer
     *
     * Default: true
     */
    divider?: boolean;
    /** Hide footer contents when drawer is closed
     *
     * Default: true
     */
    hideContentOnCollapse?: boolean;
    /** Optional sx props to apply style overrides */
    sx?: SxProps<Theme>;
};

const Root = styled(
    Box,
    {}
)<Pick<DrawerFooterProps, 'backgroundColor'>>(({ backgroundColor }) => ({
    width: '100%',
    backgroundColor: backgroundColor,
    [`&.${drawerFooterClasses.hidden}`]: {
        visibility: 'hidden',
    },
}));

const DrawerFooterRender: React.ForwardRefRenderFunction<unknown, DrawerFooterProps> = (
    props: DrawerFooterProps,
    ref: any
) => {
    const { classes = {}, divider = true, hideContentOnCollapse = true, ...restProps } = props;

    const generatedClasses = useUtilityClasses({ ...props, classes });
    const {
        className: userClassName,
        children,
        // ignore unused vars so that we can do prop transferring to the root element

        backgroundColor,

        sx,
        ...otherProps
    } = restProps;
    const { open: drawerOpen = true } = useDrawerContext();
    return (
        <>
            {divider && <Divider />}
            <Root
                ref={ref}
                data-testid={'blui-drawer-footer'}
                className={cx(
                    generatedClasses.root,
                    { [generatedClasses.hidden]: !drawerOpen && hideContentOnCollapse },
                    userClassName
                )}
                backgroundColor={backgroundColor}
                sx={sx}
                {...otherProps}
            >
                {children}
            </Root>
        </>
    );
};

/**
 * [DrawerFooter](https://brightlayer-ui-components.github.io/react/components/drawer-footer) component
 *
 * The `<DrawerFooter>` is an optional section that renders at the bottom of the `<Drawer>`. It can be used to add any custom content (as children).
 */
export const DrawerFooter = forwardRef(DrawerFooterRender);
DrawerFooter.displayName = 'DrawerFooter';
