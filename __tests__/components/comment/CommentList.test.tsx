import { render, screen } from '@testing-library/react';
import CommentList from '../../../components/comment/CommentList';
import useSWR from 'swr';

// Mock Next.js Router
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => mockUseRouter(),
}));

// Mock SWR
jest.mock('swr');

// Mock CommentInput
jest.mock('../../../components/comment/CommentInput', () => {
  return function MockCommentInput() {
    return <div data-testid="comment-input">Comment Input</div>;
  };
});

// Mock Comment
jest.mock('../../../components/comment/Comment', () => {
  return function MockComment({ comment }: any) {
    return <div data-testid={`comment-${comment.id}`}>{comment.body}</div>;
  };
});

const mockComments = [
  {
    id: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    body: 'First comment',
    author: {
      username: 'user1',
      bio: '',
      image: '',
      following: false,
    },
  },
  {
    id: 2,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    body: 'Second comment',
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
    query: { pid: 'test-article' },
    pathname: '/article/[pid]',
    asPath: '/article/test-article',
  });
});

afterEach(() => {
  (useSWR as jest.Mock).mockClear();
});

describe('CommentList', () => {
  it('displays loading spinner when data is not loaded', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
    });

    const { container } = render(<CommentList />);

    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: {},
      error: new Error('Failed to fetch'),
    });

    render(<CommentList />);

    expect(screen.getByText(/Cannot load comments related to this article\.\.\./i)).toBeInTheDocument();
  });

  it('renders CommentInput component', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments },
      error: undefined,
    });

    render(<CommentList />);

    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });

  it('renders all comments', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments },
      error: undefined,
    });

    render(<CommentList />);

    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });

  it('renders CommentInput and comments together', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments },
      error: undefined,
    });

    render(<CommentList />);

    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
  });

  it('renders CommentInput even when there are no comments', () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { comments: [] },
      error: undefined,
    });

    render(<CommentList />);

    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });
});
