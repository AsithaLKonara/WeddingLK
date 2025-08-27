"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  MapPin,
  DollarSign
} from "lucide-react"
import { DashboardLayout } from "@/components/templates/dashboard-layout"

interface PlannerStats {
  totalClients: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  averageProjectValue: number
  upcomingDeadlines: number
  clientSatisfaction: number
  responseTime: number
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  weddingDate: Date
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  budget: number
  guestCount: number
  location: string
  lastContact: Date
  nextMeeting: Date
}

interface Task {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed'
  category: string
}

export default function PlannerDashboard() {
  const [stats, setStats] = useState<PlannerStats>({
    totalClients: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    averageProjectValue: 0,
    upcomingDeadlines: 0,
    clientSatisfaction: 0,
    responseTime: 0
  })
  const [clients, setClients] = useState<Client[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlannerData()
  }, [])

  const fetchPlannerData = async () => {
    try {
      // TODO: Replace with real API calls
      const mockStats: PlannerStats = {
        totalClients: 24,
        activeProjects: 8,
        completedProjects: 16,
        totalRevenue: 4560000,
        averageProjectValue: 190000,
        upcomingDeadlines: 5,
        clientSatisfaction: 4.8,
        responseTime: 2.3
      }

      const mockClients: Client[] = [
        {
          id: "1",
          name: "Sarah & Mike",
          email: "sarah.mike@email.com",
          phone: "+94 71 234 5678",
          weddingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          status: "planning",
          budget: 2500000,
          guestCount: 150,
          location: "Colombo",
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          nextMeeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: "2",
          name: "Priya & David",
          email: "priya.david@email.com",
          phone: "+94 77 345 6789",
          weddingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "in_progress",
          budget: 1800000,
          guestCount: 120,
          location: "Kandy",
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: "3",
          name: "Emma & James",
          email: "emma.james@email.com",
          phone: "+94 76 456 7890",
          weddingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: "planning",
          budget: 3200000,
          guestCount: 200,
          location: "Galle",
          lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          nextMeeting: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      ]

      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Finalize venue selection",
          description: "Help Sarah & Mike choose between Grand Ballroom and Garden Palace",
          clientId: "1",
          clientName: "Sarah & Mike",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: "high",
          status: "in_progress",
          category: "Venue Selection"
        },
        {
          id: "2",
          title: "Book photographer",
          description: "Secure wedding photographer for Priya & David's ceremony",
          clientId: "2",
          clientName: "Priya & David",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          priority: "urgent",
          status: "pending",
          category: "Vendor Booking"
        },
        {
          id: "3",
          title: "Create wedding timeline",
          description: "Develop detailed timeline for Emma & James's wedding day",
          clientId: "3",
          clientName: "Emma & James",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: "medium",
          status: "pending",
          category: "Planning"
        }
      ]

      setStats(mockStats)
      setClients(mockClients)
      setTasks(mockTasks)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching planner data:', error)
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
      case 'planning': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'on_hold': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planning'
      case 'in_progress': return 'In Progress'
      case 'completed': return 'Completed'
      case 'on_hold': return 'On Hold'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Wedding Planner Dashboard" description="Manage your clients and projects">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects} active projects
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
                Avg: {formatCurrency(stats.averageProjectValue)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientSatisfaction}</div>
              <p className="text-xs text-muted-foreground">
                {stats.responseTime}h avg response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    <Users className="h-4 w-4 mr-2" />
                    Add New Client
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Clients */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.slice(0, 3).map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`}></div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.weddingDate.toLocaleDateString()} - {client.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatCurrency(client.budget)}</span>
                        <Badge variant="outline">{getStatusText(client.status)}</Badge>
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
                            {task.clientName} - Due {task.dueDate.toLocaleDateString()}
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

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatCurrency(client.budget)}</span>
                          <Badge variant="outline">{getStatusText(client.status)}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Wedding Date</p>
                          <p className="font-medium">{client.weddingDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Guest Count</p>
                          <p className="font-medium">{client.guestCount} guests</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{client.location}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Contact</p>
                          <p className="font-medium">{client.lastContact.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Meeting</p>
                          <p className="font-medium">{client.nextMeeting.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Client
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Meeting
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
                <CardTitle>Task Management</CardTitle>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Client</p>
                          <p className="font-medium">{task.clientName}</p>
                        </div>
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
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Client
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Upcoming Events</h3>
                      <p className="text-sm text-muted-foreground">
                        View your schedule and upcoming meetings
                      </p>
                    </div>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Full Calendar
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.upcomingDeadlines}</div>
                      <p className="text-sm text-muted-foreground">Deadlines This Week</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{clients.length}</div>
                      <p className="text-sm text-muted-foreground">Active Clients</p>
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
                      <h3 className="text-lg font-medium">Performance Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Track your business metrics and growth
                      </p>
                    </div>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.clientSatisfaction}</div>
                      <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.responseTime}h</div>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
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
