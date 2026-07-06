# BLUI Next.js Support Plan

> **Document Version:** 1.0  
> **Created:** 2026-06-24  
> **Status:** Draft  
> **Authors:** Architecture Team

---

## Executive Summary

This document outlines the comprehensive plan to add Next.js support to the Brightlayer UI (BLUI) React ecosystem. The goal is to enable adopters to use all BLUI packages seamlessly in Next.js applications while maintaining backward compatibility with existing Vite/CRA projects.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Package Compatibility Matrix](#2-package-compatibility-matrix)
3. [Technical Requirements](#3-technical-requirements)
4. [Implementation Plan](#4-implementation-plan)
5. [Package-Specific Changes](#5-package-specific-changes)
6. [CLI Templates](#6-cli-templates)
7. [Testing Strategy](#7-testing-strategy)
8. [Documentation](#8-documentation)
9. [Timeline & Resources](#9-timeline--resources)
10. [Risks & Mitigations](#10-risks--mitigations)

---

## 1. Current State Analysis

### 1.1 Existing Packages

| Package | Version | Primary Use |
|---------|---------|-------------|
| `@brightlayer-ui/react-components` | 8.0.4 | UI Components (Drawer, AppBar, Hero, etc.) |
| `@brightlayer-ui/react-themes` | 9.1.0-alpha.2 | MUI Theme Configuration |
| `@brightlayer-ui/react-auth-workflow` | 7.0.3-alpha.2 | Authentication/Registration Flows |
| `create-blui-react-app` | 2.0.2 | Project Scaffolding CLI |

### 1.2 Current Technology Stack

- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** MUI v7 + Emotion
- **Auth:** Okta SDK
- **i18n:** i18next with browser language detector
- **React Version:** 19.1.0

### 1.3 Next.js Considerations

Next.js App Router introduces:
- **React Server Components (RSC):** Components render on server by default
- **Client Components:** Must be explicitly marked with `"use client"`
- **Server Actions:** Server-side mutations
- **Middleware:** Edge runtime for auth/redirects
- **File-based Routing:** No react-router-dom needed

---

## 2. Package Compatibility Matrix

### 2.1 Overall Readiness

| Package | SSR Safe | RSC Compatible | Effort Level | Priority |
|---------|----------|----------------|--------------|----------|
| `@brightlayer-ui/react-themes` | ✅ Yes | ✅ Yes | Low | P0 |
| `@brightlayer-ui/react-components` | ⚠️ Partial | ⚠️ Needs "use client" | Medium | P0 |
| `@brightlayer-ui/react-auth-workflow` | ❌ No | ❌ Needs refactor | High | P1 |
| `create-blui-react-app` | N/A | N/A | Medium | P1 |

### 2.2 Component-Level Analysis

#### @brightlayer-ui/react-components

| Component | Browser APIs Used | SSR Impact | Required Changes |
|-----------|------------------|------------|------------------|
| `AppBar` | `window.scrollY`, `document.getElementById` | ⚠️ Low | Already in useEffect - add "use client" |
| `DataTable` | `window.addEventListener` (keydown) | ⚠️ Low | Already in useEffect - add "use client" |
| `FileDragUpload` | `window.addEventListener` (drag events) | ⚠️ Low | Already in useEffect - add "use client" |
| `Drawer` | None | ✅ Safe | Add "use client" (uses hooks) |
| `DrawerLayout` | None | ✅ Safe | Add "use client" (uses context) |
| `UserMenu` | None | ✅ Safe | Add "use client" (uses state) |
| `ToolbarMenu` | None | ✅ Safe | Add "use client" (uses state) |
| `ChannelValue` | None | ✅ Safe | No changes needed |
| `EmptyState` | None | ✅ Safe | No changes needed |
| `Hero` | None | ✅ Safe | No changes needed |
| `HeroBanner` | None | ✅ Safe | No changes needed |
| `InfoListItem` | None | ✅ Safe | No changes needed |
| `ListItemTag` | None | ✅ Safe | No changes needed |
| `ScoreCard` | None | ✅ Safe | No changes needed |
| `ThreeLiner` | None | ✅ Safe | No changes needed |

#### Utility Functions

| Utility | Browser APIs | Required Changes |
|---------|--------------|------------------|
| `convertColorNameToHex` | `document.createElement('canvas')` | Add `typeof window` guard |

---

## 3. Technical Requirements

### 3.1 Next.js Version Support

- **Minimum:** Next.js 14.0.0
- **Recommended:** Next.js 15.x (latest stable)
- **Router:** App Router (primary), Pages Router (secondary support)

### 3.2 React Version

- **Required:** React 18.2+ (for RSC support)
- **Current BLUI:** React 19.1.0 ✅

### 3.3 MUI + Next.js Integration

Following [official MUI Next.js guide](https://mui.com/material-ui/integrations/nextjs/):

```tsx
// app/ThemeRegistry.tsx
'use client';

import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blueThemes } from '@brightlayer-ui/react-themes';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'blui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={blueThemes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
```

### 3.4 Client Component Strategy

**Approach:** Mark all interactive components with `"use client"` directive.

```tsx
// components/Drawer/Drawer.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
// ... rest of component
```

**Rationale:**
- BLUI components use React hooks (useState, useEffect, useContext)
- MUI components internally use client-side features
- Simpler than conditional exports
- No breaking changes for existing users

---

## 4. Implementation Plan

### Phase 1: Foundation (Week 1)

#### 4.1.1 Add "use client" Directives

**Files to update in `@brightlayer-ui/react-components`:**

```
src/core/
├── AppBar/AppBar.tsx              ← "use client"
├── ChannelValue/ChannelValue.tsx  ← "use client" (uses forwardRef)
├── DataTable/DataTable.tsx        ← "use client"
├── Drawer/Drawer.tsx              ← "use client"
├── DrawerLayout/DrawerLayout.tsx  ← "use client"
├── DrawerLite/DrawerLite.tsx      ← "use client"
├── EmptyState/EmptyState.tsx      ← "use client" (uses forwardRef)
├── FileDragUpload/FileDragUpload.tsx ← "use client"
├── Hero/Hero.tsx                  ← "use client"
├── HeroBanner/HeroBanner.tsx      ← "use client"
├── HorizontalStackedBar/HorizontalStackedBar.tsx ← "use client"
├── InfoListItem/InfoListItem.tsx  ← "use client"
├── ListItemTag/ListItemTag.tsx    ← "use client"
├── ScoreCard/ScoreCard.tsx        ← "use client"
├── ThreeLiner/ThreeLiner.tsx      ← "use client"
├── ToolbarMenu/ToolbarMenu.tsx    ← "use client"
├── UserMenu/UserMenu.tsx          ← "use client"
└── Utility/convertColorNameToHex.tsx ← Add SSR guard
```

#### 4.1.2 Fix Browser API Guards

```tsx
// src/core/Utility/convertColorNameToHex.tsx
export const convertColorNameToHex = (name: string): string => {
    // SSR guard - return original name if not in browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return name;
    }
    
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
        return name;
    }
    ctx.fillStyle = name;
    return ctx.fillStyle;
};
```

#### 4.1.3 Update Package.json Exports

```json
{
  "exports": {
    ".": {
      "import": "./index.js",
      "types": "./index.d.ts"
    },
    "./package.json": "./package.json"
  },
  "sideEffects": false
}
```

### Phase 2: Theme Package Updates (Week 1)

#### 4.2.1 Add Next.js Integration Exports

```tsx
// src/nextjs/ThemeRegistry.tsx
'use client';

export { default as ThemeRegistry } from './ThemeRegistry';
export { createBLUICache } from './emotionCache';
```

#### 4.2.2 Update Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./index.js"
    },
    "./open-sans": {
      "import": "./open-sans.js"
    },
    "./nextjs": {
      "import": "./nextjs/index.js"
    }
  }
}
```

### Phase 3: Auth Workflow Updates (Week 2-3)

#### 4.3.1 Create Next.js Compatible Guards

**New Files:**

```
src/components/Guards/
├── ReactRouterAuthGuard.tsx      (existing)
├── ReactRouterGuestGuard.tsx     (existing)
├── NextAuthGuard.tsx             (NEW)
├── NextGuestGuard.tsx            (NEW)
├── NextMiddlewareGuard.ts        (NEW - for middleware)
└── index.ts                      (updated exports)
```

**NextAuthGuard.tsx:**

```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, JSX } from 'react';

type NextAuthGuardProps = {
    children?: JSX.Element;
    isAuthenticated: boolean;
    fallBackUrl: string;
};

export const NextAuthGuard = (props: NextAuthGuardProps): JSX.Element | null => {
    const { children = null, fallBackUrl, isAuthenticated } = props;
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            // Store intended destination for redirect after login
            sessionStorage.setItem('blui-redirect-after-login', pathname);
            router.replace(fallBackUrl);
        }
    }, [isAuthenticated, fallBackUrl, router, pathname]);

    if (!isAuthenticated) {
        return null; // or loading spinner
    }

    return children;
};
```

**NextGuestGuard.tsx:**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, JSX } from 'react';

type NextGuestGuardProps = {
    children?: JSX.Element;
    isAuthenticated: boolean;
    fallBackUrl: string;
};

export const NextGuestGuard = (props: NextGuestGuardProps): JSX.Element | null => {
    const { children = null, isAuthenticated, fallBackUrl } = props;
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            const redirectUrl = sessionStorage.getItem('blui-redirect-after-login') || fallBackUrl;
            sessionStorage.removeItem('blui-redirect-after-login');
            router.replace(redirectUrl);
        }
    }, [isAuthenticated, fallBackUrl, router]);

    if (isAuthenticated) {
        return null;
    }

    return children;
};
```

**NextMiddlewareGuard.ts:**

```typescript
// For use in Next.js middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export type MiddlewareGuardConfig = {
    protectedPaths: string[];
    publicPaths: string[];
    loginPath: string;
    getAuthToken: (request: NextRequest) => string | null;
};

export function createBLUIMiddleware(config: MiddlewareGuardConfig) {
    return function middleware(request: NextRequest) {
        const { pathname } = request.nextUrl;
        const token = config.getAuthToken(request);
        const isAuthenticated = !!token;

        // Check if path is protected
        const isProtectedPath = config.protectedPaths.some(path => 
            pathname.startsWith(path)
        );

        // Check if path is public
        const isPublicPath = config.publicPaths.some(path => 
            pathname.startsWith(path)
        );

        if (isProtectedPath && !isAuthenticated) {
            const loginUrl = new URL(config.loginPath, request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (isPublicPath && isAuthenticated && pathname === config.loginPath) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    };
}
```

#### 4.3.2 Create Next.js Auth Context Provider

```tsx
// src/contexts/NextAuthContext/provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, JSX } from 'react';

export type NextAuthContextValue = {
    isAuthenticated: boolean;
    user: unknown | null;
    login: (credentials: unknown) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const NextAuthContext = createContext<NextAuthContextValue | null>(null);

export const useNextAuth = () => {
    const context = useContext(NextAuthContext);
    if (!context) {
        throw new Error('useNextAuth must be used within NextAuthContextProvider');
    }
    return context;
};

type NextAuthContextProviderProps = {
    children: React.ReactNode;
    authActions: {
        login: (credentials: unknown) => Promise<{ user: unknown }>;
        logout: () => Promise<void>;
        getSession: () => Promise<{ user: unknown } | null>;
    };
};

export const NextAuthContextProvider: React.FC<NextAuthContextProviderProps> = ({
    children,
    authActions,
}) => {
    const [user, setUser] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authActions.getSession()
            .then((session) => {
                setUser(session?.user ?? null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [authActions]);

    const login = async (credentials: unknown) => {
        const result = await authActions.login(credentials);
        setUser(result.user);
    };

    const logout = async () => {
        await authActions.logout();
        setUser(null);
    };

    return (
        <NextAuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </NextAuthContext.Provider>
    );
};
```

#### 4.3.3 Update Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./index.js"
    },
    "./nextjs": {
      "import": "./nextjs/index.js"
    }
  },
  "optionalDependencies": {
    "react-router-dom": "^7.12.0",
    "next": ">=14.0.0"
  }
}
```

### Phase 4: CLI Templates (Week 3-4)

See [Section 6: CLI Templates](#6-cli-templates) for detailed template structures.

---

## 5. Package-Specific Changes

### 5.1 @brightlayer-ui/react-components

#### Changes Summary

| Change Type | Count | Files |
|-------------|-------|-------|
| Add "use client" | 17 | All component entry files |
| SSR Guard | 1 | convertColorNameToHex.tsx |
| Package.json | 1 | exports, sideEffects |

#### File Changes

<details>
<summary>Click to expand all file changes</summary>

**AppBar.tsx** - Add at line 1:
```tsx
'use client';
```

**ChannelValue.tsx** - Add at line 1:
```tsx
'use client';
```

**DataTable.tsx** - Add at line 1:
```tsx
'use client';
```

**Drawer.tsx** - Add at line 1:
```tsx
'use client';
```

**DrawerLayout.tsx** - Add at line 1:
```tsx
'use client';
```

**DrawerLite.tsx** - Add at line 1:
```tsx
'use client';
```

**EmptyState.tsx** - Add at line 1:
```tsx
'use client';
```

**FileDragUpload.tsx** - Add at line 1:
```tsx
'use client';
```

**Hero.tsx** - Add at line 1:
```tsx
'use client';
```

**HeroBanner.tsx** - Add at line 1:
```tsx
'use client';
```

**HorizontalStackedBar.tsx** - Add at line 1:
```tsx
'use client';
```

**InfoListItem.tsx** - Add at line 1:
```tsx
'use client';
```

**ListItemTag.tsx** - Add at line 1:
```tsx
'use client';
```

**ScoreCard.tsx** - Add at line 1:
```tsx
'use client';
```

**ThreeLiner.tsx** - Add at line 1:
```tsx
'use client';
```

**ToolbarMenu.tsx** - Add at line 1:
```tsx
'use client';
```

**UserMenu.tsx** - Add at line 1:
```tsx
'use client';
```

</details>

### 5.2 @brightlayer-ui/react-themes

#### Changes Summary

| Change Type | Count | Description |
|-------------|-------|-------------|
| New Directory | 1 | src/nextjs/ |
| New Files | 3 | ThemeRegistry, emotionCache, index |
| Package.json | 1 | Add nextjs export |

#### New Files

**src/nextjs/emotionCache.ts:**

```typescript
'use client';

import createCache from '@emotion/cache';

export const createBLUICache = () => {
    return createCache({ key: 'blui', prepend: true });
};
```

**src/nextjs/ThemeRegistry.tsx:**

```tsx
'use client';

import * as React from 'react';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blueThemes } from '../blueMergedTheme';
import { createBLUICache } from './emotionCache';

export type ThemeRegistryProps = {
    children: React.ReactNode;
    theme?: typeof blueThemes;
};

export default function ThemeRegistry({ 
    children, 
    theme = blueThemes 
}: ThemeRegistryProps) {
    const [{ cache, flush }] = useState(() => {
        const cache = createBLUICache();
        (cache as EmotionCache & { compat?: boolean }).compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
```

**src/nextjs/index.ts:**

```typescript
export { default as ThemeRegistry } from './ThemeRegistry';
export type { ThemeRegistryProps } from './ThemeRegistry';
export { createBLUICache } from './emotionCache';
```

### 5.3 @brightlayer-ui/react-auth-workflow

#### Changes Summary

| Change Type | Count | Description |
|-------------|-------|-------------|
| Add "use client" | ~25 | All screen/component files |
| New Guards | 3 | Next.js compatible guards |
| New Context | 1 | NextAuthContextProvider |
| New Middleware | 1 | createBLUIMiddleware |
| Package.json | 1 | Add next peer dep, nextjs export |

---

## 6. CLI Templates

### 6.1 Template Structure

```
packages/cli-templates/templates/
├── blank-typescript/           (existing - Vite)
├── routing-typescript/         (existing - Vite)
├── authentication-typescript/  (existing - Vite)
├── nextjs-blank/               (NEW)
├── nextjs-routing/             (NEW)
└── nextjs-authentication/      (NEW)
```

### 6.2 nextjs-blank Template

```
nextjs-blank/
├── README.md
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── next-env.d.ts
├── package.json
├── tsconfig.json
├── public/
│   └── favicon.ico
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── providers.tsx
└── components/
    └── ThemeRegistry.tsx
```

**app/layout.tsx:**

```tsx
import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'BLUI Next.js App',
    description: 'Built with Brightlayer UI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
```

**app/providers.tsx:**

```tsx
'use client';

import { ThemeRegistry } from '@brightlayer-ui/react-themes/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
    return <ThemeRegistry>{children}</ThemeRegistry>;
}
```

**app/page.tsx:**

```tsx
import { Box, Typography, Container } from '@mui/material';
import { EmptyState } from '@brightlayer-ui/react-components';
import DevicesIcon from '@mui/icons-material/Devices';

export default function Home() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <EmptyState
                icon={<DevicesIcon fontSize="inherit" />}
                title="Welcome to BLUI"
                description="Your Next.js app is ready!"
            />
        </Container>
    );
}
```

**package.json:**

```json
{
    "name": "blui-nextjs-app",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    },
    "dependencies": {
        "@brightlayer-ui/colors": "^3.2.0",
        "@brightlayer-ui/react-components": "^8.0.0",
        "@brightlayer-ui/react-themes": "^9.1.0",
        "@emotion/cache": "^11.11.0",
        "@emotion/react": "^11.11.0",
        "@emotion/styled": "^11.11.0",
        "@mui/icons-material": "^7.1.1",
        "@mui/material": "^7.1.1",
        "next": "^15.0.0",
        "react": "^19.1.0",
        "react-dom": "^19.1.0"
    },
    "devDependencies": {
        "@types/node": "^22.0.0",
        "@types/react": "^19.1.0",
        "@types/react-dom": "^19.1.0",
        "eslint": "^9.0.0",
        "eslint-config-next": "^15.0.0",
        "typescript": "^5.8.0"
    }
}
```

### 6.3 nextjs-routing Template

Extends blank template with:
- Drawer navigation
- Multiple pages (/, /dashboard, /settings)
- App Router layouts

### 6.4 nextjs-authentication Template

Extends routing template with:
- Login/Registration screens
- Protected routes
- Auth context
- Middleware-based guards

### 6.5 CLI Updates

**index.js changes:**

```javascript
const templates = [
    { name: 'blank-typescript', description: 'Blank Vite + TypeScript' },
    { name: 'routing-typescript', description: 'Vite + React Router' },
    { name: 'authentication-typescript', description: 'Vite + Auth Workflow' },
    { name: 'nextjs-blank', description: 'Next.js App Router' },
    { name: 'nextjs-routing', description: 'Next.js + Drawer Navigation' },
    { name: 'nextjs-authentication', description: 'Next.js + Auth Workflow' },
];

const questions = [
    {
        type: 'list',
        name: 'framework',
        message: 'Select a framework:',
        choices: ['Vite', 'Next.js'],
    },
    // ... conditional template selection based on framework
];
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

- Existing Jest tests continue to work (jsdom environment)
- Add SSR rendering tests for each component

**Example SSR Test:**

```tsx
import { renderToString } from 'react-dom/server';
import { EmptyState } from '@brightlayer-ui/react-components';

describe('EmptyState SSR', () => {
    it('renders without errors on server', () => {
        expect(() => {
            renderToString(<EmptyState title="Test" />);
        }).not.toThrow();
    });
});
```

### 7.2 Integration Tests

Create a Next.js test app in `apps/nextjs-test/`:

```
apps/nextjs-test/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
│       └── test-all-components.tsx
├── package.json
└── next.config.js
```

### 7.3 E2E Tests

- Add Playwright tests for Next.js templates
- Test hydration, navigation, auth flows

### 7.4 CI Pipeline Updates

```yaml
jobs:
  test-nextjs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: cd apps/nextjs-test && pnpm build
      - run: cd apps/nextjs-test && pnpm test
```

---

## 8. Documentation

### 8.1 New Documentation Pages

| Page | Location | Content |
|------|----------|---------|
| Next.js Guide | docs/nextjs-setup.md | Complete setup guide |
| Migration Guide | docs/nextjs-migration.md | Vite to Next.js migration |
| Auth in Next.js | docs/nextjs-authentication.md | Auth workflow setup |
| SSR Considerations | docs/nextjs-ssr.md | Component SSR notes |

### 8.2 README Updates

Each package README needs:
- Next.js compatibility badge
- Installation section for Next.js
- Usage examples for App Router

### 8.3 Storybook

- Add Next.js-specific stories
- Document "use client" requirements

---

## 9. Timeline & Resources

### 9.1 Timeline

```
Week 1: Foundation
├── Day 1-2: Add "use client" directives to components
├── Day 3: Fix utility SSR guards
├── Day 4-5: Theme registry for Next.js
└── Day 5: Testing & validation

Week 2: Auth Workflow
├── Day 1-2: Next.js guards (NextAuthGuard, NextGuestGuard)
├── Day 3: Middleware guard
├── Day 4: Next.js auth context provider
└── Day 5: Testing & integration

Week 3: CLI Templates
├── Day 1-2: nextjs-blank template
├── Day 3: nextjs-routing template
├── Day 4: nextjs-authentication template
└── Day 5: CLI updates & testing

Week 4: Documentation & Release
├── Day 1-2: Documentation pages
├── Day 3: README updates
├── Day 4: E2E testing
└── Day 5: Release preparation
```

### 9.2 Resource Allocation

| Role | Effort | Tasks |
|------|--------|-------|
| Senior Developer | 2 weeks | Components, Auth, Guards |
| Developer | 1.5 weeks | Templates, CLI updates |
| Technical Writer | 0.5 weeks | Documentation |
| QA Engineer | 1 week | Testing (parallel) |

### 9.3 Milestones

| Milestone | Target Date | Deliverables |
|-----------|-------------|--------------|
| M1: SSR-Safe Components | Week 1 | Components work in Next.js |
| M2: Auth Ready | Week 2 | Guards and providers |
| M3: Templates Ready | Week 3 | CLI creates Next.js projects |
| M4: Documentation | Week 4 | Full docs & guides |
| M5: Release | Week 4 | Published packages |

---

## 10. Risks & Mitigations

### 10.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MUI RSC compatibility issues | Medium | High | Follow official MUI guide, test early |
| Emotion SSR hydration mismatch | Medium | Medium | Use recommended cache setup |
| Auth state sync issues | Low | High | Use cookies + server validation |
| i18next SSR complexity | Medium | Medium | Defer to client-side detection |

### 10.2 Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing Vite apps | Low | High | Maintain backward compatibility |
| Scope creep | Medium | Medium | Stick to defined phases |
| Resource availability | Medium | Medium | Identify backup resources |

### 10.3 Compatibility Matrix

| BLUI Version | Vite | CRA | Next.js 14 | Next.js 15 |
|--------------|------|-----|------------|------------|
| 8.x (current) | ✅ | ✅ | ❌ | ❌ |
| 9.x (planned) | ✅ | ✅ | ✅ | ✅ |

---

## Appendix A: Code Snippets

### A.1 Next.js middleware.ts Example

```typescript
// middleware.ts (in project root)
import { createBLUIMiddleware } from '@brightlayer-ui/react-auth-workflow/nextjs';

export const middleware = createBLUIMiddleware({
    protectedPaths: ['/dashboard', '/settings', '/profile'],
    publicPaths: ['/login', '/register', '/forgot-password'],
    loginPath: '/login',
    getAuthToken: (request) => request.cookies.get('auth-token')?.value ?? null,
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### A.2 Server Component with BLUI

```tsx
// app/dashboard/page.tsx
import { Box, Typography } from '@mui/material';
import { ScoreCard, Hero, ChannelValue } from '@brightlayer-ui/react-components';

// This works because BLUI components are marked "use client"
// but can be composed in server components
export default async function DashboardPage() {
    // Fetch data on server
    const data = await fetch('https://api.example.com/metrics').then(r => r.json());
    
    return (
        <Box>
            <ScoreCard
                headerTitle="System Status"
                headerSubtitle="All systems operational"
            >
                <Hero
                    icon={<CheckCircleIcon />}
                    label="Uptime"
                    ChannelValueProps={{ value: '99.9', units: '%' }}
                />
            </ScoreCard>
        </Box>
    );
}
```

---

## Appendix B: Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-06-24 | Use "use client" on all components | Simplest approach, no breaking changes | Conditional exports, RSC wrappers |
| 2026-06-24 | Target App Router only | Industry direction, better DX | Pages Router support |
| 2026-06-24 | Cookie-based auth for Next.js | Works with middleware, SSR-friendly | localStorage (not SSR-safe) |
| 2026-06-24 | Separate Next.js guards | Clean separation, no react-router dep | Single guard with adapter |

---

## Appendix C: References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [MUI + Next.js Integration](https://mui.com/material-ui/integrations/nextjs/)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Emotion SSR](https://emotion.sh/docs/ssr)
- [NextAuth.js](https://next-auth.js.org/)

---

**Document Status:** Draft  
**Next Review:** Before Phase 1 kickoff  
**Approval Required From:** Engineering Lead, Product Owner
