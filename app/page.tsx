"use client"
import { Suspense } from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { PerformanceOptimizer } from "@/components/ui/performance-optimizer"
import { SkeletonLoader } from "@/components/ui/loading-spinner"
import dynamic from "next/dynamic"

// Lazy load components with better loading states
const AISearchSection = dynamic(() => import("@/components/organisms/ai-search-section"), { 
  loading: () => <SkeletonLoader variant="card" className="h-96" />,
  ssr: true,
})

const WeddingPackagesSection = dynamic(() => import("@/components/organisms/wedding-packages-section"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})

const ServicesSection = dynamic(() => import("@/components/organisms/services-section"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})

const VendorCategoriesSection = dynamic(() => import("@/components/organisms/vendor-categories-section"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})


const VenueSocialFeed = dynamic(() => import("@/components/organisms/venue-social-feed"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})

const TestimonialsSection = dynamic(() => import("@/components/organisms/testimonials-section"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})

const CTASection = dynamic(() => import("@/components/organisms/cta-section"), { 
  loading: () => <SkeletonLoader variant="card" className="py-20" />,
  ssr: true,
})

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="h-96" />}>
            <AISearchSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <WeddingPackagesSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <ServicesSection />
          </Suspense>
        </PerformanceOptimizer>

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <VendorCategoriesSection />
          </Suspense>
        </PerformanceOptimizer>

        <div className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PerformanceOptimizer>
              <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
                <VenueSocialFeed venueId="all" />
              </Suspense>
            </PerformanceOptimizer>
          </div>
        </div>

        {/* Temporarily disabled due to Avatar component bundling issue */}
        {/* <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <TestimonialsSection />
          </Suspense>
        </PerformanceOptimizer> */}

        <PerformanceOptimizer>
          <Suspense fallback={<SkeletonLoader variant="card" className="py-20" />}>
            <CTASection />
          </Suspense>
        </PerformanceOptimizer>
      </div>
    </MainLayout>
  )
}
