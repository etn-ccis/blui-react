import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { AppStore } from '../__types__';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { blueThemes } from '@brightlayer-ui/react-themes';
document.body.setAttribute('dir', 'rtl');

export const RTLThemeProvider = (props: any): JSX.Element => {
    const dir = useSelector((store: AppStore) => store.app.direction);

    const cacheRtl = createCache({
        key: dir === 'rtl' ? 'cssrtl' : 'cssltr',
        prepend: true,
        stylisPlugins: [rtlPlugin],
    });

    const cacheLtr = createCache({
        key: dir === 'ltr' ? 'cssltr' : 'cssrtl',
        prepend: true,
        stylisPlugins: dir === 'ltr' ? undefined : [rtlPlugin],
    });

    useEffect(() => {
        document.body.dir = dir;
    }, [dir]);

    return (
        <ThemeProvider theme={{ ...blueThemes, direction: dir }} defaultMode="light">
            <CacheProvider value={dir === 'ltr' ? cacheLtr : cacheRtl}>
                {props.children}
            </CacheProvider>
        </ThemeProvider>
    );
};
