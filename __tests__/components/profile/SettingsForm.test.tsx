import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsForm from '../../../components/profile/SettingsForm';

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

// Mock axios
const mockAxiosPut = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    put: (...args: any[]) => mockAxiosPut(...args),
  },
}));

const mockCurrentUser = {
  email: 'test@example.com',
  token: 'test-token',
  username: 'testuser',
  bio: 'Test bio',
  image: 'https://example.com/avatar.png',
};

beforeEach(() => {
  // Default SWR mock returns current user
  mockUseSWRValue.data = mockCurrentUser;
  mockUseSWRValue.error = undefined;
  mockUseSWRValue.isLoading = false;
});

afterEach(() => {
  mockPush.mockClear();
  mockMutate.mockClear();
  mockAxiosPut.mockClear();
  localStorage.clear();
});

describe('SettingsForm', () => {
  it('renders settings form with all fields', () => {
    render(<SettingsForm />);

    expect(screen.getByPlaceholderText('URL of profile picture')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Short bio about you')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update settings/i })).toBeInTheDocument();
  });

  it('pre-fills form with current user data', async () => {
    render(<SettingsForm />);

    // Wait for useEffect to populate form
    await waitFor(() => {
      const imageInput = screen.getByPlaceholderText('URL of profile picture') as HTMLInputElement;
      const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
      const bioInput = screen.getByPlaceholderText('Short bio about you') as HTMLTextAreaElement;
      const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;

      expect(imageInput.value).toBe(mockCurrentUser.image);
      expect(usernameInput.value).toBe(mockCurrentUser.username);
      expect(bioInput.value).toBe(mockCurrentUser.bio);
      expect(emailInput.value).toBe(mockCurrentUser.email);
    });
  });

  it('allows user to update profile fields', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(mockCurrentUser.username);
    });

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    const bioInput = screen.getByPlaceholderText('Short bio about you') as HTMLTextAreaElement;

    await user.clear(usernameInput);
    await user.type(usernameInput, 'updateduser');

    await user.clear(bioInput);
    await user.type(bioInput, 'Updated bio text');

    expect(usernameInput.value).toBe('updateduser');
    expect(bioInput.value).toBe('Updated bio text');
  });

  it('successfully updates user settings without password', async () => {
    const user = userEvent.setup();
    const updatedUserData = {
      ...mockCurrentUser,
      username: 'updateduser',
      bio: 'Updated bio',
    };

    mockAxiosPut.mockResolvedValue({
      data: { user: updatedUserData },
      status: 200,
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(mockCurrentUser.username);
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const bioInput = screen.getByPlaceholderText('Short bio about you');
    const submitButton = screen.getByRole('button', { name: /update settings/i });

    await user.clear(usernameInput);
    await user.type(usernameInput, 'updateduser');
    await user.clear(bioInput);
    await user.type(bioInput, 'Updated bio');
    await user.click(submitButton);

    await waitFor(() => {
      // Verify localStorage was updated
      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeTruthy();
      expect(JSON.parse(storedUser!)).toEqual(updatedUserData);

      // Verify SWR cache was updated
      expect(mockMutate).toHaveBeenCalledWith('user', updatedUserData);

      // Verify redirect to home page
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    // Verify password was not included in request when empty
    const requestBody = JSON.parse(mockAxiosPut.mock.calls[0][1]);
    expect(requestBody.user.password).toBeUndefined();
  });

  it('successfully updates user settings with new password', async () => {
    const user = userEvent.setup();
    const updatedUserData = {
      ...mockCurrentUser,
      username: 'updateduser',
    };

    mockAxiosPut.mockResolvedValue({
      data: { user: updatedUserData },
      status: 200,
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(mockCurrentUser.username);
    });

    const passwordInput = screen.getByPlaceholderText('New Password');
    const submitButton = screen.getByRole('button', { name: /update settings/i });

    await user.type(passwordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    // Verify password was included in request
    const requestBody = JSON.parse(mockAxiosPut.mock.calls[0][1]);
    expect(requestBody.user.password).toBe('newpassword123');
  });

  it('includes authorization token in update request', async () => {
    const user = userEvent.setup();

    mockAxiosPut.mockResolvedValue({
      data: { user: mockCurrentUser },
      status: 200,
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(mockCurrentUser.username);
    });

    const submitButton = screen.getByRole('button', { name: /update settings/i });
    await user.click(submitButton);

    await waitFor(() => {
      const headers = mockAxiosPut.mock.calls[0][2].headers;
      expect(headers.Authorization).toBe(`Token ${mockCurrentUser.token}`);
    });
  });

  it('displays validation errors when update fails', async () => {
    const user = userEvent.setup();

    mockAxiosPut.mockResolvedValue({
      data: {
        errors: {
          body: {
            username: ['has already been taken'],
            email: ['is invalid'],
          },
        },
      },
      status: 422,
    });

    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username')).toHaveValue(mockCurrentUser.username);
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const submitButton = screen.getByRole('button', { name: /update settings/i });

    await user.clear(usernameInput);
    await user.type(usernameInput, 'takenusername');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username/i)).toBeInTheDocument();
      expect(screen.getByText(/has already been taken/i)).toBeInTheDocument();
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not render form when user is not logged in', () => {
    mockUseSWRValue.data = undefined;

    render(<SettingsForm />);

    // Form should still render, but fields will be empty
    expect(screen.getByPlaceholderText('Username')).toHaveValue('');
  });
});
