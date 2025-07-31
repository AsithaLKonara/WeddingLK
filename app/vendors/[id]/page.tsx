"use client"

import dynamic from "next/dynamic"
import { MainLayout } from "@/components/templates/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const VendorProfile = dynamic(() => import("@/components/organisms/vendor-profile"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VendorPortfolio = dynamic(() => import("@/components/organisms/vendor-portfolio"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VendorReviews = dynamic(() => import("@/components/organisms/vendor-reviews"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VendorContact = dynamic(() => import("@/components/organisms/vendor-contact"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

interface VendorPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params
  
  // Mock vendor data - replace with actual API call
  const vendor = {
    id: id,
    name: "Elegant Events & Catering",
    category: "Catering",
    location: "Colombo",
    rating: 4.8,
    reviewCount: 127,
    experience: "15+ years",
    price: 75000,
    avatar: "/placeholder.jpg",
    coverImage: "/placeholder.jpg",
    description: "Premium catering services for weddings and special events",
    services: ["Wedding Catering", "Event Planning", "Decoration", "Staffing"],
    portfolio: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    contact: {
      email: "info@elegantevents.lk",
      phone: "+94 11 234 5678",
      website: "www.elegantevents.lk"
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">{vendor.category}</Badge>
            <span className="text-gray-600">{vendor.location}</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span>{vendor.rating}</span>
              <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <VendorProfile vendor={vendor} />
          </TabsContent>

          <TabsContent value="portfolio">
            <VendorPortfolio portfolio={vendor.portfolio} />
          </TabsContent>

          <TabsContent value="reviews">
            <VendorReviews vendorId={vendor.id} />
          </TabsContent>

          <TabsContent value="contact">
            <VendorContact vendor={vendor} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
