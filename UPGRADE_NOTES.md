# CivicLens Web - Next.js 14 Upgrade Notes

## Overview

This document summarizes the upgrade from Next.js 9.5.1 + React 16 to Next.js 14.2.15 + React 18.3.1.

## Version Changes

### Framework & Core
| Package | Old Version | New Version | Notes |
|---------|------------|-------------|-------|
| next | 9.5.1 | 14.2.15 | Major framework upgrade |
| react | 16.13.1 | 18.3.1 | Enables Suspense, Streaming SSR |
| react-dom | 16.13.1 | 18.3.1 | Matches React version |
| typescript | 3.9.7 | 5.6.3 | Modern TypeScript features |

### Dependencies
| Package | Old Version | New Version | Notes |
|---------|------------|-------------|-------|
| axios | 0.19.2 | 1.7.7 | Security updates, API improvements |
| swr | 0.3.0 | 2.2.5 | New API (`fallbackData` vs `initialData`) |
| marked | 1.1.1 | 12.0.2 | Security fixes, removed `sanitize` option |
| lazysizes | 5.2.2 | **Removed** | Use `next/image` instead |

### Type Definitions
| Package | Old Version | New Version |
|---------|------------|-------------|
| @types/node | 14.0.27 | 20.16.11 |
| @types/react | 16.9.44 | 18.3.11 |
| @types/react-dom | - | 18.3.1 |

### New Dependencies (Testing & Tooling)
- `@testing-library/react@16.0.1` - React 18 compatible
- `@testing-library/jest-dom@6.5.0` - Custom Jest matchers
- `@testing-library/user-event@14.5.2` - User interaction testing
- `jest@29.7.0` - Test framework
- `jest-environment-jsdom@29.7.0` - Browser-like test environment
- `eslint@8.57.1` - Linting
- `eslint-config-next@14.2.15` - Next.js ESLint rules
- `next-router-mock@1.0.4` - Router mocking for tests

## Breaking Changes & Migrations

### 1. Next.js Link Component
**Old Pattern:**
```tsx
<Link href="/path" passHref>
  <a className="link">Text</a>
</Link>
```

**New Pattern:**
```tsx
<Link href="/path" className="link">
  Text
</Link>
```

### 2. Document Component (`_document.tsx`)
**Changed:**
- Removed `getInitialProps` (deprecated)
- Removed `styled-jsx/server` flush (no longer needed)
- Changed from class component to function component
- Updated imports: `Html` instead of `html`

**Old:**
```tsx
class MyDocument extends Document {
  static async getInitialProps(ctx) { ... }
  render() { return <html>...</html> }
}
```

**New:**
```tsx
export default function Document() {
  return <Html>...</Html>
}
```

### 3. Data Fetching
**Changed:**
- `getInitialProps` → `getServerSideProps` for SSR pages
- Client-side auth checks moved to `useEffect`

**Files Updated:**
- `pages/profile/[pid].tsx`
- `pages/article/[pid].tsx`
- `pages/editor/[pid].tsx`
- `pages/user/settings.tsx`

### 4. SWR API Changes (v0.3 → v2.x)
- `trigger()` removed → use `mutate(key)` for revalidation
- `mutate(key, data, false)` → `mutate(key, data, { revalidate: false })`
- `initialData` option → `fallbackData`

### 5. Marked Library
- Removed `sanitize` option (deprecated)
- Import changed: `import marked from 'marked'` → `import { marked } from 'marked'`

### 6. Removed lazysizes
- Lazy loading images now handled by Next.js built-in features
- Consider migrating `<img>` tags to `next/image` for optimization

## Configuration Updates

### tsconfig.json
Key changes:
- `target`: "es5" → "ES2017"
- `moduleResolution`: "node" → "bundler"
- `strict`: false (can be enabled incrementally)
- `strictNullChecks`: true
- Added Next.js plugin configuration

### new: next.config.js
Created with modern settings:
- `reactStrictMode: true`
- Image optimization configuration
- SWC compiler options
- Environment variable handling

### new: .eslintrc.json
- Extended `next/core-web-vitals` and `next/typescript`
- Configured warnings for common issues

### new: jest.config.js & jest.setup.js
- Configured Jest with Next.js integration
- Setup Testing Library matchers
- Router mocking configuration

## Testing Infrastructure

### New Scripts
```json
"lint": "next lint",
"type-check": "tsc --noEmit",
"test": "jest",
"test:watch": "jest --watch"
```

### Example Test
See `__tests__/pages/index.test.tsx` for a basic smoke test example.

## Known Issues & Follow-Up Tasks

### ESLint Warnings
The following non-blocking warnings remain:
1. External stylesheets in `_document.tsx` (external dependency)
2. `<img>` tags in `CustomImage.tsx` (consider migrating to `next/image`)
3. Some React Hook dependency warnings (non-critical)
4. Explicit `any` types in legacy code (can be typed incrementally)

### Recommended Future Work
1. **Enable Full Strict Mode**: Currently using `strict: false` with `strictNullChecks: true`. Gradually type components to enable full strict mode.
2. **Migrate to next/image**: Replace `CustomImage` component with `next/image` for better performance.
3. **Add MSW for API Mocking**: Improve test coverage with Mock Service Worker.
4. **Increase Test Coverage**: Add tests for critical user flows.
5. **Consider App Router**: Evaluate migration from Pages Router to App Router (Next.js 13+) for future-proofing.

## Build & Runtime

### Build Status
✅ Build succeeds without errors
✅ Tests pass
⚠️  Some ESLint warnings (documented above)

### Build Output (Sample)
```
Route (pages)                Size       First Load JS
├ ○ /                       5.55 kB     94.1 kB
├ ƒ /article/[pid]          20.4 kB     130 kB
├ ƒ /editor/[pid]           5.93 kB     115 kB
└ ○ /user/login             5.9 kB      115 kB

○ (Static)  prerendered as static content
ƒ (Dynamic) server-rendered on demand
```

## Node.js Requirements

**Minimum Version:** Node.js 18.0.0 or higher

This is enforced in `package.json`:
```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
}
```

## Manual QA Checklist

Test the following flows manually:
- [ ] Home page loads and displays articles
- [ ] User registration and login
- [ ] Article creation and editing
- [ ] Profile viewing and editing
- [ ] Following/unfollowing users
- [ ] Favoriting articles
- [ ] Commenting on articles
- [ ] Tag filtering

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [SWR 2.0 Migration](https://swr.vercel.app/docs/advanced/migration)
- [Testing Library with Next.js](https://nextjs.org/docs/testing#jest-and-react-testing-library)

## Summary

This upgrade brings civiclens-web to modern Next.js 14 + React 18, enabling:
- ✅ React 18 features (Suspense, Streaming SSR)
- ✅ Modern build tooling (SWC compiler)
- ✅ Better type safety (TypeScript 5.x)
- ✅ Testing infrastructure
- ✅ Security updates for all dependencies
- ✅ Compatibility with Node.js 18+

The application builds cleanly and is ready for deployment. Follow-up work should focus on incremental improvements (strict typing, test coverage, performance optimization).
