/**
 * MSW Browser Handlers
 * Stateful mock API handlers for browser development
 */

import { http, HttpResponse, PathParams } from 'msw';
import { SERVER_BASE_URL } from '../lib/utils/constant';
import {
  mockArticles,
  mockComments,
  mockTags,
  mockUsers,
  currentUser,
  setCurrentUser,
  getUserFromToken,
  getNextCommentId,
  getNextArticleSlug,
} from './data';
import { ArticleType } from '../lib/types/articleType';
import { CommentType } from '../lib/types/commentType';

// In-memory storage for stateful operations
const storage = {
  articles: [...mockArticles],
  comments: { ...mockComments },
  users: { ...mockUsers },
  followedUsers: new Set<string>(),
  favoritedArticles: new Set<string>(),
};

// Helper to get auth token from request
const getAuthToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  return authHeader.replace('Token ', '');
};

// Helper to authenticate request
const authenticate = (request: Request) => {
  const token = getAuthToken(request);
  if (!token) return null;
  return getUserFromToken(token);
};

export const browserHandlers = [
  // ============================================
  // Authentication Endpoints
  // ============================================

  // Login
  http.post(`${SERVER_BASE_URL}/users/login`, async ({ request }) => {
    const body = (await request.json()) as { user: { email: string; password: string } };
    const { email } = body.user;

    const user = storage.users[email];
    if (!user) {
      return HttpResponse.json(
        { errors: { 'email or password': ['is invalid'] } },
        { status: 422 }
      );
    }

    setCurrentUser(user);
    return HttpResponse.json({ user });
  }),

  // Register
  http.post(`${SERVER_BASE_URL}/users`, async ({ request }) => {
    const body = (await request.json()) as {
      user: { email: string; username: string; password: string };
    };
    const { email, username } = body.user;

    // Check if user already exists
    if (storage.users[email]) {
      return HttpResponse.json(
        { errors: { email: ['has already been taken'] } },
        { status: 422 }
      );
    }

    const newUser = {
      email,
      username,
      bio: '',
      image: 'https://api.realworld.io/images/demo-avatar.png',
      token: `jwt.token.${username}`,
    };

    storage.users[email] = newUser;
    setCurrentUser(newUser);
    return HttpResponse.json({ user: newUser });
  }),

  // Get current user
  http.get(`${SERVER_BASE_URL}/user`, ({ request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }
    return HttpResponse.json({ user });
  }),

  // Update user
  http.put(`${SERVER_BASE_URL}/user`, async ({ request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const body = (await request.json()) as { user: Partial<typeof user> };
    const updatedUser = { ...user, ...body.user };

    // Update in storage
    storage.users[user.email] = updatedUser;
    setCurrentUser(updatedUser);

    return HttpResponse.json({ user: updatedUser });
  }),

  // ============================================
  // Articles Endpoints
  // ============================================

  // Get articles (with query params support)
  http.get(`${SERVER_BASE_URL}/articles`, ({ request }) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const author = url.searchParams.get('author');
    const favorited = url.searchParams.get('favorited');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let filteredArticles = [...storage.articles];

    // Filter by tag
    if (tag) {
      filteredArticles = filteredArticles.filter((article) =>
        article.tagList.includes(tag)
      );
    }

    // Filter by author
    if (author) {
      filteredArticles = filteredArticles.filter(
        (article) => article.author.username === author
      );
    }

    // Filter by favorited
    if (favorited) {
      filteredArticles = filteredArticles.filter((article) =>
        storage.favoritedArticles.has(article.slug)
      );
    }

    // Sort by date (newest first)
    filteredArticles.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return HttpResponse.json({
      articles: paginatedArticles,
      articlesCount: filteredArticles.length,
    });
  }),

  // Get article feed (for logged in users)
  http.get(`${SERVER_BASE_URL}/articles/feed`, ({ request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Get articles from followed users
    const feedArticles = storage.articles.filter((article) =>
      storage.followedUsers.has(article.author.username)
    );

    // Sort by date
    feedArticles.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginatedArticles = feedArticles.slice(offset, offset + limit);

    return HttpResponse.json({
      articles: paginatedArticles,
      articlesCount: feedArticles.length,
    });
  }),

  // Get single article
  http.get<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug`, ({ params }) => {
    const article = storage.articles.find((a) => a.slug === params.slug);
    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }
    return HttpResponse.json({ article });
  }),

  // Create article
  http.post(`${SERVER_BASE_URL}/articles`, async ({ request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const body = (await request.json()) as {
      article: { title: string; description: string; body: string; tagList: string[] };
    };

    const newArticle: ArticleType = {
      slug: getNextArticleSlug(body.article.title),
      title: body.article.title,
      description: body.article.description,
      body: body.article.body,
      tagList: body.article.tagList || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    };

    storage.articles.unshift(newArticle);
    return HttpResponse.json({ article: newArticle });
  }),

  // Update article
  http.put<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug`, async ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const articleIndex = storage.articles.findIndex((a) => a.slug === params.slug);
    if (articleIndex === -1) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    const article = storage.articles[articleIndex];
    if (article.author.username !== user.username) {
      return HttpResponse.json({ errors: { auth: ['forbidden'] } }, { status: 403 });
    }

    const body = (await request.json()) as { article: Partial<ArticleType> };
    const updatedArticle = {
      ...article,
      ...body.article,
      updatedAt: new Date().toISOString(),
    };

    storage.articles[articleIndex] = updatedArticle;
    return HttpResponse.json({ article: updatedArticle });
  }),

  // Delete article
  http.delete<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const articleIndex = storage.articles.findIndex((a) => a.slug === params.slug);
    if (articleIndex === -1) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    const article = storage.articles[articleIndex];
    if (article.author.username !== user.username) {
      return HttpResponse.json({ errors: { auth: ['forbidden'] } }, { status: 403 });
    }

    storage.articles.splice(articleIndex, 1);
    delete storage.comments[params.slug];
    storage.favoritedArticles.delete(params.slug);

    return HttpResponse.json({});
  }),

  // ============================================
  // Favorite Endpoints
  // ============================================

  // Favorite article
  http.post<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug/favorite`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const article = storage.articles.find((a) => a.slug === params.slug);
    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    if (!storage.favoritedArticles.has(params.slug)) {
      storage.favoritedArticles.add(params.slug);
      article.favorited = true;
      article.favoritesCount++;
    }

    return HttpResponse.json({ article });
  }),

  // Unfavorite article
  http.delete<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug/favorite`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const article = storage.articles.find((a) => a.slug === params.slug);
    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    if (storage.favoritedArticles.has(params.slug)) {
      storage.favoritedArticles.delete(params.slug);
      article.favorited = false;
      article.favoritesCount = Math.max(0, article.favoritesCount - 1);
    }

    return HttpResponse.json({ article });
  }),

  // ============================================
  // Comments Endpoints
  // ============================================

  // Get comments
  http.get<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug/comments`, ({ params }) => {
    const comments = storage.comments[params.slug] || [];
    return HttpResponse.json({ comments });
  }),

  // Create comment
  http.post<PathParams<'slug'>>(`${SERVER_BASE_URL}/articles/:slug/comments`, async ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const body = (await request.json()) as { comment: { body: string } };

    const newComment: CommentType = {
      id: getNextCommentId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      body: body.comment.body,
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    };

    if (!storage.comments[params.slug]) {
      storage.comments[params.slug] = [];
    }
    storage.comments[params.slug].push(newComment);

    return HttpResponse.json({ comment: newComment });
  }),

  // Delete comment
  http.delete<PathParams<'slug' | 'id'>>(`${SERVER_BASE_URL}/articles/:slug/comments/:id`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const comments = storage.comments[params.slug] || [];
    const commentIndex = comments.findIndex((c) => c.id === parseInt(params.id as string, 10));

    if (commentIndex === -1) {
      return HttpResponse.json({ errors: { comment: ['not found'] } }, { status: 404 });
    }

    const comment = comments[commentIndex];
    if (comment.author.username !== user.username) {
      return HttpResponse.json({ errors: { auth: ['forbidden'] } }, { status: 403 });
    }

    comments.splice(commentIndex, 1);
    return HttpResponse.json({});
  }),

  // ============================================
  // Tags Endpoint
  // ============================================

  http.get(`${SERVER_BASE_URL}/tags`, () => {
    return HttpResponse.json({ tags: mockTags });
  }),

  // ============================================
  // Profile Endpoints
  // ============================================

  // Get profile
  http.get<PathParams<'username'>>(`${SERVER_BASE_URL}/profiles/:username`, ({ params }) => {
    const user = Object.values(storage.users).find((u) => u.username === params.username);
    if (!user) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    const profile = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: storage.followedUsers.has(user.username),
    };

    return HttpResponse.json({ profile });
  }),

  // Follow user
  http.post<PathParams<'username'>>(`${SERVER_BASE_URL}/profiles/:username/follow`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const targetUser = Object.values(storage.users).find((u) => u.username === params.username);
    if (!targetUser) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    storage.followedUsers.add(params.username);

    const profile = {
      username: targetUser.username,
      bio: targetUser.bio,
      image: targetUser.image,
      following: true,
    };

    return HttpResponse.json({ profile });
  }),

  // Unfollow user
  http.delete<PathParams<'username'>>(`${SERVER_BASE_URL}/profiles/:username/follow`, ({ params, request }) => {
    const user = authenticate(request);
    if (!user) {
      return HttpResponse.json({ errors: { auth: ['unauthorized'] } }, { status: 401 });
    }

    const targetUser = Object.values(storage.users).find((u) => u.username === params.username);
    if (!targetUser) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    storage.followedUsers.delete(params.username);

    const profile = {
      username: targetUser.username,
      bio: targetUser.bio,
      image: targetUser.image,
      following: false,
    };

    return HttpResponse.json({ profile });
  }),
];
