import { render, screen, fireEvent } from '@testing-library/react';
import CustomImage from '../../components/common/CustomImage';
import { DEFAULT_IMAGE_SOURCE, DEFAULT_PROFILE_IMAGE } from '../../lib/utils/constant';

describe('CustomImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
  };

  it('renders an image element', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });

  it('uses DEFAULT_IMAGE_SOURCE as initial src for lazy loading', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img.src).toBe(DEFAULT_IMAGE_SOURCE);
  });

  it('stores actual image URL in data-src attribute', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('data-src', 'https://example.com/image.jpg');
  });

  it('sets data-sizes to auto for responsive images', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('data-sizes', 'auto');
  });

  it('applies lazyload class by default', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('lazyload');
  });

  it('applies custom className with lazyload', () => {
    render(<CustomImage {...defaultProps} className="user-img" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('user-img');
    expect(img).toHaveClass('lazyload');
  });

  it('handles image load error by setting default profile image', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image') as HTMLImageElement;

    // Simulate error
    fireEvent.error(img);

    // After error, src should be set to default profile image
    expect(img.src).toBe(DEFAULT_PROFILE_IMAGE);
  });

  it('clears onerror after handling error to prevent infinite loop', () => {
    render(<CustomImage {...defaultProps} />);

    const img = screen.getByAltText('Test image') as HTMLImageElement;

    // Simulate error
    fireEvent.error(img);

    // onerror should be cleared
    expect(img.onerror).toBeNull();
  });

  it('renders with correct alt text', () => {
    render(<CustomImage src="test.jpg" alt="Profile picture" />);

    expect(screen.getByAltText('Profile picture')).toBeInTheDocument();
  });
});
