/// <reference types="node" />
/// <reference types="react-dom" />

import * as React from 'react';

declare namespace NodeJS {
    type ProcessEnv = {
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PUBLIC_URL: string;
    };
}

declare module '*.avif' {
    const src: string;
    export default src;
}

declare module '*.bmp' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default src;
}

declare module '*.module.css' {
    const classes: Record<string, string>;
    export default classes;
}

declare module '*.module.scss' {
    const classes: Record<string, string>;
    export default classes;
}

declare module '*.module.sass' {
    const classes: Record<string, string>;
    export default classes;
}
