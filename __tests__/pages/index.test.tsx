import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: () => ({
    data: undefined,
    error: undefined,
    isLoading: true,
  }),
}));

describe('Home Page', () => {
  it('renders the home page', () => {
    render(<Home />);

    // Check if the home page container exists
    const homePageDiv = document.querySelector('.home-page');
    expect(homePageDiv).toBeInTheDocument();
  });

  it('renders Banner and MainView components', () => {
    render(<Home />);

    // Check for key structural elements
    expect(document.querySelector('.banner')).toBeInTheDocument();
    expect(document.querySelector('.container.page')).toBeInTheDocument();
  });
});
