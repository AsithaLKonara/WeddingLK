'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  MapPin,
  Users,
  CreditCard,
  Bookmark,
  MessageSquare,
  Settings,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/templates/dashboard-layout';

interface UserStats {
  _totalBookings: number;
  _upcomingEvents: number;
  _completedEvents: number;
  _totalSpent: number;
  _savedVenues: number;
  _savedVendors: number;
  _daysUntilWedding: number;
  _planningdiv: number;
}

interface Booking {
  _id: string;
  type: 'venue' | 'vendor' | 'package';
  _name: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  _amount: number;
  _location: string;
  _description: string;
}

interface SavedItem {
  _id: string;
  type: 'venue' | 'vendor';
  _name: string;
  _image: string;
  _location: string;
  _rating: number;
  _price: string;
  _description: string;
}

interface Task {
  _id: string;
  _title: string;
  _description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  _category: string;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalSpent: 0,
    savedVenues: 0,
    savedVendors: 0,
    daysUntilWedding: 0,
    planningdiv: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // TODO: Replace with real API calls
      const mockStats: UserStats = {
        totalBookings: 3,
        upcomingEvents: 2,
        completedEvents: 1,
        totalSpent: 1250000,
        savedVenues: 8,
        savedVendors: 12,
        daysUntilWedding: 45,
        planningdiv: 65,
      };

      const mockBookings: Booking[] = [
        {
          id: '1',
          type: 'venue',
          name: 'Grand Ballroom Hotel',
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'confirmed',
          amount: 850000,
          location: 'Colombo, Sri Lanka',
          description: 'Main wedding venue with catering and decoration',
        },
        {
          id: '2',
          type: 'vendor',
          name: 'Perfect Moments Photography',
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'confirmed',
          amount: 250000,
          location: 'Colombo, Sri Lanka',
          description: 'Wedding photography and videography package',
        },
        {
          id: '3',
          type: 'vendor',
          name: 'Sweet Dreams Catering',
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: 'pending',
          amount: 150000,
          location: 'Colombo, Sri Lanka',
          description: 'Wedding catering for 150 guests',
        },
      ];

      const mockSavedItems: SavedItem[] = [
        {
          id: '1',
          type: 'venue',
          name: 'Garden Palace',
          image: '/venues/garden-palace.jpg',
          location: 'Kandy, Sri Lanka',
          rating: 4.6,
          price: 'LKR 450,000',
          description: 'Beautiful outdoor garden venue with natural beauty',
        },
        {
          id: '2',
          type: 'vendor',
          name: 'Elegant Decorators',
          image: '/vendors/elegant-decorators.jpg',
          location: 'Colombo, Sri Lanka',
          rating: 4.8,
          price: 'LKR 200,000',
          description: 'Creative wedding decoration and floral arrangements',
        },
      ];

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Book wedding cake vendor',
          description: 'Research and book wedding cake vendor',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          status: 'pending',
          category: 'Vendor Booking',
        },
        {
          id: '2',
          title: 'Send wedding invitations',
          description: 'Design and send wedding invitations to guests',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          status: 'pending',
          category: 'Planning',
        },
        {
          id: '3',
          title: 'Finalize wedding playlist',
          description: 'Create final wedding ceremony and reception playlist',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          priority: 'low',
          status: 'pending',
          category: 'Entertainment',
        },
      ];

      setStats(mockStats);
      setBookings(mockBookings);
      setSavedItems(mockSavedItems);
      setTasks(mockTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (_amount: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (_status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (_status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getPriorityColor = (_priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title='My Dashboard'
      description='Your wedding planning journey'
    >
      <div className='space-y-6'>
        {/* Wedding Countdown */}
        <div className='bg-gradient-to-r from-pink-500 to-purple-600 text-white'>
          <div className='pt-6'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold mb-2'>Your Wedding Day</h2>
              <div className='text-4xl font-bold mb-2'>
                {stats.daysUntilWedding}
              </div>
              <p className='text-lg'>days to go!</p>
              <div className='mt-4'>
                <div className='w-full bg-white bg-opacity-20 rounded-full h-2'>
                  <div
                    className='bg-white h-2 rounded-full transition-all duration-300'
                    style={{ width: `${stats.planningdiv}%` }}
                  ></div>
                </div>
                <p className='text-sm mt-2'>
                  {stats.planningdiv}% planning complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h3 className='text-sm font-medium'>Total Bookings</h3>
              <div className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <div className='text-2xl font-bold'>{stats.totalBookings}</div>
              <p className='text-xs text-muted-foreground'>
                {stats.upcomingEvents} upcoming
              </p>
            </div>
          </div>

          <div>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h3 className='text-sm font-medium'>Total Spent</h3>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <div className='text-2xl font-bold'>
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {stats.completedEvents} completed
              </p>
            </div>
          </div>

          <div>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h3 className='text-sm font-medium'>Saved Venues</h3>
              <MapPin className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <div className='text-2xl font-bold'>{stats.savedVenues}</div>
              <p className='text-xs text-muted-foreground'>
                {stats.savedVendors} vendors
              </p>
            </div>
          </div>

          <div>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h3 className='text-sm font-medium'>Planning div</h3>
              <Heart className='h-4 w-4 text-muted-foreground' />
            </div>
            <div>
              <div className='text-2xl font-bold'>{stats.planningdiv}%</div>
              <p className='text-xs text-muted-foreground'>
                {stats.daysUntilWedding} days left
              </p>
            </div>
          </div>
        </div>

        {/* Main Content div */}
        <div defaultValue='overview' className='space-y-6'>
          <div>
            <button value='overview'>Overview</button>
            <button value='bookings'>Bookings</button>
            <button value='saved'>Saved Items</button>
            <button value='tasks'>Planning Tasks</button>
            <button value='timeline'>Timeline</button>
          </div>

          <div className='space-y-6'>
            {/* Quick Actions */}
            <div>
              <div>
                <h3>Quick Actions</h3>
              </div>
              <div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <button className='w-full'>
                    <MapPin className='h-4 w-4 mr-2' />
                    Find Venues
                  </button>
                  <button className='w-full'>
                    <Users className='h-4 w-4 mr-2' />
                    Find Vendors
                  </button>
                  <button className='w-full'>
                    <div className='h-4 w-4 mr-2' />
                    View Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div>
              <div>
                <h3>Recent Bookings</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  {bookings.slice(0, 3).map(booking => (
                    <div
                      key={booking.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`}
                        ></div>
                        <div>
                          <p className='font-medium'>{booking.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {booking.date.toLocaleDateString()} - {booking.type}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>
                          {formatCurrency(booking.amount)}
                        </span>
                        <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div>
              <div>
                <h3>Upcoming Tasks</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  {tasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex items-center space-x-4'>
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
                        ></div>
                        <div>
                          <p className='font-medium'>{task.title}</p>
                          <p className='text-sm text-muted-foreground'>
                            Due {task.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <div>
                <h3>All Bookings</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  {bookings.map(booking => (
                    <div key={booking.id} className='border rounded-lg p-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <h3 className='font-medium'>{booking.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {booking.description}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='font-medium'>
                            {formatCurrency(booking.amount)}
                          </span>
                          <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>Date</p>
                          <p className='font-medium'>
                            {booking.date.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Location
                          </p>
                          <p className='font-medium'>{booking.location}</p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <button className='px-3 py-1 text-sm'>
                          <MessageSquare className='h-4 w-4 mr-1' />
                          Contact
                        </button>
                        <button className='px-3 py-1 text-sm'>
                          <div className='h-4 w-4 mr-1' />
                          Reschedule
                        </button>
                        <button className='px-3 py-1 text-sm'>
                          <Settings className='h-4 w-4 mr-1' />
                          Modify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <div>
                <h3>Saved Items</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  {savedItems.map(item => (
                    <div key={item.id} className='border rounded-lg p-4'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center'>
                          <span className='text-gray-500 text-xs'>Image</span>
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-2'>
                            <h3 className='font-medium'>{item.name}</h3>
                            <div className='flex items-center space-x-2'>
                              <div className='flex items-center'>
                                <Star className='h-4 w-4 text-yellow-400 fill-current' />
                                <span className='text-sm ml-1'>
                                  {item.rating}
                                </span>
                              </div>
                              <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {item.description}
                          </p>
                          <div className='flex items-center space-x-4 text-sm'>
                            <span className='flex items-center'>
                              <MapPin className='h-4 w-4 mr-1' />
                              {item.location}
                            </span>
                            <span className='font-medium'>{item.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2 mt-4'>
                        <button className='px-3 py-1 text-sm'>
                          <div className='h-4 w-4 mr-1' />
                          Book Now
                        </button>
                        <button className='px-3 py-1 text-sm'>
                          <MessageSquare className='h-4 w-4 mr-1' />
                          Contact
                        </button>
                        <button className='px-3 py-1 text-sm'>
                          <Bookmark className='h-4 w-4 mr-1' />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <div>
                <h3>Planning Tasks</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  {tasks.map(task => (
                    <div key={task.id} className='border rounded-lg p-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <h3 className='font-medium'>{task.title}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {task.description}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                            {task.category}
                          </span>
                          <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Due Date
                          </p>
                          <p className='font-medium'>
                            {task.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Priority
                          </p>
                          <div className='flex items-center space-x-2'>
                            <div
                              className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}
                            ></div>
                            <span className='capitalize'>{task.priority}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
                        {task.status === 'pending' && (
                          <button
                            className='px-3 py-1 text-sm'
                            onClick={() =>
                              console.log(`Start task: ${task.id}`)
                            }
                          >
                            <Clock className='h-4 w-4 mr-1' />
                            Start Task
                          </button>
                        )}

                        {task.status === 'in_progress' && (
                          <button
                            className='px-3 py-1 text-sm'
                            onClick={() =>
                              console.log(`Complete task: ${task.id}`)
                            }
                          >
                            <CheckCircle className='h-4 w-4 mr-1' />
                            Mark Complete
                          </button>
                        )}

                        <button className='px-3 py-1 text-sm'>
                          <div className='h-4 w-4 mr-1' />
                          Set Reminder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <div>
                <h3>Wedding Timeline</h3>
              </div>
              <div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-medium'>
                        Planning Milestones
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Track your wedding planning progress
                      </p>
                    </div>
                    <button>
                      <div className='h-4 w-4 mr-2' />
                      Full Timeline
                    </button>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p className='font-medium'>Venue Booked</p>
                        <p className='text-sm text-muted-foreground'>
                          Grand Ballroom Hotel - 45 days ago
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                        <CheckCircle className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p className='font-medium'>Photographer Booked</p>
                        <p className='text-sm text-muted-foreground'>
                          Perfect Moments Photography - 30 days ago
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center'>
                        <Clock className='h-4 w-4 text-white' />
                      </div>
                      <div>
                        <p className='font-medium'>Catering Pending</p>
                        <p className='text-sm text-muted-foreground'>
                          Sweet Dreams Catering - Due in 7 days
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                        <Clock className='h-4 w-4 text-gray-500' />
                      </div>
                      <div>
                        <p className='font-medium'>Wedding Cake</p>
                        <p className='text-sm text-muted-foreground'>
                          Due in 14 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
