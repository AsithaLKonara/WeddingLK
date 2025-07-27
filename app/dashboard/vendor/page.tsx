"use client"

import { BarChart2, ClipboardList, Package, Star, Calendar, MessageCircle, Filter, Search, Download, TrendingUp, Users, DollarSign, Clock, MapPin, Phone, Mail, Image as ImageIcon, Plus, Edit, Trash2, Reply, Send, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Booking {
  _id: string
  contactInfo?: {
    name: string
    email: string
    phone: string
  }
  date: string
  status: string
  guests?: number
  message?: string
}

interface Service {
  _id: string
  name: string
  price: number
  description: string
  image?: string
  isAvailable?: boolean
}

interface Review {
  id: string
  client: string
  rating: number
  comment: string
  date: string
  reply?: string
}

interface Message {
  id: string
  from: string
  message: string
  timestamp: string
  isRead: boolean
}

// API functions
const fetchBookings = () => fetch("/api/bookings").then(res => res.json())
const fetchServices = () => fetch("/api/services").then(res => res.json())
const fetchReviews = () => fetch("/api/reviews").then(res => res.json())

const updateBookingStatus = (data: any) => fetch("/api/bookings", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(res => res.json())

const addService = (data: any) => fetch("/api/services", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(res => res.json())

const updateService = (data: any) => fetch("/api/services", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(res => res.json())

const deleteService = (data: any) => fetch("/api/services", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(res => res.json())

const replyToReview = (data: any) => fetch("/api/reviews", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(res => res.json())

// Enhanced analytics data
const analyticsData = {
  totalBookings: 32,
  totalRevenue: 1250000,
  avgReview: 4.7,
  reviewCount: 18,
  monthlyGrowth: 15.2,
  topService: "Photography",
  avgBookingValue: 39000,
  completionRate: 94.5
}

// Mock messages for demo
const mockMessages: Message[] = [
  { id: "1", from: "Sarah & Michael", message: "Hi! We're interested in your photography services for our wedding on July 15th.", timestamp: "2024-01-20T10:30:00Z", isRead: false },
  { id: "2", from: "Priya & Raj", message: "Thank you for the amazing service! We loved the photos.", timestamp: "2024-01-19T15:45:00Z", isRead: true },
]

export default function VendorDashboardPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState({ 
    name: "", 
    price: "", 
    description: "", 
    image: "",
    isAvailable: true 
  })
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  // React Query hooks
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings
  })
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices
  })
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews
  })

  const bookings = bookingsData?.bookings || []
  const services = servicesData?.services || []
  const reviews = reviewsData?.reviews || mockMessages // Fallback to mock data

  // Mutations
  const bookingMutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast({ title: "Booking status updated successfully" })
    },
    onError: () => toast({ title: "Failed to update booking status", variant: "destructive" })
  })

  const serviceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setIsAddServiceOpen(false)
      setServiceForm({ name: "", price: "", description: "", image: "", isAvailable: true })
      toast({ title: "Service added successfully" })
    },
    onError: () => toast({ title: "Failed to add service", variant: "destructive" })
  })

  const updateServiceMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setIsEditServiceOpen(false)
      setEditService(null)
      setServiceForm({ name: "", price: "", description: "", image: "", isAvailable: true })
      toast({ title: "Service updated successfully" })
    },
    onError: () => toast({ title: "Failed to update service", variant: "destructive" })
  })

  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast({ title: "Service deleted successfully" })
    },
    onError: () => toast({ title: "Failed to delete service", variant: "destructive" })
  })

  const reviewReplyMutation = useMutation({
    mutationFn: replyToReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      setReplyText("")
      setSelectedReview(null)
      toast({ title: "Reply sent successfully" })
    },
    onError: () => toast({ title: "Failed to send reply", variant: "destructive" })
  })

  // Filter functions
  const filterBookings = (bookings: Booking[]) => {
    return bookings.filter(booking => {
      const matchesSearch = !searchTerm || 
        booking.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { color: string, text: string } } = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      confirmed: { color: "bg-green-100 text-green-800", text: "Confirmed" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      completed: { color: "bg-blue-100 text-blue-800", text: "Completed" }
    }
    
    const variant = variants[status] || { color: "bg-gray-100 text-gray-800", text: status }
    
    return (
      <Badge className={variant.color}>
        {variant.text}
      </Badge>
    )
  }

  const handleBookingAction = (booking: Booking, action: string) => {
    const newStatus = action === "accept" ? "confirmed" : "rejected"
    bookingMutation.mutate({ id: booking._id, status: newStatus })
  }

  const handleAddService = () => {
    serviceMutation.mutate(serviceForm)
  }

  const handleUpdateService = () => {
    if (!editService) return
    updateServiceMutation.mutate({ id: editService._id, ...serviceForm })
  }

  const handleDeleteService = (id: string) => {
    deleteServiceMutation.mutate({ id })
  }

  const handleReplyToReview = () => {
    if (!selectedReview || !replyText.trim()) return
    reviewReplyMutation.mutate({ id: selectedReview.id, reply: replyText })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message: Message = {
      id: Date.now().toString(),
      from: "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    }
    setMessages(prev => [...prev, message])
    setNewMessage("")
    toast({ title: "Message sent" })
  }

  const unreadMessagesCount = messages.filter(m => !m.isRead).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsMessageOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
            {unreadMessagesCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadMessagesCount}</Badge>
            )}
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings"><ClipboardList className="inline mr-2 h-4 w-4" />Bookings</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart2 className="inline mr-2 h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="services"><Package className="inline mr-2 h-4 w-4" />Services</TabsTrigger>
          <TabsTrigger value="reviews"><Star className="inline mr-2 h-4 w-4" />Reviews</TabsTrigger>
          <TabsTrigger value="calendar"><Calendar className="inline mr-2 h-4 w-4" />Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
              <CardTitle>Bookings</CardTitle>
                <Button onClick={() => exportToCSV(filterBookings(bookings), 'bookings')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterBookings(bookings).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-5xl mb-2">📅</span>
                            <span>No bookings found.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterBookings(bookings).map((booking: Booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.contactInfo?.name || "N/A"}</div>
                              <div className="text-sm text-gray-500">{booking.contactInfo?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                          <TableCell>{booking.guests || "N/A"}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            {booking.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingAction(booking, "accept")}
                                  disabled={bookingMutation.isPending}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleBookingAction(booking, "reject")}
                                  disabled={bookingMutation.isPending}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {booking.status === "confirmed" ? "✅ Confirmed" : "❌ Rejected"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">LKR {analyticsData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: LKR {analyticsData.avgBookingValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.avgReview}</div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.reviewCount} reviews
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Top service: {analyticsData.topService}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart component would go here (Recharts/Chart.js)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Services</CardTitle>
              <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Service Name</label>
                      <Input
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g., Wedding Photography"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (LKR)</label>
                      <Input
                        type="number"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        placeholder="120000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        placeholder="Describe your service..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input
                        value={serviceForm.image}
                        onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={serviceForm.isAvailable}
                        onChange={(e) => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })}
                      />
                      <label htmlFor="isAvailable" className="text-sm">Available for booking</label>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddService} disabled={serviceMutation.isPending}>
                      {serviceMutation.isPending ? "Adding..." : "Add Service"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service: Service) => (
                    <Card key={service._id} className="relative">
                      {service.image && (
                        <div className="h-32 bg-gray-200 rounded-t-lg overflow-hidden">
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge variant={service.isAvailable ? "default" : "secondary"}>
                            {service.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          LKR {service.price.toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                        <div className="flex gap-2">
                                <Button
                            size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditService(service)
                              setServiceForm({
                                name: service.name,
                                price: String(service.price),
                                description: service.description,
                                image: service.image || "",
                                isAvailable: service.isAvailable || true
                              })
                              setIsEditServiceOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteService(service._id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Service Dialog */}
          <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
            <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Edit Service</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Service Name</label>
                  <Input
                                      value={serviceForm.name}
                                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Price (LKR)</label>
                  <Input
                                      type="number"
                                      value={serviceForm.price}
                                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                                      value={serviceForm.description}
                                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                      rows={3}
                                    />
                                  </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    value={serviceForm.image}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editIsAvailable"
                    checked={serviceForm.isAvailable}
                    onChange={(e) => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })}
                  />
                  <label htmlFor="editIsAvailable" className="text-sm">Available for booking</label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                <Button onClick={handleUpdateService} disabled={updateServiceMutation.isPending}>
                  {updateServiceMutation.isPending ? "Updating..." : "Update Service"}
                </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review: Review) => (
                  <div key={review.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{review.client}</h4>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    
                    {review.reply && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Reply:</p>
                        <p className="text-blue-700">{review.reply}</p>
                      </div>
                    )}
                    
                    {!review.reply && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reply Dialog */}
          <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reply to Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Review from {selectedReview?.client}:</p>
                  <p className="text-gray-800">{selectedReview?.comment}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Reply</label>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleReplyToReview} disabled={reviewReplyMutation.isPending}>
                  {reviewReplyMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Booking Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-500">
                Calendar component would go here (FullCalendar/React Big Calendar)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Messages Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="max-w-2xl h-96">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message: Message) => (
                <div key={message.id} className={`flex ${message.from === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.from === "You" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <div className="text-sm font-medium mb-1">{message.from}</div>
                    <p className="text-sm">{message.message}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function for CSV export
const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {}).join(',')
  const rows = data.map(item => Object.values(item).join(',')).join('\n')
  const csv = `${headers}\n${rows}`
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
