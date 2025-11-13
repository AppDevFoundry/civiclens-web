# Testing Guide

This document describes the testing setup and how to generate and view test coverage reports.

## Running Tests

### Basic Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (automatically re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with coverage and open the HTML report in your browser
npm run test:coverage:open
```

## Coverage Reports

### Viewing Coverage Reports

After running `npm run test:coverage`, several coverage reports are generated in the `coverage/` directory:

#### 1. **HTML Report** (Most Visual)
- **Location**: `coverage/index.html`
- **Best for**: Interactive browsing, detailed file-by-file analysis
- **How to view**:
  ```bash
  npm run test:coverage:open
  # Or manually open: open coverage/index.html
  ```

**Features of the HTML Report:**
- 📊 Visual coverage metrics with color coding (green = covered, red = uncovered)
- 🔍 Click through to see line-by-line coverage for each file
- 📈 See which branches, statements, functions, and lines are covered
- 🎯 Identify exactly which code needs more test coverage

#### 2. **Terminal Summary**
- **Format**: Text output in your terminal
- **Best for**: Quick overview during development
- **Shows**: Overall percentages for statements, branches, functions, and lines

#### 3. **LCOV Report**
- **Location**: `coverage/lcov.info`
- **Best for**: CI/CD integration (Codecov, Coveralls, etc.)
- **Format**: Machine-readable format for coverage tools

#### 4. **JSON Reports**
- **Location**: `coverage/coverage-final.json`, `coverage/coverage-summary.json`
- **Best for**: Programmatic access, custom tooling, badges

## Current Coverage Status

**Latest Results** (as of Phase 2 completion):

| Metric | Coverage | Count |
|--------|----------|-------|
| Statements | 57.39% | 1664/2899 |
| Branches | 74.25% | 124/167 |
| Functions | 52.11% | 37/71 |
| Lines | 57.39% | 1664/2899 |

### Coverage by Area

**High Coverage (90-100%):**
- ✅ Comment system (Comment, CommentInput, CommentList, DeleteButton)
- ✅ Common components (Navbar, Footer, Layout, LoadingSpinner, etc.)
- ✅ Authentication pages (login, register, settings)
- ✅ Authentication forms (LoginForm, RegisterForm, SettingsForm)
- ✅ Article components (ArticlePreview, ArticleMeta, ArticleActions)

**Needs Coverage (0-50%):**
- 🔴 API layer (article.ts, user.ts, comment.ts, tag.ts) - 0%
- 🔴 Editor components (TagInput, editor pages) - 0%
- 🔴 Profile components (EditProfileButton, FollowUserButton, ProfileTab) - 0%
- 🔴 Some utility functions (editorReducer, fetcher, storage) - 0-50%

## Understanding the HTML Coverage Report

### Dashboard View (`coverage/index.html`)

When you open the HTML report, you'll see:

1. **Summary Table**: Shows coverage for all directories
   - Green bars = good coverage (>80%)
   - Yellow bars = medium coverage (50-80%)
   - Red bars = needs coverage (<50%)

2. **Click on any directory or file** to drill down

### File Detail View

When viewing a specific file:

- **Green background** = line is covered by tests
- **Red background** = line is NOT covered by tests
- **Yellow background** = branch partially covered (e.g., if statement only tested one way)
- **Gray numbers** = line not executable (comments, declarations)

### Coverage Metrics Explained

| Metric | What it Measures | Example |
|--------|------------------|---------|
| **Statements** | Individual statements executed | `const x = 5;` |
| **Branches** | Conditional paths taken | Both `true` and `false` of an `if` statement |
| **Functions** | Functions called | All functions invoked at least once |
| **Lines** | Lines of code executed | Physical lines in the file |

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    name: civiclens-web-coverage
```

### Coverage Badge

You can add a coverage badge to your README using services like:
- **Codecov**: https://codecov.io/
- **Coveralls**: https://coveralls.io/
- **Shields.io**: Create custom badges from JSON summary

Example badge markdown:
```markdown
![Coverage](https://img.shields.io/codecov/c/github/AppDevFoundry/civiclens)
```

## Setting Coverage Thresholds

To enforce minimum coverage in CI/CD, add to `jest.config.js`:

```javascript
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
```

Tests will fail if coverage drops below these thresholds.

## Tips for Improving Coverage

1. **Identify gaps quickly**: Use the HTML report to find uncovered files
2. **Focus on high-value areas**: Prioritize business logic over presentational components
3. **Test user flows**: Integration tests often cover more code than unit tests
4. **Use coverage as a guide**: 100% coverage doesn't guarantee bug-free code
5. **Balance effort**: Aim for 70-80% coverage for most projects

## Troubleshooting

### Coverage report is empty

**Solution**: Make sure you ran `npm run test:coverage`, not just `npm test`

### Coverage directory missing

**Solution**: The `coverage/` directory is git-ignored and generated on demand. Run tests with coverage flag.

### Coverage seems incorrect

**Possible causes:**
- Stale coverage from previous run (delete `coverage/` and re-run)
- File not imported by any test
- Dynamic imports not properly mocked

## Related Files

- `jest.config.js` - Jest configuration including coverage settings
- `jest.setup.js` - Test environment setup
- `__tests__/` - All test files
- `coverage/` - Generated coverage reports (git-ignored)

---

For more information about testing:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Test Coverage Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
