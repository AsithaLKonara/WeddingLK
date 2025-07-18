"use client"

import dynamic from "next/dynamic"

import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const VenueFilters = dynamic(() => import("@/components/organisms/venue-filters"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

const VenueGrid = dynamic(() => import("@/components/organisms/venue-grid"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

const SearchHeader = dynamic(() => import("@/components/organisms/search-header"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function VenuesPage() {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 500000],
    capacity: "",
    amenities: [],
    rating: 0,
  })

  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState("grid")

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SearchHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <VenueFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <VenueGrid
                filters={filters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
