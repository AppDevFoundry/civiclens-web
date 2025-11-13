import { render, screen } from '@testing-library/react';
import NavLink from '../../components/common/NavLink';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, as, className }: { children: React.ReactNode; href: string; as: string; className?: string }) => (
    <a href={as} data-href={href} className={className}>
      {children}
    </a>
  );
});

// Mock next/router
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}));

describe('NavLink', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      asPath: '/',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <NavLink href="/" as="/">
        Home
      </NavLink>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies nav-link class', () => {
    render(
      <NavLink href="/" as="/">
        Home
      </NavLink>
    );

    const link = screen.getByText('Home');
    expect(link).toHaveClass('nav-link');
  });

  it('adds active class when current path matches', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/home',
    });

    render(
      <NavLink href="/home" as="/home">
        Home
      </NavLink>
    );

    const link = screen.getByText('Home');
    expect(link).toHaveClass('active');
  });

  it('does not add active class when path does not match', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/profile',
    });

    render(
      <NavLink href="/home" as="/home">
        Home
      </NavLink>
    );

    const link = screen.getByText('Home');
    expect(link).not.toHaveClass('active');
  });

  it('passes as prop as actual href', () => {
    render(
      <NavLink href="/profile/[pid]" as="/profile/john">
        Profile
      </NavLink>
    );

    const link = screen.getByText('Profile');
    expect(link).toHaveAttribute('href', '/profile/john');
  });

  it('passes href to data-href attribute', () => {
    render(
      <NavLink href="/profile/[pid]" as="/profile/john">
        Profile
      </NavLink>
    );

    const link = screen.getByText('Profile');
    expect(link).toHaveAttribute('data-href', '/profile/[pid]');
  });

  it('handles paths with special characters', () => {
    mockUseRouter.mockReturnValue({
      asPath: '/profile/user%20name',
    });

    render(
      <NavLink href="/profile/[pid]" as="/profile/user%20name">
        Profile
      </NavLink>
    );

    const link = screen.getByText('Profile');
    expect(link).toHaveClass('active');
  });

  it('renders complex children', () => {
    render(
      <NavLink href="/" as="/">
        <span>Icon</span>
        <span>Label</span>
      </NavLink>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});
