import { renderHook, act } from '@testing-library/react';
import useViewport from '../../../lib/hooks/useViewport';

describe('useViewport', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('returns vw and vh properties', () => {
    const { result } = renderHook(() => useViewport());

    expect(result.current).toHaveProperty('vw');
    expect(result.current).toHaveProperty('vh');
  });

  it('initializes with window dimensions', () => {
    const { result } = renderHook(() => useViewport());

    expect(result.current.vw).toBe(1024);
    expect(result.current.vh).toBe(768);
  });

  it('updates on window resize', () => {
    const { result } = renderHook(() => useViewport());

    expect(result.current.vw).toBe(1024);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1920 });
      Object.defineProperty(window, 'innerHeight', { value: 1080 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.vw).toBe(1920);
    expect(result.current.vh).toBe(1080);
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useViewport());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('adds event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useViewport());

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('does not update if width is same', () => {
    const { result } = renderHook(() => useViewport());

    const initialVw = result.current.vw;

    act(() => {
      // Keep width same, only change height
      Object.defineProperty(window, 'innerHeight', { value: 900 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.vw).toBe(initialVw);
    expect(result.current.vh).toBe(900);
  });
});
