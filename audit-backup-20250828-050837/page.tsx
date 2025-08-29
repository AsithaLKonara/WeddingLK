'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Users,
  Phone,
  Eye,
  Download,
  Loader2,
  Heart,
  MessageSquare,
  CreditCard,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Bell,
  Settings,
  CheckSquare,
  MessageCircle,
  Store,
  Smartphone,
  Shield,
  Star,
  Camera,
  ArrowRight,
  Mail,
  Lock,
  EyeOff,
  XCircle,
  Clock,
  Play,
  Database,
  User,
  Search,
} from 'lucide-react';
import { VenueHero } from '@/components/organisms/venue-hero';
import { VenueDetails } from '@/components/organisms/venue-details';
import { VenueGallery } from '@/components/organisms/venue-gallery';
import { VenueReviews } from '@/components/organisms/venue-reviews';
import { VenueBooking } from '@/components/organisms/venue-booking';
import { SimilarVenues } from '@/components/organisms/similar-venues';

interface Venue {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  capacity: {
    min: number;
    max: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    packages?: Array<{
      name: string;
      description: string;
      price: number;
      includes: string[];
    }>;
  };
  amenities: string[];
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    _id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = params.id as string;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadVenue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/venues?venueId=${venueId}`);
      const data = await response.json();

      if (data.success) {
        setVenue(data.venue);
      } else {
        setError(data.error || 'Failed to load venue');
        toast({
          title: 'Error',
          description: data.error || 'Failed to load venue',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error loading venue:', error);
      setError('Failed to load venue');
      toast({
        title: 'Error',
        description: 'Failed to load venue',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [venueId, toast]);

  useEffect(() => {
    loadVenue();
  }, [loadVenue]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency || 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='space-y-8'>
            {/* Hero div */}
            <div className='relative h-96 bg-gray-200 rounded-lg'>
              <div className='h-full w-full' />
            </div>

            {/* Content div */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 space-y-6'>
                <div>
                  <div>
                    <div className='h-8 w-3/4' />
                    <div className='h-4 w-1/2' />
                  </div>
                  <div>
                    <div className='h-4 w-full mb-2' />
                    <div className='h-4 w-full mb-2' />
                    <div className='h-4 w-2/3' />
                  </div>
                </div>

                <div>
                  <div>
                    <div className='h-6 w-1/3' />
                  </div>
                  <div>
                    <div className='grid grid-cols-2 gap-4'>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className='h-4 w-full' />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div>
                  <div>
                    <div className='h-6 w-1/2' />
                  </div>
                  <div>
                    <div className='h-12 w-full mb-4' />
                    <div className='h-4 w-full mb-2' />
                    <div className='h-4 w-2/3' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Venue Not Found
          </h1>
          <p className='text-gray-600 mb-6'>
            {error || 'The venue you are looking for does not exist.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <VenueHero venue={venue} />

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Venue Details */}
            <VenueDetails venue={venue} />

            {/* Gallery */}
            <VenueGallery images={venue.images} venueName={venue.name} />

            {/* Reviews */}
            <VenueReviews
              reviews={venue.reviews}
              rating={venue.rating}
              venueId={venue._id}
              venueName={venue.name}
            />

            {/* Similar Venues */}
            <SimilarVenues
              currentVenueId={venue._id}
              currentVenueLocation={venue.location.city}
              currentVenuePrice={venue.pricing.basePrice}
            />
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Booking div */}
            <VenueBooking venue={venue} />

            {/* Contact Information */}
            <div>
              <div>
                <h3 className='flex items-center'>
                  <Phone className='h-5 w-5 mr-2' />
                  Contact Information
                </h3>
              </div>
              <div className='space-y-4'>
                <div>
                  <p className='font-semibold'>
                    {venue.owner.firstName} {venue.owner.lastName}
                  </p>
                  <p className='text-sm text-gray-600'>Venue Owner</p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center text-sm'>
                    <Phone className='h-4 w-4 mr-2 text-gray-500' />
                    <span>{venue.owner.phone}</span>
                  </div>
                  <div className='flex items-center text-sm'>
                    <Mail className='h-4 w-4 mr-2 text-gray-500' />
                    <span>{venue.owner.email}</span>
                  </div>
                </div>

                <button className='w-full px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                  <Mail className='h-4 w-4 mr-2' />
                  Send Message
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div>
              <div>
                <h3>Quick Info</h3>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Capacity</span>
                  <span className='font-semibold'>
                    {venue.capacity.min}-{venue.capacity.max} guests
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Starting Price</span>
                  <span className='font-semibold text-green-600'>
                    {formatPrice(
                      venue.pricing.basePrice,
                      venue.pricing.currency
                    )}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Rating</span>
                  <div className='flex items-center'>
                    <Star className='h-4 w-4 text-yellow-500 mr-1' />
                    <span className='font-semibold'>
                      {venue.rating.average.toFixed(1)}
                    </span>
                    <span className='text-sm text-gray-500 ml-1'>
                      ({venue.rating.count})
                    </span>
                  </div>
                </div>

                {venue.featured && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Status</span>
                    <span className='bg-yellow-500 text-white'>Featured</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div>
                <h3>Amenities</h3>
              </div>
              <div>
                <div className='flex flex-wrap gap-2'>
                  {venue.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
