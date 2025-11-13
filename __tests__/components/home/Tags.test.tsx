import { render, screen, fireEvent } from '@testing-library/react';
import Tags from '../../../components/home/Tags';
import useSWR from 'swr';

// Mock SWR
jest.mock('swr');
const mockedUseSWR = useSWR as jest.Mock;

// Mock next/link for CustomLink
jest.mock('next/link', () => {
  return ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
});

// Mock PageContext
const mockSetPage = jest.fn();
jest.mock('../../../lib/context/PageContext', () => ({
  usePageDispatch: () => mockSetPage,
}));

describe('Tags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when data is not available', () => {
    mockedUseSWR.mockReturnValue({ data: undefined, error: undefined });

    render(<Tags />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message when error occurs', () => {
    mockedUseSWR.mockReturnValue({ data: undefined, error: new Error('Network error') });

    render(<Tags />);

    expect(screen.getByText('Cannot load popular tags...')).toBeInTheDocument();
  });

  it('renders tags when data is available', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['javascript', 'react', 'nodejs'] },
      error: undefined,
    });

    render(<Tags />);

    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('nodejs')).toBeInTheDocument();
  });

  it('renders tag-list container', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['test'] },
      error: undefined,
    });

    const { container } = render(<Tags />);

    const tagList = container.querySelector('.tag-list');
    expect(tagList).toBeInTheDocument();
  });

  it('renders tags with correct classes', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['react'] },
      error: undefined,
    });

    const { container } = render(<Tags />);

    const tagLink = container.querySelector('.tag-default.tag-pill');
    expect(tagLink).toBeInTheDocument();
  });

  it('creates correct href for each tag', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['javascript'] },
      error: undefined,
    });

    render(<Tags />);

    const link = screen.getByText('javascript').closest('a');
    expect(link).toHaveAttribute('href', '/?tag=javascript');
  });

  it('calls setPage with 0 when tag is clicked', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['react'] },
      error: undefined,
    });

    render(<Tags />);

    const tag = screen.getByText('react');
    fireEvent.click(tag);

    expect(mockSetPage).toHaveBeenCalledWith(0);
  });

  it('handles empty tags array', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: [] },
      error: undefined,
    });

    const { container } = render(<Tags />);

    const tagList = container.querySelector('.tag-list');
    expect(tagList).toBeInTheDocument();
    expect(tagList?.children).toHaveLength(0);
  });

  it('renders multiple tags as links', () => {
    mockedUseSWR.mockReturnValue({
      data: { tags: ['tag1', 'tag2', 'tag3'] },
      error: undefined,
    });

    const { container } = render(<Tags />);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(3);
  });
});
