"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  Bookmark,
  MessageSquare,
  Settings,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { DashboardLayout } from "@/components/templates/dashboard-layout"

interface UserStats {
  totalBookings: number
  upcomingEvents: number
  completedEvents: number
  totalSpent: number
  savedVenues: number
  savedVendors: number
  daysUntilWedding: number
  planningProgress: number
}

interface Booking {
  id: string
  type: 'venue' | 'vendor' | 'package'
  name: string
  date: Date
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  amount: number
  location: string
  description: string
}

interface SavedItem {
  id: string
  type: 'venue' | 'vendor'
  name: string
  image: string
  location: string
  rating: number
  price: string
  description: string
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  category: string
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
    planningProgress: 0
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

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
        planningProgress: 65
      }

      const mockBookings: Booking[] = [
        {
          id: "1",
          type: "venue",
          name: "Grand Ballroom Hotel",
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: "confirmed",
          amount: 850000,
          location: "Colombo, Sri Lanka",
          description: "Main wedding venue with catering and decoration"
        },
        {
          id: "2",
          type: "vendor",
          name: "Perfect Moments Photography",
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: "confirmed",
          amount: 250000,
          location: "Colombo, Sri Lanka",
          description: "Wedding photography and videography package"
        },
        {
          id: "3",
          type: "vendor",
          name: "Sweet Dreams Catering",
          date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: "pending",
          amount: 150000,
          location: "Colombo, Sri Lanka",
          description: "Wedding catering for 150 guests"
        }
      ]

      const mockSavedItems: SavedItem[] = [
        {
          id: "1",
          type: "venue",
          name: "Garden Palace",
          image: "/venues/garden-palace.jpg",
          location: "Kandy, Sri Lanka",
          rating: 4.6,
          price: "LKR 450,000",
          description: "Beautiful outdoor garden venue with natural beauty"
        },
        {
          id: "2",
          type: "vendor",
          name: "Elegant Decorators",
          image: "/vendors/elegant-decorators.jpg",
          location: "Colombo, Sri Lanka",
          rating: 4.8,
          price: "LKR 200,000",
          description: "Creative wedding decoration and floral arrangements"
        }
      ]

      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Book wedding cake vendor",
          description: "Research and book wedding cake vendor",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: "high",
          status: "pending",
          category: "Vendor Booking"
        },
        {
          id: "2",
          title: "Send wedding invitations",
          description: "Design and send wedding invitations to guests",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: "medium",
          status: "pending",
          category: "Planning"
        },
        {
          id: "3",
          title: "Finalize wedding playlist",
          description: "Create final wedding ceremony and reception playlist",
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          priority: "low",
          status: "pending",
          category: "Entertainment"
        }
      ]

      setStats(mockStats)
      setBookings(mockBookings)
      setSavedItems(mockSavedItems)
      setTasks(mockTasks)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user data:', error)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="My Dashboard" description="Your wedding planning journey">
      <div className="space-y-6">
        {/* Wedding Countdown */}
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Your Wedding Day</h2>
              <div className="text-4xl font-bold mb-2">{stats.daysUntilWedding}</div>
              <p className="text-lg">days to go!</p>
              <div className="mt-4">
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.planningProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2">{stats.planningProgress}% planning complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {stats.upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedEvents} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Venues</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.savedVenues}</div>
              <p className="text-xs text-muted-foreground">
                {stats.savedVendors} vendors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planning Progress</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.planningProgress}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.daysUntilWedding} days left
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="tasks">Planning Tasks</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Venues
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Find Vendors
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Timeline
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
                          <p className="font-medium">{booking.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.date.toLocaleDateString()} - {booking.type}
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

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {task.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{task.category}</Badge>
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
                          <h3 className="font-medium">{booking.name}</h3>
                          <p className="text-sm text-muted-foreground">{booking.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatCurrency(booking.amount)}</span>
                          <Badge variant="outline">{getStatusText(booking.status)}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{booking.date.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{booking.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Modify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm ml-1">{item.rating}</span>
                              </div>
                              <Badge variant="outline">{item.type}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {item.location}
                            </span>
                            <span className="font-medium">{item.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Planning Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{task.category}</Badge>
                          <Badge variant="outline">{getStatusText(task.status)}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">{task.dueDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Priority</p>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            <span className="capitalize">{task.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {task.status === 'pending' && (
                          <Button size="sm" onClick={() => console.log(`Start task: ${task.id}`)}>
                            <Clock className="h-4 w-4 mr-1" />
                            Start Task
                          </Button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <Button size="sm" onClick={() => console.log(`Complete task: ${task.id}`)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wedding Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Planning Milestones</h3>
                      <p className="text-sm text-muted-foreground">
                        Track your wedding planning progress
                      </p>
                    </div>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Full Timeline
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Venue Booked</p>
                        <p className="text-sm text-muted-foreground">Grand Ballroom Hotel - 45 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Photographer Booked</p>
                        <p className="text-sm text-muted-foreground">Perfect Moments Photography - 30 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Catering Pending</p>
                        <p className="text-sm text-muted-foreground">Sweet Dreams Catering - Due in 7 days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">Wedding Cake</p>
                        <p className="text-sm text-muted-foreground">Due in 14 days</p>
                      </div>
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