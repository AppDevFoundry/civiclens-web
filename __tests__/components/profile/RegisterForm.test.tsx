import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../../components/profile/RegisterForm';

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
const mockRegister = jest.fn();
jest.mock('../../../lib/api/user', () => ({
  __esModule: true,
  default: {
    register: (...args: any[]) => mockRegister(...args),
  },
}));

afterEach(() => {
  mockPush.mockClear();
  mockMutate.mockClear();
  mockRegister.mockClear();
  localStorage.clear();
});

describe('RegisterForm', () => {
  it('renders registration form with username, email, and password fields', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('allows user to type in all form fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    await user.type(usernameInput, 'newuser');
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'securepassword123');

    expect(usernameInput.value).toBe('newuser');
    expect(emailInput.value).toBe('newuser@example.com');
    expect(passwordInput.value).toBe('securepassword123');
  });

  it('successfully registers user and redirects to home page', async () => {
    const user = userEvent.setup();
    const mockUserData = {
      email: 'newuser@example.com',
      token: 'test-jwt-token',
      username: 'newuser',
      bio: '',
      image: '',
    };

    mockRegister.mockResolvedValue({
      data: { user: mockUserData },
      status: 200,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'newuser');
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'securepassword123');
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

  it('displays validation errors when registration fails', async () => {
    const user = userEvent.setup();

    mockRegister.mockResolvedValue({
      data: {
        errors: {
          username: ['has already been taken'],
          email: ['has already been taken'],
        },
      },
      status: 422,
    });

    render(<RegisterForm />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'existinguser');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username/i)).toBeInTheDocument();
      const errors = screen.getAllByText(/has already been taken/i);
      expect(errors).toHaveLength(2); // username and email both have this error
    });

    // Should not redirect on error
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockRegister.mockRejectedValue(new Error('Network error'));

    render(<RegisterForm />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await user.type(usernameInput, 'testuser');
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
