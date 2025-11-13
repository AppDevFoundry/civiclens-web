import {
  SERVER_BASE_URL,
  APP_NAME,
  ARTICLE_QUERY_MAP,
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_LIMIT,
  DEFAULT_IMAGE_SOURCE,
} from '../../lib/utils/constant';

describe('constants', () => {
  describe('SERVER_BASE_URL', () => {
    it('is a valid URL string', () => {
      expect(typeof SERVER_BASE_URL).toBe('string');
      expect(SERVER_BASE_URL).toMatch(/^https?:\/\//);
    });

    it('points to the API endpoint', () => {
      expect(SERVER_BASE_URL).toContain('/api');
    });
  });

  describe('APP_NAME', () => {
    it('is defined', () => {
      expect(APP_NAME).toBe('conduit');
    });
  });

  describe('ARTICLE_QUERY_MAP', () => {
    it('has feed URL', () => {
      expect(ARTICLE_QUERY_MAP['tab=feed']).toContain('/articles/feed');
    });

    it('has tag URL', () => {
      expect(ARTICLE_QUERY_MAP['tab=tag']).toContain('/articles/tag');
    });

    it('URLs include SERVER_BASE_URL', () => {
      expect(ARTICLE_QUERY_MAP['tab=feed']).toContain(SERVER_BASE_URL);
      expect(ARTICLE_QUERY_MAP['tab=tag']).toContain(SERVER_BASE_URL);
    });
  });

  describe('DEFAULT_PROFILE_IMAGE', () => {
    it('is a valid URL', () => {
      expect(DEFAULT_PROFILE_IMAGE).toMatch(/^https?:\/\//);
    });

    it('is an image URL', () => {
      expect(DEFAULT_PROFILE_IMAGE).toMatch(/\.(jpg|jpeg|png|gif)$/);
    });
  });

  describe('DEFAULT_LIMIT', () => {
    it('is a positive number', () => {
      expect(typeof DEFAULT_LIMIT).toBe('number');
      expect(DEFAULT_LIMIT).toBeGreaterThan(0);
    });

    it('is set to 20', () => {
      expect(DEFAULT_LIMIT).toBe(20);
    });
  });

  describe('DEFAULT_IMAGE_SOURCE', () => {
    it('is a base64 data URL', () => {
      expect(DEFAULT_IMAGE_SOURCE).toMatch(/^data:image\/png;base64,/);
    });
  });
});
