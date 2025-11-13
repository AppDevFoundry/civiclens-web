import handleBrokenImage from '../../lib/utils/handleBrokenImage';
import { DEFAULT_PROFILE_IMAGE } from '../../lib/utils/constant';

describe('handleBrokenImage', () => {
  it('sets the image source to default profile image', () => {
    const mockEvent = {
      target: {
        src: 'broken-image-url.jpg',
        onerror: jest.fn(),
      },
    };

    handleBrokenImage(mockEvent);

    expect(mockEvent.target.src).toBe(DEFAULT_PROFILE_IMAGE);
  });

  it('clears the onerror handler to prevent infinite loop', () => {
    const mockEvent = {
      target: {
        src: 'broken-image-url.jpg',
        onerror: jest.fn(),
      },
    };

    handleBrokenImage(mockEvent);

    expect(mockEvent.target.onerror).toBeNull();
  });

  it('handles empty src', () => {
    const mockEvent = {
      target: {
        src: '',
        onerror: jest.fn(),
      },
    };

    handleBrokenImage(mockEvent);

    expect(mockEvent.target.src).toBe(DEFAULT_PROFILE_IMAGE);
    expect(mockEvent.target.onerror).toBeNull();
  });
});
