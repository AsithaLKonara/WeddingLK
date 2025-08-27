"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
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
  AlertCircle
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingBookings} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedBookings} completed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReviews} reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingBookings} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
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
                        <Badge variant="outline">{getStatusText(booking.status)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
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
                          <Badge variant="outline">{getStatusText(booking.status)}</Badge>
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
                            <Button size="sm" onClick={() => handleBookingAction(booking.id, 'confirm')}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleBookingAction(booking.id, 'cancel')}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <Button size="sm" onClick={() => handleBookingAction(booking.id, 'complete')}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Client
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Client Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your client relationships and communication
                      </p>
                    </div>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      View All Clients
                    </Button>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Performance Metrics</h3>
                      <p className="text-sm text-muted-foreground">
                        Track your business performance and growth
                      </p>
                    </div>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your profile and business information
                      </p>
                    </div>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
