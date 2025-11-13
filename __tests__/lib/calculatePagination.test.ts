import { getRange, getPageInfo } from '../../lib/utils/calculatePagination';

describe('calculatePagination', () => {
  describe('getRange', () => {
    it('returns an array of numbers from start to end inclusive', () => {
      expect(getRange(0, 4)).toEqual([0, 1, 2, 3, 4]);
    });

    it('handles single element range', () => {
      expect(getRange(5, 5)).toEqual([5]);
    });

    it('handles range starting from 0', () => {
      expect(getRange(0, 2)).toEqual([0, 1, 2]);
    });

    it('handles larger ranges', () => {
      expect(getRange(10, 15)).toEqual([10, 11, 12, 13, 14, 15]);
    });
  });

  describe('getPageInfo', () => {
    it('returns correct page info for first page', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 5,
        total: 100,
        page: 0,
      });

      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(true);
      expect(result.previousPage).toBe(-1);
      expect(result.nextPage).toBe(1);
      expect(result.totalPages).toBe(10);
    });

    it('returns correct page info for middle page', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 5,
        total: 100,
        page: 5,
      });

      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(true);
      expect(result.previousPage).toBe(4);
      expect(result.nextPage).toBe(6);
    });

    it('returns correct page info for last page', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 5,
        total: 100,
        page: 10,
      });

      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(false);
      expect(result.previousPage).toBe(9);
      expect(result.nextPage).toBe(11);
    });

    it('clamps current page to total pages when exceeded', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 5,
        total: 50,
        page: 20,
      });

      expect(result.totalPages).toBe(5);
    });

    it('handles small total with large page count', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 10,
        total: 25,
        page: 0,
      });

      expect(result.totalPages).toBe(2);
      expect(result.firstPage).toBeGreaterThanOrEqual(0);
      expect(result.lastPage).toBeLessThanOrEqual(2);
    });

    it('calculates first and last page for page window', () => {
      const result = getPageInfo({
        limit: 20,
        pageCount: 5,
        total: 200,
        page: 5,
      });

      expect(result.firstPage).toBeDefined();
      expect(result.lastPage).toBeDefined();
      expect(result.lastPage - result.firstPage).toBeLessThanOrEqual(5);
    });

    it('handles zero total', () => {
      const result = getPageInfo({
        limit: 10,
        pageCount: 5,
        total: 0,
        page: 0,
      });

      expect(result.totalPages).toBe(0);
      expect(result.hasNextPage).toBe(false);
    });
  });
});
