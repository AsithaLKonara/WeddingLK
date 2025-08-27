"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Filter, 
  Search, 
  Star, 
  MapPin, 
  Users, 
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  TrendingUp,
  Zap,
  Crown,
  Sparkles,
  ImageIcon
} from "lucide-react"
import Image from "next/image"

interface WeddingPackage {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: 'LKR'
  category: 'basic' | 'premium' | 'luxury' | 'custom'
  features: string[]
  images: string[]
  vendor: {
    id: string
    name: string
    avatar: string
    rating: number
    reviewCount: number
    verified: boolean
  }
  location: string
  maxGuests: number
  duration: string
  availability: string[]
  boostType?: 'featured' | 'trending' | 'popular'
  boostExpiry?: Date
  tags: string[]
  rating: number
  reviewCount: number
  isBookmarked: boolean
}

export default function WeddingPackagesPage() {
  const [packages, setPackages] = useState<WeddingPackage[]>([])
  const [filteredPackages, setFilteredPackages] = useState<WeddingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("popular")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockPackages: WeddingPackage[] = [
      {
        id: "1",
        name: "Dream Wedding Package",
        description: "Complete wedding planning and execution with premium services",
        price: 850000,
        originalPrice: 950000,
        currency: 'LKR',
        category: 'premium',
        features: [
          "Full wedding planning",
          "Venue decoration",
          "Catering for 200 guests",
          "Photography & videography",
          "Wedding cake",
          "Bridal makeup & styling",
          "Live music band",
          "Transportation"
        ],
        images: ["/packages/dream-wedding-1.jpg", "/packages/dream-wedding-2.jpg"],
        vendor: {
          id: "vendor1",
          name: "Elegant Events",
          avatar: "/vendors/elegant-events.jpg",
          rating: 4.8,
          reviewCount: 127,
          verified: true
        },
        location: "Colombo",
        maxGuests: 200,
        duration: "Full Day",
        availability: ["Weekends", "Weekdays"],
        boostType: 'featured',
        boostExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: ["premium", "all-inclusive", "colombo"],
        rating: 4.8,
        reviewCount: 127,
        isBookmarked: false
      },
      {
        id: "2",
        name: "Intimate Garden Wedding",
        description: "Beautiful outdoor wedding in a stunning garden setting",
        price: 450000,
        currency: 'LKR',
        category: 'basic',
        features: [
          "Garden venue",
          "Basic decoration",
          "Catering for 50 guests",
          "Photography",
          "Simple cake",
          "Basic styling"
        ],
        images: ["/packages/garden-wedding-1.jpg"],
        vendor: {
          id: "vendor2",
          name: "Garden Dreams",
          avatar: "/vendors/garden-dreams.jpg",
          rating: 4.5,
          reviewCount: 89,
          verified: true
        },
        location: "Kandy",
        maxGuests: 50,
        duration: "Half Day",
        availability: ["Weekends"],
        tags: ["outdoor", "intimate", "garden"],
        rating: 4.5,
        reviewCount: 89,
        isBookmarked: false
      },
      {
        id: "3",
        name: "Luxury Beach Wedding",
        description: "Exclusive beachfront wedding with luxury amenities",
        price: 1200000,
        originalPrice: 1400000,
        currency: 'LKR',
        category: 'luxury',
        features: [
          "Beachfront venue",
          "Luxury decoration",
          "Premium catering",
          "Professional photography",
          "Wedding planner",
          "Luxury accommodation",
          "Spa services",
          "Water sports activities"
        ],
        images: ["/packages/beach-wedding-1.jpg", "/packages/beach-wedding-2.jpg"],
        vendor: {
          id: "vendor3",
          name: "Luxury Weddings SL",
          avatar: "/vendors/luxury-weddings.jpg",
          rating: 4.9,
          reviewCount: 203,
          verified: true
        },
        location: "Galle",
        maxGuests: 150,
        duration: "2 Days",
        availability: ["Weekends", "Weekdays"],
        boostType: 'trending',
        boostExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        tags: ["luxury", "beachfront", "exclusive"],
        rating: 4.9,
        reviewCount: 203,
        isBookmarked: false
      }
    ]
    
    setPackages(mockPackages)
    setFilteredPackages(mockPackages)
    setLoading(false)
  }, [])

  // Filter and sort packages
  useEffect(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory
      const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
      const matchesLocation = selectedLocation === "all" || pkg.location === selectedLocation
      const matchesFeatures = selectedFeatures.length === 0 || 
                             selectedFeatures.some(feature => pkg.features.includes(feature))
      
      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesFeatures
    })

    // Sort packages
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.boostExpiry || 0).getTime() - new Date(a.boostExpiry || 0).getTime())
        break
    }

    setFilteredPackages(filtered)
  }, [packages, searchQuery, selectedCategory, priceRange, selectedLocation, selectedFeatures, sortBy])

  const handleBookmark = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId ? { ...pkg, isBookmarked: !pkg.isBookmarked } : pkg
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getBoostBadge = (boostType?: string) => {
    if (!boostType) return null
    
    const boostConfig = {
      featured: { label: "Featured", icon: Crown, className: "bg-purple-500" },
      trending: { label: "Trending", icon: TrendingUp, className: "bg-orange-500" },
      popular: { label: "Popular", icon: Sparkles, className: "bg-pink-500" }
    }
    
    const config = boostConfig[boostType as keyof typeof boostConfig]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <Badge className={`${config.className} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wedding packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wedding Packages</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the perfect wedding package for your special day. From intimate gatherings to grand celebrations, 
          we have options for every style and budget.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Jaffna">Jaffna</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000000}
                  step={10000}
                  className="w-full"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="space-y-2">
                  {["Photography", "Catering", "Decoration", "Music", "Transportation"].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures(prev => [...prev, feature])
                          } else {
                            setSelectedFeatures(prev => prev.filter(f => f !== feature))
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm text-gray-600">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredPackages.length} of {packages.length} packages
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Package Image */}
            <div className="relative h-48 bg-gray-200">
              {pkg.images[0] ? (
                <Image
                  src={pkg.images[0]}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
              
              {/* Boost Badge */}
              {pkg.boostType && (
                <div className="absolute top-2 left-2">
                  {getBoostBadge(pkg.boostType)}
                </div>
              )}
              
              {/* Bookmark Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleBookmark(pkg.id)}
              >
                <Heart className={`h-4 w-4 ${pkg.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              {/* Price */}
              <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-3 py-1">
                <p className="text-lg font-bold text-green-600">{formatPrice(pkg.price)}</p>
                {pkg.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(pkg.originalPrice)}
                  </p>
                )}
              </div>
            </div>

            {/* Package Content */}
            <CardContent className="p-4">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{pkg.name}</h3>
                  <Badge variant={pkg.category === 'luxury' ? 'default' : 'secondary'}>
                    {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{pkg.description}</p>
              </div>

              {/* Vendor Info */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                  {pkg.vendor.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{pkg.vendor.name}</span>
                {pkg.vendor.verified && (
                  <Badge variant="outline" className="text-xs">Verified</Badge>
                )}
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{pkg.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Up to {pkg.maxGuests}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{pkg.rating} ({pkg.reviewCount})</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                <div className="flex flex-wrap gap-1">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {pkg.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pkg.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button className="flex-1 mr-2">
                  View Details
                </Button>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or filters to find what you're looking for.
          </p>
          <Button onClick={() => {
            setSearchQuery("")
            setSelectedCategory("all")
            setPriceRange([0, 1000000])
            setSelectedLocation("all")
            setSelectedFeatures([])
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
