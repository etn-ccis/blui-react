import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DrawerLayout } from '@brightlayer-ui/react-components';
import { NavigationDrawer } from './NavigationDrawer';
import { SharedAppBar } from '../components/SharedAppBar';
import { SimpleNavItem, pageDefinitions } from './navigation';
import { useSelector } from 'react-redux';
import { AppStore } from '../__types__';
import { useColorScheme } from '@mui/material';

const buildRoutes = (routes: SimpleNavItem[], url: string): JSX.Element[] => {
    let ret: any[] = [];
    for (const route of routes) {
        if (route.component) {
            ret.push(
                <Route path={`${url}${route.url || ''}`} element={route.component} key={`${url}/${route.url || ''}`} />
            );
        }
        if (route.pages) {
            ret = ret.concat(buildRoutes(route.pages || [], `${url}${route.url || ''}`));
        }
    }
    return ret;
};

const ScrollToTop = (): null => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const MainRouter: React.FC = () => {
    const title = useSelector((state: AppStore) => state.app.pageTitle);
    const { setMode } = useColorScheme();

    useEffect(() => {
        setMode('light');
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <DrawerLayout
                sx={{
                    display: 'block',
                    '& .BluiDrawerLayout-drawer': {
                        zIndex: 'modal',
                    },
                    '& .MuiAppBar-root': {
                        zIndex: 'modal',
                    },
                }}
                drawer={<NavigationDrawer />}
            >
                <SharedAppBar title={title} />
                <Routes>
                    {buildRoutes(pageDefinitions, '')}

                    <Route path="*" element={<Navigate to={'/templates/dashboard'} />} />
                </Routes>
            </DrawerLayout>
        </Router>
    );
};
