import { renderHook, act } from '@testing-library/react';
import useSessionStorage from '../../../lib/hooks/useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('returns stored value and setter function', () => {
    const { result } = renderHook(() => useSessionStorage('key', 'initial'));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
    expect(typeof result.current[1]).toBe('function');
  });

  it('uses initial value when no stored value exists', () => {
    const { result } = renderHook(() => useSessionStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('retrieves existing value from sessionStorage', () => {
    window.sessionStorage.setItem('existingKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() => useSessionStorage('existingKey', 'default'));

    expect(result.current[0]).toBe('storedValue');
  });

  it('updates value and sessionStorage when setValue is called', () => {
    const { result } = renderHook(() => useSessionStorage('updateKey', 'initial'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(JSON.parse(window.sessionStorage.getItem('updateKey')!)).toBe('newValue');
  });

  it('handles object values', () => {
    const initialObj = { name: 'Test', count: 0 };
    const { result } = renderHook(() => useSessionStorage('objKey', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    act(() => {
      result.current[1]({ name: 'Updated', count: 1 });
    });

    expect(result.current[0]).toEqual({ name: 'Updated', count: 1 });
  });

  it('handles function updater', () => {
    const { result } = renderHook(() => useSessionStorage('counterKey', 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev: number) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('persists value to sessionStorage', () => {
    const { result } = renderHook(() => useSessionStorage('persistKey', 'initial'));

    act(() => {
      result.current[1]('persisted');
    });

    const storedValue = window.sessionStorage.getItem('persistKey');
    expect(JSON.parse(storedValue!)).toBe('persisted');
  });

  it('handles array values', () => {
    const { result } = renderHook(() => useSessionStorage('arrayKey', []));

    act(() => {
      result.current[1]([1, 2, 3]);
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('handles boolean values', () => {
    const { result } = renderHook(() => useSessionStorage('boolKey', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('handles null initial value', () => {
    const { result } = renderHook(() => useSessionStorage('nullKey', null));

    expect(result.current[0]).toBeNull();
  });
});
