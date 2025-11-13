import axios from 'axios';
import ArticleAPI from '../../../lib/api/article';
import { SERVER_BASE_URL } from '../../../lib/utils/constant';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ArticleAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('all', () => {
    it('fetches articles with default limit', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.all(0);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`${SERVER_BASE_URL}/articles?`)
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=10')
      );
    });

    it('fetches articles with custom limit', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.all(0, 20);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=20')
      );
    });

    it('calculates correct offset for page', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.all(2, 10);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=20')
      );
    });
  });

  describe('byAuthor', () => {
    it('fetches articles by author', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.byAuthor('john');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('author=john')
      );
    });

    it('encodes author name with special characters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.byAuthor('john doe');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('author=john%20doe')
      );
    });

    it('uses default page and limit', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.byAuthor('john');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=5')
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=0')
      );
    });
  });

  describe('byTag', () => {
    it('fetches articles by tag', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.byTag('javascript');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('tag=javascript')
      );
    });

    it('encodes tag with special characters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.byTag('c++');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('tag=c%2B%2B')
      );
    });
  });

  describe('delete', () => {
    it('deletes article with authorization', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

      await ArticleAPI.delete('article-id', 'my-token');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/article-id`,
        {
          headers: {
            Authorization: 'Token my-token',
          },
        }
      );
    });
  });

  describe('favorite', () => {
    it('favorites an article', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { article: {} } });

      await ArticleAPI.favorite('my-article');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article/favorite`
      );
    });
  });

  describe('unfavorite', () => {
    it('unfavorites an article', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { article: {} } });

      await ArticleAPI.unfavorite('my-article');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article/favorite`
      );
    });
  });

  describe('favoritedBy', () => {
    it('fetches articles favorited by user', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.favoritedBy('john', 0);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('favorited=john')
      );
    });
  });

  describe('feed', () => {
    it('fetches user feed', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { articles: [] } });

      await ArticleAPI.feed(0);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`${SERVER_BASE_URL}/articles/feed`)
      );
    });
  });

  describe('get', () => {
    it('fetches single article by slug', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { article: {} } });

      await ArticleAPI.get('my-article');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article`
      );
    });
  });

  describe('update', () => {
    it('updates article with authorization', async () => {
      const article = { slug: 'my-article', title: 'Updated', body: 'New content', tagList: [] };
      mockedAxios.put.mockResolvedValueOnce({ data: { article }, status: 200 });

      const result = await ArticleAPI.update(article, 'my-token');

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article`,
        JSON.stringify({ article }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token my-token',
          },
        }
      );
      expect(result.status).toBe(200);
    });
  });

  describe('create', () => {
    it('creates new article with authorization', async () => {
      const article = { title: 'New Article', description: 'Desc', body: 'Content', tagList: ['test'] };
      mockedAxios.post.mockResolvedValueOnce({ data: { article }, status: 201 });

      const result = await ArticleAPI.create(article, 'my-token');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles`,
        JSON.stringify({ article }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token my-token',
          },
        }
      );
      expect(result.status).toBe(201);
    });
  });
});
