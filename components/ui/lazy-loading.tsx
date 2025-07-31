"use client"

import { Suspense, lazy, ComponentType } from "react"
import { Loader2 } from "lucide-react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  [key: string]: any
}

export function LazyComponent({ component, fallback, ...props }: LazyComponentProps) {
  const LazyComponent = lazy(component)
  
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}

// Lazy loading for main page components
export const LazyAISearchSection = lazy(() => import("@/components/organisms/ai-search-section"))
export const LazyWeddingPackagesSection = lazy(() => import("@/components/organisms/wedding-packages-section"))
export const LazyServicesSection = lazy(() => import("@/components/organisms/services-section"))
export const LazyVendorCategoriesSection = lazy(() => import("@/components/organisms/vendor-categories-section"))
export const LazyVenueSocialFeed = lazy(() => import("@/components/organisms/venue-social-feed"))
export const LazyTestimonialsSection = lazy(() => import("@/components/organisms/testimonials-section"))
export const LazyCTASection = lazy(() => import("@/components/organisms/cta-section"))

// Lazy loading for about page components
export const LazyAboutHero = lazy(() => import("@/components/organisms/about-hero"))
export const LazyAboutStory = lazy(() => import("@/components/organisms/about-story"))
export const LazyTeamSection = lazy(() => import("@/components/organisms/team-section"))
export const LazyStatsSection = lazy(() => import("@/components/organisms/stats-section"))

// Lazy loading for contact page components
export const LazyContactForm = lazy(() => import("@/components/organisms/contact-form"))
export const LazyContactInfo = lazy(() => import("@/components/organisms/contact-info"))

// Lazy loading for venue components
export const LazyVenueHero = lazy(() => import("@/components/organisms/venue-hero"))
export const LazyVenueDetails = lazy(() => import("@/components/organisms/venue-details"))
export const LazyVenueGallery = lazy(() => import("@/components/organisms/venue-gallery"))
export const LazyVenueReviews = lazy(() => import("@/components/organisms/venue-reviews"))
export const LazyVenueBooking = lazy(() => import("@/components/organisms/venue-booking"))
export const LazySimilarVenues = lazy(() => import("@/components/organisms/similar-venues"))

// Lazy loading for vendor components
export const LazyVendorProfile = lazy(() => import("@/components/organisms/vendor-profile"))
export const LazyVendorPortfolio = lazy(() => import("@/components/organisms/vendor-portfolio"))
export const LazyVendorReviews = lazy(() => import("@/components/organisms/vendor-reviews"))
export const LazyVendorContact = lazy(() => import("@/components/organisms/vendor-contact"))

// Lazy loading for profile components
export const LazyProfileHeader = lazy(() => import("@/components/organisms/profile-header"))
export const LazyProfileTabs = lazy(() => import("@/components/organisms/profile-tabs"))

// Lazy loading for dashboard components
export const LazyDashboardHeader = lazy(() => import("@/components/organisms/dashboard-header"))
export const LazyQuickActions = lazy(() => import("@/components/organisms/quick-actions"))
export const LazyRecentActivity = lazy(() => import("@/components/organisms/recent-activity"))
export const LazyUpcomingTasks = lazy(() => import("@/components/organisms/upcoming-tasks"))

// Lazy loading for auth components
export const LazyLoginForm = lazy(() => import("@/components/auth/login-form"))
export const LazyRegisterForm = lazy(() => import("@/components/auth/register-form"))

// Lazy loading for search and filter components
export const LazyAdvancedSearch = lazy(() => import("@/components/organisms/advanced-search"))
export const LazyVenueFilters = lazy(() => import("@/components/organisms/venue-filters"))
export const LazyVendorFilters = lazy(() => import("@/components/organisms/vendor-filters"))

// Lazy loading for gallery and media components
export const LazyPhotoGrid = lazy(() => import("@/components/organisms/photo-grid"))
export const LazyGalleryFilters = lazy(() => import("@/components/organisms/gallery-filters"))

// Lazy loading for social and feed components
export const LazyFeedPosts = lazy(() => import("@/components/organisms/feed-posts"))
export const LazyFeedSidebar = lazy(() => import("@/components/organisms/feed-sidebar"))
export const LazyFeedStories = lazy(() => import("@/components/organisms/feed-stories"))

// Lazy loading for planning and management components
export const LazyWeddingChecklist = lazy(() => import("@/components/organisms/wedding-checklist"))
export const LazyWeddingDetails = lazy(() => import("@/components/organisms/wedding-details"))
export const LazyGuestList = lazy(() => import("@/components/organisms/guest-list"))
export const LazyBudgetTracker = lazy(() => import("@/components/organisms/budget-tracker"))

// Lazy loading for payment and subscription components
export const LazyPaymentForm = lazy(() => import("@/components/organisms/payment-form"))
export const LazySubscriptionPlans = lazy(() => import("@/components/organisms/subscription-plans"))

// Lazy loading for settings and configuration components
export const LazyAccountSettings = lazy(() => import("@/components/organisms/account-settings"))
export const LazyNotificationSettings = lazy(() => import("@/components/organisms/notification-settings"))
export const LazyPersonalInfo = lazy(() => import("@/components/organisms/personal-info"))

// Lazy loading for AI and enhancement components
export const LazyAISearchResults = lazy(() => import("@/components/molecules/ai-search-results"))
export const LazyCulturalWeddingTools = lazy(() => import("@/components/organisms/cultural-wedding-tools"))

// Lazy loading for premium features
export const LazyPremiumCoupleFeatures = lazy(() => import("@/components/organisms/premium-couple-features"))
export const LazyCommissionTracker = lazy(() => import("@/components/organisms/commission-tracker"))

// Lazy loading for favorites and saved items
export const LazyFavoriteVendors = lazy(() => import("@/components/organisms/favorite-vendors"))
export const LazyFavoriteVenues = lazy(() => import("@/components/organisms/favorite-venues"))
export const LazyFavoritesTabs = lazy(() => import("@/components/organisms/favorites-tabs"))
export const LazySavedVenues = lazy(() => import("@/components/organisms/saved-venues"))

// Lazy loading for testimonials and reviews
export const LazyTestimonialCard = lazy(() => import("@/components/molecules/testimonial-card"))

// Lazy loading for services and packages
export const LazyServiceCard = lazy(() => import("@/components/molecules/service-card"))
export const LazyWeddingPackageCard = lazy(() => import("@/components/molecules/wedding-package-card"))

// Lazy loading for vendor and venue grids
export const LazyVendorGrid = lazy(() => import("@/components/organisms/vendor-grid"))
export const LazyVendorCard = lazy(() => import("@/components/molecules/vendor-card"))
export const LazyVenueGrid = lazy(() => import("@/components/organisms/venue-grid"))
export const LazyVenueCard = lazy(() => import("@/components/molecules/venue-card"))

// Lazy loading for categories and navigation
export const LazyVendorCategories = lazy(() => import("@/components/organisms/vendor-categories"))
export const LazyVendorCategoryCard = lazy(() => import("@/components/molecules/vendor-category-card"))

// Lazy loading for social feed and venue social features
export const LazyVenueSocialFeedEnhanced = lazy(() => import("@/components/organisms/venue-social-feed-enhanced"))

// Lazy loading for CTA and marketing components
export const LazyFeaturesSection = lazy(() => import("@/components/organisms/features-section"))
export const LazyFeatureCard = lazy(() => import("@/components/molecules/feature-card"))

// Lazy loading for planning tabs and tools
export const LazyPlanningTabs = lazy(() => import("@/components/organisms/planning-tabs"))

// Lazy loading for platform status and debugging
export const LazyPlatformStatus = lazy(() => import("@/components/organisms/platform-status"))
export const LazyNavigationDebug = lazy(() => import("@/components/organisms/navigation-debug"))

// Lazy loading for booking and confirmation
export const LazyBookingConfirmation = lazy(() => import("@/components/organisms/booking-confirmation"))

// Lazy loading for search header
export const LazySearchHeader = lazy(() => import("@/components/organisms/search-header"))

// Lazy loading for location and dropdown components
export const LazyLocationDropdown = lazy(() => import("@/components/molecules/location-dropdown"))

// Lazy loading for mobile components
export const LazyMobileMenu = lazy(() => import("@/components/molecules/mobile-menu"))

// Lazy loading for navigation components
export const LazyNavigationMenu = lazy(() => import("@/components/molecules/navigation-menu"))

// Lazy loading for social links
export const LazySocialLinks = lazy(() => import("@/components/molecules/social-links"))

// Lazy loading for theme toggle
export const LazyThemeToggle = lazy(() => import("@/components/molecules/theme-toggle"))

// Lazy loading for animated background
export const LazyAnimatedBackground = lazy(() => import("@/components/atoms/animated-background"))

// Lazy loading for logo
export const LazyLogo = lazy(() => import("@/components/atoms/logo"))

// Lazy loading for error boundary
export const LazyErrorBoundary = lazy(() => import("@/components/organisms/error-boundary"))

// Lazy loading for header and footer
export const LazyHeader = lazy(() => import("@/components/organisms/header"))
export const LazyFooter = lazy(() => import("@/components/organisms/footer"))

// Lazy loading for main layout
export const LazyMainLayout = lazy(() => import("@/components/templates/main-layout"))

// Lazy loading for theme provider
export const LazyThemeProvider = lazy(() => import("@/components/providers/theme-provider"))


export default LazyComponent
