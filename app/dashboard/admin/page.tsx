"use client"

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Store, TrendingUp, Calendar, Shield, Settings, UserCheck, AlertTriangle, Loader2 } from 'lucide-react'

interface AnalyticsData {
  userGrowth?: { total: number; data: any[] }
  revenue?: { total: number; data: any[] }
  bookings?: { total: number; data: any[] }
  [key: string]: any
}

interface SettingsData {
  [category: string]: { [key: string]: any }
}

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalVenues: 0,
    totalBookings: 0,
    pendingApprovals: 0
  })
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [analytics, setAnalytics] = useState<AnalyticsData>({})
  const [settings, setSettings] = useState<SettingsData>({})
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
    fetchAdminStats()
    
    if (tab === 'users') fetchUsers()
    if (tab === 'vendors') fetchVendors()
    if (tab === 'analytics') fetchAnalytics()
    if (tab === 'settings') fetchSettings()

    // Add event listeners for table actions
    const handleUserActionEvent = (event: CustomEvent) => {
      const { userId, action } = event.detail
      handleUserAction(userId, action)
    }

    const handleVendorActionEvent = (event: CustomEvent) => {
      const { vendorId, action } = event.detail
      handleVendorAction(vendorId, action)
    }

    window.addEventListener('userAction', handleUserActionEvent as EventListener)
    window.addEventListener('vendorAction', handleVendorActionEvent as EventListener)

    return () => {
      window.removeEventListener('userAction', handleUserActionEvent as EventListener)
      window.removeEventListener('vendorAction', handleVendorActionEvent as EventListener)
    }
  }, [searchParams, activeTab])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/dashboard/admin/platform-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/dashboard/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/dashboard/admin/vendors')
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch('/api/dashboard/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
      const response = await fetch('/api/dashboard/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch('/api/dashboard/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { isActive: action === 'activate' } })
      })
      
      if (response.ok) {
        fetchUsers()
        fetchAdminStats()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleVendorAction = async (vendorId: string, action: string) => {
    try {
      const response = await fetch('/api/dashboard/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, action })
      })
      
      if (response.ok) {
        fetchVendors()
        fetchAdminStats()
      }
    } catch (error) {
      console.error('Error processing vendor action:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-32 w-32 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform administration and oversight</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingApprovals} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVenues}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New vendor application</p>
                      <p className="text-xs text-gray-500">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User account suspended</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">System backup completed</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
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
                      <p className="text-sm font-medium">User Management</p>
                      <p className="text-xs text-gray-500">Manage platform users</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('users')}>
                      Manage Users
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Vendor Approval</p>
                      <p className="text-xs text-gray-500">Review applications</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('vendors')}>
                      Review Vendors
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Platform Analytics</p>
                      <p className="text-xs text-gray-500">View system stats</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab('analytics')}>
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="space-y-4">
                  {users.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user._id, user.isActive ? 'deactivate' : 'activate')}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No users found</p>
                  <p className="text-sm">Users will appear here once they register</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Vendor Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendors.length > 0 ? (
                <div className="space-y-4">
                  {vendors.map((vendor: any) => (
                    <div key={vendor._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Store className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{vendor.businessName || 'Unknown Business'}</p>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vendor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        {!vendor.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVendorAction(vendor._id, 'approve')}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No vendors found</p>
                  <p className="text-sm">Vendors will appear here once they apply</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Platform Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading analytics...</p>
                </div>
              ) : analytics && analytics.userGrowth && analytics.revenue && analytics.bookings ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">User Growth</h3>
                      <p className="text-2xl font-bold">{analytics.userGrowth.total || 0}</p>
                      <p className="text-sm text-gray-500">New users in period</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Revenue</h3>
                      <p className="text-2xl font-bold">LKR {analytics.revenue.total?.toLocaleString() || 0}</p>
                      <p className="text-sm text-gray-500">Total revenue in period</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Bookings</h3>
                      <p className="text-2xl font-bold">{analytics.bookings.total || 0}</p>
                      <p className="text-sm text-gray-500">Total bookings in period</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No analytics data yet</p>
                  <p className="text-sm">Analytics will appear here once there's activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                  <p>Loading settings...</p>
                </div>
              ) : Object.keys(settings).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(settings).map(([category, categorySettings]: [string, any]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h3 className="font-semibold capitalize mb-3">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(categorySettings).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm text-gray-600">
                              {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No settings data yet</p>
                  <p className="text-sm">Platform settings will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
