'use client';

import { useState, useEffect, useCallback } from 'react';
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
import Link from 'next/link';

interface Venue {
  _id: string;
  _name: string;
  _description: string;
  location: {
    _city: string;
    _province: string;
  };
  capacity: {
    _min: number;
    _max: number;
  };
  pricing: {
    _basePrice: number;
    _perPerson: number;
    _minimumGuests: number;
  };
  _amenities: string[];
  reviewStats: {
    _averageRating: number;
    _count: number;
  };
  _isActive: boolean;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setselectedLocation] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [minRating, setMinRating] = useState('');

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '20',
        offset: '0',
      });

      if (selectedLocation) params.append('location', selectedLocation);
      if (minCapacity) params.append('minCapacity', minCapacity);
      if (maxCapacity) params.append('maxCapacity', maxCapacity);
      if (minRating) params.append('minRating', minRating);
      if (searchQuery) params.append('q', searchQuery);

      const response = await fetch(`/api/venues/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues);
      }
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, minCapacity, maxCapacity, minRating, searchQuery]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVenues();
  };

  const handleReset = () => {
    setSearchQuery('');
    setselectedLocation('');
    setMinCapacity('');
    setMaxCapacity('');
    setMinRating('');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl font-bold mb-4'>
            Discover Perfect Wedding Venues
          </h1>
          <p className='text-xl text-purple-100 max-w-2xl mx-auto'>
            From intimate gardens to grand ballrooms, find the perfect setting
            for your special day
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* Search and Filters */}
        <div className='mb-8'>
          <div className='mb-4'>
            <h3 className='flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-2'>
              <Search className='h-5 w-5' />
              <span>Search & Filter Venues</span>
            </h3>
            <p className='text-gray-600 mb-4'>
              Find venues by location, capacity, rating, or search terms
            </p>
          </div>
          <div>
            <form onSubmit={handleSearch} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                <div>
                  <input
                    placeholder='Search venues or locations...'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={e => setselectedLocation(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                >
                  <option value=''>All Locations</option>
                  <option value='Colombo'>Colombo</option>
                  <option value='Kandy'>Kandy</option>
                  <option value='Galle'>Galle</option>
                  <option value='Jaffna'>Jaffna</option>
                  <option value='Anuradhapura'>Anuradhapura</option>
                </select>
                <input
                  type='number'
                  placeholder='Min Capacity'
                  value={minCapacity}
                  onChange={e => setMinCapacity(e.target.value)}
                />
                <input
                  type='number'
                  placeholder='Max Capacity'
                  value={maxCapacity}
                  onChange={e => setMaxCapacity(e.target.value)}
                />
                <select
                  value={minRating}
                  onChange={e => setMinRating(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value=''>Any Rating</option>
                  <option value='4'>4+ Stars</option>
                  <option value='4.5'>4.5+ Stars</option>
                  <option value='5'>5 Stars</option>
                </select>
              </div>

              <div className='flex justify-between items-center'>
                <button type='submit' className='flex items-center space-x-2'>
                  <Search className='h-4 w-4' />
                  <span>Search</span>
                </button>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                  onClick={handleReset}
                >
                  Reset Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {loading ? 'Loading...' : `${venues.length} Venues Found`}
            </h2>
            <div className='text-sm text-gray-600'>
              Showing {venues.length} results
            </div>
          </div>

          {loading ? (
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Searching for venues...</p>
            </div>
          ) : venues.length === 0 ? (
            <div className='text-center py-12'>
              <div className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No venues found
              </h3>
              <p className='text-gray-600 mb-4'>
                Try adjusting your search criteria or browse all locations
              </p>
              <button onClick={handleReset}>Reset Filters</button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {venues.map((_venue: any) => (
                <div
                  key={venue._id}
                  className='hover:shadow-lg transition-shadow duration-300'
                >
                  <div className='pb-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                      {venue.name}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {venue.location.city}, {venue.location.province}
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <p className='text-gray-700 text-sm line-clamp-3'>
                      {venue.description}
                    </p>

                    <div className='flex items-center space-x-2'>
                      <Star className='h-4 w-4 text-yellow-500 fill-current' />
                      <span className='text-sm font-medium text-gray-900'>
                        {venue.reviewStats.averageRating}
                      </span>
                      <span className='text-sm text-gray-500'>
                        ({venue.reviewStats.count} reviews)
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <Users className='h-4 w-4 text-blue-600' />
                        <span className='text-gray-700'>
                          {venue.capacity.min}-{venue.capacity.max} guests
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <DollarSign className='h-4 w-4 text-green-600' />
                        <span className='text-gray-700'>
                          From LKR {venue.pricing.basePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className='text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full'
                        >
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className='text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded-full'>
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className='pt-4'>
                      <Link href={`/venues/${venue._id}`}>
                        <button className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                          View Venue
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Locations */}
        <div>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Popular Locations
            </h3>
            <p className='text-gray-600 mb-4'>
              Browse venues by popular wedding destinations
            </p>
          </div>
          <div>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {[
                { name: 'Colombo', count: '50+' },
                { name: 'Kandy', count: '30+' },
                { name: 'Galle', count: '25+' },
                { name: 'Jaffna', count: '20+' },
                { name: 'Anuradhapura', count: '15+' },
                { name: 'Other Cities', count: '40+' },
              ].map(location => (
                <Link
                  key={location.name}
                  href={`/venues?location=${location.name}`}
                >
                  <div className='text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {location.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {location.count} venues
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
