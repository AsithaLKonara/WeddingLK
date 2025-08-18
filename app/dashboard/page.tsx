"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Calendar, Heart, MessageSquare, CreditCard, Settings, Loader2, Users, Star, MapPin } from 'lucide-react'

export default function UserDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalFavorites: 0,
    totalMessages: 0,
    totalPayments: 0
  })
  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])
  const [messages, setMessages] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
    fetchUserStats()
    
    if (tab === 'bookings') fetchBookings()
    if (tab === 'favorites') fetchFavorites()
    if (tab === 'messages') fetchMessages()
    if (tab === 'payments') fetchPayments()
  }, [searchParams, activeTab])

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/dashboard/user/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/dashboard/user/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/dashboard/user/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/dashboard/user/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/dashboard/user/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-32 w-32 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* User Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Wedding Planning Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your wedding planning journey</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Venues & vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* User Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking: any) => (
                      <div key={booking._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{booking.venue?.name || 'Vendor Service'}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No bookings yet</p>
                    <p className="text-sm">Start planning your wedding by booking venues and vendors</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Find Venues</p>
                      <p className="text-xs text-gray-500">Browse wedding venues</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Browse Venues
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Find Vendors</p>
                      <p className="text-xs text-gray-500">Browse wedding services</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Browse Vendors
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Wedding Planning</p>
                      <p className="text-xs text-gray-500">Use planning tools</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Start Planning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Your Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.venue?.name || 'Vendor Service'}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">LKR {booking.totalAmount?.toLocaleString()}</p>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No bookings yet</p>
                  <p className="text-sm">Start planning your wedding by booking venues and vendors</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Your Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((favorite: any) => (
                    <div key={favorite._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{favorite.name || favorite.businessName}</p>
                          <p className="text-sm text-gray-500">{favorite.category || favorite.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No favorites yet</p>
                  <p className="text-sm">Save venues and vendors you like for later</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message: any) => (
                    <div key={message._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{message.sender?.name || 'Vendor'}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{message.content}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</p>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Communicate with vendors about your wedding needs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment: any) => (
                    <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.description || 'Wedding Service'}</p>
                          <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">LKR {payment.amount?.toLocaleString()}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No payments yet</p>
                  <p className="text-sm">Payment history will appear here after you make bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
