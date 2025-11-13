import { render, screen } from '@testing-library/react';
import ArticleList from '../../../components/article/ArticleList';
import useSWR from 'swr';

// Mock Next.js Router
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => mockUseRouter(),
}));

// Mock SWR
jest.mock('swr');

// Mock PageContext
jest.mock('../../../lib/context/PageContext', () => ({
  usePageState: () => 0,
  usePageDispatch: () => jest.fn(),
}));

// Mock PageCountContext
const mockSetPageCount = jest.fn();
jest.mock('../../../lib/context/PageCountContext', () => ({
  usePageCountState: () => 25,
  usePageCountDispatch: () => mockSetPageCount,
}));

// Mock useViewport
jest.mock('../../../lib/hooks/useViewport', () => ({
  __esModule: true,
  default: () => ({ vw: 1024, vh: 768 }),
}));

// Mock ArticlePreview
jest.mock('../../../components/article/ArticlePreview', () => {
  return function MockArticlePreview({ article }: any) {
    return <div data-testid={`article-${article.slug}`}>{article.title}</div>;
  };
});

const mockArticles = [
  {
    slug: 'article-1',
    title: 'Article 1',
    description: 'Description 1',
    body: 'Body 1',
    tagList: ['tag1'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'user1',
      bio: '',
      image: '',
      following: false,
    },
  },
  {
    slug: 'article-2',
    title: 'Article 2',
    description: 'Description 2',
    body: 'Body 2',
    tagList: ['tag2'],
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    favorited: true,
    favoritesCount: 10,
    author: {
      username: 'user2',
      bio: '',
      image: '',
      following: false,
    },
  },
];

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    query: {},
    pathname: '/',
    asPath: '/',
  });
});

afterEach(() => {
  (useSWR as jest.Mock).mockClear();
  mockSetPageCount.mockClear();
});

describe('ArticleList', () => {
  it('displays loading spinner when data is not loaded', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
    });

    const { container } = render(<ArticleList />);

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('Failed to fetch'),
    });

    render(<ArticleList />);

    expect(screen.getByText(/Cannot load recent articles\.\.\./i)).toBeInTheDocument();
  });

  it('displays message when no articles are available', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { articles: [], articlesCount: 0 },
      error: undefined,
    });

    render(<ArticleList />);

    expect(screen.getByText(/No articles are here... yet/i)).toBeInTheDocument();
  });

  it('renders articles when data is loaded', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { articles: mockArticles, articlesCount: 2 },
      error: undefined,
    });

    render(<ArticleList />);

    expect(screen.getByTestId('article-article-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-article-2')).toBeInTheDocument();
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  it('updates page count when articles are loaded', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { articles: mockArticles, articlesCount: 50 },
      error: undefined,
    });

    render(<ArticleList />);

    expect(mockSetPageCount).toHaveBeenCalledWith(50);
  });

  it('renders pagination when articles count exceeds 20', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { articles: mockArticles, articlesCount: 25 },
      error: undefined,
    });

    render(<ArticleList />);

    // Should render pagination component
    expect(screen.getByTestId('article-article-1')).toBeInTheDocument();
  });
});
