# CivicLens Web

> A platform for civic engagement and community building. Built with Next.js 14, React 18, and SWR.

This repository is part of [CivicLens](https://github.com/AppDevFoundry/civiclens), a multi-platform civic engagement platform designed to make government more accessible and help communities collaborate on solutions.

## Features

- **User Authentication** - Secure JWT-based login and registration
- **Article Publishing** - Create and share civic engagement content with markdown support
- **Community Interaction** - Comment on articles, follow users, and favorite content
- **Tag-based Discovery** - Find content by civic engagement topics
- **Secure Markdown Rendering** - XSS-protected content display
- **API Mocking System** - Full offline development support with MSW

## Requirements

- **Node.js 18.0.0 or higher**
- npm 9.x or higher (recommended)

## Getting Started

### Standard Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
```

### Development with Mock API
If you don't have a backend server running, use the built-in mocking system:

```bash
npm run dev:mock     # Start with full API mocking
```

Then open [http://localhost:3000](http://localhost:3000)

**Demo Credentials** (mock mode only):
| Email | Password | Username |
|-------|----------|----------|
| demo@civiclens.org | password123 | demouser |
| jane@civiclens.org | password123 | janedoe |
| john@civiclens.org | password123 | johnsmith |

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:mock         # Start with mock API (no backend needed)

# Production
npm run build            # Create optimized production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Testing
npm test                 # Run test suite
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:coverage:open  # Generate and open HTML coverage report
npm run coverage:open    # Open existing coverage report
```

## Tech Stack

- **Framework**: Next.js 14.2.x (Pages Router)
- **React**: 18.3.x with Strict Mode
- **Data Fetching**: SWR 2.2.x
- **TypeScript**: 5.6.x
- **HTTP Client**: Axios 1.7.x
- **Markdown**: Marked 14.x with DOMPurify (XSS protection)
- **Testing**: Jest 29.x + React Testing Library 16.x
- **API Mocking**: MSW 2.x (Mock Service Worker)
- **Linting**: ESLint 8.x with Next.js Core Web Vitals

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
├── mocks/                # MSW mock API system
│   ├── data/             # Mock data (users, articles, etc.)
│   ├── handlers.ts       # API request handlers
│   └── README.md         # Mock system documentation
├── pages/                # Next.js pages (Pages Router)
├── public/               # Static assets
└── styles.css            # Global styles
```

## API Configuration

The application connects to a RealWorld-compatible API. To configure:

1. Edit `lib/utils/constant.ts`
2. Update `SERVER_BASE_URL` to your API endpoint

For local development without a backend, use `npm run dev:mock` to enable the built-in mock server.

## Functionality Overview

**General functionality:**
- User authentication via JWT
- Create, read, update, delete articles
- Comment on articles
- Paginated article lists with filtering
- Favorite articles and follow users
- Tag-based content discovery
- Secure markdown rendering

**Pages:**
- **Home** (`/`) - Article feed, tags, pagination
- **Authentication** (`/user/login`, `/user/register`) - JWT-based auth
- **Settings** (`/user/settings`) - User profile management
- **Editor** (`/editor/new`, `/editor/[slug]`) - Article creation/editing
- **Article** (`/article/[slug]`) - Article view with comments
- **Profile** (`/profile/[username]`) - User profile and articles

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# View coverage report in browser
npm run test:coverage:open

# Watch mode for development
npm run test:watch
```

**Current Coverage:**
- API Layer: 100%
- Utility Functions: 97.5%
- Custom Hooks: 97.6%
- Common Components: 41.5%
- Overall: ~28%

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for civic engagement by [AppDevFoundry](https://github.com/AppDevFoundry)
