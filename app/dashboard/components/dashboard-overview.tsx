'use client';

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

interface DashboardOverviewProps {
  stats: {
    _totalBookings: number;
    _totalFavorites: number;
    _totalMessages: number;
    _totalPayments: number;
  };
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className='space-y-6'>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Total Bookings</h3>
            <div className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>{stats.totalBookings}</div>
            <p className='text-xs text-muted-foreground'>Venues & vendors</p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Favorites</h3>
            <Heart className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>{stats.totalFavorites}</div>
            <p className='text-xs text-muted-foreground'>Saved items</p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Messages</h3>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>{stats.totalMessages}</div>
            <p className='text-xs text-muted-foreground'>Unread messages</p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Payments</h3>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>{stats.totalPayments}</div>
            <p className='text-xs text-muted-foreground'>Total transactions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold'>Quick Actions</h3>
        </div>
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'>
              <h3 className='font-medium mb-2'>Find Venues</h3>
              <p className='text-sm text-gray-600'>Browse wedding venues</p>
            </div>
            <div className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'>
              <h3 className='font-medium mb-2'>Find Vendors</h3>
              <p className='text-sm text-gray-600'>Browse wedding services</p>
            </div>
            <div className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'>
              <h3 className='font-medium mb-2'>Wedding Planning</h3>
              <p className='text-sm text-gray-600'>Use planning tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
