import { render, screen } from '@testing-library/react';
import Navbar from '../../../components/common/Navbar';

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

// Mock PageContext
const mockSetPage = jest.fn();
jest.mock('../../../lib/context/PageContext', () => ({
  usePageDispatch: () => mockSetPage,
}));

describe('Navbar', () => {
  afterEach(() => {
    mockSetPage.mockClear();
    mockUseSWRValue.data = undefined;
  });

  it('renders navbar with brand and home link', () => {
    render(<Navbar />);

    expect(screen.getByText('conduit')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('shows Sign in and Sign up links when user is not logged in', () => {
    mockUseSWRValue.data = undefined;

    render(<Navbar />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText('New Post')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('shows user navigation links when user is logged in', () => {
    mockUseSWRValue.data = {
      email: 'test@example.com',
      token: 'test-token',
      username: 'testuser',
      bio: '',
      image: '',
    };

    render(<Navbar />);

    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });

  it('displays username in profile link', () => {
    mockUseSWRValue.data = {
      email: 'john@example.com',
      token: 'token',
      username: 'johndoe',
      bio: '',
      image: '',
    };

    render(<Navbar />);

    expect(screen.getAllByText('johndoe')[0]).toBeInTheDocument();
  });
});
