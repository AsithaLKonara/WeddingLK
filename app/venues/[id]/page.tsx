"use client"

import dynamic from "next/dynamic"
import { MainLayout } from "@/components/templates/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const VenueHero = dynamic(() => import("@/components/organisms/venue-hero"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VenueDetails = dynamic(() => import("@/components/organisms/venue-details"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VenueGallery = dynamic(() => import("@/components/organisms/venue-gallery"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VenueReviews = dynamic(() => import("@/components/organisms/venue-reviews"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const SimilarVenues = dynamic(() => import("@/components/organisms/similar-venues"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VenueBooking = dynamic(() => import("@/components/organisms/venue-booking"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

interface VenuePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { id } = await params
  
  // Mock venue data - replace with actual API call
  const venue = {
    id: id,
    name: "Grand Ballroom Hotel",
    location: "Colombo",
    capacity: 300,
    price: 150000,
    rating: 4.7,
    reviewCount: 89,
    description: "Luxurious wedding venue with stunning ocean views",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    amenities: ["Parking", "Catering", "Decoration", "Audio/Visual", "Bridal Suite"],
    contact: {
      phone: "+94 11 234 5678",
      email: "events@grandballroom.lk",
      website: "www.grandballroom.lk"
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <VenueHero venue={venue} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="similar">Similar</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <VenueDetails venue={venue} />
                </TabsContent>

                <TabsContent value="gallery">
                  <VenueGallery images={venue.images} />
                </TabsContent>

                <TabsContent value="reviews">
                  <VenueReviews venueId={venue.id} />
                </TabsContent>

                <TabsContent value="similar">
                  <SimilarVenues currentVenueId={venue.id} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <VenueBooking venue={venue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
