'use client';

import { useState, useEffect } from 'react';
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

export default function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/dashboard/user/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className='p-8'>
          <div className='flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
            <span className='ml-2'>Loading bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4'>
        <h2 className='flex items-center text-lg font-semibold'>
          <div className='h-5 w-5 mr-2' />
          Your Bookings
        </h2>
      </div>
      <div>
        {bookings.length > 0 ? (
          <div className='space-y-4'>
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <div className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium'>
                      {booking.venue?.name || 'Vendor Service'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>
                    LKR {booking.totalAmount?.toLocaleString()}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <div className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p>No bookings yet</p>
            <p className='text-sm'>
              Start planning your wedding by booking venues and vendors
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
