import React, { ReactElement, useState, CSSProperties, forwardRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { DrawerProps as DrawerComponentProps } from '../Drawer/Drawer';
import { DrawerLayoutContext } from './contexts/DrawerLayoutContextProvider';
import { cx } from '@emotion/css';
import Box, { BoxProps } from '@mui/material/Box';
import drawerLayoutClasses, {
    DrawerLayoutClasses,
    DrawerLayoutClassKey,
    getDrawerLayoutUtilityClass,
} from './DrawerLayoutClasses';
import { unstable_composeClasses as composeClasses } from '@mui/material';

const useUtilityClasses = (ownerState: DrawerLayoutProps): Record<DrawerLayoutClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        content: ['content'],
        drawer: ['drawer'],
        expanded: ['expanded'],
    };

    return composeClasses(slots, getDrawerLayoutUtilityClass, classes);
};

const Root = styled(
    Box,
    {}
)(({ theme }) => ({
    display: 'block',
    width: '100%',
    '&$expanded $content': {
        transition: theme.transitions.create('padding', {
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    [`& .${drawerLayoutClasses.expanded}`]: {},
}));

const Drawer = styled(
    Box,
    {}
)(() => ({
    display: 'flex',
    position: 'fixed',
    height: '100%',
    alignItems: 'stretch',
}));

const Content = styled(
    Box,
    {}
)(({ theme }) => ({
    width: '100%',
    transition: theme.transitions.create('padding', { duration: theme.transitions.duration.leavingScreen }),
    zIndex: 0,
}));

export type DrawerLayoutProps = BoxProps & {
    /** Custom classes for default style overrides */
    classes?: DrawerLayoutClasses;

    /** Drawer component to be embedded */
    drawer: ReactElement<DrawerComponentProps>;
};

const DrawerLayoutRender: React.ForwardRefRenderFunction<unknown, DrawerLayoutProps> = (
    props: DrawerLayoutProps,
    ref: any
) => {
    const { children, drawer, classes = {}, className: userClassName, ...otherProps } = props;
    const theme = useTheme();
    const [padding, setPadding] = useState<number | string>(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const generatedClasses = useUtilityClasses({ ...props, classes });

    const style: CSSProperties = { paddingLeft: 0, paddingRight: 0 };
    style.paddingLeft = theme.direction === 'ltr' ? padding : 0;
    style.paddingRight = theme.direction === 'rtl' ? padding : 0;

    return (
        <DrawerLayoutContext.Provider
            value={{
                setPadding,
                setDrawerOpen,
            }}
        >
            <Root
                ref={ref}
                className={cx(
                    generatedClasses.root,
                    {
                        [generatedClasses.expanded]: drawerOpen,
                    },
                    userClassName
                )}
                {...otherProps}
            >
                <Drawer className={generatedClasses.drawer}>{drawer}</Drawer>
                <Content className={generatedClasses.content} style={style}>
                    {children}
                </Content>
            </Root>
        </DrawerLayoutContext.Provider>
    );
};
/**
 * [DrawerLayout](https://brightlayer-ui-components.github.io/react/components/drawer-layout) component
 *
 * The `<DrawerLayout>` component is used to provide the appropriate resizing behavior for your main application content when used in conjunction with a Brightlayer UI `<Drawer>`. It accepts a `<Drawer>` as a prop, and the main page content is passed in through child elements.
 */
export const DrawerLayout = forwardRef(DrawerLayoutRender);
DrawerLayout.displayName = 'DrawerLayout';
