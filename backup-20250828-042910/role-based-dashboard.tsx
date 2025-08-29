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
          <divHeader>
            <divTitle>Authentication Required</divTitle>
          </divHeader>
          <divContent className='space-y-4'>
            <button asChild className='w-full'>
              <Link href='/login'>Login to Dashboard</Link>
            </button>
            <button variant='outline' asChild className='w-full'>
              <Link href='/register'>Create Account</Link>
            </button>
          </divContent>
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
          <button variant='outline' size='icon'>
            <Bell className='h-5 w-5' />
          </button>
          <button variant='outline' size='icon'>
            <Settings className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Role-based Quick Actions */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Primary Action button */}
          <button
            asChild
            className='h-24 flex flex-col justify-center items-center bg-blue-600 hover:bg-blue-700'
          >
            <Link href={roleDashboard.primaryAction}>
              <RoleIcon className='h-6 w-6 mb-2' />
              {roleDashboard.primaryActionText}
            </Link>
          </button>

          {/* Role-specific actions */}
          {userRole === 'user' && (
            <>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/planning?tab=checklist'>
                  <CheckSquare className='h-6 w-6 mb-2' />
                  Wedding Checklist
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/messages'>
                  <MessageCircle className='h-6 w-6 mb-2' />
                  Messages
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/planning?tab=budget-tracker'>
                  <DollarSign className='h-6 w-6 mb-2' />
                  Budget Tracker
                </Link>
              </button>
            </>
          )}

          {userRole === 'vendor' && (
            <>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/vendor?tab=bookings'>
                  <div className='h-6 w-6 mb-2' />
                  Manage Bookings
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/vendor?tab=services'>
                  <Store className='h-6 w-6 mb-2' />
                  My Services
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/vendor?tab=analytics'>
                  <TrendingUp className='h-6 w-6 mb-2' />
                  Analytics
                </Link>
              </button>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/admin?tab=users'>
                  <Users className='h-6 w-6 mb-2' />
                  User Management
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/admin?tab=vendors'>
                  <Store className='h-6 w-6 mb-2' />
                  Vendor Management
                </Link>
              </button>
              <button
                asChild
                variant='outline'
                className='h-24 flex flex-col justify-center items-center'
              >
                <Link href='/dashboard/admin?tab=analytics'>
                  <TrendingUp className='h-6 w-6 mb-2' />
                  Platform Analytics
                </Link>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Role-based Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {userRole === 'user' && (
          <>
            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Upcoming Events
                </divTitle>
                <div className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>2</div>
                <p className='text-xs text-muted-foreground'>
                  Next event in 3 days
                </p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/planning?tab=calendar'>View div</Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>Guest List</divTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>150</div>
                <p className='text-xs text-muted-foreground'>RSVPs received</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/planning?tab=guest-list'>Manage Guests</Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Budget Spent
                </divTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>LKR 450,000</div>
                <p className='text-xs text-muted-foreground'>
                  75% of budget used
                </p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/planning?tab=budget-tracker'>View Budget</Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Tasks Completed
                </divTitle>
                <CheckSquare className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>18/25</div>
                <p className='text-xs text-muted-foreground'>72% complete</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/planning?tab=checklist'>View Tasks</Link>
                </button>
              </divContent>
            </div>
          </>
        )}

        {userRole === 'vendor' && (
          <>
            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Total Bookings
                </divTitle>
                <div className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>32</div>
                <p className='text-xs text-muted-foreground'>
                  +15% from last month
                </p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/vendor?tab=bookings'>
                    View Bookings
                  </Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Total Revenue
                </divTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>LKR 1,250,000</div>
                <p className='text-xs text-muted-foreground'>Avg: LKR 39,000</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/vendor?tab=analytics'>
                    View Analytics
                  </Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>Avg Rating</divTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>4.7</div>
                <p className='text-xs text-muted-foreground'>18 reviews</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/vendor?tab=reviews'>View Reviews</Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Active Services
                </divTitle>
                <Store className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>8</div>
                <p className='text-xs text-muted-foreground'>All available</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/vendor?tab=services'>
                    Manage Services
                  </Link>
                </button>
              </divContent>
            </div>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>Total Users</divTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>1,247</div>
                <p className='text-xs text-muted-foreground'>
                  +12.5% from last month
                </p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/admin?tab=users'>Manage Users</Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Total Vendors
                </divTitle>
                <Store className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>89</div>
                <p className='text-xs text-muted-foreground'>
                  23 pending approval
                </p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/admin?tab=vendors'>
                    Manage Vendors
                  </Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Total Bookings
                </divTitle>
                <div className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>342</div>
                <p className='text-xs text-muted-foreground'>This month</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/admin?tab=bookings'>
                    View Bookings
                  </Link>
                </button>
              </divContent>
            </div>

            <div>
              <divHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <divTitle className='text-sm font-medium'>
                  Platform Revenue
                </divTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </divHeader>
              <divContent>
                <div className='text-2xl font-bold'>LKR 1,250,000</div>
                <p className='text-xs text-muted-foreground'>This month</p>
                <button asChild variant='link' className='p-0 h-auto mt-2'>
                  <Link href='/dashboard/admin?tab=analytics'>
                    View Analytics
                  </Link>
                </button>
              </divContent>
            </div>
          </>
        )}
      </div>

      {/* Role-based Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <divHeader>
            <divTitle className='flex items-center'>
              <TrendingUp className='h-5 w-5 mr-2' />
              Recent Activity
            </divTitle>
          </divHeader>
          <divContent>
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
          </divContent>
        </div>

        <div>
          <divHeader>
            <divTitle>Quick Navigation</divTitle>
          </divHeader>
          <divContent>
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
                    <button size='sm' variant='outline' asChild>
                      <Link href='/planning'>Go to Planning</Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Vendor Search</p>
                      <p className='text-xs text-gray-500'>
                        Find wedding services
                      </p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/vendors'>Browse Vendors</Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Venue Search</p>
                      <p className='text-xs text-gray-500'>
                        Find wedding venues
                      </p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/venues'>Browse Venues</Link>
                    </button>
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
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/vendor?tab=services'>
                        Manage Services
                      </Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Booking div</p>
                      <p className='text-xs text-gray-500'>
                        View your schedule
                      </p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/vendor?tab=calendar'>
                        View div
                      </Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Business Profile</p>
                      <p className='text-xs text-gray-500'>
                        Update your profile
                      </p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/vendor/onboarding'>
                        Update Profile
                      </Link>
                    </button>
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
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/admin?tab=users'>
                        Manage Users
                      </Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Vendor Approval</p>
                      <p className='text-xs text-gray-500'>
                        Review applications
                      </p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/admin?tab=vendors'>
                        Review Vendors
                      </Link>
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Platform Analytics</p>
                      <p className='text-xs text-gray-500'>View system stats</p>
                    </div>
                    <button size='sm' variant='outline' asChild>
                      <Link href='/dashboard/admin?tab=analytics'>
                        View Analytics
                      </Link>
                    </button>
                  </div>
                </>
              )}
            </div>
          </divContent>
        </div>
      </div>
    </div>
  );
}
