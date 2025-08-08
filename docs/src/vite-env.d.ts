/// <reference types="vite/client" />

type ImportMetaEnv = {
    readonly VITE_REACT_APP_GAID?: string;
    readonly VITE_PUBLIC_URL?: string;
    readonly VITE_REACT_APP_BRANCH?: string;
    // add more environment variables as needed
};

type ImportMeta = {
    readonly env: ImportMetaEnv;
};

// Asset type declarations
declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}

declare module '*.css' {
    const content: string;
    export default content;
}
