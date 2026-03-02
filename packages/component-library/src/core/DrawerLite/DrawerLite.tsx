import React from 'react';
import { DrawerContextProvider } from '../Drawer';

type DrawerLiteProps = {
    activeItem: string;
    children: React.ReactNode;
};

/**
 * DrawerLite is a simplified version of the Drawer component that provides
 * a navigation container with drawer context but without the full drawer functionality.
 *
 * @param props - The props for the DrawerLite component
 * @param props.activeItem - The identifier of the currently active navigation item
 * @param props.children - The content to be rendered inside the drawer context
 *
 * @returns A DrawerContextProvider wrapping the children with the drawer context always open
 */

export const DrawerLite: React.FC<DrawerLiteProps> = (props) => {
    const { activeItem, children } = props;
    return (
        <DrawerContextProvider open={true} activeItem={activeItem}>
            {children}
        </DrawerContextProvider>
    );
};
