'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Triangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

interface DashboardStats {
  _totalUsers: number;
  _totalVendors: number;
  _totalVenues: number;
  _totalBookings: number;
  _totalRevenue: number;
  _pendingApprovals: number;
  _activeUsers: number;
  _conversionRate: number;
}

interface User {
  _id: string;
  _name: string;
  _email: string;
  _role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: Date;
  lastActive: Date;
  _verified: boolean;
}

interface Vendor {
  _id: string;
  _name: string;
  _category: string;
  status: 'approved' | 'pending' | 'rejected';
  _rating: number;
  _reviewCount: number;
  joinDate: Date;
  _verified: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    conversionRate: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setselectedStatus] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockStats: DashboardStats = {
      totalUsers: 1247,
      totalVendors: 89,
      totalVenues: 156,
      totalBookings: 2341,
      totalRevenue: 45678900,
      pendingApprovals: 23,
      activeUsers: 892,
      conversionRate: 12.5,
    };

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'user',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(),
        verified: true,
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'user',
        status: 'active',
        joinDate: new Date('2024-02-20'),
        lastActive: new Date(),
        verified: true,
      },
    ];

    const mockVendors: Vendor[] = [
      {
        id: '1',
        name: 'Elegant Events',
        category: 'Event Planning',
        status: 'approved',
        rating: 4.8,
        reviewCount: 127,
        joinDate: new Date('2024-01-10'),
        verified: true,
      },
      {
        id: '2',
        name: 'Perfect Photography',
        category: 'Photography',
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        joinDate: new Date('2024-03-15'),
        verified: false,
      },
    ];

    setStats(mockStats);
    setUsers(mockUsers);
    setVendors(mockVendors);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-32 bg-gray-200 dark:bg-gray-700 rounded'
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Admin Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Manage your wedding platform and monitor performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600 dark:text-blue-400' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Users
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 dark:bg-green-900 rounded-lg'>
                <Building2 className='h-6 w-6 text-green-600 dark:text-green-400' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Vendors
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalVendors.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 dark:bg-purple-900 rounded-lg'>
                <div className='h-6 w-6 text-purple-600 dark:text-purple-400' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Bookings
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg'>
                <DollarSign className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Revenue
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Rs. {(stats.totalRevenue / 100000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Quick Actions
          </h2>
          <div className='flex flex-wrap gap-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center'>
              <Plus className='h-4 w-4 mr-2' />
              Add User
            </button>
            <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center'>
              <Plus className='h-4 w-4 mr-2' />
              Add Vendor
            </button>
            <button className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center'>
              <Download className='h-4 w-4 mr-2' />
              Export Data
            </button>
            <button className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh
            </button>
          </div>
        </div>

        {/* Recent Users */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Recent Users
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Name
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Email
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Status
                  </th>
                  <th className='text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    className='border-b border-gray-100 dark:border-gray-800'
                  >
                    <td className='py-3 px-4 text-sm text-gray-900 dark:text-white'>
                      {user.name}
                    </td>
                    <td className='py-3 px-4 text-sm text-gray-600 dark:text-gray-300'>
                      {user.email}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : user.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex space-x-2'>
                        <button className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                          <Eye className='h-4 w-4' />
                        </button>
                        <button className='text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'>
                          <Edit className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
