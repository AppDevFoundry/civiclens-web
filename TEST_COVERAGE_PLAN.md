# Test Coverage Analysis and Improvement Plan

## Current State

**Overall Coverage: 0.77% statements**

| Category | Files | Current Coverage | Priority |
|----------|-------|-----------------|----------|
| **lib/utils** | 8 files | 5% statements | HIGH |
| **components/common** | 11 files | 3.37% statements | HIGH |
| **components/article** | 4 files | 0% | MEDIUM |
| **components/comment** | 4 files | 0% | MEDIUM |
| **components/profile** | 6 files | 0% | MEDIUM |
| **lib/api** | 4 files | 0% | HIGH |
| **lib/hooks** | 3 files | 0% | MEDIUM |
| **lib/context** | 3 files | 0% | LOW |
| **pages** | 9 files | 0% | LOW |

### Files with 100% Coverage (2 files)
- `lib/utils/checkLogin.ts`
- `components/common/LoadingSpinner.tsx`

### Critical Gaps

1. **Utility Functions** - Core business logic with 0% coverage
2. **API Layer** - No tests for API calls
3. **Interactive Components** - Forms, buttons with user interactions
4. **Custom Hooks** - State management logic untested

---

## Test Coverage Improvement Plan

### Phase 1: Core Utilities (Target: 80% lib/utils coverage)
**Priority: HIGH | Effort: Low | Impact: High**

Files to test:
1. `calculatePagination.ts` - Pure functions, easy to test
2. `editorReducer.ts` - Reducer logic, critical for editor
3. `fetcher.ts` - Data fetching logic
4. `storage.ts` - LocalStorage wrapper
5. `getQuery.ts` - Query string parsing
6. `handleBrokenImage.ts` - Error handling

**Estimated tests: 25-30 test cases**

### Phase 2: API Layer (Target: 70% lib/api coverage)
**Priority: HIGH | Effort: Medium | Impact: High**

Files to test:
1. `article.ts` - CRUD operations
2. `user.ts` - Auth operations
3. `comment.ts` - Comment operations
4. `tag.ts` - Tag fetching

**Approach:** Mock axios, test request construction and error handling

**Estimated tests: 20-25 test cases**

### Phase 3: Common Components (Target: 60% coverage)
**Priority: HIGH | Effort: Medium | Impact: High**

Files to test:
1. `CustomLink.tsx` - Navigation component
2. `NavLink.tsx` - Active state logic
3. `Maybe.tsx` - Conditional rendering
4. `ErrorMessage.tsx` - Error display
5. `ListErrors.tsx` - Error list rendering
6. `Pagination.tsx` - User interactions
7. `Navbar.tsx` - Navigation and auth state

**Estimated tests: 30-35 test cases**

### Phase 4: Interactive Components (Target: 50% coverage)
**Priority: MEDIUM | Effort: High | Impact: Medium**

#### Article Components
1. `ArticlePreview.tsx` - Favoriting, navigation
2. `ArticleActions.tsx` - Delete, edit actions
3. `ArticleMeta.tsx` - Author info display
4. `ArticleList.tsx` - List rendering

#### Comment Components
1. `CommentInput.tsx` - Form submission
2. `Comment.tsx` - Display and delete
3. `CommentList.tsx` - List rendering
4. `DeleteButton.tsx` - Delete action

#### Profile Components
1. `LoginForm.tsx` - Auth form
2. `RegisterForm.tsx` - Registration form
3. `SettingsForm.tsx` - User settings
4. `FollowUserButton.tsx` - Follow/unfollow

**Estimated tests: 50-60 test cases**

### Phase 5: Custom Hooks (Target: 80% coverage)
**Priority: MEDIUM | Effort: Medium | Impact: Medium**

Files to test:
1. `useIsMounted.ts` - Lifecycle hook
2. `useViewport.ts` - Responsive logic
3. `useSessionStorage.ts` - Storage hook

**Estimated tests: 15-20 test cases**

### Phase 6: Context Providers (Target: 70% coverage)
**Priority: LOW | Effort: Medium | Impact: Low**

Files to test:
1. `PageContext.tsx` - Page state
2. `PageCountContext.tsx` - Pagination state
3. `index.tsx` - Provider composition

**Estimated tests: 10-15 test cases**

### Phase 7: Pages (Optional - Integration Tests)
**Priority: LOW | Effort: High | Impact: Medium**

Consider E2E testing with Playwright or Cypress instead of unit tests for pages.

---

## Implementation Roadmap

### Week 1: Foundation (Phases 1-2)
- [ ] Utility function tests (8 files)
- [ ] API layer tests (4 files)
- **Target Coverage: 25-30%**

### Week 2: Components (Phase 3)
- [ ] Common component tests (11 files)
- **Target Coverage: 40-45%**

### Week 3: Interactive Components (Phase 4)
- [ ] Article, Comment, Profile components
- **Target Coverage: 55-60%**

### Week 4: Hooks & Polish (Phases 5-6)
- [ ] Custom hooks tests
- [ ] Context provider tests
- [ ] Edge cases and error scenarios
- **Target Coverage: 65-70%**

---

## Immediate Action Items

### 1. Add Test Coverage Script
```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watch"
  }
}
```

### 2. Set Coverage Thresholds
Add to `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
},
```

### 3. Add Coverage to CI
Ensure coverage reports are generated in CI pipeline.

### 4. Priority Test Files to Create Next

1. **`__tests__/lib/calculatePagination.test.ts`** - Pure functions
2. **`__tests__/lib/editorReducer.test.ts`** - State reducer
3. **`__tests__/lib/fetcher.test.ts`** - Data fetching
4. **`__tests__/components/Maybe.test.tsx`** - Conditional render
5. **`__tests__/components/NavLink.test.tsx`** - Active state
6. **`__tests__/api/article.test.ts`** - API operations

---

## Testing Best Practices

### For Components
- Test rendering with different props
- Test user interactions (clicks, form submissions)
- Test conditional rendering
- Test error states
- Mock external dependencies (SWR, Router)

### For Utilities
- Test edge cases (null, undefined, empty)
- Test error handling
- Test all branches
- Use parameterized tests for multiple inputs

### For API Layer
- Mock axios/fetch
- Test request headers and body
- Test error responses
- Test authentication token handling

### For Hooks
- Use `@testing-library/react-hooks` or `renderHook`
- Test state changes
- Test cleanup functions
- Test with different initial values

---

## Recommended Testing Tools to Add

1. **MSW (Mock Service Worker)** - API mocking
   ```bash
   npm install -D msw
   ```

2. **@testing-library/react-hooks** - Hook testing (if not using React 18+)

3. **Faker.js** - Test data generation
   ```bash
   npm install -D @faker-js/faker
   ```

---

## Success Metrics

| Metric | Current | Week 2 | Week 4 | Goal |
|--------|---------|--------|--------|------|
| Statement Coverage | 0.77% | 35% | 65% | 70%+ |
| Branch Coverage | 2.17% | 30% | 55% | 60%+ |
| Function Coverage | 0.70% | 40% | 70% | 75%+ |
| Line Coverage | 0.61% | 35% | 65% | 70%+ |
| Test Files | 2 | 15 | 35 | 40+ |
| Test Cases | 9 | 80 | 180 | 200+ |

---

## Conclusion

The current test coverage of **0.77%** is critically low and poses significant risk for:
- Regression bugs during future development
- Difficulty refactoring code safely
- Uncertainty about code correctness

The proposed 4-week plan would bring coverage to **65-70%**, focusing on:
1. **High-value, low-effort** utility functions first
2. **Critical business logic** in API layer
3. **User-facing components** with interactions
4. **State management** in hooks and context

**Recommended Immediate Action:** Start with Phase 1 (utility functions) as they are pure functions that are easy to test and provide immediate coverage gains.
