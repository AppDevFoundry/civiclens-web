# API Mocking System

This project includes a comprehensive API mocking system using [Mock Service Worker (MSW)](https://mswjs.io/) that allows you to run the application locally without a backend API.

## 🚀 Quick Start

### Enable Mocking

1. **Set the environment variable** in `.env.local`:
   ```bash
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

You should see a message in the console:
```
[MSW] Mocking enabled
All API requests to https://api.realworld.io/api will be mocked
```

### Disable Mocking

When you have a real backend API running, disable mocking:

```bash
# In .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=false
```

## 📁 Project Structure

```
mocks/
├── browser.ts           # Browser worker initialization
├── browser-handlers.ts  # Stateful API handlers for browser
└── data.ts             # Mock data (users, articles, comments)

__tests__/mocks/
└── handlers.ts         # Test-only handlers (simpler, stateless)

public/
└── mockServiceWorker.js # MSW service worker (auto-generated)
```

## 🎭 How It Works

### Mock Service Worker (MSW)

MSW intercepts network requests at the **network level** using Service Workers. This means:

- ✅ **No code changes needed** - Your app makes real fetch/axios calls
- ✅ **Works in browser DevTools** - See requests in Network tab
- ✅ **Realistic testing** - Same code path as production
- ✅ **Easy to toggle** - Enable/disable with environment variable

### Two Mocking Systems

#### 1. Test Mocks (`__tests__/mocks/handlers.ts`)
- Simple, stateless handlers
- Used during Jest testing
- Fast and predictable

#### 2. Browser Mocks (`mocks/browser-handlers.ts`)
- Stateful, persistent data
- Used during local development
- Simulates real backend behavior

## 🗄️ Mock Data

### Pre-configured Users

You can log in with these accounts:

| Email | Username | Bio |
|-------|----------|-----|
| `jake@jake.jake` | jake | I work at statefarm |
| `john@john.john` | john | Software engineer and civic engagement enthusiast |
| `jane@jane.jane` | jane | Policy researcher and community organizer |

**Password**: Any password will work in mock mode

### Sample Articles

The system includes 5 pre-configured articles about civic engagement:
- Understanding Local Governance
- Community Organizing Tips
- Transparency in Government
- Voting Rights Overview
- Understanding Public Budgets

### Sample Comments

Each article has relevant comments from different mock users.

## 🔧 Features

### Stateful Operations

The browser mocking system maintains state across requests:

- **Authentication**: Login persists across page refreshes
- **Articles**: Create, edit, delete articles (stored in memory)
- **Comments**: Add and delete comments
- **Favorites**: Favorite/unfavorite articles
- **Following**: Follow/unfollow users
- **Filtering**: Articles by tag, author, favorites

### API Endpoints Mocked

#### Authentication
- `POST /users/login` - Login with email/password
- `POST /users` - Register new user
- `GET /user` - Get current user
- `PUT /user` - Update user profile

#### Articles
- `GET /articles` - List articles (with filters)
- `GET /articles/feed` - Get feed for logged-in user
- `GET /articles/:slug` - Get single article
- `POST /articles` - Create article
- `PUT /articles/:slug` - Update article
- `DELETE /articles/:slug` - Delete article

#### Favorites
- `POST /articles/:slug/favorite` - Favorite article
- `DELETE /articles/:slug/favorite` - Unfavorite article

#### Comments
- `GET /articles/:slug/comments` - Get comments
- `POST /articles/:slug/comments` - Add comment
- `DELETE /articles/:slug/comments/:id` - Delete comment

#### Tags
- `GET /tags` - Get all tags

#### Profiles
- `GET /profiles/:username` - Get user profile
- `POST /profiles/:username/follow` - Follow user
- `DELETE /profiles/:username/follow` - Unfollow user

## 🎨 Customizing Mock Data

### Add More Articles

Edit `mocks/data.ts` and add to the `mockArticles` array:

```typescript
export const mockArticles: ArticleType[] = [
  // ... existing articles
  {
    slug: 'my-new-article',
    title: 'My New Article',
    description: 'Article description',
    body: 'Article content...',
    tagList: ['tag1', 'tag2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    favorited: false,
    favoritesCount: 0,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      following: false,
    },
  },
];
```

### Add More Users

Edit `mocks/data.ts` and add to the `mockUsers` object:

```typescript
export const mockUsers: Record<string, UserType> = {
  // ... existing users
  'newuser@example.com': {
    email: 'newuser@example.com',
    username: 'newuser',
    bio: 'New user bio',
    image: 'https://i.pravatar.cc/150?img=10',
    token: 'jwt.token.newuser',
  },
};
```

### Modify Handler Behavior

Edit `mocks/browser-handlers.ts` to customize API responses:

```typescript
// Example: Add delay to simulate slow network
http.get(`${SERVER_BASE_URL}/articles`, async ({ request }) => {
  await delay(1000); // 1 second delay

  // ... rest of handler
});
```

## 🐛 Debugging

### View Mocked Requests

Open browser DevTools → Console. MSW logs all intercepted requests:

```
[MSW] GET /api/articles (200 OK)
[MSW] POST /api/users/login (200 OK)
```

### Check Network Tab

Mocked requests appear in the Network tab as regular requests, but are handled by the service worker.

### Common Issues

#### Race Condition - CORS Errors Before Data Loads

**Problem**: CORS errors appear before mock data loads, with ~5 second delay

**Root Cause**: Components were making API requests before MSW's service worker was fully registered and ready

**Solution**: ✅ **FIXED** - The app now uses SWR middleware that delays data fetching until MSW is ready. See `MSW_FIXES.md` for technical details.

If you still experience delays:
1. Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Check the console for the "🎭 [MSW] Mocking enabled" message BEFORE any API requests
3. Verify no CORS errors appear

#### Server-Side Rendering Error (Error 530)

**Problem**: Clicking on articles shows "AxiosError: Request failed with status code 530"

**Root Cause**: Pages using `getServerSideProps` fetch data on the server where MSW doesn't run

**Solution**: ✅ **FIXED** - Article pages now use client-side data fetching with SWR. All data fetching happens in the browser where MSW can intercept requests.

**Technical Change**: Removed `getServerSideProps` from `pages/article/[pid].tsx` and added proper loading/error states

#### Service Worker Not Registering

**Problem**: MSW doesn't start, no console message

**Solutions**:
1. Check that `NEXT_PUBLIC_ENABLE_API_MOCKING=true` in `.env.local`
2. Clear browser cache and reload
3. Check that `public/mockServiceWorker.js` exists
4. Try different browser (Service Workers may be disabled)
5. Make sure you're not in incognito/private mode (some browsers restrict Service Workers)

#### TypeScript Errors

**Problem**: Type errors in mock files

**Solutions**:
1. Ensure all type imports match your project types
2. Check `lib/types/` for correct type definitions
3. Run `npm run type-check` to see all errors

#### State Not Persisting

**Problem**: Data resets after page refresh

**Expected Behavior**: This is intentional! Mock state is stored in memory and resets when you refresh. This ensures a clean state for testing.

**Solution**: If you need persistence, you can:
1. Use `localStorage` in the handlers
2. Or implement a custom state management solution

## 🧪 Testing with Mocks

The test mocks are automatically used by Jest. No configuration needed!

```typescript
// In your test file
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('loads data', async () => {
  render(<MyComponent />);

  // Handlers from __tests__/mocks/handlers.ts are automatically used
  const element = await screen.findByText('Test Article');
  expect(element).toBeInTheDocument();
});
```

## 📚 Resources

- [MSW Documentation](https://mswjs.io/docs/)
- [MSW Examples](https://github.com/mswjs/examples)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎯 Best Practices

### DO ✅

- Keep mock data realistic and representative
- Update mocks when API changes
- Use mocking for local development and testing
- Document any custom mock behaviors

### DON'T ❌

- Don't commit sensitive data to mock files
- Don't use mocks in production
- Don't make mocks too complex (keep them maintainable)
- Don't forget to test against real API before deploying

## 🔄 Switching Between Mock and Real API

### During Development

**Use Mocks When**:
- Backend is not available
- Working on frontend features
- Need consistent test data
- Want fast iteration

**Use Real API When**:
- Testing integrations
- Verifying API changes
- Debugging backend issues
- Final QA before deployment

### Quick Toggle

Add this to your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:mock": "NEXT_PUBLIC_ENABLE_API_MOCKING=true npm run dev",
    "dev:real": "NEXT_PUBLIC_ENABLE_API_MOCKING=false npm run dev"
  }
}
```

Then use:
```bash
npm run dev:mock   # With mocking
npm run dev:real   # With real API
```

## 📝 Contributing

When adding new features that interact with the API:

1. **Update mock data** in `mocks/data.ts`
2. **Add/modify handlers** in `mocks/browser-handlers.ts`
3. **Update test mocks** in `__tests__/mocks/handlers.ts` if needed
4. **Document** any special mock behaviors in this file

## 🎉 Benefits

### For Developers
- ✅ Work offline
- ✅ Consistent, predictable data
- ✅ Fast feedback loop
- ✅ No backend setup required
- ✅ Easy to reproduce bugs

### For Testing
- ✅ Reliable test data
- ✅ Fast test execution
- ✅ No flaky network tests
- ✅ Easy to test edge cases

### For Teams
- ✅ Frontend and backend teams work independently
- ✅ Can develop features before backend is ready
- ✅ Easy onboarding for new developers
- ✅ Consistent demo data for presentations

---

**Happy Mocking! 🎭**

For questions or issues, please check the [MSW documentation](https://mswjs.io/docs/) or reach out to the team.
