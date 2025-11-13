import checkLogin from '../../lib/utils/checkLogin';

describe('checkLogin', () => {
  it('returns true when user is a non-empty object', () => {
    const user = { token: 'valid-token', username: 'testuser' };
    expect(checkLogin(user)).toBe(true);
  });

  it('returns true when user has any properties', () => {
    const user = { username: 'testuser' };
    expect(checkLogin(user)).toBe(true);
  });

  it('returns false when user is null', () => {
    expect(checkLogin(null)).toBe(false);
  });

  it('returns false when user is undefined', () => {
    expect(checkLogin(undefined)).toBe(false);
  });

  it('returns false when user is an empty object', () => {
    const user = {};
    expect(checkLogin(user)).toBe(false);
  });

  it('returns false when user is a non-object value', () => {
    expect(checkLogin('string')).toBe(false);
    expect(checkLogin(123)).toBe(false);
    expect(checkLogin([])).toBe(false);
  });
});
