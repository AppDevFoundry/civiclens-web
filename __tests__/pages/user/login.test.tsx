import { render, screen } from '@testing-library/react';
import Login from '../../../pages/user/login';

// Mock LoginForm component
jest.mock('../../../components/profile/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

describe('Login Page', () => {
  it('renders the login page with correct title', () => {
    render(<Login />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('displays link to register page', () => {
    render(<Login />);

    expect(screen.getByText('Need an account?')).toBeInTheDocument();
  });

  it('renders the LoginForm component', () => {
    render(<Login />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('has correct page structure with auth-page class', () => {
    const { container } = render(<Login />);

    expect(container.querySelector('.auth-page')).toBeInTheDocument();
    expect(container.querySelector('.container.page')).toBeInTheDocument();
  });

  it('has centered layout', () => {
    const { container } = render(<Login />);

    expect(container.querySelector('.col-md-6.offset-md-3')).toBeInTheDocument();
  });
});
