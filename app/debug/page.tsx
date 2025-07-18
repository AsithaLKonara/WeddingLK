import { MainLayout } from "@/components/templates/main-layout"
import dynamic from "next/dynamic"

const NavigationDebug = dynamic(() => import("@/components/organisms/navigation-debug"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function DebugPage() {
  return (
    <MainLayout>
      <NavigationDebug />
    </MainLayout>
  )
}
