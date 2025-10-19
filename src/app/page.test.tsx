import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

// Mock the components that are used in the Home page
jest.mock('@/components/landing-page/Header', () => {
  const MockHeader = () => <header>Mock Header</header>;
  MockHeader.displayName = 'MockHeader';
  return {
    __esModule: true,
    Header: MockHeader,
  };
});

jest.mock('@/components/landing-page/Footer', () => {
  const MockFooter = () => <footer>Mock Footer</footer>;
  MockFooter.displayName = 'MockFooter';
  return {
    __esModule: true,
    Footer: MockFooter,
  };
});

// Mock the Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock other components
jest.mock('@/components/FeaturesSection', () => ({
  __esModule: true,
  default: () => <div>FeaturesSection</div>,
}));

jest.mock('@/components/ImageGallery', () => ({
  __esModule: true,
  default: () => <div>ImageGallery</div>,
}));

jest.mock('@/components/how-it-works', () => ({
  __esModule: true,
  default: () => <div>MomentumInfographic</div>,
}));

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    // Check if the main heading is rendered
    const heading = screen.getByRole('heading', {
      name: /project management for freelancers & small businesses/i,
    });
    
    expect(heading).toBeInTheDocument();
  });
});
