"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import Link from "next/link"

interface VendorData {
  _id: string
  name: string
  businessName: string
  category: string
  owner?: {
    name: string
    avatar?: string
  }
}

interface CategoryData {
  name: string
  count: number
  vendors: VendorData[]
  icon: string
  description: string
}

export default function VendorCategoriesSection() {
  const [categories, setCategories] = useState<CategoryData[]>([
    {
      name: "Photography & Videography",
      count: 0,
      vendors: [],
      icon: "📸",
      description: "Capture your special moments with professional photographers and videographers"
    },
    {
      name: "Venues & Locations",
      count: 0,
      vendors: [],
      icon: "🏰",
      description: "Beautiful venues and locations for your perfect wedding day"
    },
    {
      name: "Catering & Food",
      count: 0,
      vendors: [],
      icon: "🍽️",
      description: "Delicious catering services to delight your guests"
    },
    {
      name: "Decoration & Flowers",
      count: 0,
      vendors: [],
      icon: "🌸",
      description: "Stunning decorations and floral arrangements"
    },
    {
      name: "Music & Entertainment",
      count: 0,
      vendors: [],
      icon: "🎵",
      description: "Live music and entertainment to make your celebration memorable"
    },
    {
      name: "Transportation",
      count: 0,
      vendors: [],
      icon: "🚗",
      description: "Reliable transportation services for your wedding day"
    },
    {
      name: "Beauty & Makeup",
      count: 0,
      vendors: [],
      icon: "💄",
      description: "Professional beauty and makeup services"
    },
    {
      name: "Wedding Planning",
      count: 0,
      vendors: [],
      icon: "📋",
      description: "Expert wedding planners to organize your perfect day"
    }
  ])
  const [loading, setLoading] = useState(true)

  // Fetch vendors data from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors/with-avatars')
        if (response.ok) {
          const data = await response.json()
          const vendors = data.vendors || []
          
          // Process vendor data to populate categories
          const updatedCategories = categories.map(category => {
            const categoryVendors = vendors.filter((vendor: VendorData) => 
              category.name.toLowerCase().includes(vendor.category?.toLowerCase() || '') ||
              vendor.category?.toLowerCase().includes(category.name.toLowerCase())
            )
            
            return {
              ...category,
              count: categoryVendors.length,
              vendors: categoryVendors
            }
          })
          
          setCategories(updatedCategories)
        }
      } catch (error) {
        console.error('Error fetching vendors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // Generate default avatar for users
  const getDefaultAvatar = (name: string): string => {
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=200`
  }

  if (loading) {
    return (
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vendor categories...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Wedding Service Categories
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Find the perfect vendors for every aspect of your wedding
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/vendors?category=${encodeURIComponent(category.name)}`}>
                <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 text-4xl">{category.icon}</div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">
                      {category.count} vendors
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {category.description}
                    </p>
                    
                    {/* Show sample vendors */}
                    {category.vendors.slice(0, 3).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Featured vendors:</p>
                        <div className="flex justify-center space-x-1">
                          {category.vendors.slice(0, 3).map((vendor, vendorIndex) => (
                            <Avatar key={vendor._id} className="h-6 w-6">
                              <AvatarImage 
                                src={vendor.owner?.avatar || getDefaultAvatar(vendor.owner?.name || vendor.name)} 
                                alt={vendor.owner?.name || vendor.name} 
                              />
                              <AvatarFallback className="text-xs">
                                {(vendor.owner?.name || vendor.name).split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/vendors">
            <button className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              View All Vendors
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
} 