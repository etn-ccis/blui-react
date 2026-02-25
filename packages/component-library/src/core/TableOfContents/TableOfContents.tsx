import React from "react";
import { DrawerContextProvider } from "../Drawer";

type TableOfContentsProps = {
    activeItem: string;
    children: React.ReactNode;
}

export const TableOfContents: React.FC<TableOfContentsProps> = (props) => {
    const { activeItem, children } = props;
    return (
        <DrawerContextProvider open={true} activeItem={activeItem}>
            {children}
        </DrawerContextProvider>
    )
}