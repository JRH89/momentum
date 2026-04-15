import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

// Mock the Header component with named export
jest.mock('@/components/landing-page/Header', () => {
  const MockHeader = () => <div>Mock Header</div>;
  MockHeader.displayName = 'MockHeader';
  return {
    __esModule: true,
    Header: MockHeader,
  };
});

// Mock the Footer component
jest.mock('@/components/landing-page/Footer', () => {
  const MockFooter = () => <div>Mock Footer</div>;
  MockFooter.displayName = 'MockFooter';
  return {
    __esModule: true,
    Footer: MockFooter,
  };
});

// Mock the Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock the FeaturesSection component
jest.mock('@/components/FeaturesSection', () => {
  const MockFeaturesSection = () => <div>Mock FeaturesSection</div>;
  MockFeaturesSection.displayName = 'MockFeaturesSection';
  return {
    __esModule: true,
    default: MockFeaturesSection,
  };
});

// Mock the ImageGallery component
jest.mock('@/components/ImageGallery', () => {
  const MockImageGallery = () => <div>Mock ImageGallery</div>;
  MockImageGallery.displayName = 'MockImageGallery';
  return {
    __esModule: true,
    default: MockImageGallery,
  };
});

// Mock the how-it-works component
jest.mock('@/components/how-it-works', () => {
  const MockHowItWorks = () => <div>Mock HowItWorks</div>;
  MockHowItWorks.displayName = 'MockHowItWorks';
  return {
    __esModule: true,
    default: MockHowItWorks,
  };
});

describe('Home Component', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    // Check if the main heading is rendered
    const heading = screen.getByRole('heading', {
      name: /project management for freelancers & small businesses/i,
    });
    
    expect(heading).toBeInTheDocument();
  });

  it('renders the call to action button', () => {
    render(<Home />);
    
    // Get all links with 'Start Now' text and find the one that goes to /Signup
    const startNowButtons = screen.getAllByRole('link', { name: /start now/i });
    const signupButton = startNowButtons.find(button => 
      button.getAttribute('href') === '/Signup'
    );
    
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveAttribute('href', '/Signup');
  });

  it('renders the learn more link with correct href', () => {
    render(<Home />);
    
    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    
    expect(learnMoreLink).toBeInTheDocument();
    expect(learnMoreLink).toHaveAttribute('href', '/#howitworks');
  });

  it('renders the hero image with correct alt text', () => {
    render(<Home />);
    
    // Get all images with the alt text and select the first one
    const heroImages = screen.getAllByAltText('Project Dashboard');
    expect(heroImages.length).toBeGreaterThan(0);
    
    const heroImage = heroImages[0];
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/project.png');
  });

  it('renders the features section', () => {
    render(<Home />);
    
    const featuresSection = screen.getByText('Mock FeaturesSection');
    expect(featuresSection).toBeInTheDocument();
  });

  it('renders the how it works section', () => {
    render(<Home />);
    
    const howItWorksSection = screen.getByText('Mock HowItWorks');
    expect(howItWorksSection).toBeInTheDocument();
  });

  it('renders the pricing section', () => {
    render(<Home />);
    
    // Check for the pricing section heading
    const pricingHeading = screen.getByRole('heading', { name: /affordable plans/i });
    expect(pricingHeading).toBeInTheDocument();
  });
});
