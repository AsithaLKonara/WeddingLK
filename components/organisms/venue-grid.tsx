"use client"
import { VenueCard } from "@/components/molecules/venue-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SlidersHorizontal } from "lucide-react"

interface VenueGridProps {
  filters: any
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: string
  onViewModeChange: (mode: string) => void
}

export function VenueGrid({ filters, sortBy, onSortChange, viewMode, onViewModeChange }: VenueGridProps) {
  // Mock venues data
  const venues = [
    {
      id: 1,
      name: "Grand Ballroom Hotel",
      location: "Colombo",
      capacity: 300,
      price: 150000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Parking", "Catering", "Decoration", "Sound System"],
    },
    {
      id: 2,
      name: "Garden Paradise Resort",
      location: "Kandy",
      capacity: 200,
      price: 120000,
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Garden", "Pool", "Accommodation", "Photography"],
    },
    {
      id: 3,
      name: "Seaside Wedding Villa",
      location: "Galle",
      capacity: 150,
      price: 100000,
      rating: 4.9,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Beach View", "Photography", "Catering"],
    },
    {
      id: 4,
      name: "Mountain View Resort",
      location: "Ella",
      capacity: 120,
      price: 90000,
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Mountain View", "Garden", "Accommodation"],
    },
    {
      id: 5,
      name: "City Center Ballroom",
      location: "Colombo",
      capacity: 250,
      price: 130000,
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Parking", "AC", "Sound System", "WiFi"],
    },
    {
      id: 6,
      name: "Lakeside Pavilion",
      location: "Kandy",
      capacity: 180,
      price: 110000,
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=400",
      amenities: ["Lake View", "Garden", "Catering", "Decoration"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{venues.length} venues found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Perfect venues for your special day</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div
        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {venues.map((venue) => (
          <VenueCard key={venue.id} {...venue} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg">
          Load More Venues
        </Button>
      </div>
    </div>
  )
}
