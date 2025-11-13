import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../../../pages/user/settings';

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
const mockMutate = jest.fn();
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => mockUseSWRValue),
  mutate: (...args: any[]) => mockMutate(...args),
}));

// Mock SettingsForm component
jest.mock('../../../components/profile/SettingsForm', () => {
  return function MockSettingsForm() {
    return <div data-testid="settings-form">Settings Form</div>;
  };
});

const mockCurrentUser = {
  email: 'test@example.com',
  token: 'test-token',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://example.com/avatar.png',
};

beforeEach(() => {
  mockUseSWRValue.data = mockCurrentUser;
  mockUseSWRValue.error = undefined;
  mockUseSWRValue.isLoading = false;
});

afterEach(() => {
  mockPush.mockClear();
  mockMutate.mockClear();
  localStorage.clear();
});

describe('Settings Page', () => {
  it('renders the settings page with correct title', () => {
    render(<Settings />);

    expect(screen.getByText('Your Settings')).toBeInTheDocument();
  });

  it('renders the SettingsForm component', () => {
    render(<Settings />);

    expect(screen.getByTestId('settings-form')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Settings />);

    expect(screen.getByText(/click here to logout/i)).toBeInTheDocument();
  });

  it('has correct page structure with settings-page class', () => {
    const { container } = render(<Settings />);

    expect(container.querySelector('.settings-page')).toBeInTheDocument();
    expect(container.querySelector('.container.page')).toBeInTheDocument();
  });

  it('has centered layout', () => {
    const { container } = render(<Settings />);

    expect(container.querySelector('.col-md-6.offset-md-3')).toBeInTheDocument();
  });

  it('handles logout when button is clicked', async () => {
    const user = userEvent.setup();

    // Mock successful push
    mockPush.mockResolvedValue(true);

    render(<Settings />);

    const logoutButton = screen.getByText(/click here to logout/i);
    await user.click(logoutButton);

    await waitFor(() => {
      // Verify localStorage was cleared
      expect(localStorage.getItem('user')).toBeNull();

      // Verify SWR cache was cleared
      expect(mockMutate).toHaveBeenCalledWith('user', null);

      // Verify redirect to home page
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('does not redirect when user is logged in', () => {
    mockUseSWRValue.data = mockCurrentUser;

    render(<Settings />);

    // Should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect while user data is loading (undefined)', () => {
    mockUseSWRValue.data = undefined;

    render(<Settings />);

    // Should not redirect while loading (currentUser is undefined, waiting for data)
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects when user data is null (logged out)', async () => {
    mockUseSWRValue.data = null;

    render(<Settings />);

    // Should redirect when user is null (logged out)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
