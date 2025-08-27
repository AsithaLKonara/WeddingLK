"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, MapPin, Phone, Mail, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Vendor {
  _id: string
  name: string
  businessName: string
  category: string
  description: string
  location: {
    city: string
    province: string
  }
  contact: {
    phone: string
    email: string
  }
  rating: {
    average: number
    count: number
  }
  reviewStats: {
    averageRating: number
    count: number
  }
  isVerified: boolean
  isActive: boolean
}

interface VendorCategory {
  value: string
  label: string
  count: number
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<VendorCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setselectedCategory] = useState("all")
  const [selectedLocation, setselectedLocation] = useState("")

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: '20',
        offset: '0'
      })
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedLocation) params.append('location', selectedLocation)
      if (searchQuery) params.append('q', searchQuery)

      const response = await fetch(`/api/vendors/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setVendors(data.vendors)
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedLocation, searchQuery])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/vendors/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.all)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchVendors()
    fetchCategories()
  }, [fetchVendors, fetchCategories])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVendors()
  }

  const handleReset = () => {
    setSearchQuery("")
    setselectedCategory("all")
    setselectedLocation("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Wedding Vendors</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover verified, professional vendors who will make your wedding day truly special
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-2">
              <Search className="h-5 w-5" />
              <span>Search & Filter Vendors</span>
            </h3>
            <p className="text-gray-600 mb-4">
              Find vendors by category, location, or search terms
            </p>
          </div>
          <div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    placeholder="Search vendors, services, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setselectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setselectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
                <button type="button" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50" onClick={handleReset}>
                  Reset Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${vendors.length} Vendors Found`}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {vendors.length} results
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <button onClick={handleReset}>Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="hover:shadow-lg transition-shadow duration-300">
                  <div className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {vendor.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vendor.name} • {vendor.category}
                        </p>
                      </div>
                      {vendor.isVerified && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {vendor.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {vendor.reviewStats.averageRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({vendor.reviewStats.count} reviews)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location.city}, {vendor.location.province}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{vendor.contact.email}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href={`/vendors/${vendor._id}`}>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          View Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Categories */}
        <div>
          <div className="mb-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-2">
              <Filter className="h-5 w-5" />
              <span>Popular Categories</span>
            </h3>
            <p className="text-gray-600 mb-4">
              Browse vendors by popular wedding service categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Photography', count: '45+' },
              { name: 'Catering', count: '38+' },
              { name: 'Decoration', count: '32+' },
              { name: 'Music', count: '28+' },
              { name: 'Transport', count: '25+' },
              { name: 'Beauty', count: '22+' }
            ].map((category) => (
              <Link key={category.name} href={`/vendors?category=${category.name.toLowerCase()}`}>
                <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {category.count} vendors
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 