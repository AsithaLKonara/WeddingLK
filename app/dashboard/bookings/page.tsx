'use client';

import { useState } from 'react';

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

export default function BookingsPage() {
  const [bookings] = useState([
    {
      id: '1',
      venueId: '1',
      venueName: 'Galle Face Hotel',
      venueImage: '/placeholder.svg?height=100&width=150',
      date: '2024-06-15',
      guests: 150,
      status: 'confirmed',
      totalAmount: 450000,
      createdAt: '2024-01-15',
      contactPerson: 'Arjun Mendis',
      phone: '+94 77 123 4567',
      email: 'arjun@example.com',
    },
    {
      id: '2',
      venueId: '2',
      venueName: 'Cinnamon Grand Colombo',
      venueImage: '/placeholder.svg?height=100&width=150',
      date: '2024-07-20',
      guests: 200,
      status: 'pending',
      totalAmount: 650000,
      createdAt: '2024-01-20',
      contactPerson: 'Kavitha Rajapaksa',
      phone: '+94 77 987 6543',
      email: 'kavitha@example.com',
    },
    {
      id: '3',
      venueId: '3',
      venueName: 'Jetwing Lighthouse',
      venueImage: '/placeholder.svg?height=100&width=150',
      date: '2024-08-10',
      guests: 120,
      status: 'cancelled',
      totalAmount: 380000,
      createdAt: '2024-01-25',
      contactPerson: 'Dinesh Wickramasinghe',
      phone: '+94 77 555 1234',
      email: 'dinesh@example.com',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>My Bookings</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your venue bookings and track their status
        </p>
      </div>

      <div className='space-y-6'>
        {bookings.map(booking => (
          <div key={booking.id} className='overflow-hidden'>
            <div className='p-0'>
              <div className='flex flex-col md:flex-row'>
                {/* Venue Image */}
                <div className='md:w-48 h-48 md:h-auto'>
                  <img
                    src={booking.venueImage || '/placeholder.svg'}
                    alt={booking.venueName}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Booking Details */}
                <div className='flex-1 p-6'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>
                        {booking.venueName}
                      </h3>
                      <span className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                    <div className='text-right mt-4 md:mt-0'>
                      <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                        LKR {booking.totalAmount.toLocaleString()}
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Booked on{' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='h-4 w-4 text-gray-400' />
                      <span className='text-sm'>
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Users className='h-4 w-4 text-gray-400' />
                      <span className='text-sm'>{booking.guests} Guests</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Phone className='h-4 w-4 text-gray-400' />
                      <span className='text-sm'>{booking.phone}</span>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <Link href={`/venues/${booking.venueId}`}>
                      <button className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm'>
                        <Eye className='h-4 w-4 mr-2' />
                        View Venue
                      </button>
                    </Link>
                    <button className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm'>
                      <Download className='h-4 w-4 mr-2' />
                      Download Receipt
                    </button>
                    {booking.status === 'pending' && (
                      <button className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm'>
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button className='px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-md text-sm'>
                        Contact Venue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className='text-center py-12'>
          <div>
            <div className='h-12 w-12 mx-auto mb-4 text-gray-400' />
            <h3 className='text-lg font-medium mb-2'>No bookings yet</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Start planning your dream wedding by booking a venue
            </p>
            <Link href='/venues'>
              <button className='px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-md'>
                Browse Venues
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
