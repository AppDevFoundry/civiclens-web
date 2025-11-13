import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlePreview from '../../../components/article/ArticlePreview';

// Mock Next.js Router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: (...args: any[]) => mockPush(...args),
  },
}));

// Mock SWR
const mockUseSWRValue = {
  data: undefined,
  error: undefined,
  isLoading: false,
};
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => mockUseSWRValue),
}));

// Mock axios
const mockAxiosPost = jest.fn();
const mockAxiosDelete = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: (...args: any[]) => mockAxiosPost(...args),
    delete: (...args: any[]) => mockAxiosDelete(...args),
  },
}));

// Mock PageContext
const mockSetPage = jest.fn();
jest.mock('../../../lib/context/PageContext', () => ({
  usePageDispatch: () => mockSetPage,
}));

const mockArticle = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'Test article description',
  body: 'Test article body',
  tagList: ['test', 'article'],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 5,
  author: {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.png',
    following: false,
  },
};

beforeEach(() => {
  mockUseSWRValue.data = undefined;
});

afterEach(() => {
  mockPush.mockClear();
  mockAxiosPost.mockClear();
  mockAxiosDelete.mockClear();
  mockSetPage.mockClear();
});

describe('ArticlePreview', () => {
  it('renders article preview with title and description', () => {
    render(<ArticlePreview article={mockArticle} />);

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Test article description')).toBeInTheDocument();
    expect(screen.getByText('Read more...')).toBeInTheDocument();
  });

  it('displays author information', () => {
    render(<ArticlePreview article={mockArticle} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText(/Dec 31 2024/i)).toBeInTheDocument();
  });

  it('displays favorite button with count', () => {
    render(<ArticlePreview article={mockArticle} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toHaveTextContent('5');
  });

  it('displays tags', () => {
    render(<ArticlePreview article={mockArticle} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('article')).toBeInTheDocument();
  });

  it('redirects to login when not logged in user favorites article', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = undefined;

    render(<ArticlePreview article={mockArticle} />);

    const favoriteButton = screen.getByRole('button');
    await user.click(favoriteButton);

    expect(mockPush).toHaveBeenCalledWith('/user/login');
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it('favorites article when logged in user clicks favorite', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    mockAxiosPost.mockResolvedValue({ data: {} });

    render(<ArticlePreview article={mockArticle} />);

    const favoriteButton = screen.getByRole('button');
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining('/articles/test-article/favorite'),
        {},
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Token test-token',
          }),
        })
      );
    });
  });

  it('unfavorites article when already favorited', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    const favoritedArticle = { ...mockArticle, favorited: true, favoritesCount: 10 };
    mockAxiosDelete.mockResolvedValue({ data: {} });

    render(<ArticlePreview article={favoritedArticle} />);

    const favoriteButton = screen.getByRole('button');
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(mockAxiosDelete).toHaveBeenCalledWith(
        expect.stringContaining('/articles/test-article/favorite'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Token test-token',
          }),
        })
      );
    });
  });

  it('updates favorite count optimistically', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    mockAxiosPost.mockResolvedValue({ data: {} });

    render(<ArticlePreview article={mockArticle} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toHaveTextContent('5');

    await user.click(favoriteButton);

    // Should optimistically update to 6
    expect(favoriteButton).toHaveTextContent('6');
  });

  it('returns nothing when article is null', () => {
    const { container } = render(<ArticlePreview article={null} />);
    expect(container.firstChild).toBeNull();
  });
});
