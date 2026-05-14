import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useDirection } from '../contexts/AppContext';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { blueThemes } from '@brightlayer-ui/react-themes';
document.body.setAttribute('dir', 'rtl');

export const RTLThemeProvider = (props: any): JSX.Element => {
    const dir = useDirection();

    const cacheRtl = useMemo(
        () =>
            createCache({
                key: 'cssrtl',
                prepend: true,
                stylisPlugins: [rtlPlugin],
            }),
        []
    );

    const cacheLtr = useMemo(
        () =>
            createCache({
                key: 'cssltr',
                prepend: true,
            }),
        []
    );

    const theme = useMemo(() => ({ ...blueThemes, direction: dir }), [dir]);

    useEffect(() => {
        document.body.dir = dir;
    }, [dir]);

    return (
        <ThemeProvider theme={theme} defaultMode="light">
            <CacheProvider value={dir === 'ltr' ? cacheLtr : cacheRtl}>{props.children}</CacheProvider>
        </ThemeProvider>
    );
};
