import { render, screen } from '@testing-library/react';
import Comment from '../../../components/comment/Comment';

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

// Mock DeleteButton
jest.mock('../../../components/comment/DeleteButton', () => {
  return function MockDeleteButton() {
    return <div data-testid="delete-button">Delete</div>;
  };
});

const mockComment = {
  id: 1,
  createdAt: '2025-01-10T14:30:00.000Z',
  updatedAt: '2025-01-10T14:30:00.000Z',
  body: 'This is a test comment',
  author: {
    username: 'commenter',
    bio: 'Test bio',
    image: 'https://example.com/commenter.png',
    following: false,
  },
};

beforeEach(() => {
  mockUseSWRValue.data = undefined;
});

describe('Comment', () => {
  it('renders comment body', () => {
    render(<Comment comment={mockComment} />);

    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  it('renders author information', () => {
    render(<Comment comment={mockComment} />);

    expect(screen.getByText('commenter')).toBeInTheDocument();
    expect(screen.getByText(/Fri Jan 10 2025/i)).toBeInTheDocument();
  });

  it('does not render delete button when user is not the author', () => {
    mockUseSWRValue.data = {
      email: 'other@example.com',
      token: 'other-token',
      username: 'otheruser',
      bio: '',
      image: '',
    };

    render(<Comment comment={mockComment} />);

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  it('renders delete button when user is the author', () => {
    mockUseSWRValue.data = {
      email: 'commenter@example.com',
      token: 'test-token',
      username: 'commenter',
      bio: '',
      image: '',
    };

    render(<Comment comment={mockComment} />);

    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('does not render delete button when user is not logged in', () => {
    mockUseSWRValue.data = undefined;

    render(<Comment comment={mockComment} />);

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });
});
