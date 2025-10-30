import React, { forwardRef } from 'react';
import { useDrawerContext } from '../DrawerContext';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

export type DrawerSubheaderProps = BoxProps & {
    /** Optional divider which appears below the Subheader
     *
     * Default: true
     */
    divider?: boolean;
    /** Hide subheader contents when drawer is closed
     *
     * Default: true
     */
    hideContentOnCollapse?: boolean;
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'drawerOpen' && prop !== 'hideContentOnCollapse',
})<{
    drawerOpen: boolean;
    hideContentOnCollapse: boolean;
}>(({ drawerOpen, hideContentOnCollapse }) => ({
    visibility: drawerOpen || !hideContentOnCollapse ? 'inherit' : 'hidden',
}));

const DrawerSubheaderRender: React.ForwardRefRenderFunction<unknown, DrawerSubheaderProps> = (
    props: DrawerSubheaderProps,
    ref: any
) => {
    const { children, divider = true, hideContentOnCollapse = true, ...otherProps } = props;
    const { open: drawerOpen = true } = useDrawerContext();

    return (
        <>
            <Root
                ref={ref}
                data-testid={'blui-drawer-sub-header'}
                drawerOpen={drawerOpen}
                hideContentOnCollapse={hideContentOnCollapse}
                {...otherProps}
            >
                {children}
            </Root>
            {divider && <Divider />}
        </>
    );
};
/**
 * [DrawerSubheader](https://brightlayer-ui-components.github.io/react/components/drawer-subheader) component
 *
 * The `<DrawerSubheader>` is an optional section that renders below the header and above the body of the `<Drawer>`. It can be used to support custom content (passed as children), such as filtering options or to display additional information.
 */
export const DrawerSubheader = forwardRef(DrawerSubheaderRender);

DrawerSubheader.displayName = 'DrawerSubheader';
