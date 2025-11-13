import { render, screen } from '@testing-library/react';
import ListErrors from '../../components/common/ListErrors';

describe('ListErrors', () => {
  it('renders error list with single error', () => {
    const errors = { email: 'is invalid' };
    render(<ListErrors errors={errors} />);

    expect(screen.getByText('email is invalid')).toBeInTheDocument();
  });

  it('renders error list with multiple errors', () => {
    const errors = {
      email: 'is invalid',
      password: 'is too short',
      username: 'is already taken',
    };
    render(<ListErrors errors={errors} />);

    expect(screen.getByText('email is invalid')).toBeInTheDocument();
    expect(screen.getByText('password is too short')).toBeInTheDocument();
    expect(screen.getByText('username is already taken')).toBeInTheDocument();
  });

  it('renders as unordered list with error-messages class', () => {
    const errors = { field: 'error' };
    const { container } = render(<ListErrors errors={errors} />);

    const ul = container.querySelector('ul.error-messages');
    expect(ul).toBeInTheDocument();
  });

  it('renders each error as a list item', () => {
    const errors = { email: 'invalid', password: 'short' };
    const { container } = render(<ListErrors errors={errors} />);

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });

  it('handles empty errors object', () => {
    const errors = {};
    const { container } = render(<ListErrors errors={errors} />);

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(0);
  });

  it('renders each error with the field name', () => {
    const errors = { email: 'is invalid' };
    const { container } = render(<ListErrors errors={errors} />);

    const li = container.querySelector('li');
    expect(li).toBeInTheDocument();
    expect(li?.textContent).toContain('email');
  });

  it('combines key and value in error message', () => {
    const errors = { 'user email': 'cannot be blank' };
    render(<ListErrors errors={errors} />);

    expect(screen.getByText('user email cannot be blank')).toBeInTheDocument();
  });

  it('handles array values in errors', () => {
    const errors = { email: ['is invalid', 'is required'] };
    render(<ListErrors errors={errors} />);

    // Arrays are joined with commas when converted to string
    expect(screen.getByText(/email.*is invalid.*is required/)).toBeInTheDocument();
  });
});
