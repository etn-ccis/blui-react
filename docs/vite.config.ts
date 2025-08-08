/* eslint-disable */

/// <reference types='vitest' />
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import prism from 'vite-plugin-prismjs';

export default defineConfig({
    base: '/',
    plugins: [
        react(),
        viteTsconfigPaths(),
        mdx({
            remarkPlugins: [remarkGfm],
            providerImportSource: '@mdx-js/react',
        }),
        prism({
            languages: ['javascript', 'css', 'html', 'typescript', 'jsx'],
            plugins: ['line-numbers'],
            theme: 'tomorrow',
            css: true,
        }),
    ],
    server: {
        port: 3000,
        host: 'localhost',
        open: true,
    },
    preview: {
        port: 3001,
        host: 'localhost',
        open: true,
    },
    build: {
        outDir: 'build',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    optimizeDeps: {
        exclude: ['@brightlayer-ui/react-themes', '@brightlayer-ui/react-components'],
    },
    define: {
        // Only expose specific environment variables
        'import.meta.env.VITE_REACT_APP_GAID': JSON.stringify(process.env.VITE_REACT_APP_GAID),
        'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(process.env.VITE_PUBLIC_URL),
        'import.meta.env.VITE_REACT_APP_BRANCH': JSON.stringify(process.env.VITE_REACT_APP_BRANCH),
    },
    test: {
        name: 'Docs',
        watch: false,
        globals: true,
        environment: 'jsdom',
        reporters: ['default'],
        coverage: {
            reportsDirectory: 'coverage',
            provider: 'v8',
        },
        setupFiles: './src/setupTests.ts',
    },
});
