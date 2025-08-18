"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  Store, 
  Shield, 
  CheckSquare,
  TrendingUp,
  FileText,
  Heart,
  Package
} from "lucide-react"

export default function DashboardNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userRole = session?.user?.role || 'user'

  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Overview',
            href: '/dashboard/admin',
            icon: LayoutDashboard,
            description: 'Platform overview and statistics'
          },
          {
            title: 'User Management',
            href: '/dashboard/admin?tab=users',
            icon: Users,
            description: 'Manage platform users'
          },
          {
            title: 'Vendor Management',
            href: '/dashboard/admin?tab=vendors',
            icon: Store,
            description: 'Review and manage vendors'
          },
          {
            title: 'Analytics',
            href: '/dashboard/admin?tab=analytics',
            icon: TrendingUp,
            description: 'Platform performance metrics'
          },
          {
            title: 'Settings',
            href: '/dashboard/admin?tab=settings',
            icon: Settings,
            description: 'Platform configuration'
          }
        ]

      case 'vendor':
        return [
          {
            title: 'Dashboard',
            href: '/dashboard/vendor',
            icon: LayoutDashboard,
            description: 'Business overview and insights'
          },
          {
            title: 'Bookings',
            href: '/dashboard/vendor?tab=bookings',
            icon: Calendar,
            description: 'Manage client bookings'
          },
          {
            title: 'Services',
            href: '/dashboard/vendor?tab=services',
            icon: Package,
            description: 'Manage your services'
          },
          {
            title: 'Analytics',
            href: '/dashboard/vendor?tab=analytics',
            icon: TrendingUp,
            description: 'Business performance metrics'
          },
          {
            title: 'Messages',
            href: '/dashboard/vendor?tab=messages',
            icon: MessageSquare,
            description: 'Client communications'
          },
          {
            title: 'Settings',
            href: '/dashboard/vendor?tab=settings',
            icon: Settings,
            description: 'Business profile settings'
          }
        ]

      case 'planner':
        return [
          {
            title: 'Dashboard',
            href: '/dashboard/planner',
            icon: LayoutDashboard,
            description: 'Planning overview and tasks'
          },
          {
            title: 'Tasks',
            href: '/dashboard/planner?tab=tasks',
            icon: CheckSquare,
            description: 'Manage wedding planning tasks'
          },
          {
            title: 'Clients',
            href: '/dashboard/planner?tab=clients',
            icon: Users,
            description: 'Manage client relationships'
          },
          {
            title: 'Timeline',
            href: '/dashboard/planner?tab=timeline',
            icon: Calendar,
            description: 'Wedding planning timeline'
          },
          {
            title: 'Settings',
            href: '/dashboard/planner?tab=settings',
            icon: Settings,
            description: 'Account and preferences'
          }
        ]

      default: // user
        return [
          {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            description: 'Wedding planning overview'
          },
          {
            title: 'Planning',
            href: '/planning',
            icon: CheckSquare,
            description: 'Wedding planning tools'
          },
          {
            title: 'Bookings',
            href: '/dashboard?tab=bookings',
            icon: Calendar,
            description: 'Your venue and vendor bookings'
          },
          {
            title: 'Favorites',
            href: '/favorites',
            icon: Heart,
            description: 'Saved vendors and venues'
          },
          {
            title: 'Messages',
            href: '/dashboard?tab=messages',
            icon: MessageSquare,
            description: 'Communicate with vendors'
          },
          {
            title: 'Payments',
            href: '/dashboard?tab=payments',
            icon: CreditCard,
            description: 'Payment history and receipts'
          },
          {
            title: 'Settings',
            href: '/dashboard?tab=settings',
            icon: Settings,
            description: 'Account preferences'
          }
        ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]))
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{item.title}</div>
                <div className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
} 