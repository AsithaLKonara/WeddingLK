"use client"

import { useState, useEffect } from "react"
import { 
  div, 
  CreditCard, 
  Users, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  divCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/templates/dashboard-layout"

interface VendorStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  upcomingBookings: number
  responseRate: number
}

interface Booking {
  id: string
  clientName: string
  eventDate: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
  service: string
  clientPhone: string
  clientEmail: string
  notes: string
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<VendorStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    upcomingBookings: 0,
    responseRate: 0
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      // TODO: Replace with real API calls
      const mockStats: VendorStats = {
        totalBookings: 47,
        completedBookings: 32,
        pendingBookings: 8,
        totalRevenue: 2345000,
        averageRating: 4.7,
        totalReviews: 28,
        upcomingBookings: 7,
        responseRate: 95
      }

      const mockBookings: Booking[] = [
        {
          id: "1",
          clientName: "Sarah & Mike",
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "confirmed",
          amount: 85000,
          service: "Wedding Photography",
          clientPhone: "+94 71 234 5678",
          clientEmail: "sarah.mike@email.com",
          notes: "Outdoor ceremony, indoor reception. Need drone shots."
        },
        {
          id: "2",
          clientName: "Priya & David",
          eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: "pending",
          amount: 65000,
          service: "Engagement Shoot",
          clientPhone: "+94 77 345 6789",
          clientEmail: "priya.david@email.com",
          notes: "Beach location, sunset timing preferred."
        },
        {
          id: "3",
          clientName: "Emma & James",
          eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "completed",
          amount: 75000,
          service: "Wedding Photography",
          clientPhone: "+94 76 456 7890",
          clientEmail: "emma.james@email.com",
          notes: "Traditional ceremony, modern reception."
        }
      ]

      setStats(mockStats)
      setBookings(mockBookings)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vendor data:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  const handleBookingAction = (bookingId: string, action: 'confirm' | 'complete' | 'cancel') => {
    // TODO: Implement booking actions
    console.log(`Action ${action} on booking ${bookingId}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Vendor Dashboard" description="Manage your bookings and business">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <divTitle className="text-sm font-medium">Total Bookings</divTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </divHeader>
            <divContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingBookings} upcoming
              </p>
            </divContent>
          </div>

          <div>
            <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <divTitle className="text-sm font-medium">Total Revenue</divTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </divHeader>
            <divContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedBookings} completed bookings
              </p>
            </divContent>
          </div>

          <div>
            <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <divTitle className="text-sm font-medium">Rating</divTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </divHeader>
            <divContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReviews} reviews
              </p>
            </divContent>
          </div>

          <div>
            <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <divTitle className="text-sm font-medium">Response Rate</divTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </divHeader>
            <divContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingBookings} pending
              </p>
            </divContent>
          </div>
        </div>

        {/* Main Content div */}
        <div defaultValue="overview" className="space-y-6">
          <divList>
            <divTrigger value="overview">Overview</divTrigger>
            <divTrigger value="bookings">Bookings</divTrigger>
            <divTrigger value="clients">Clients</divTrigger>
            <divTrigger value="analytics">Analytics</divTrigger>
            <divTrigger value="settings">Settings</divTrigger>
          </divList>

          <divContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div>
              <divHeader>
                <divTitle>Quick Actions</divTitle>
              </divHeader>
              <divContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="w-full" variant="outline">
                    <div className="h-4 w-4 mr-2" />
                    View div
                  </button>
                  <button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </button>
                  <button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </button>
                </div>
              </divContent>
            </div>

            {/* Recent Bookings */}
            <div>
              <divHeader>
                <divTitle>Recent Bookings</divTitle>
              </divHeader>
              <divContent>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(booking.status)}`}></div>
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.eventDate.toLocaleDateString()} - {booking.service}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatCurrency(booking.amount)}</span>
                        <span variant="outline">{getStatusText(booking.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </divContent>
            </div>
          </divContent>

          <divContent value="bookings" className="space-y-6">
            <div>
              <divHeader>
                <divTitle>All Bookings</divTitle>
              </divHeader>
              <divContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{booking.clientName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatCurrency(booking.amount)}</span>
                          <span variant="outline">{getStatusText(booking.status)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Event Date</p>
                          <p className="font-medium">{booking.eventDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="font-medium">{booking.clientPhone}</p>
                          <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button size="sm" onClick={() => handleBookingAction(booking.id, 'confirm')}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button size="sm" variant="outline" onClick={() => handleBookingAction(booking.id, 'cancel')}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button size="sm" onClick={() => handleBookingAction(booking.id, 'complete')}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </button>
                        )}
                        
                        <button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Client
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </divContent>
            </div>
          </divContent>

          <divContent value="clients" className="space-y-6">
            <div>
              <divHeader>
                <divTitle>Client Management</divTitle>
              </divHeader>
              <divContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Client Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your client relationships and communication
                      </p>
                    </div>
                    <button>
                      <Users className="h-4 w-4 mr-2" />
                      View All Clients
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                      <p className="text-sm text-muted-foreground">Total Clients</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
                      <p className="text-sm text-muted-foreground">Satisfied Clients</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
                      <p className="text-sm text-muted-foreground">Pending Responses</p>
                    </div>
                  </div>
                </div>
              </divContent>
            </div>
          </divContent>

          <divContent value="analytics" className="space-y-6">
            <div>
              <divHeader>
                <divTitle>Business Analytics</divTitle>
              </divHeader>
              <divContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Performance Metrics</h3>
                      <p className="text-sm text-muted-foreground">
                        Track your business performance and growth
                      </p>
                    </div>
                    <button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export Report
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.averageRating}</div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.responseRate}%</div>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                    </div>
                  </div>
                </div>
              </divContent>
            </div>
          </divContent>

          <divContent value="settings" className="space-y-6">
            <div>
              <divHeader>
                <divTitle>Profile Settings</divTitle>
              </divHeader>
              <divContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your profile and business information
                      </p>
                    </div>
                    <button>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Service Areas</h4>
                      <p className="text-sm text-muted-foreground">Colombo, Kandy, Galle</p>
                    </div>
                  </div>
                </div>
              </divContent>
            </div>
          </divContent>
        </div>
      </div>
    </DashboardLayout>
  )
}
