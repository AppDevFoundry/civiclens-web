import { render, screen } from '@testing-library/react';
import ArticleMeta from '../../../components/article/ArticleMeta';

// Mock ArticleActions component
jest.mock('../../../components/article/ArticleActions', () => {
  return function MockArticleActions() {
    return <div data-testid="article-actions">Article Actions</div>;
  };
});

const mockArticle = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test description',
  body: 'Test body',
  tagList: ['test'],
  createdAt: '2025-01-15T10:30:00.000Z',
  updatedAt: '2025-01-15T10:30:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'johndoe',
    bio: 'Test bio',
    image: 'https://example.com/johndoe.png',
    following: false,
  },
};

describe('ArticleMeta', () => {
  it('renders article metadata', () => {
    render(<ArticleMeta article={mockArticle} />);

    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText(/Wed Jan 15 2025/i)).toBeInTheDocument();
  });

  it('renders ArticleActions component', () => {
    render(<ArticleMeta article={mockArticle} />);

    expect(screen.getByTestId('article-actions')).toBeInTheDocument();
  });

  it('renders author profile image', () => {
    render(<ArticleMeta article={mockArticle} />);

    const images = screen.getAllByAltText('author-profile-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('returns null when article is null', () => {
    const { container } = render(<ArticleMeta article={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when article is undefined', () => {
    const { container } = render(<ArticleMeta article={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
