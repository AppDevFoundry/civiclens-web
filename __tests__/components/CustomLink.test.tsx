import { render, screen } from '@testing-library/react';
import CustomLink from '../../components/common/CustomLink';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, as, className }: { children: React.ReactNode; href: string; as: string; className?: string }) => {
    return (
      <a href={as} data-href={href} className={className}>
        {children}
      </a>
    );
  };
});

describe('CustomLink', () => {
  it('renders children', () => {
    render(
      <CustomLink href="/test" as="/test">
        Link Text
      </CustomLink>
    );

    expect(screen.getByText('Link Text')).toBeInTheDocument();
  });

  it('applies className when provided', () => {
    render(
      <CustomLink href="/test" as="/test" className="custom-class">
        Link
      </CustomLink>
    );

    const link = screen.getByText('Link');
    expect(link).toHaveClass('custom-class');
  });

  it('applies empty string for className when not provided', () => {
    render(
      <CustomLink href="/test" as="/test">
        Link
      </CustomLink>
    );

    const link = screen.getByText('Link');
    expect(link).toHaveAttribute('class', '');
  });

  it('passes href to Link component', () => {
    render(
      <CustomLink href="/profile/[pid]" as="/profile/john">
        Profile
      </CustomLink>
    );

    const link = screen.getByText('Profile');
    expect(link).toHaveAttribute('data-href', '/profile/[pid]');
  });

  it('passes as prop as actual href', () => {
    render(
      <CustomLink href="/article/[pid]" as="/article/my-article">
        Article
      </CustomLink>
    );

    const link = screen.getByText('Article');
    expect(link).toHaveAttribute('href', '/article/my-article');
  });

  it('renders complex children', () => {
    render(
      <CustomLink href="/test" as="/test">
        <span>Icon</span>
        <span>Text</span>
      </CustomLink>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
