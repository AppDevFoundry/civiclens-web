import storage from '../../lib/utils/storage';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns undefined for non-existent key', async () => {
    const result = await storage('nonexistent');
    expect(result).toBeUndefined();
  });

  it('returns parsed JSON for existing key', async () => {
    const userData = { token: 'abc123', username: 'testuser' };
    window.localStorage.setItem('user', JSON.stringify(userData));

    const result = await storage('user');
    expect(result).toEqual(userData);
  });

  it('handles string values', async () => {
    window.localStorage.setItem('name', JSON.stringify('John Doe'));

    const result = await storage('name');
    expect(result).toBe('John Doe');
  });

  it('handles array values', async () => {
    const tags = ['react', 'typescript', 'nextjs'];
    window.localStorage.setItem('tags', JSON.stringify(tags));

    const result = await storage('tags');
    expect(result).toEqual(tags);
  });

  it('handles boolean values', async () => {
    window.localStorage.setItem('isLoggedIn', JSON.stringify(true));

    const result = await storage('isLoggedIn');
    expect(result).toBe(true);
  });

  it('handles null stored value', async () => {
    window.localStorage.setItem('nullValue', JSON.stringify(null));

    const result = await storage('nullValue');
    expect(result).toBeNull();
  });

  it('handles complex nested objects', async () => {
    const complexData = {
      user: {
        id: 1,
        profile: {
          name: 'Test User',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
      },
    };
    window.localStorage.setItem('complex', JSON.stringify(complexData));

    const result = await storage('complex');
    expect(result).toEqual(complexData);
  });
});
