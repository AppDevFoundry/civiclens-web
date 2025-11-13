import { getQuery } from '../../lib/utils/getQuery';

describe('getQuery', () => {
  it('returns correct query string for first page', () => {
    const result = getQuery(10, 0);
    expect(result).toBe('limit=10&offset=0');
  });

  it('returns correct query string for second page', () => {
    const result = getQuery(10, 1);
    expect(result).toBe('limit=10&offset=10');
  });

  it('returns correct query string for higher pages', () => {
    const result = getQuery(20, 5);
    expect(result).toBe('limit=20&offset=100');
  });

  it('handles different limit values', () => {
    expect(getQuery(5, 2)).toBe('limit=5&offset=10');
    expect(getQuery(50, 3)).toBe('limit=50&offset=150');
  });

  it('handles zero page correctly', () => {
    const result = getQuery(15, 0);
    expect(result).toBe('limit=15&offset=0');
  });

  it('calculates offset as page * limit', () => {
    const limit = 25;
    const page = 4;
    const result = getQuery(limit, page);
    expect(result).toBe(`limit=${limit}&offset=${page * limit}`);
  });
});
