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
import Link from 'next/link';

interface DashboardStats {
  overview: {
    totalBookings: number;
    totalTasks: number;
    totalVendors: number;
    totalVenues: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'task';
  title: string;
  status: string;
  date: string;
  amount?: number;
  priority?: string;
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    overview: {
      totalBookings: 0,
      totalTasks: 0,
      totalVendors: 0,
      totalVenues: 0,
    },
    tasks: {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
    },
    bookings: {
      total: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
    },
    budget: {
      total: 0,
      spent: 0,
      remaining: 0,
    },
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const statsResponse = await fetch('/api/dashboard/user-stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/dashboard/recent-activity');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activities);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Overview divs */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Total Bookings</h3>
            <div className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>
              {stats.overview.totalBookings}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.bookings.confirmed} confirmed
            </p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Total Tasks</h3>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>
              {stats.overview.totalTasks}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.tasks.completed} completed
            </p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Total Vendors</h3>
            <Users className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>
              {stats.overview.totalVendors}
            </div>
            <p className='text-xs text-muted-foreground'>Working with you</p>
          </div>
        </div>

        <div>
          <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <h3 className='text-sm font-medium'>Budget Used</h3>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </div>
          <div>
            <div className='text-2xl font-bold'>
              LKR {stats.budget.spent.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>
              of LKR {stats.budget.total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* div divs */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div>
            <h3>Task div</h3>
            <p>Track your wedding planning tasks</p>
          </div>
          <div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Overall div</span>
                <span className='text-sm text-gray-500'>
                  {Math.round(
                    (stats.tasks.completed / Math.max(stats.tasks.total, 1)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div
                value={
                  (stats.tasks.completed / Math.max(stats.tasks.total, 1)) * 100
                }
              />

              <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.tasks.completed}
                  </div>
                  <div className='text-sm text-gray-600'>Completed</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-yellow-600'>
                    {stats.tasks.pending}
                  </div>
                  <div className='text-sm text-gray-600'>Pending</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-red-600'>
                    {stats.tasks.overdue}
                  </div>
                  <div className='text-sm text-gray-600'>Overdue</div>
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <Link href='/dashboard/planner'>
                <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full'>
                  View All Tasks
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div>
            <h3>Booking Status</h3>
            <p>Overview of your venue and vendor bookings</p>
          </div>
          <div>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats.bookings.confirmed}
                  </div>
                  <div className='text-sm text-gray-600'>Confirmed</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-yellow-600'>
                    {stats.bookings.pending}
                  </div>
                  <div className='text-sm text-gray-600'>Pending</div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Confirmed Bookings</span>
                  <span className='font-medium'>
                    {stats.bookings.confirmed}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Pending Bookings</span>
                  <span className='font-medium'>{stats.bookings.pending}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span>Completed Bookings</span>
                  <span className='font-medium'>
                    {stats.bookings.completed}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <Link href='/dashboard/bookings'>
                <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full'>
                  View All Bookings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div>
          <h3>Recent Activity</h3>
          <p>Your latest bookings and task updates</p>
        </div>
        <div>
          <div className='space-y-4'>
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className='flex items-center justify-between p-3 border rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === 'booking'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {activity.type === 'booking' ? (
                        <div className='h-4 w-4' />
                      ) : (
                        <CheckCircle className='h-4 w-4' />
                      )}
                    </div>
                    <div>
                      <p className='font-medium'>{activity.title}</p>
                      <p className='text-sm text-gray-500'>
                        {activity.type === 'booking' ? 'Booking' : 'Task'} •{' '}
                        {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'confirmed' ||
                        activity.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'pending'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                    {activity.amount && (
                      <span className='text-sm font-medium text-green-600'>
                        LKR {activity.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : activity.priority === 'high'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {activity.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>No recent activity</p>
                <p className='text-sm'>Your activity will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div>
          <h3>Quick Actions</h3>
          <p>Common tasks and shortcuts</p>
        </div>
        <div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Link href='/vendors'>
              <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full h-20 flex flex-col items-center justify-center space-y-2'>
                <Users className='h-6 w-6' />
                <span className='text-sm'>Find Vendors</span>
              </button>
            </Link>

            <Link href='/venues'>
              <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full h-20 flex flex-col items-center justify-center space-y-2'>
                <div className='h-6 w-6' />
                <span className='text-sm'>Book Venue</span>
              </button>
            </Link>

            <Link href='/dashboard/planner'>
              <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full h-20 flex flex-col items-center justify-center space-y-2'>
                <CheckCircle className='h-6 w-6' />
                <span className='text-sm'>View Tasks</span>
              </button>
            </Link>

            <Link href='/dashboard/bookings'>
              <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full h-20 flex flex-col items-center justify-center space-y-2'>
                <TrendingUp className='h-6 w-6' />
                <span className='text-sm'>Bookings</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
