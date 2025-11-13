import { http, HttpResponse, delay } from 'msw';
import { SERVER_BASE_URL } from '../lib/utils/constant';
import {
  users,
  getUserByToken,
  getUserByEmail,
  getProfile,
  followingRelationships,
} from './data/users';
import {
  articles,
  userFavorites,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleBySlug,
} from './data/articles';
import { getCommentsForArticle, createComment, deleteComment } from './data/comments';
import { getPopularTags } from './data/tags';

// Helper to extract token from Authorization header
const getTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader) return null;
  const match = authHeader.match(/Token\s+(.+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Helper to get current user from request
const getCurrentUser = (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);
  return token ? getUserByToken(token) : null;
};

export const handlers = [
  // ==================== USER ENDPOINTS ====================

  // Login
  http.post(`${SERVER_BASE_URL}/users/login`, async ({ request }) => {
    await delay(300); // Simulate network delay

    const body = (await request.json()) as { user: { email: string; password: string } };
    const { email, password } = body.user;

    const user = getUserByEmail(email);
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { errors: { 'email or password': ['is invalid'] } },
        { status: 422 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return HttpResponse.json({ user: userWithoutPassword });
  }),

  // Register
  http.post(`${SERVER_BASE_URL}/users`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as {
      user: { username: string; email: string; password: string };
    };
    const { username, email, password } = body.user;

    // Check if email already exists
    if (users.has(email)) {
      return HttpResponse.json({ errors: { email: ['has already been taken'] } }, { status: 422 });
    }

    // Check if username already exists
    const existingUsername = Array.from(users.values()).find((u) => u.username === username);
    if (existingUsername) {
      return HttpResponse.json(
        { errors: { username: ['has already been taken'] } },
        { status: 422 }
      );
    }

    // Create new user
    const newUser = {
      email,
      password,
      token: `mock-jwt-token-${Date.now()}`,
      username,
      bio: '',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    users.set(email, newUser);
    followingRelationships.set(username, new Set());
    userFavorites.set(username, new Set());

    const { password: _, ...userWithoutPassword } = newUser;
    return HttpResponse.json({ user: userWithoutPassword });
  }),

  // Get current user
  http.get('/user', async ({ request }) => {
    await delay(200);

    const user = getCurrentUser(request);
    if (!user) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    return HttpResponse.json({ user });
  }),

  // Update user
  http.put(`${SERVER_BASE_URL}/user`, async ({ request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = (await request.json()) as {
      user: Partial<{ email: string; username: string; bio: string; image: string; password: string }>;
    };
    const updates = body.user;

    // Update user in database
    const userEntry = users.get(currentUser.email);
    if (userEntry) {
      Object.assign(userEntry, updates);
    }

    return HttpResponse.json({
      user: {
        ...currentUser,
        ...updates,
        password: undefined,
      },
    });
  }),

  // Get profile
  http.get(`${SERVER_BASE_URL}/profiles/:username`, async ({ params, request }) => {
    await delay(200);

    const { username } = params as { username: string };
    const currentUser = getCurrentUser(request);
    const profile = getProfile(username, currentUser?.username);

    if (!profile) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    return HttpResponse.json({ profile });
  }),

  // Follow user
  http.post(`${SERVER_BASE_URL}/profiles/:username/follow`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { username } = params as { username: string };
    const profile = getProfile(username, currentUser.username);

    if (!profile) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    // Add to following relationships
    const following = followingRelationships.get(currentUser.username) || new Set();
    following.add(username);
    followingRelationships.set(currentUser.username, following);

    return HttpResponse.json({
      profile: {
        ...profile,
        following: true,
      },
    });
  }),

  // Unfollow user
  http.delete(`${SERVER_BASE_URL}/profiles/:username/follow`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { username } = params as { username: string };
    const profile = getProfile(username, currentUser.username);

    if (!profile) {
      return HttpResponse.json({ errors: { profile: ['not found'] } }, { status: 404 });
    }

    // Remove from following relationships
    const following = followingRelationships.get(currentUser.username);
    if (following) {
      following.delete(username);
    }

    return HttpResponse.json({
      profile: {
        ...profile,
        following: false,
      },
    });
  }),

  // ==================== ARTICLE ENDPOINTS ====================

  // Get all articles (with filters)
  http.get(`${SERVER_BASE_URL}/articles`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const author = url.searchParams.get('author');
    const favorited = url.searchParams.get('favorited');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const currentUser = getCurrentUser(request);

    let filteredArticles = [...articles];

    // Apply filters
    if (tag) {
      filteredArticles = filteredArticles.filter((a) => a.tagList.includes(tag));
    }

    if (author) {
      filteredArticles = filteredArticles.filter((a) => a.author.username === author);
    }

    if (favorited) {
      const userFavs = userFavorites.get(favorited) || new Set();
      filteredArticles = filteredArticles.filter((a) => userFavs.has(a.slug));
    }

    // Update favorited status for current user
    if (currentUser) {
      const currentUserFavs = userFavorites.get(currentUser.username) || new Set();
      filteredArticles = filteredArticles.map((a) => ({
        ...a,
        favorited: currentUserFavs.has(a.slug),
        author: {
          ...a.author,
          following: followingRelationships.get(currentUser.username)?.has(a.author.username) || false,
        },
      }));
    }

    const total = filteredArticles.length;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return HttpResponse.json({
      articles: paginatedArticles,
      articlesCount: total,
    });
  }),

  // Get feed (articles from followed users)
  http.get(`${SERVER_BASE_URL}/articles/feed`, async ({ request }) => {
    await delay(400);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const following = followingRelationships.get(currentUser.username) || new Set();
    const currentUserFavs = userFavorites.get(currentUser.username) || new Set();

    let feedArticles = articles
      .filter((a) => following.has(a.author.username))
      .map((a) => ({
        ...a,
        favorited: currentUserFavs.has(a.slug),
        author: {
          ...a.author,
          following: true,
        },
      }));

    const total = feedArticles.length;
    const paginatedArticles = feedArticles.slice(offset, offset + limit);

    return HttpResponse.json({
      articles: paginatedArticles,
      articlesCount: total,
    });
  }),

  // Get single article
  http.get(`${SERVER_BASE_URL}/articles/:slug`, async ({ params, request }) => {
    await delay(300);

    const { slug } = params as { slug: string };
    const article = getArticleBySlug(slug);

    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    const currentUser = getCurrentUser(request);
    let responseArticle = { ...article };

    if (currentUser) {
      const currentUserFavs = userFavorites.get(currentUser.username) || new Set();
      responseArticle = {
        ...article,
        favorited: currentUserFavs.has(slug),
        author: {
          ...article.author,
          following:
            followingRelationships.get(currentUser.username)?.has(article.author.username) || false,
        },
      };
    }

    return HttpResponse.json({ article: responseArticle });
  }),

  // Create article
  http.post(`${SERVER_BASE_URL}/articles`, async ({ request }) => {
    await delay(500);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = (await request.json()) as {
      article: { title: string; description: string; body: string; tagList: string[] };
    };

    const userProfile = getProfile(currentUser.username);
    if (!userProfile) {
      return HttpResponse.json({ errors: { user: ['not found'] } }, { status: 404 });
    }

    const newArticle = createArticle(body.article, {
      username: currentUser.username,
      bio: currentUser.bio,
      image: currentUser.image,
    });

    return HttpResponse.json({ article: newArticle }, { status: 201 });
  }),

  // Update article
  http.put(`${SERVER_BASE_URL}/articles/:slug`, async ({ params, request }) => {
    await delay(400);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug } = params as { slug: string };
    const article = getArticleBySlug(slug);

    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    if (article.author.username !== currentUser.username) {
      return HttpResponse.json({ errors: { article: ['not authorized'] } }, { status: 403 });
    }

    const body = (await request.json()) as {
      article: Partial<{ title: string; description: string; body: string; tagList: string[] }>;
    };

    const updatedArticle = updateArticle(slug, body.article);

    return HttpResponse.json({ article: updatedArticle });
  }),

  // Delete article
  http.delete(`${SERVER_BASE_URL}/articles/:slug`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug } = params as { slug: string };
    const article = getArticleBySlug(slug);

    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    if (article.author.username !== currentUser.username) {
      return HttpResponse.json({ errors: { article: ['not authorized'] } }, { status: 403 });
    }

    deleteArticle(slug);

    return HttpResponse.json({});
  }),

  // Favorite article
  http.post(`${SERVER_BASE_URL}/articles/:slug/favorite`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug } = params as { slug: string };
    const articleIndex = articles.findIndex((a) => a.slug === slug);

    if (articleIndex === -1) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    // Add to favorites
    const favs = userFavorites.get(currentUser.username) || new Set();
    if (!favs.has(slug)) {
      favs.add(slug);
      userFavorites.set(currentUser.username, favs);
      articles[articleIndex].favoritesCount++;
    }

    return HttpResponse.json({
      article: {
        ...articles[articleIndex],
        favorited: true,
        author: {
          ...articles[articleIndex].author,
          following:
            followingRelationships.get(currentUser.username)?.has(articles[articleIndex].author.username) ||
            false,
        },
      },
    });
  }),

  // Unfavorite article
  http.delete(`${SERVER_BASE_URL}/articles/:slug/favorite`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug } = params as { slug: string };
    const articleIndex = articles.findIndex((a) => a.slug === slug);

    if (articleIndex === -1) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    // Remove from favorites
    const favs = userFavorites.get(currentUser.username);
    if (favs && favs.has(slug)) {
      favs.delete(slug);
      articles[articleIndex].favoritesCount = Math.max(0, articles[articleIndex].favoritesCount - 1);
    }

    return HttpResponse.json({
      article: {
        ...articles[articleIndex],
        favorited: false,
        author: {
          ...articles[articleIndex].author,
          following:
            followingRelationships.get(currentUser.username)?.has(articles[articleIndex].author.username) ||
            false,
        },
      },
    });
  }),

  // ==================== COMMENT ENDPOINTS ====================

  // Get comments for article
  http.get(`${SERVER_BASE_URL}/articles/:slug/comments`, async ({ params }) => {
    await delay(300);

    const { slug } = params as { slug: string };
    const comments = getCommentsForArticle(slug);

    return HttpResponse.json({ comments });
  }),

  // Create comment
  http.post(`${SERVER_BASE_URL}/articles/:slug/comments`, async ({ params, request }) => {
    await delay(400);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug } = params as { slug: string };
    const article = getArticleBySlug(slug);

    if (!article) {
      return HttpResponse.json({ errors: { article: ['not found'] } }, { status: 404 });
    }

    const body = (await request.json()) as { comment: { body: string } };

    if (!body.comment.body || body.comment.body.trim() === '') {
      return HttpResponse.json({ errors: { body: ["can't be blank"] } }, { status: 422 });
    }

    const newComment = createComment(slug, body.comment.body, {
      username: currentUser.username,
      bio: currentUser.bio,
      image: currentUser.image,
    });

    return HttpResponse.json({ comment: newComment });
  }),

  // Delete comment
  http.delete(`${SERVER_BASE_URL}/articles/:slug/comments/:id`, async ({ params, request }) => {
    await delay(300);

    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return HttpResponse.json({ errors: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { slug, id } = params as { slug: string; id: string };
    const commentId = parseInt(id);

    const deleted = deleteComment(slug, commentId);

    if (!deleted) {
      return HttpResponse.json({ errors: { comment: ['not found'] } }, { status: 404 });
    }

    return HttpResponse.json({});
  }),

  // ==================== TAG ENDPOINTS ====================

  // Get all tags
  http.get(`${SERVER_BASE_URL}/tags`, async () => {
    await delay(200);

    const tags = getPopularTags();

    return HttpResponse.json({ tags });
  }),
];
