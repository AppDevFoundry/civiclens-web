import { render, screen } from '@testing-library/react';
import Layout from '../../components/common/Layout';

// Mock child components
jest.mock('../../components/common/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('../../components/common/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('Layout', () => {
  it('renders Navbar component', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children between Navbar and Footer', () => {
    render(
      <Layout>
        <main>Main Content</main>
      </Layout>
    );

    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders Navbar before children', () => {
    const { container } = render(
      <Layout>
        <main data-testid="main">Content</main>
      </Layout>
    );

    const navbar = container.querySelector('[data-testid="navbar"]');
    const main = container.querySelector('[data-testid="main"]');

    // Check that navbar comes before main in the DOM
    expect(navbar?.compareDocumentPosition(main!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders children before Footer', () => {
    const { container } = render(
      <Layout>
        <main data-testid="main">Content</main>
      </Layout>
    );

    const main = container.querySelector('[data-testid="main"]');
    const footer = container.querySelector('[data-testid="footer"]');

    // Check that main comes before footer in the DOM
    expect(main?.compareDocumentPosition(footer!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders multiple children', () => {
    render(
      <Layout>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Layout>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('renders with empty children', () => {
    render(<Layout>{null}</Layout>);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
