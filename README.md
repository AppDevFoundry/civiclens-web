# ![Next.js + SWR Example App](project-logo.png)

> **Note**: This repository is part of [CivicLens](https://github.com/AppDevFoundry/civiclens), a multi-platform Congressional legislation tracker. It is based on the Next.js RealWorld implementation and will be adapted for civic engagement functionality.

> ### Next.js + SWR codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

### [Demo](https://next-realworld.now.sh/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

## Recent Upgrade

✨ **This project has been upgraded to Next.js 14 + React 18!**

- **Next.js**: 9.5.1 → 14.2.15
- **React**: 16.13.1 → 18.3.1
- **TypeScript**: 3.9.7 → 5.6.3
- **SWR**: 0.3.0 → 2.2.5
- Added complete testing infrastructure (Jest + Testing Library)

See [UPGRADE_NOTES.md](./UPGRADE_NOTES.md) for detailed migration information.

## Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher

## Getting started

You can view a live demo over at [https://next-realworld.now.sh/](https://next-realworld.now.sh/)

To get the frontend running locally:

- Clone this repo
- Ensure you have Node.js 18+ installed (`node --version`)
- `npm install` to install all dependencies
- `npm run dev` to start the local development server (http://localhost:3000)

### Available Scripts

```bash
npm run dev                 # Start development server
npm run dev:mock            # Start development server with API mocking enabled
npm run dev:real            # Start development server with real API
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint
npm run type-check          # Run TypeScript type checking
npm test                    # Run tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run test:coverage:open  # Run tests with coverage and open HTML report
```

### Making requests to the backend API

For convenience, we have a live API server running at `https://conduit.productionready.io/api` for the application to make requests against. You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/api) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

If you want to change the API URL to a local server, simply edit `lib/utils/constant.js` and change `SERVER_BASE_URL` to the local server's URL (i.e. `localhost:3000/api`)

### 🎭 API Mocking System

This project includes a comprehensive **Mock Service Worker (MSW)** setup that allows you to run the entire application locally without a backend API. This is perfect for:

- 🚀 Frontend development without backend dependency
- 🧪 Consistent testing data
- 🎨 UI/UX prototyping
- 📚 Demos and presentations

#### Quick Start with Mocking

1. **Enable mocking** by setting the environment variable in `.env.local`:
   ```bash
   NEXT_PUBLIC_ENABLE_API_MOCKING=true
   ```

2. **Start the server**:
   ```bash
   npm run dev:mock
   # or just npm run dev (reads from .env.local)
   ```

3. **Open your browser** and you'll see all API requests intercepted and mocked!

#### Pre-configured Mock Users

You can log in with these test accounts:

| Email | Username | Password |
|-------|----------|----------|
| `jake@jake.jake` | jake | any |
| `john@john.john` | john | any |
| `jane@jane.jane` | jane | any |

*Note: Any password works in mock mode*

#### Features

The mock system includes:

- ✅ **Full CRUD operations** - Create, edit, delete articles and comments
- ✅ **Authentication** - Login, register, update profile
- ✅ **Social features** - Favorite articles, follow users
- ✅ **Stateful behavior** - Changes persist during your session
- ✅ **Realistic data** - 5 pre-loaded articles about civic engagement
- ✅ **Easy toggle** - Switch between mock and real API instantly

#### Documentation

For detailed information about the mocking system, see [MOCKING.md](./MOCKING.md).

**Disable mocking:**
```bash
# In .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=false

# Or use the script
npm run dev:real
```

### 🧪 Testing & Coverage

This project includes comprehensive testing with Jest and React Testing Library:

**Current Test Coverage**: 57.39% (95 tests, 18 test suites)

#### Run Tests

```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Generate coverage report
npm run test:coverage:open  # Generate report and open in browser
```

#### View Coverage Reports

After running `npm run test:coverage`, an **interactive HTML report** is generated at `coverage/index.html`. This provides:

- 📊 Visual coverage metrics with color-coded files
- 🔍 Line-by-line coverage for each file
- 📈 Drill-down views to see exactly what's tested
- 🎯 Identify gaps in test coverage

The report automatically opens in your browser with `npm run test:coverage:open`.

For detailed testing information, see [TESTING.md](./TESTING.md).

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication. You can view a live demo over at [https://next-realworld.now.sh/](https://next-realworld.now.sh/)

**General functionality:**

- Authenticate users via JWT (login/register pages + logout button on settings page)
- CRU\* users (sign up & settings page - no deleting required)
- CRUD Articles
- CR\*D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: /)
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /user/login, /user/register)
  - Use JWT (store the token in localStorage)
- Settings page (URL: /user/settings )
- Editor page to create/edit articles (URL: /editor/new, /editor/article-slug-here)
- Article page (URL: /article/article-slug-here)
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /profile/username-here, /profile/username-here?favorite=true)
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
