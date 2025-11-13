import axios from 'axios';
import CommentAPI from '../../../lib/api/comment';
import { SERVER_BASE_URL } from '../../../lib/utils/constant';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CommentAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('posts comment to correct endpoint', async () => {
      const mockResponse = { data: { comment: { id: 1, body: 'Great!' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await CommentAPI.create('my-article', { body: 'Great!' });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article/comments`,
        JSON.stringify({ comment: { body: 'Great!' } })
      );
    });

    it('returns response on success', async () => {
      const mockResponse = { data: { comment: { id: 1, body: 'Nice!' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await CommentAPI.create('article-slug', { body: 'Nice!' });

      expect(result).toEqual(mockResponse);
    });

    it('returns error response on failure', async () => {
      const errorResponse = { data: { errors: { body: ["can't be blank"] } }, status: 422 };
      const error = { response: errorResponse };
      mockedAxios.post.mockRejectedValueOnce(error);

      const result = await CommentAPI.create('article-slug', { body: '' });

      expect(result).toEqual(errorResponse);
    });
  });

  describe('delete', () => {
    it('deletes comment at correct endpoint', async () => {
      const mockResponse = { data: {}, status: 200 };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      await CommentAPI.delete('my-article', 123);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article/comments/123`
      );
    });

    it('returns response on success', async () => {
      const mockResponse = { data: {}, status: 200 };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await CommentAPI.delete('article-slug', 456);

      expect(result).toEqual(mockResponse);
    });

    it('returns error response on failure', async () => {
      const errorResponse = { data: { errors: { message: 'Unauthorized' } }, status: 403 };
      const error = { response: errorResponse };
      mockedAxios.delete.mockRejectedValueOnce(error);

      const result = await CommentAPI.delete('article-slug', 789);

      expect(result).toEqual(errorResponse);
    });
  });

  describe('forArticle', () => {
    it('fetches comments for article from correct endpoint', async () => {
      const mockResponse = { data: { comments: [] } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await CommentAPI.forArticle('my-article');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/articles/my-article/comments`
      );
    });

    it('returns axios response', async () => {
      const mockResponse = {
        data: {
          comments: [
            { id: 1, body: 'Comment 1' },
            { id: 2, body: 'Comment 2' },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await CommentAPI.forArticle('article-slug');

      expect(result).toEqual(mockResponse);
    });

    it('propagates errors', async () => {
      const error = new Error('Not Found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(CommentAPI.forArticle('invalid-slug')).rejects.toThrow('Not Found');
    });
  });
});
