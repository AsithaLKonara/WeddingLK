"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalVendors: number
  totalVenues: number
  totalBookings: number
  totalRevenue: number
  pendingApprovals: number
  activeUsers: number
  conversionRate: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: Date
  lastActive: Date
  verified: boolean
}

interface Vendor {
  id: string
  name: string
  category: string
  status: 'approved' | 'pending' | 'rejected'
  rating: number
  reviewCount: number
  joinDate: Date
  verified: boolean
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
    conversionRate: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

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
      conversionRate: 12.5
    }
    
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "user",
        status: "active",
        joinDate: new Date("2024-01-15"),
        lastActive: new Date(),
        verified: true
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike@example.com",
        role: "user",
        status: "active",
        joinDate: new Date("2024-02-01"),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
        verified: false
      },
      {
        id: "3",
        name: "Priya Patel",
        email: "priya@example.com",
        role: "user",
        status: "pending",
        joinDate: new Date("2024-03-10"),
        lastActive: new Date(),
        verified: false
      }
    ]
    
    const mockVendors: Vendor[] = [
      {
        id: "1",
        name: "Elegant Events",
        category: "Wedding Planning",
        status: "approved",
        rating: 4.8,
        reviewCount: 127,
        joinDate: new Date("2023-06-15"),
        verified: true
      },
      {
        id: "2",
        name: "Garden Dreams",
        category: "Venue",
        status: "pending",
        rating: 4.5,
        reviewCount: 89,
        joinDate: new Date("2024-01-20"),
        verified: false
      },
      {
        id: "3",
        name: "Luxury Weddings SL",
        category: "Full Service",
        status: "approved",
        rating: 4.9,
        reviewCount: 203,
        joinDate: new Date("2023-03-10"),
        verified: true
      }
    ]
    
    setStats(mockStats)
    setUsers(mockUsers)
    setVendors(mockVendors)
    setLoading(false)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || vendor.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform and monitor performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.activeUsers} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApprovals} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users Management</TabsTrigger>
          <TabsTrigger value="vendors">Vendors Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(user.status)}
                          {user.verified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Management Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendors Management</CardTitle>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{vendor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(vendor.status)}
                          <span className="text-sm text-gray-600">
                            ⭐ {vendor.rating} ({vendor.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">User Growth</h3>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Revenue Trends</h3>
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Send email notifications to users</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Security Settings</h3>
                    <p className="text-sm text-gray-600">Manage platform security</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API Keys</h3>
                    <p className="text-sm text-gray-600">Manage third-party integrations</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
