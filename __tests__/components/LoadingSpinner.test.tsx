import { render } from '@testing-library/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner element', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('has the correct class for styling', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerDiv = container.firstChild;
    expect(spinnerDiv).toHaveClass('loading-spinner');
  });

  it('includes CSS animation styles', () => {
    const { container } = render(<LoadingSpinner />);

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.textContent).toContain('spin');
  });
});
