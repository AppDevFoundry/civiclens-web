import { render, screen } from '@testing-library/react';
import Banner from '../../../components/home/Banner';
import { APP_NAME } from '../../../lib/utils/constant';

describe('Banner', () => {
  it('renders banner div', () => {
    const { container } = render(<Banner />);

    const banner = container.querySelector('.banner');
    expect(banner).toBeInTheDocument();
  });

  it('renders app name in lowercase', () => {
    render(<Banner />);

    expect(screen.getByText(APP_NAME.toLowerCase())).toBeInTheDocument();
  });

  it('displays app name with logo-font class', () => {
    const { container } = render(<Banner />);

    const h1 = container.querySelector('h1.logo-font');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toBe(APP_NAME.toLowerCase());
  });

  it('renders tagline text', () => {
    render(<Banner />);

    expect(screen.getByText('A place to share your knowledge.')).toBeInTheDocument();
  });

  it('has container div', () => {
    const { container } = render(<Banner />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('renders h1 and p elements', () => {
    const { container } = render(<Banner />);

    const h1 = container.querySelector('h1');
    const p = container.querySelector('p');

    expect(h1).toBeInTheDocument();
    expect(p).toBeInTheDocument();
  });
});
