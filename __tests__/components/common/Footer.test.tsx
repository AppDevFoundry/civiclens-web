import { render, screen } from '@testing-library/react';
import Footer from '../../../components/common/Footer';

describe('Footer', () => {
  it('renders footer with brand name', () => {
    render(<Footer />);

    expect(screen.getByText('conduit')).toBeInTheDocument();
  });

  it('renders attribution text', () => {
    render(<Footer />);

    expect(screen.getByText(/An interactive learning project from/i)).toBeInTheDocument();
    expect(screen.getByText('Thinkster')).toBeInTheDocument();
  });

  it('has link to Thinkster', () => {
    render(<Footer />);

    const thinksterLink = screen.getByText('Thinkster').closest('a');
    expect(thinksterLink).toHaveAttribute('href', 'https://thinkster.io');
  });
});
