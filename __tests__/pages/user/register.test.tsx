import { render, screen } from '@testing-library/react';
import Register from '../../../pages/user/register';

// Mock RegisterForm component
jest.mock('../../../components/profile/RegisterForm', () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">Register Form</div>;
  };
});

describe('Register Page', () => {
  it('renders the register page with correct title', () => {
    render(<Register />);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('displays link to login page', () => {
    render(<Register />);

    expect(screen.getByText('Have an account?')).toBeInTheDocument();
  });

  it('renders the RegisterForm component', () => {
    render(<Register />);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('has correct page structure with auth-page class', () => {
    const { container } = render(<Register />);

    expect(container.querySelector('.auth-page')).toBeInTheDocument();
    expect(container.querySelector('.container.page')).toBeInTheDocument();
  });

  it('has centered layout', () => {
    const { container } = render(<Register />);

    expect(container.querySelector('.col-md-6.offset-md-3')).toBeInTheDocument();
  });
});
