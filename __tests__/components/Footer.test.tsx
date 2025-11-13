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

  it('renders conduit logo text', () => {
    render(<Footer />);

    expect(screen.getByText('conduit')).toBeInTheDocument();
  });

  it('renders logo link to home page', () => {
    render(<Footer />);

    const logoLink = screen.getByText('conduit');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has logo-font class on logo link', () => {
    render(<Footer />);

    const logoLink = screen.getByText('conduit');
    expect(logoLink).toHaveClass('logo-font');
  });

  it('renders attribution text', () => {
    render(<Footer />);

    expect(screen.getByText(/An interactive learning project/)).toBeInTheDocument();
  });

  it('renders Thinkster link in attribution', () => {
    render(<Footer />);

    const thinksterLink = screen.getByText('Thinkster');
    expect(thinksterLink).toHaveAttribute('href', 'https://thinkster.io');
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
