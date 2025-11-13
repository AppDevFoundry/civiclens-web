# API Mocking System

This directory contains a complete API mocking solution using [MSW (Mock Service Worker)](https://mswjs.io/). It allows you to run the CivicLens application locally with fully functional mock data, without needing a backend server.

## Quick Start

```bash
# Run the application with mock API
npm run dev:mock
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

You can log in with any of these demo accounts:

| Email                | Password      | Username    |
|---------------------|---------------|-------------|
| demo@civiclens.org  | password123   | demouser    |
| jane@civiclens.org  | password123   | janedoe     |
| john@civiclens.org  | password123   | johnsmith   |

## Features

### User Management
- **Register** - Create new accounts (validates unique email/username)
- **Login** - Authenticate with email/password
- **Profile** - View and update user profiles
- **Follow/Unfollow** - Social following functionality

### Articles
- **Browse** - View all articles with pagination
- **Filter** - Filter by tag, author, or favorited
- **Create** - Write new articles (requires login)
- **Edit** - Update your own articles
- **Delete** - Remove your own articles
- **Favorite** - Like/unlike articles
- **Feed** - View articles from followed users

### Comments
- **View** - See comments on articles
- **Create** - Add comments (requires login)
- **Delete** - Remove your own comments

### Tags
- **Browse** - View popular tags
- **Filter** - Click tags to filter articles

## Mock Data

The system includes realistic civic engagement content:
- 5 sample articles about civic tech, democracy, and community organizing
- 3 user accounts with bios and avatars
- Pre-existing comments and relationships
- 20 civic-themed tags

## How It Works

1. **Service Worker** - MSW installs a service worker that intercepts HTTP requests
2. **Request Handlers** - `handlers.ts` defines mock responses for each API endpoint
3. **In-Memory Database** - Mock data is stored in memory and persists during the session
4. **Realistic Delays** - Network delays are simulated for a realistic experience

## Architecture

```
mocks/
├── browser.ts       # MSW browser setup
├── handlers.ts      # API request handlers (the core logic)
├── index.ts         # Initialization and configuration
├── data/
│   ├── articles.ts  # Article mock data and operations
│   ├── comments.ts  # Comment mock data and operations
│   ├── tags.ts      # Tag mock data
│   └── users.ts     # User mock data and operations
└── README.md        # This file
```

## API Endpoints Mocked

### Authentication
- `POST /users/login` - Login
- `POST /users` - Register
- `GET /user` - Get current user
- `PUT /user` - Update user settings

### Profiles
- `GET /profiles/:username` - Get user profile
- `POST /profiles/:username/follow` - Follow user
- `DELETE /profiles/:username/follow` - Unfollow user

### Articles
- `GET /articles` - List articles (with filters)
- `GET /articles/feed` - Get personalized feed
- `GET /articles/:slug` - Get single article
- `POST /articles` - Create article
- `PUT /articles/:slug` - Update article
- `DELETE /articles/:slug` - Delete article
- `POST /articles/:slug/favorite` - Favorite article
- `DELETE /articles/:slug/favorite` - Unfavorite article

### Comments
- `GET /articles/:slug/comments` - Get comments
- `POST /articles/:slug/comments` - Add comment
- `DELETE /articles/:slug/comments/:id` - Delete comment

### Tags
- `GET /tags` - Get popular tags

## Debugging

When running with mocks enabled, you'll see:
- `[MSW] Mocking enabled.` in the browser console
- Network requests intercepted by MSW show as "from ServiceWorker" in DevTools

You can also access the worker instance:
```javascript
// In browser console
window.msw.worker.printHandlers()
```

## Customizing Mock Data

### Add a New User

Edit `mocks/data/users.ts`:

```typescript
users.set('new@example.com', {
  email: 'new@example.com',
  password: 'password123',
  token: 'mock-jwt-token-new',
  username: 'newuser',
  bio: 'New user bio',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new',
});
```

### Add a New Article

Edit `mocks/data/articles.ts`:

```typescript
articles.push({
  slug: 'my-new-article',
  title: 'My New Article',
  description: 'Description here',
  body: 'Full markdown content...',
  tagList: ['tag1', 'tag2'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  favorited: false,
  favoritesCount: 0,
  author: { /* author object */ },
});
```

## Disabling Mocks

To run with the real API:

```bash
# Standard dev mode (no mocking)
npm run dev
```

Or remove/comment the environment variable:
```bash
# In .env.mock
# NEXT_PUBLIC_API_MOCKING=enabled
```

## Limitations

- Data resets when you refresh the page (in-memory storage)
- No server-side rendering support (client-side only)
- File uploads are not implemented
- Some edge cases may not match real API behavior

## Contributing

To add new mock functionality:

1. Add data structures in `mocks/data/`
2. Create handlers in `mocks/handlers.ts`
3. Test thoroughly with the UI
4. Update this documentation

## Resources

- [MSW Documentation](https://mswjs.io/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [RealWorld API Spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints)
