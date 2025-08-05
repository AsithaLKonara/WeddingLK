import { NextRequest, NextResponse } from 'next/server'

// Mock search data
const venues = [
  {
    id: 'venue_1',
    name: 'Grand Ballroom Hotel',
    location: 'Colombo',
    price: 50000,
    rating: 4.8,
    description: 'Luxurious wedding venue with stunning architecture',
    image: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Grand+Ballroom',
    capacity: 300,
    amenities: ['parking', 'catering', 'decoration']
  },
  {
    id: 'venue_2',
    name: 'Garden Palace',
    location: 'Kandy',
    price: 35000,
    rating: 4.6,
    description: 'Beautiful garden venue perfect for outdoor weddings',
    image: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Garden+Palace',
    capacity: 200,
    amenities: ['garden', 'outdoor', 'photography']
  },
  {
    id: 'venue_3',
    name: 'Ocean View Resort',
    location: 'Galle',
    price: 75000,
    rating: 4.9,
    description: 'Stunning beachfront venue with ocean views',
    image: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Ocean+View',
    capacity: 250,
    amenities: ['beach', 'ocean-view', 'luxury']
  }
]

const vendors = [
  {
    id: 'vendor_1',
    name: 'Perfect Moments Photography',
    category: 'Photography',
    location: 'Colombo',
    price: 25000,
    rating: 4.9,
    description: 'Professional wedding photography services',
    image: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Photography',
    services: ['wedding', 'engagement', 'portrait']
  },
  {
    id: 'vendor_2',
    name: 'Elegant Decorators',
    category: 'Decoration',
    location: 'Colombo',
    price: 15000,
    rating: 4.7,
    description: 'Beautiful wedding decorations and floral arrangements',
    image: 'https://via.placeholder.com/400x300/96ceb4/ffffff?text=Decorations',
    services: ['floral', 'lighting', 'themes']
  },
  {
    id: 'vendor_3',
    name: 'Sweet Dreams Catering',
    category: 'Catering',
    location: 'Kandy',
    price: 20000,
    rating: 4.8,
    description: 'Delicious wedding catering with multiple menu options',
    image: 'https://via.placeholder.com/400x300/ffa726/ffffff?text=Catering',
    services: ['buffet', 'plated', 'desserts']
  }
]

// POST /api/ai-search - AI-powered search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, searchType, filters } = body

    if (!query || !searchType) {
      return NextResponse.json({
        error: 'Query and search type are required'
      }, { status: 400 })
    }

    const results: { venues: any[], vendors: any[] } = { venues: [], vendors: [] }
    const aiRecommendations: string[] = []

    // AI-powered search logic
    if (searchType === 'venue' || searchType === 'all') {
      results.venues = venues.filter(venue => {
        const matchesQuery = venue.name.toLowerCase().includes(query.toLowerCase()) ||
                           venue.location.toLowerCase().includes(query.toLowerCase()) ||
                           venue.description.toLowerCase().includes(query.toLowerCase())
        
        if (filters) {
          if (filters.budget && venue.price > filters.budget.max) return false
          if (filters.location && venue.location !== filters.location) return false
          if (filters.guestCount && venue.capacity < filters.guestCount) return false
        }
        
        return matchesQuery
      })
    }

    if (searchType === 'vendor' || searchType === 'all') {
      results.vendors = vendors.filter(vendor => {
        const matchesQuery = vendor.name.toLowerCase().includes(query.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(query.toLowerCase()) ||
                           vendor.description.toLowerCase().includes(query.toLowerCase())
        
        if (filters) {
          if (filters.budget && vendor.price > filters.budget.max) return false
          if (filters.location && vendor.location !== filters.location) return false
          if (filters.category && vendor.category !== filters.category) return false
        }
        
        return matchesQuery
      })
    }

    // AI recommendations based on search
    if (query.toLowerCase().includes('affordable') || query.toLowerCase().includes('budget')) {
      aiRecommendations.push('Consider booking during off-peak season for better rates')
      aiRecommendations.push('Look for venues that offer all-inclusive packages')
    }

    if (query.toLowerCase().includes('colombo')) {
      aiRecommendations.push('Colombo venues are popular - book at least 6 months in advance')
      aiRecommendations.push('Consider weekday weddings for better availability')
    }

    if (results.venues.length > 0 || results.vendors.length > 0) {
      aiRecommendations.push('Compare multiple options before making a decision')
      aiRecommendations.push('Read reviews and check vendor portfolios')
    }

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        aiRecommendations
      },
      query,
      searchType,
      filters,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'AI search failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/ai-search - Get search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({
        error: 'Query parameter is required'
      }, { status: 400 })
    }

    const allSuggestions = [
      'Wedding venues in Colombo',
      'Photographers in Sri Lanka',
      'Wedding planners near me',
      'Catering services for weddings',
      'Wedding decoration ideas',
      'Wedding cake designers',
      'Wedding transportation services',
      'Wedding music and entertainment',
      'Affordable wedding venues',
      'Luxury wedding venues',
      'Outdoor wedding venues',
      'Beach wedding venues',
      'Garden wedding venues',
      'Wedding photographers',
      'Wedding videographers',
      'Wedding makeup artists',
      'Wedding dress designers',
      'Wedding invitation designers'
    ]

    const suggestions = allSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)

    return NextResponse.json({
      success: true,
      suggestions,
      query,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get search suggestions',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 