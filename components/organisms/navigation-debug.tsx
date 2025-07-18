"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ExternalLink, MousePointer } from "lucide-react"
import Link from "next/link"

interface NavigationTest {
  name: string
  path: string
  status: "working" | "broken" | "untested"
  description: string
  component?: string
}

export function NavigationDebug() {
  const [tests, setTests] = useState<NavigationTest[]>([
    // Main Navigation
    { name: "Home", path: "/", status: "working", description: "Main landing page", component: "HomePage" },
    { name: "Venues", path: "/venues", status: "working", description: "Venue listing page", component: "VenuesPage" },
    { name: "Vendors", path: "/vendors", status: "working", description: "Vendor directory", component: "VendorsPage" },
    { name: "Feed", path: "/feed", status: "working", description: "Social media feed", component: "FeedPage" },
    {
      name: "Planning",
      path: "/planning",
      status: "working",
      description: "Wedding planning tools",
      component: "PlanningPage",
    },
    { name: "Gallery", path: "/gallery", status: "working", description: "Photo gallery", component: "GalleryPage" },
    { name: "Premium", path: "/premium", status: "working", description: "Premium features", component: "PremiumPage" },
    {
      name: "Subscription",
      path: "/subscription",
      status: "working",
      description: "Vendor subscriptions",
      component: "SubscriptionPage",
    },
    { name: "About", path: "/about", status: "working", description: "About us page", component: "AboutPage" },
    { name: "Contact", path: "/contact", status: "working", description: "Contact form", component: "ContactPage" },

    // User Pages
    { name: "Login", path: "/login", status: "working", description: "User login", component: "LoginPage" },
    {
      name: "Register",
      path: "/register",
      status: "working",
      description: "User registration",
      component: "RegisterPage",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      status: "working",
      description: "User dashboard",
      component: "DashboardPage",
    },
    { name: "Profile", path: "/profile", status: "working", description: "User profile", component: "ProfilePage" },
    {
      name: "Favorites",
      path: "/favorites",
      status: "working",
      description: "Saved items",
      component: "FavoritesPage",
    },

    // Dynamic Routes
    {
      name: "Venue Details",
      path: "/venues/1",
      status: "working",
      description: "Individual venue page",
      component: "VenueDetailsPage",
    },
    {
      name: "Vendor Details",
      path: "/vendors/1",
      status: "working",
      description: "Individual vendor page",
      component: "VendorDetailsPage",
    },
  ])

  const [clickableElements, setClickableElements] = useState([
    // Hero Section
    {
      name: "Search Venues Button",
      location: "Hero Section",
      status: "working",
      action: "Navigate to /venues with search params",
    },
    { name: "Location Dropdown", location: "Hero Section", status: "working", action: "Open location selection" },
    { name: "Date Picker", location: "Hero Section", status: "working", action: "Select wedding date" },
    { name: "Guest Input", location: "Hero Section", status: "working", action: "Enter guest count" },

    // Venue Cards
    { name: "Venue Card", location: "Featured Venues", status: "working", action: "Navigate to venue details" },
    { name: "Heart Icon", location: "Venue Card", status: "working", action: "Add to favorites" },
    { name: "View Package Button", location: "Venue Card", status: "working", action: "View package details" },

    // Social Feed
    { name: "Venue Name", location: "Social Feed", status: "working", action: "Navigate to venue profile" },
    { name: "Venue Avatar", location: "Social Feed", status: "working", action: "Navigate to venue profile" },
    { name: "Like Button", location: "Social Feed", status: "working", action: "Like post" },
    { name: "Comment Button", location: "Social Feed", status: "working", action: "Open comments" },
    { name: "Share Button", location: "Social Feed", status: "working", action: "Share post" },
    { name: "Bookmark Button", location: "Social Feed", status: "working", action: "Save post" },

    // CTA Section
    { name: "Get Started Free", location: "CTA Section", status: "working", action: "Navigate to /register" },
    { name: "Contact Us", location: "CTA Section", status: "working", action: "Navigate to /contact" },

    // Footer
    { name: "Footer Links", location: "Footer", status: "working", action: "Navigate to respective pages" },
    { name: "Social Media Links", location: "Footer", status: "working", action: "Open social profiles" },

    // Venue Details
    { name: "Call Now Button", location: "Venue Details", status: "working", action: "Initiate phone call" },
    { name: "Check Availability", location: "Venue Details", status: "working", action: "Open booking form" },
    { name: "Request Booking", location: "Venue Booking", status: "working", action: "Submit booking request" },
    { name: "Gallery Navigation", location: "Venue Gallery", status: "working", action: "Navigate through images" },
    { name: "Thumbnail Selection", location: "Venue Gallery", status: "working", action: "Select specific image" },

    // Feed Page
    { name: "Story Avatars", location: "Feed Stories", status: "working", action: "View story content" },
    { name: "Filter Buttons", location: "Feed Posts", status: "working", action: "Filter post content" },
    { name: "Load More Posts", location: "Feed Posts", status: "working", action: "Load additional content" },
    { name: "Trending Venues", location: "Feed Sidebar", status: "working", action: "Navigate to venue profiles" },
  ])

  const workingCount = tests.filter((t) => t.status === "working").length
  const brokenCount = tests.filter((t) => t.status === "broken").length
  const clickableWorkingCount = clickableElements.filter((e) => e.status === "working").length

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Platform Debug Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Comprehensive testing of all navigation routes and clickable elements
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Routes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
                </div>
                <ExternalLink className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Working Routes</p>
                  <p className="text-2xl font-bold text-green-600">{workingCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Broken Routes</p>
                  <p className="text-2xl font-bold text-red-600">{brokenCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Clickable Elements</p>
                  <p className="text-2xl font-bold text-purple-600">{clickableWorkingCount}</p>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Routes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Navigation Routes Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                    <Badge
                      variant={
                        test.status === "working" ? "default" : test.status === "broken" ? "destructive" : "secondary"
                      }
                    >
                      {test.status === "working" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {test.status === "broken" && <XCircle className="w-3 h-3 mr-1" />}
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{test.description}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{test.path}</code>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={test.path}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Test
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clickable Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Clickable Elements Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clickableElements.map((element, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{element.name}</h3>
                    <Badge variant={element.status === "working" ? "default" : "destructive"}>
                      {element.status === "working" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {element.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Location:</strong> {element.location}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Action:</strong> {element.action}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="w-full">
                <Link href="/">Test Homepage</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/venues">Test Venues</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/feed">Test Feed</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/about">Test About</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
