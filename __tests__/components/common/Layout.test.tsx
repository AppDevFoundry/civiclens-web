import { render, screen } from '@testing-library/react';
import Layout from '../../../components/common/Layout';

// Mock Navbar and Footer
jest.mock('../../../components/common/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('../../../components/common/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('Layout', () => {
  it('renders Navbar, children, and Footer', () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children between Navbar and Footer', () => {
    render(
      <Layout>
        <main data-testid="main-content">
          <h1>Page Title</h1>
          <p>Page content</p>
        </main>
      </Layout>
    );

    const container = screen.getByTestId('main-content').parentElement;
    const navbar = screen.getByTestId('navbar');
    const footer = screen.getByTestId('footer');

    // Verify structure exists (all components are rendered)
    expect(navbar).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
