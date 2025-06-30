import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react(), viteTsconfigPaths()],
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000
        port: 3000,
    },
    optimizeDeps: {
        exclude: ['@brightlayer-ui/react-themes', '@brightlayer-ui/react-components'],
    },
    resolve: {
        alias: {
            '@brightlayer-ui/react-components': '../../packages/component-library/src/core',
        },
    },
    build: {
        rollupOptions: {
            plugins: [
                {
                    name: 'debug-alias',
                    buildStart() {
                        console.log('Alias @brightlayer-ui/react-components:', '../../packages/component-library/src/core');
                    },
                },
            ],
        },
    },
});
