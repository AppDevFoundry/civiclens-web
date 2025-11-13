import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../components/common/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has error-container class', () => {
    const { container } = render(<ErrorMessage message="Error" />);

    const errorContainer = container.querySelector('.error-container');
    expect(errorContainer).toBeInTheDocument();
  });

  it('has error-content class', () => {
    const { container } = render(<ErrorMessage message="Error" />);

    const errorContent = container.querySelector('.error-content');
    expect(errorContent).toBeInTheDocument();
  });

  it('displays different messages', () => {
    const { rerender } = render(<ErrorMessage message="First Error" />);
    expect(screen.getByText('First Error')).toBeInTheDocument();

    rerender(<ErrorMessage message="Second Error" />);
    expect(screen.getByText('Second Error')).toBeInTheDocument();
    expect(screen.queryByText('First Error')).not.toBeInTheDocument();
  });

  it('handles empty message', () => {
    const { container } = render(<ErrorMessage message="" />);

    const errorContent = container.querySelector('.error-content');
    expect(errorContent).toBeInTheDocument();
    expect(errorContent?.textContent).toBe('');
  });

  it('handles long messages', () => {
    const longMessage = 'This is a very long error message that describes what went wrong in great detail';
    render(<ErrorMessage message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
