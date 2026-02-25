import React, { createContext, useContext } from 'react';
import { DrawerVariant } from './types';

type DrawerContextType = {
    open?: boolean;
    variant?: DrawerVariant;
    condensed?: boolean;
    activeItem?: string;
    onItemSelect?: (id: string) => void;
    width?: number | string;
};

export const DrawerContext = createContext<DrawerContextType>({
    open: true,
    variant: 'persistent',
    condensed: false,
});

export const useDrawerContext = (): DrawerContextType => useContext(DrawerContext);

export const DrawerContextProvider: React.FC<React.PropsWithChildren<DrawerContextType>> = (props) => {
    const { children, ...drawerContextProps } = props;

    return <DrawerContext.Provider value={drawerContextProps}>{children}</DrawerContext.Provider>;
}