# Next.js 14 / React 18 Upgrade Notes

This document summarizes the major changes made during the upgrade from Next.js 9.5.1 to Next.js 14.2.x.

## Summary of Changes

### Core Framework Upgrades

| Package | Before | After | Notes |
|---------|--------|-------|-------|
| next | 9.5.1 | 14.2.15 | Major upgrade (4 major versions) |
| react | 16.13.1 | 18.3.1 | Concurrent rendering, Strict Mode |
| react-dom | 16.13.1 | 18.3.1 | New root API |
| typescript | 3.9.7 | 5.6.3 | Modern TS features |
| swr | 0.3.0 | 2.2.5 | New APIs, React 18 support |
| axios | 0.19.2 | 1.7.7 | Modern HTTP client |
| marked | 1.1.1 | 14.1.3 | Security fixes |

### New Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| isomorphic-dompurify | 2.16.0 | XSS protection for markdown |
| @testing-library/react | 16.0.1 | React component testing |
| @testing-library/jest-dom | 6.6.2 | Custom Jest matchers |
| @testing-library/user-event | 14.5.2 | User interaction simulation |
| jest | 29.7.0 | Test runner |
| jest-environment-jsdom | 29.7.0 | DOM testing environment |
| eslint-config-next | 14.2.15 | Next.js ESLint rules |
| next-router-mock | 0.9.13 | Router mocking for tests |

### Removed Dependencies

| Package | Reason |
|---------|--------|
| lazysizes | Replaced with native lazy loading |

## Breaking Changes Addressed

### 1. getInitialProps → getServerSideProps (5 files)

**Files Modified:**
- `pages/article/[pid].tsx`
- `pages/editor/[pid].tsx`
- `pages/profile/[pid].tsx`
- `pages/user/settings.tsx`
- `pages/_document.tsx`

**Migration Pattern:**
```typescript
// Before
ArticlePage.getInitialProps = async ({ query: { pid } }) => {
  const { data } = await ArticleAPI.get(pid);
  return data;
};

// After
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const pid = params?.pid;
  const { data } = await ArticleAPI.get(pid as string);
  return {
    props: { initialArticle: data },
  };
};
```

### 2. Link Component Updates (3 files)

**Files Modified:**
- `components/common/CustomLink.tsx`
- `components/common/NavLink.tsx`
- `components/article/ArticlePreview.tsx`

**Migration Pattern:**
```typescript
// Before (Next.js 9-12)
<Link href={href} as={as} passHref>
  <a className={className}>{children}</a>
</Link>

// After (Next.js 13+)
<Link href={href} as={as} className={className}>
  {children}
</Link>
```

Next.js 13+ automatically renders the `<a>` tag internally. The `passHref` prop is no longer needed.

### 3. SWR 2.x API Changes (7+ files)

**Key Changes:**
- `initialData` → `fallbackData`
- `trigger()` removed, use `mutate()` from `useSWRConfig()`
- Import `useSWRConfig` for global mutations

**Migration Pattern:**
```typescript
// Before
import useSWR, { trigger, mutate } from "swr";
useSWR(url, fetcher, { initialData });
trigger(url);

// After
import useSWR, { useSWRConfig } from "swr";
const { mutate } = useSWRConfig();
useSWR(url, fetcher, { fallbackData });
mutate(url);
```

### 4. Marked Security Vulnerability (CRITICAL)

**File Modified:** `pages/article/[pid].tsx`

**Issue:** The `sanitize` option in marked was deprecated and removed due to security vulnerabilities.

**Fix:**
```typescript
// Before (VULNERABLE)
import marked from "marked";
const markup = { __html: marked(article.body, { sanitize: true }) };

// After (SECURE)
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
const markup = { __html: DOMPurify.sanitize(marked(article.body) as string) };
```

### 5. _document.tsx Updates

**Changes:**
- Removed deprecated `styled-jsx/server` flush
- Updated imports from `next/document`
- Changed `<html>` to `<Html>` component
- Added proper TypeScript types

### 6. _app.tsx Updates

**Changes:**
- Removed `lazysizes` imports (use native lazy loading)
- Added `AppProps` TypeScript type
- Enabled React Strict Mode via `next.config.js`

### 7. TypeScript Configuration

**tsconfig.json Changes:**
- `target`: "es5" → "es2017"
- `moduleResolution`: "node" → "bundler"
- Added `incremental: true`
- Added path aliases (`@/*`)
- Removed deprecated options (`suppressImplicitAnyIndexErrors`)

### 8. React Hooks Compliance

**Fixed:** Conditional hook calls (React 18 strict enforcement)

Example in `pages/profile/[pid].tsx`:
```typescript
// Before (INVALID - hooks after early return)
const { data } = useSWR(...);
if (error) return <Error />;
const { data: user } = useSWR(...);  // ❌ After early return

// After (VALID - all hooks before any returns)
const { data } = useSWR(...);
const { data: user } = useSWR(...);  // ✅ Before any returns
if (error) return <Error />;
```

## New Features Added

### 1. Testing Infrastructure

- Jest 29 with next/jest integration
- React Testing Library setup
- Mock files for styles and static assets
- Sample tests for components and utilities
- npm scripts: `test`, `test:watch`, `test:ci`

### 2. ESLint Configuration

- Next.js Core Web Vitals rules
- React Hooks linting
- Import/export validation
- Configurable rule overrides

### 3. Next.js 14 Features Enabled

- React Strict Mode (catches potential issues)
- SWC minification (faster builds)
- Image optimization configuration
- Production console removal

## Configuration Files Created

1. **next.config.js** - Next.js configuration
2. **jest.config.js** - Jest test configuration
3. **jest.setup.ts** - Test environment setup
4. **.eslintrc.json** - ESLint rules
5. **__mocks__/** - Mock files for testing

## Known Warnings (Non-Critical)

These warnings exist but don't affect functionality:

1. **CSS Tags Warning** - External stylesheets in `_document.tsx` (required for RealWorld spec)
2. **No-img-element** - Using `<img>` instead of `next/image` (future optimization)
3. **React Hooks Exhaustive Deps** - Missing dependencies in some callbacks (intentional in some cases)

## Follow-Up Recommendations

### High Priority
1. Add more comprehensive test coverage
2. Implement CI/CD pipeline with GitHub Actions
3. Consider migrating `<img>` to `next/image` for better performance

### Medium Priority
1. Evaluate App Router migration (significant refactor)
2. Add MSW for API mocking in tests
3. Implement error boundaries for better error handling

### Low Priority
1. Add Storybook for component documentation
2. Consider React Query vs SWR evaluation
3. Add bundle analysis tooling

## Migration Statistics

- **Files Modified:** ~35 files
- **New Files Created:** ~10 files
- **Dependencies Updated:** 7 major packages
- **Dependencies Added:** 8 new packages
- **Dependencies Removed:** 1 package
- **Security Vulnerabilities Fixed:** 1 critical (marked XSS)

## Verification Results

```bash
# Type checking
✓ npm run type-check - 0 errors

# Linting
✓ npm run lint - 0 errors (warnings only)

# Testing
✓ npm test - 9 tests passed

# Build
✓ npm run build - Successful production build
  - 7 pages generated
  - No deprecated API warnings
  - Bundle sizes optimized
```

## Environment Requirements

- **Node.js:** >= 18.0.0 (required)
- **npm:** >= 9.0.0 (recommended)
- **OS:** Cross-platform (macOS, Linux, Windows)

---

**Upgrade Date:** November 2024
**Previous Version:** Next.js 9.5.1 / React 16.13.1
**Current Version:** Next.js 14.2.15 / React 18.3.1
