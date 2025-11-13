import { http, HttpResponse } from 'msw';
import { SERVER_BASE_URL } from '../../lib/utils/constant';

// Mock user data
const mockUser = {
  email: 'test@example.com',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  token: 'mock-jwt-token',
};

// Mock article data
const mockArticle = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test description',
  body: 'Test body content',
  tagList: ['test', 'article'],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    following: false,
  },
};

export const handlers = [
  // Authentication endpoints
  http.post(`${SERVER_BASE_URL}/users/login`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.post(`${SERVER_BASE_URL}/users`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.get(`${SERVER_BASE_URL}/user`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.put(`${SERVER_BASE_URL}/user`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  // Articles endpoints
  http.get(`${SERVER_BASE_URL}/articles`, () => {
    return HttpResponse.json({
      articles: [mockArticle],
      articlesCount: 1,
    });
  }),

  http.get(`${SERVER_BASE_URL}/articles/:slug`, () => {
    return HttpResponse.json({ article: mockArticle });
  }),

  http.post(`${SERVER_BASE_URL}/articles`, () => {
    return HttpResponse.json({ article: mockArticle });
  }),

  http.put(`${SERVER_BASE_URL}/articles/:slug`, () => {
    return HttpResponse.json({ article: mockArticle });
  }),

  http.delete(`${SERVER_BASE_URL}/articles/:slug`, () => {
    return HttpResponse.json({});
  }),

  // Favorite endpoints
  http.post(`${SERVER_BASE_URL}/articles/:slug/favorite`, () => {
    return HttpResponse.json({
      article: { ...mockArticle, favorited: true, favoritesCount: 1 },
    });
  }),

  http.delete(`${SERVER_BASE_URL}/articles/:slug/favorite`, () => {
    return HttpResponse.json({
      article: { ...mockArticle, favorited: false, favoritesCount: 0 },
    });
  }),

  // Comments endpoints
  http.get(`${SERVER_BASE_URL}/articles/:slug/comments`, () => {
    return HttpResponse.json({
      comments: [
        {
          id: 1,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          body: 'Test comment',
          author: mockUser,
        },
      ],
    });
  }),

  http.post(`${SERVER_BASE_URL}/articles/:slug/comments`, () => {
    return HttpResponse.json({
      comment: {
        id: 1,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        body: 'Test comment',
        author: mockUser,
      },
    });
  }),

  http.delete(`${SERVER_BASE_URL}/articles/:slug/comments/:id`, () => {
    return HttpResponse.json({});
  }),

  // Tags endpoint
  http.get(`${SERVER_BASE_URL}/tags`, () => {
    return HttpResponse.json({
      tags: ['test', 'demo', 'example'],
    });
  }),

  // Profile endpoints
  http.get(`${SERVER_BASE_URL}/profiles/:username`, () => {
    return HttpResponse.json({
      profile: {
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: false,
      },
    });
  }),

  http.post(`${SERVER_BASE_URL}/profiles/:username/follow`, () => {
    return HttpResponse.json({
      profile: {
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: true,
      },
    });
  }),

  http.delete(`${SERVER_BASE_URL}/profiles/:username/follow`, () => {
    return HttpResponse.json({
      profile: {
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: false,
      },
    });
  }),
];
