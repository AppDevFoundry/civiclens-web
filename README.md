# ![Next.js + SWR Example App](project-logo.png)

> **Note**: This repository is part of [CivicLens](https://github.com/AppDevFoundry/civiclens), a multi-platform Congressional legislation tracker. It is based on the Next.js RealWorld implementation and will be adapted for civic engagement functionality.

> ### Next.js 14 + React 18 + SWR 2.x codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

### [Demo](https://next-realworld.now.sh/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

Originally created for this [GH issue](https://github.com/gothinkster/realworld/issues/336). The codebase is now feature complete; please submit bug fixes via pull requests & feedback via issues.

## Requirements

- **Node.js 18.0.0 or higher** (required for Next.js 14 compatibility)
- npm 9.x or higher (recommended)

## Getting started

You can view a live demo over at [https://next-realworld.now.sh/](https://next-realworld.now.sh/)

To get the frontend running locally:

1. Clone this repo
2. Ensure you have Node.js 18+ installed (`node --version`)
3. `npm install` to install all dependencies
4. `npm run dev` to start the local development server

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint with Next.js rules
npm run type-check   # Run TypeScript type checking

# Testing
npm test             # Run Jest test suite
npm run test:watch   # Run tests in watch mode
npm run test:ci      # Run tests for CI environment
```

## Tech Stack

- **Framework**: Next.js 14.2.x (Pages Router)
- **React**: 18.3.x with Strict Mode enabled
- **Data Fetching**: SWR 2.2.x
- **TypeScript**: 5.6.x
- **HTTP Client**: Axios 1.7.x
- **Markdown Rendering**: Marked 14.x with DOMPurify for XSS protection
- **Testing**: Jest 29.x + React Testing Library 16.x
- **Linting**: ESLint 8.x with Next.js Core Web Vitals rules

## Making requests to the backend API

For convenience, we have a live API server running at `https://conduit.productionready.io/api` for the application to make requests against. You can view [the API spec here](https://github.com/GoThinkster/productionready/blob/master/api) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

If you want to change the API URL to a local server, simply edit `lib/utils/constant.ts` and change `SERVER_BASE_URL` to the local server's URL (i.e. `localhost:3000/api`)

## Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication.

**General functionality:**

- Authenticate users via JWT (login/register pages + logout button on settings page)
- CRU\* users (sign up & settings page - no deleting required)
- CRUD Articles
- CR\*D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users
- **Secure markdown rendering** with XSS protection via DOMPurify

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
  - Render markdown from server client side (secured with DOMPurify)
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /profile/username-here, /profile/username-here?favorite=true)
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

## Project Structure

```
civiclens-web/
├── __tests__/            # Jest test files
├── components/           # React components
│   ├── article/          # Article-related components
│   ├── comment/          # Comment-related components
│   ├── common/           # Shared components (Layout, Navbar, etc.)
│   ├── editor/           # Editor components
│   ├── home/             # Home page components
│   └── profile/          # User profile components
├── lib/
│   ├── api/              # API client functions
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── pages/                # Next.js pages (Pages Router)
├── public/               # Static assets
└── styles.css            # Global styles
```

## Recent Upgrade: Next.js 14 / React 18

This codebase was recently upgraded from Next.js 9.5 to Next.js 14. See [UPGRADE_NOTES.md](./UPGRADE_NOTES.md) for details on the migration.

**Key improvements:**
- Modern React 18 features with Concurrent Rendering
- Improved performance with SWC compiler
- Enhanced type safety with TypeScript 5.x
- Secure markdown rendering (fixed XSS vulnerability in marked)
- Comprehensive testing setup with Jest + React Testing Library
- Modern SWR 2.x with improved data fetching patterns

<br />

[![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
