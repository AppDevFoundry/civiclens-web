import axios from 'axios';
import TagAPI from '../../../lib/api/tag';
import { SERVER_BASE_URL } from '../../../lib/utils/constant';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TagAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches all tags from the correct endpoint', async () => {
      const mockTags = { tags: ['react', 'angular', 'vue'] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockTags });

      await TagAPI.getAll();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${SERVER_BASE_URL}/tags`);
    });

    it('returns the axios response', async () => {
      const mockResponse = { data: { tags: ['javascript', 'typescript'] } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await TagAPI.getAll();

      expect(result).toEqual(mockResponse);
    });

    it('handles empty tags array', async () => {
      const mockResponse = { data: { tags: [] } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await TagAPI.getAll();

      expect(result.data.tags).toEqual([]);
    });

    it('propagates errors from axios', async () => {
      const error = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(TagAPI.getAll()).rejects.toThrow('Network Error');
    });
  });
});
