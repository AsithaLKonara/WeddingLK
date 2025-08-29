'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';

export default function RoleBasedDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else if (status === 'unauthenticated') {
      router.push('/login');
    } else {
      setIsLoading(false);

      // Smart routing based on user role
      if (session?.user?.role) {
        const userRole = session.user.role;

        // Redirect users to their appropriate dashboard
        if (
          userRole === 'vendor' &&
          window.location.pathname === '/dashboard'
        ) {
          router.push('/dashboard/vendor');
          return;
        } else if (
          userRole === 'admin' &&
          window.location.pathname === '/dashboard'
        ) {
          router.push('/dashboard/admin');
          return;
        }
      }
    }
  }, [status, router, session]);

  // Show loading state
  if (isLoading || status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-full max-w-md'>
          <div>
            <h3>Authentication Required</h3>
          </div>
          <div className='space-y-4'>
            <Link
              href='/login'
              className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center block'
            >
              Login to Dashboard
            </Link>
            <Link
              href='/register'
              className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 w-full block text-center'
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user;
  const userRole = user.role || 'user';

  // Role-based dashboard selection
  const getRoleBasedDashboard = () => {
    switch (userRole) {
      case 'vendor':
        return {
          title: 'Vendor Dashboard',
          description: 'Manage your business, services, and bookings',
          icon: Store,
          primaryAction: '/dashboard/vendor',
          primaryActionText: 'Go to Vendor Dashboard',
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Platform administration and oversight',
          icon: Shield,
          primaryAction: '/dashboard/admin',
          primaryActionText: 'Go to Admin Dashboard',
        };
      default:
        return {
          title: 'Wedding Planning Dashboard',
          description: 'Plan your perfect wedding with our tools',
          icon: LayoutDashboard,
          primaryAction: '/planning',
          primaryActionText: 'Start Planning',
        };
    }
  };

  const roleDashboard = getRoleBasedDashboard();
  const RoleIcon = roleDashboard.icon;

  return (
    <div className='container mx-auto py-8 px-4 md:px-6'>
      {/* Role-based Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <div className='p-3 bg-blue-100 rounded-full'>
            <RoleIcon className='h-8 w-8 text-blue-600' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{roleDashboard.title}</h1>
            <p className='text-gray-600 mt-2'>{roleDashboard.description}</p>
            <p className='text-sm text-gray-500 mt-1'>
              Welcome back, {user?.name || user?.email || 'User'}!
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            <Bell className='h-5 w-5' />
          </button>
          <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Role-based Quick Actions */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Primary Action button */}
          <Link
            href={roleDashboard.primaryAction}
            className='h-24 flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg'
          >
            <RoleIcon className='h-6 w-6 mb-2' />
            {roleDashboard.primaryActionText}
          </Link>

          {/* Role-specific actions */}
          {userRole === 'user' && (
            <>
              <Link
                href='/planning?tab=checklist'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <CheckSquare className='h-6 w-6 mb-2' />
                Wedding Checklist
              </Link>
              <Link
                href='/dashboard/messages'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <MessageCircle className='h-6 w-6 mb-2' />
                Messages
              </Link>
              <Link
                href='/planning?tab=budget-tracker'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <DollarSign className='h-6 w-6 mb-2' />
                Budget Tracker
              </Link>
            </>
          )}

          {userRole === 'vendor' && (
            <>
              <Link
                href='/dashboard/vendor?tab=bookings'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <div className='h-6 w-6 mb-2' />
                Manage Bookings
              </Link>
              <Link
                href='/dashboard/vendor?tab=services'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <Store className='h-6 w-6 mb-2' />
                My Services
              </Link>
              <Link
                href='/dashboard/vendor?tab=analytics'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <TrendingUp className='h-6 w-6 mb-2' />
                Analytics
              </Link>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <Link
                href='/dashboard/admin?tab=users'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <Users className='h-6 w-6 mb-2' />
                User Management
              </Link>
              <Link
                href='/dashboard/admin?tab=vendors'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <Store className='h-6 w-6 mb-2' />
                Vendor Management
              </Link>
              <Link
                href='/dashboard/admin?tab=analytics'
                className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-24'
              >
                <TrendingUp className='h-6 w-6 mb-2' />
                Platform Analytics
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Role-based Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {userRole === 'user' && (
          <>
            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Upcoming Events</h3>
                <div className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>2</div>
                <p className='text-xs text-muted-foreground'>
                  Next event in 3 days
                </p>
                <Link
                  href='/planning?tab=calendar'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View div
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Guest List</h3>
                <Users className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>150</div>
                <p className='text-xs text-muted-foreground'>RSVPs received</p>
                <Link
                  href='/planning?tab=guest-list'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  Manage Guests
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Budget Spent</h3>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>LKR 450,000</div>
                <p className='text-xs text-muted-foreground'>
                  75% of budget used
                </p>
                <Link
                  href='/planning?tab=budget-tracker'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Budget
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Tasks Completed</h3>
                <CheckSquare className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>18/25</div>
                <p className='text-xs text-muted-foreground'>72% complete</p>
                <Link
                  href='/planning?tab=checklist'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Tasks
                </Link>
              </div>
            </div>
          </>
        )}

        {userRole === 'vendor' && (
          <>
            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Total Bookings</h3>
                <div className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>32</div>
                <p className='text-xs text-muted-foreground'>
                  +15% from last month
                </p>
                <Link
                  href='/dashboard/vendor?tab=bookings'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Bookings
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Total Revenue</h3>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>LKR 1,250,000</div>
                <p className='text-xs text-muted-foreground'>Avg: LKR 39,000</p>
                <Link
                  href='/dashboard/vendor?tab=analytics'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Analytics
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Avg Rating</h3>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>4.7</div>
                <p className='text-xs text-muted-foreground'>18 reviews</p>
                <Link
                  href='/dashboard/vendor?tab=reviews'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Reviews
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Active Services</h3>
                <Store className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>8</div>
                <p className='text-xs text-muted-foreground'>All available</p>
                <Link
                  href='/dashboard/vendor?tab=services'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  Manage Services
                </Link>
              </div>
            </div>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Total Users</h3>
                <Users className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>1,247</div>
                <p className='text-xs text-muted-foreground'>
                  +12.5% from last month
                </p>
                <Link
                  href='/dashboard/admin?tab=users'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  Manage Users
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Total Vendors</h3>
                <Store className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>89</div>
                <p className='text-xs text-muted-foreground'>
                  23 pending approval
                </p>
                <Link
                  href='/dashboard/admin?tab=vendors'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  Manage Vendors
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Total Bookings</h3>
                <div className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>342</div>
                <p className='text-xs text-muted-foreground'>This month</p>
                <Link
                  href='/dashboard/admin?tab=bookings'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Bookings
                </Link>
              </div>
            </div>

            <div>
              <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <h3 className='text-sm font-medium'>Platform Revenue</h3>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </div>
              <div>
                <div className='text-2xl font-bold'>LKR 1,250,000</div>
                <p className='text-xs text-muted-foreground'>This month</p>
                <Link
                  href='/dashboard/admin?tab=analytics'
                  className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                >
                  View Analytics
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Role-based Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <div>
            <h3 className='flex items-center'>
              <TrendingUp className='h-5 w-5 mr-2' />
              Recent Activity
            </h3>
          </div>
          <div>
            <div className='space-y-4'>
              {userRole === 'user' && (
                <>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        Venue booking confirmed
                      </p>
                      <p className='text-xs text-gray-500'>2 hours ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        Photographer payment received
                      </p>
                      <p className='text-xs text-gray-500'>1 day ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Guest list updated</p>
                      <p className='text-xs text-gray-500'>2 days ago</p>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'vendor' && (
                <>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        New booking received
                      </p>
                      <p className='text-xs text-gray-500'>1 hour ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>Payment received</p>
                      <p className='text-xs text-gray-500'>3 hours ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>New review posted</p>
                      <p className='text-xs text-gray-500'>1 day ago</p>
                    </div>
                  </div>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        New vendor application
                      </p>
                      <p className='text-xs text-gray-500'>30 minutes ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        User account suspended
                      </p>
                      <p className='text-xs text-gray-500'>2 hours ago</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        System backup completed
                      </p>
                      <p className='text-xs text-gray-500'>6 hours ago</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div>
            <h3>Quick Navigation</h3>
          </div>
          <div>
            <div className='space-y-4'>
              {userRole === 'user' && (
                <>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Wedding Planning</p>
                      <p className='text-xs text-gray-500'>
                        Manage your wedding details
                      </p>
                    </div>
                    <Link href='/planning' className='px-3 py-1 text-sm'>
                      Go to Planning
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Vendor Search</p>
                      <p className='text-xs text-gray-500'>
                        Find wedding services
                      </p>
                    </div>
                    <Link href='/vendors' className='px-3 py-1 text-sm'>
                      Browse Vendors
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Venue Search</p>
                      <p className='text-xs text-gray-500'>
                        Find wedding venues
                      </p>
                    </div>
                    <Link href='/venues' className='px-3 py-1 text-sm'>
                      Browse Venues
                    </Link>
                  </div>
                </>
              )}

              {userRole === 'vendor' && (
                <>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Service Management</p>
                      <p className='text-xs text-gray-500'>
                        Manage your services
                      </p>
                    </div>
                    <Link
                      href='/dashboard/vendor?tab=services'
                      className='px-3 py-1 text-sm'
                    >
                      Manage Services
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Booking div</p>
                      <p className='text-xs text-gray-500'>
                        View your schedule
                      </p>
                    </div>
                    <Link
                      href='/dashboard/vendor?tab=calendar'
                      className='px-3 py-1 text-sm'
                    >
                      View div
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Business Profile</p>
                      <p className='text-xs text-gray-500'>
                        Update your profile
                      </p>
                    </div>
                    <Link
                      href='/dashboard/vendor/onboarding'
                      className='px-3 py-1 text-sm'
                    >
                      Update Profile
                    </Link>
                  </div>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>User Management</p>
                      <p className='text-xs text-gray-500'>
                        Manage platform users
                      </p>
                    </div>
                    <Link
                      href='/dashboard/admin?tab=users'
                      className='px-3 py-1 text-sm'
                    >
                      Manage Users
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Vendor Approval</p>
                      <p className='text-xs text-gray-500'>
                        Review applications
                      </p>
                    </div>
                    <Link
                      href='/dashboard/admin?tab=vendors'
                      className='px-3 py-1 text-sm'
                    >
                      Review Vendors
                    </Link>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Platform Analytics</p>
                      <p className='text-xs text-gray-500'>View system stats</p>
                    </div>
                    <Link
                      href='/dashboard/admin?tab=analytics'
                      className='px-3 py-1 text-sm'
                    >
                      View Analytics
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
