import React from 'react';
import { render, screen, fireEvent } from '@/tests/utils/test-utils';
import { VendorPortfolio } from '@/components/organisms/vendor-portfolio';
import { createMockVendor } from '@/tests/utils/test-utils';

describe('VendorPortfolio', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  const mockVendor = createMockVendor({
    name: 'Test Vendor',
  });

  it('renders portfolio title and description', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('View our latest work and projects')).toBeInTheDocument();
  });

  it('displays the first image by default', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    const image = screen.getByAltText('Test Vendor portfolio image 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImages[0]);
  });

  it('shows navigation buttons when there are multiple images', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('hides navigation buttons when there is only one image', () => {
    const singleImage = ['https://example.com/image1.jpg'];
    render(<VendorPortfolio images={singleImage} vendorName={mockVendor.name} />);

    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('navigates to next image when next button is clicked', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    const image = screen.getByAltText('Test Vendor portfolio image 2');
    expect(image).toHaveAttribute('src', mockImages[1]);
  });

  it('navigates to previous image when previous button is clicked', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    // First go to second image
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    // Then go back to first image
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    const image = screen.getByAltText('Test Vendor portfolio image 1');
    expect(image).toHaveAttribute('src', mockImages[0]);
  });

  it('wraps around to first image when navigating past last image', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    // Navigate to last image
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton); // image 2
    fireEvent.click(nextButton); // image 3

    // Navigate past last image
    fireEvent.click(nextButton); // should wrap to image 1

    const image = screen.getByAltText('Test Vendor portfolio image 1');
    expect(image).toHaveAttribute('src', mockImages[0]);
  });

  it('wraps around to last image when navigating before first image', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    // Navigate before first image
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton); // should wrap to image 3

    const image = screen.getByAltText('Test Vendor portfolio image 3');
    expect(image).toHaveAttribute('src', mockImages[2]);
  });

  it('handles empty images array gracefully', () => {
    render(<VendorPortfolio images={[]} vendorName={mockVendor.name} />);

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.queryByAltText(/portfolio image/)).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<VendorPortfolio images={mockImages} vendorName={mockVendor.name} />);

    const container = screen.getByText('Portfolio').closest('.mb-8');
    expect(container).toBeInTheDocument();

    const imageContainer = screen.getByAltText(/portfolio image/).closest('.aspect-video');
    expect(imageContainer).toBeInTheDocument();
  });
}); 