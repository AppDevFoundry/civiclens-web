import { render, screen } from '@testing-library/react';
import Footer from '../../components/common/Footer';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

describe('Footer', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders app logo text', () => {
    render(<Footer />);

    expect(screen.getByText('civiclens')).toBeInTheDocument();
  });

  it('renders logo link to home page', () => {
    render(<Footer />);

    const logoLink = screen.getByText('civiclens');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has logo-font class on logo link', () => {
    render(<Footer />);

    const logoLink = screen.getByText('civiclens');
    expect(logoLink).toHaveClass('logo-font');
  });

  it('renders attribution text', () => {
    render(<Footer />);

    expect(screen.getByText(/civic engagement and community building/)).toBeInTheDocument();
  });

  it('mentions MIT license', () => {
    render(<Footer />);

    expect(screen.getByText(/MIT/)).toBeInTheDocument();
  });

  it('has attribution class on span', () => {
    const { container } = render(<Footer />);

    const attribution = container.querySelector('.attribution');
    expect(attribution).toBeInTheDocument();
  });

  it('has container div', () => {
    const { container } = render(<Footer />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });
});
