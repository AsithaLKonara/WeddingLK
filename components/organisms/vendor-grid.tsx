"use client"

import { VendorCard } from "@/components/molecules/vendor-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

interface VendorGridProps {
  category: string
  filters: any
}

export function VendorGrid({ category, filters }: VendorGridProps) {
  // Mock vendors data
  const vendors = [
    {
      id: 1,
      name: "Perfect Moments Photography",
      category: "Photography",
      location: "Colombo",
      rating: 4.9,
      price: 75000,
      image: "/placeholder.svg?height=200&width=300",
      portfolio: ["/placeholder.svg?height=150&width=200"],
    },
    {
      id: 2,
      name: "Delicious Catering Co.",
      category: "Catering",
      location: "Galle",
      rating: 4.7,
      price: 2500,
      image: "/placeholder.svg?height=200&width=300",
      portfolio: ["/placeholder.svg?height=150&width=200"],
    },
    {
      id: 3,
      name: "Harmony Live Band",
      category: "Entertainment",
      location: "Kandy",
      rating: 4.8,
      price: 45000,
      image: "/placeholder.svg?height=200&width=300",
      portfolio: ["/placeholder.svg?height=150&width=200"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{vendors.length} vendors found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Trusted professionals for your wedding</p>
        </div>

        <div className="flex items-center space-x-4">
          <Select defaultValue="popular">
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} {...vendor} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg">
          Load More Vendors
        </Button>
      </div>
    </div>
  )
}
