import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentInput from '../../../components/comment/CommentInput';

// Mock Next.js Router
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
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

// Mock axios
const mockAxiosPost = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: (...args: any[]) => mockAxiosPost(...args),
  },
}));

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    query: { pid: 'test-article' },
    pathname: '/article/[pid]',
    asPath: '/article/test-article',
  });
  mockUseSWRValue.data = undefined;
});

afterEach(() => {
  mockAxiosPost.mockClear();
  mockMutate.mockClear();
});

describe('CommentInput', () => {
  it('shows sign in links when user is not logged in', () => {
    mockUseSWRValue.data = undefined;

    render(<CommentInput />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/to add comments on this article/i)).toBeInTheDocument();
  });

  it('renders comment form when user is logged in', () => {
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: 'https://example.com/avatar.png',
    };

    render(<CommentInput />);

    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
  });

  it('allows user to type in comment field', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    render(<CommentInput />);

    const textarea = screen.getByPlaceholderText('Write a comment...') as HTMLTextAreaElement;
    await user.type(textarea, 'This is my comment');

    expect(textarea.value).toBe('This is my comment');
  });

  it('submits comment when form is submitted', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    mockAxiosPost.mockResolvedValue({ data: {} });

    render(<CommentInput />);

    const textarea = screen.getByPlaceholderText('Write a comment...');
    const submitButton = screen.getByText('Post Comment');

    await user.type(textarea, 'New comment');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.stringContaining('/articles/test-article/comments'),
        expect.stringContaining('New comment'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('test-token'),
          }),
        })
      );
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('clears comment field after submission', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    mockAxiosPost.mockResolvedValue({ data: {} });

    render(<CommentInput />);

    const textarea = screen.getByPlaceholderText('Write a comment...') as HTMLTextAreaElement;
    const submitButton = screen.getByText('Post Comment');

    await user.type(textarea, 'Test comment');
    await user.click(submitButton);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('disables textarea while submitting', async () => {
    const user = userEvent.setup();
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    mockAxiosPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<CommentInput />);

    const textarea = screen.getByPlaceholderText('Write a comment...');
    const submitButton = screen.getByText('Post Comment');

    await user.type(textarea, 'Test');
    await user.click(submitButton);

    expect(textarea).toBeDisabled();
  });
});
