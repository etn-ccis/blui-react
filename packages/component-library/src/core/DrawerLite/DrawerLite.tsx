import React from 'react';
import { DrawerContextProvider } from '../Drawer';

type DrawerLiteProps = {
    activeItem: string;
    children: React.ReactNode;
};

export const DrawerLite: React.FC<DrawerLiteProps> = (props) => {
    const { activeItem, children } = props;
    return (
        <DrawerContextProvider open={true} activeItem={activeItem}>
            {children}
        </DrawerContextProvider>
    );
};
