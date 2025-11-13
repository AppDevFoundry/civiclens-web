import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../../components/profile/LoginForm';

// Mock Next.js Router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: (...args: any[]) => mockPush(...args),
  },
}));

// Mock SWR mutate
const mockMutate = jest.fn();
jest.mock('swr', () => ({
  __esModule: true,
  mutate: (...args: any[]) => mockMutate(...args),
}));

// Mock UserAPI
const mockLogin = jest.fn();
jest.mock('../../../lib/api/user', () => ({
  __esModule: true,
  default: {
    login: (...args: any[]) => mockLogin(...args),
  },
}));

afterEach(() => {
  mockPush.mockClear();
  mockMutate.mockClear();
  mockLogin.mockClear();
  localStorage.clear();
});

describe('LoginForm', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to type in email and password fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();

    // Mock API to delay response
    mockLogin.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        data: {
          user: {
            email: 'test@example.com',
            token: 'test-token',
            username: 'testuser',
            bio: '',
            image: '',
          },
        },
        status: 200,
      };
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('successfully logs in user and redirects to home page', async () => {
    const user = userEvent.setup();
    const mockUserData = {
      email: 'test@example.com',
      token: 'test-jwt-token',
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.png',
    };

    mockLogin.mockResolvedValue({
      data: { user: mockUserData },
      status: 200,
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      // Verify localStorage was updated
      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeTruthy();
      expect(JSON.parse(storedUser!)).toEqual(mockUserData);

      // Verify SWR cache was updated
      expect(mockMutate).toHaveBeenCalledWith('user', mockUserData);

      // Verify redirect to home page
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('displays errors when login fails', async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      data: {
        errors: {
          'email or password': ['is invalid'],
        },
      },
      status: 422,
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email or password/i)).toBeInTheDocument();
      expect(screen.getByText(/is invalid/i)).toBeInTheDocument();
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect if user data is missing', async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue({
      data: { user: null },
      status: 200,
    });

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Should not redirect if user data is missing
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockLogin.mockRejectedValue(new Error('Network error'));

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Should not redirect on network error
    expect(mockPush).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
