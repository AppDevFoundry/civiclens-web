import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteButton from '../../../components/comment/DeleteButton';

// Mock Next.js Router
const mockUseRouter = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: () => mockUseRouter(),
}));

// Mock SWR
const mockUseSWRValue = {
  data: {
    email: 'test@example.com',
    token: 'test-token',
    username: 'testuser',
    bio: '',
    image: '',
  },
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
const mockAxiosDelete = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    delete: (...args: any[]) => mockAxiosDelete(...args),
  },
}));

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    query: { pid: 'test-article' },
    pathname: '/article/[pid]',
    asPath: '/article/test-article',
  });
});

afterEach(() => {
  mockAxiosDelete.mockClear();
  mockMutate.mockClear();
});

describe('DeleteButton', () => {
  it('renders delete icon', () => {
    const { container } = render(<DeleteButton commentId={1} />);

    expect(container.querySelector('.ion-trash-a')).toBeInTheDocument();
  });

  it('deletes comment when clicked', async () => {
    const user = userEvent.setup();
    mockAxiosDelete.mockResolvedValue({ data: {} });

    const { container } = render(<DeleteButton commentId={5} />);

    const deleteIcon = container.querySelector('.ion-trash-a') as HTMLElement;
    await user.click(deleteIcon);

    await waitFor(() => {
      expect(mockAxiosDelete).toHaveBeenCalledWith(
        expect.stringContaining('/articles/test-article/comments/5'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Token test-token',
          }),
        })
      );
      expect(mockMutate).toHaveBeenCalledWith(
        expect.stringContaining('/articles/test-article/comments')
      );
    });
  });

  it('has correct class names', () => {
    const { container } = render(<DeleteButton commentId={1} />);

    expect(container.querySelector('.mod-options')).toBeInTheDocument();
  });
});
