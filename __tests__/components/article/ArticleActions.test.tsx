import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleActions from '../../../components/article/ArticleActions';

// Mock Next.js Router
const mockPush = jest.fn();
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: (...args: any[]) => mockPush(...args),
  },
  useRouter: () => mockUseRouter(),
}));

// Mock SWR
const mockUseSWRValue = {
  data: undefined,
  error: undefined,
  isLoading: false,
};
const mockMutate = jest.fn();
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => mockUseSWRValue),
  mutate: (...args: any[]) => mockMutate(...args),
}));

// Mock ArticleAPI
const mockArticleAPIDelete = jest.fn();
jest.mock('../../../lib/api/article', () => ({
  __esModule: true,
  default: {
    delete: (...args: any[]) => mockArticleAPIDelete(...args),
  },
}));

const mockArticle = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test description',
  body: 'Test body',
  tagList: ['test'],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 0,
  author: {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.png',
    following: false,
  },
};

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    query: { pid: 'test-article' },
    pathname: '/article/[pid]',
    asPath: '/article/test-article',
  });
  mockUseSWRValue.data = undefined;
  // Mock window.confirm
  global.confirm = jest.fn();
});

afterEach(() => {
  mockPush.mockClear();
  mockMutate.mockClear();
  mockArticleAPIDelete.mockClear();
  jest.clearAllMocks();
});

describe('ArticleActions', () => {
  it('does not render when user is not the author', () => {
    mockUseSWRValue.data = {
      email: 'other@example.com',
      token: 'other-token',
      username: 'otheruser',
      bio: '',
      image: '',
    };

    const { container } = render(<ArticleActions article={mockArticle} />);

    expect(container.querySelector('.btn')).not.toBeInTheDocument();
  });

  it('renders edit and delete buttons when user is the author', () => {
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    render(<ArticleActions article={mockArticle} />);

    expect(screen.getByText(/Edit Article/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Article/i)).toBeInTheDocument();
  });

  it('does not render when user is not logged in', () => {
    mockUseSWRValue.data = undefined;

    const { container } = render(<ArticleActions article={mockArticle} />);

    expect(container.querySelector('.btn')).not.toBeInTheDocument();
  });

  it('deletes article when confirmed', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    (global.confirm as jest.Mock).mockReturnValue(true);
    mockArticleAPIDelete.mockResolvedValue({});

    render(<ArticleActions article={mockArticle} />);

    const deleteButton = screen.getByText(/Delete Article/i);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockArticleAPIDelete).toHaveBeenCalledWith('test-article', 'test-token');
      expect(mockMutate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not delete article when cancelled', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    (global.confirm as jest.Mock).mockReturnValue(false);

    render(<ArticleActions article={mockArticle} />);

    const deleteButton = screen.getByText(/Delete Article/i);
    await user.click(deleteButton);

    expect(mockArticleAPIDelete).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
