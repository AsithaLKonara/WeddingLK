import DashboardNavigation from "@/components/organisms/dashboard-navigation"
import DashboardHeader from "@/components/organisms/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
          <DashboardNavigation />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
} 