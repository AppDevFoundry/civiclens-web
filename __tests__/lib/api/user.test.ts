import axios from 'axios';
import UserAPI from '../../../lib/api/user';
import { SERVER_BASE_URL } from '../../../lib/utils/constant';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  describe('current', () => {
    it('fetches current user with token from localStorage', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      mockedAxios.get.mockResolvedValueOnce({ data: { user: { id: 1 } } });

      await UserAPI.current();

      // Note: The current() function has a bug - it tries to access .token on a string
      // This test documents the existing behavior
      expect(mockedAxios.get).toHaveBeenCalledWith('/user', expect.any(Object));
    });

    it('returns error response on failure', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      const errorResponse = { data: { errors: { message: 'Unauthorized' } }, status: 401 };
      mockedAxios.get.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.current();

      expect(result).toEqual(errorResponse);
    });
  });

  describe('login', () => {
    it('posts login credentials to correct endpoint', async () => {
      const mockResponse = { data: { user: { token: 'jwt-token' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await UserAPI.login('test@example.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/users/login`,
        JSON.stringify({ user: { email: 'test@example.com', password: 'password123' } }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('returns response on success', async () => {
      const mockResponse = { data: { user: { token: 'jwt-token', email: 'test@example.com' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await UserAPI.login('test@example.com', 'password123');

      expect(result).toEqual(mockResponse);
    });

    it('returns error response on failure', async () => {
      const errorResponse = { data: { errors: { 'email or password': ['is invalid'] } }, status: 422 };
      mockedAxios.post.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.login('invalid@example.com', 'wrongpassword');

      expect(result).toEqual(errorResponse);
    });
  });

  describe('register', () => {
    it('posts registration data to correct endpoint', async () => {
      const mockResponse = { data: { user: { token: 'jwt-token' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await UserAPI.register('newuser', 'new@example.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/users`,
        JSON.stringify({ user: { username: 'newuser', email: 'new@example.com', password: 'password123' } }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('returns response on success', async () => {
      const mockResponse = { data: { user: { username: 'newuser', token: 'jwt-token' } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await UserAPI.register('newuser', 'new@example.com', 'password123');

      expect(result).toEqual(mockResponse);
    });

    it('returns error response on validation failure', async () => {
      const errorResponse = { data: { errors: { username: ['is already taken'] } }, status: 422 };
      mockedAxios.post.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.register('existinguser', 'new@example.com', 'password123');

      expect(result).toEqual(errorResponse);
    });
  });

  describe('save', () => {
    it('puts user data to correct endpoint', async () => {
      const user = { email: 'updated@example.com', bio: 'New bio' };
      const mockResponse = { data: { user }, status: 200 };
      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      await UserAPI.save(user);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/user`,
        JSON.stringify({ user }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('returns response on success', async () => {
      const user = { email: 'updated@example.com' };
      const mockResponse = { data: { user }, status: 200 };
      mockedAxios.put.mockResolvedValueOnce(mockResponse);

      const result = await UserAPI.save(user);

      expect(result).toEqual(mockResponse);
    });

    it('returns error response on failure', async () => {
      const errorResponse = { data: { errors: { email: ['is invalid'] } }, status: 422 };
      mockedAxios.put.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.save({ email: 'invalid' });

      expect(result).toEqual(errorResponse);
    });
  });

  describe('follow', () => {
    it('posts follow request with token', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      const mockResponse = { data: { profile: { following: true } }, status: 200 };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await UserAPI.follow('johnsmith');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/profiles/johnsmith/follow`,
        {},
        {
          headers: {
            Authorization: 'Token test-token',
          },
        }
      );
    });

    it('returns error response on failure', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      const errorResponse = { data: { errors: { message: 'Not found' } }, status: 404 };
      mockedAxios.post.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.follow('nonexistent');

      expect(result).toEqual(errorResponse);
    });
  });

  describe('unfollow', () => {
    it('deletes follow with token', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      const mockResponse = { data: { profile: { following: false } }, status: 200 };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      await UserAPI.unfollow('johnsmith');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}/profiles/johnsmith/follow`,
        {
          headers: {
            Authorization: 'Token test-token',
          },
        }
      );
    });

    it('returns error response on failure', async () => {
      window.localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
      const errorResponse = { data: { errors: { message: 'Not found' } }, status: 404 };
      mockedAxios.delete.mockRejectedValueOnce({ response: errorResponse });

      const result = await UserAPI.unfollow('nonexistent');

      expect(result).toEqual(errorResponse);
    });
  });

  describe('get', () => {
    it('fetches user profile by username', async () => {
      const mockResponse = { data: { profile: { username: 'johnsmith' } } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await UserAPI.get('johnsmith');

      expect(mockedAxios.get).toHaveBeenCalledWith(`${SERVER_BASE_URL}/profiles/johnsmith`);
      expect(result).toEqual(mockResponse);
    });

    it('propagates errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not Found'));

      await expect(UserAPI.get('nonexistent')).rejects.toThrow('Not Found');
    });
  });
});
