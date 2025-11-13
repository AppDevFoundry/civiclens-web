import axios from 'axios';
import fetcher from '../../lib/utils/fetcher';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetcher', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  it('fetches data from URL', async () => {
    const mockData = { articles: [] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await fetcher('https://api.example.com/articles');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/articles', expect.anything());
    expect(result).toEqual(mockData);
  });

  it('returns empty options when localStorage.user is not set', async () => {
    const mockData = { user: { id: 1 } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    await fetcher('/api/user');

    // Should call with empty object or undefined options
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('returns empty options when localStorage.user is empty string', async () => {
    // The fetcher accesses window.localStorage.user directly
    Object.defineProperty(window.localStorage, 'user', {
      value: '',
      writable: true,
      configurable: true,
    });
    const mockData = { user: { id: 1 } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    await fetcher('/api/user');

    expect(mockedAxios.get).toHaveBeenCalled();
    // Clean up
    delete (window.localStorage as { user?: string }).user;
  });

  it('adds Authorization header when user has token', async () => {
    const user = { token: 'test-token-123' };
    // The fetcher accesses window.localStorage.user directly, not via getItem
    Object.defineProperty(window.localStorage, 'user', {
      value: JSON.stringify(user),
      writable: true,
      configurable: true,
    });

    const mockData = { user: { id: 1, name: 'Test' } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    await fetcher('/api/user');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/user',
      expect.objectContaining({
        headers: {
          Authorization: 'Token test-token-123',
        },
      })
    );

    // Clean up
    delete (window.localStorage as { user?: string }).user;
  });

  it('does not add Authorization header when user has no token', async () => {
    const user = { name: 'Test', email: 'test@example.com' };
    // The fetcher accesses window.localStorage.user directly
    Object.defineProperty(window.localStorage, 'user', {
      value: JSON.stringify(user),
      writable: true,
      configurable: true,
    });

    const mockData = { data: 'public' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    await fetcher('/api/public');

    // Should not include Authorization header
    const callArgs = mockedAxios.get.mock.calls[0];
    const options = callArgs[1] as { headers?: { Authorization?: string } } | undefined;
    expect(options?.headers?.Authorization).toBeUndefined();

    // Clean up
    delete (window.localStorage as { user?: string }).user;
  });

  it('returns the data property from axios response', async () => {
    const responseData = {
      articles: [
        { id: 1, title: 'Article 1' },
        { id: 2, title: 'Article 2' },
      ],
      articlesCount: 2,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: responseData });

    const result = await fetcher('/api/articles');

    expect(result).toEqual(responseData);
    expect(result.articles).toHaveLength(2);
  });

  it('handles different URL formats', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });

    await fetcher('/relative/path');
    expect(mockedAxios.get).toHaveBeenCalledWith('/relative/path', expect.anything());

    await fetcher('https://absolute.com/path');
    expect(mockedAxios.get).toHaveBeenCalledWith('https://absolute.com/path', expect.anything());
  });

  it('propagates axios errors', async () => {
    const error = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(fetcher('/api/fail')).rejects.toThrow('Network Error');
  });
});
