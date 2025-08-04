import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { weddingLKAI } from '@/lib/weddinglk-ai-processor'
import { connectDB } from '@/lib/db'

// POST /api/ai-search - AI-powered search
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      query, 
      searchType, 
      filters, 
      userPreferences, 
      eventDetails 
    } = body

    if (!query || !searchType) {
      return NextResponse.json({ 
        error: 'Query and search type are required' 
      }, { status: 400 })
    }

    await connectDB()

    let results
    switch (searchType) {
      case 'venue':
        results = await searchVenues(query, filters)
        break
      case 'vendor':
        results = await searchVendors(query, userPreferences, eventDetails)
        break
      case 'budget':
        results = await optimizeBudget(query, filters)
        break
      case 'timeline':
        results = await generateTimeline(query, eventDetails)
        break
      case 'guest_list':
        results = await manageGuestList(query, filters)
        break
      case 'weather':
        results = await getWeatherRecommendations(query, eventDetails)
        break
      default:
        return NextResponse.json({ 
          error: 'Invalid search type' 
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: results,
      query,
      searchType,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Search error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'AI search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/ai-search - Get search suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')

    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required' 
      }, { status: 400 })
    }

    const suggestions = await getSearchSuggestions(query, type || undefined)

    return NextResponse.json({
      success: true,
      suggestions,
      query,
      type
    })

  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to get search suggestions' },
      { status: 500 }
    )
  }
}

// Search venues with AI
async function searchVenues(query: string, filters: any) {
  try {
    const aiRecommendations = await weddingLKAI.searchVenues(query, filters)
    
    // Combine AI recommendations with database search
    const { Venue } = await import('@/lib/models/venue')
    
    const dbQuery: any = {}
    
    if (filters.location) {
      dbQuery.location = { $regex: filters.location || '', $options: 'i' }
    }
    
    if (filters.budget) {
      dbQuery['packages.price'] = { $lte: filters.budget }
    }
    
    if (filters.guestCount) {
      dbQuery.capacity = { $gte: filters.guestCount }
    }
    
    if (filters.style) {
      dbQuery.style = { $regex: filters.style, $options: 'i' }
    }

    const dbVenues = await Venue.find(dbQuery)
      .limit(20)
      .populate('reviews')
      .lean()

    // Merge AI recommendations with database results
    const mergedResults = dbVenues.map(venue => ({
      ...venue,
      aiScore: calculateAIScore(venue, query, filters),
      matchScore: calculateMatchScore(venue, filters)
    }))

    // Sort by AI score and match score
    mergedResults.sort((a, b) => 
      (b.aiScore + b.matchScore) - (a.aiScore + a.matchScore)
    )

    return {
      venues: mergedResults.slice(0, 10),
      aiRecommendations,
      totalResults: mergedResults.length,
      filters
    }

  } catch (error) {
    console.error('Venue search error:', error)
    return { venues: [], aiRecommendations: [], totalResults: 0, filters }
  }
}

// Search vendors with AI
async function searchVendors(query: string, userPreferences: any, eventDetails: any) {
  try {
    const aiRecommendations = await weddingLKAI.recommendVendors(userPreferences, eventDetails)
    
    // Combine AI recommendations with database search
    const { Vendor } = await import('@/lib/models/vendor')
    
    const dbQuery: any = {}
    
    if (eventDetails.location) {
      dbQuery.location = { $regex: eventDetails.location, $options: 'i' }
    }
    
    if (userPreferences.category) {
      dbQuery.category = { $regex: userPreferences.category, $options: 'i' }
    }
    
    if (eventDetails.budget) {
      dbQuery['packages.price'] = { $lte: eventDetails.budget }
    }

    const dbVendors = await Vendor.find(dbQuery)
      .limit(20)
      .populate('reviews')
      .lean()

    // Merge AI recommendations with database results
    const mergedResults = dbVendors.map(vendor => ({
      ...vendor,
      aiScore: calculateVendorAIScore(vendor, userPreferences, eventDetails),
      matchScore: calculateVendorMatchScore(vendor, eventDetails)
    }))

    // Sort by AI score and match score
    mergedResults.sort((a, b) => 
      (b.aiScore + b.matchScore) - (a.aiScore + a.matchScore)
    )

    return {
      vendors: mergedResults.slice(0, 10),
      aiRecommendations,
      totalResults: mergedResults.length,
      userPreferences,
      eventDetails
    }

  } catch (error) {
    console.error('Vendor search error:', error)
    return { vendors: [], aiRecommendations: [], totalResults: 0, userPreferences, eventDetails }
  }
}

// Optimize budget with AI
async function optimizeBudget(query: string, filters: any) {
  try {
    const budgetData = await weddingLKAI.optimizeBudget(
      filters.totalBudget || 1000000,
      filters.requirements || {}
    )

    return {
      budgetOptimization: budgetData,
      suggestions: budgetData.suggestions || [],
      breakdown: budgetData.breakdown || {},
      query,
      filters
    }

  } catch (error) {
    console.error('Budget optimization error:', error)
    return { 
      budgetOptimization: null, 
      suggestions: [], 
      breakdown: {}, 
      query, 
      filters 
    }
  }
}

// Generate timeline with AI
async function generateTimeline(query: string, eventDetails: any) {
  try {
    const eventDate = eventDetails.date ? new Date(eventDetails.date) : new Date()
    const timelineData = await weddingLKAI.generateTimeline(eventDate, eventDetails.requirements || {})

    return {
      timeline: timelineData.timeline || [],
      eventDate,
      requirements: eventDetails.requirements || {},
      query
    }

  } catch (error) {
    console.error('Timeline generation error:', error)
    return { 
      timeline: [], 
      eventDate: new Date(), 
      requirements: {}, 
      query 
    }
  }
}

// Manage guest list with AI
async function manageGuestList(query: string, filters: any) {
  try {
    const guestListData = await weddingLKAI.manageGuestList(
      filters.guestList || [],
      filters.venueCapacity || 100
    )

    return {
      guestListManagement: guestListData,
      recommendations: guestListData.recommendations || [],
      seating: guestListData.seating || {},
      query,
      filters
    }

  } catch (error) {
    console.error('Guest list management error:', error)
    return { 
      guestListManagement: null, 
      recommendations: [], 
      seating: {}, 
      query, 
      filters 
    }
  }
}

// Get weather recommendations with AI
async function getWeatherRecommendations(query: string, eventDetails: any) {
  try {
    const weatherData = await weddingLKAI.weatherBasedRecommendations(
      eventDetails.location || 'Colombo',
      eventDetails.date ? new Date(eventDetails.date) : new Date()
    )

    return {
      weatherRecommendations: weatherData,
      weather: weatherData.weather || 'Unknown',
      backupPlan: weatherData.backupPlan || '',
      recommendations: weatherData.recommendations || [],
      query,
      eventDetails
    }

  } catch (error) {
    console.error('Weather recommendations error:', error)
    return { 
      weatherRecommendations: null, 
      weather: 'Unknown', 
      backupPlan: '', 
      recommendations: [], 
      query, 
      eventDetails 
    }
  }
}

// Get search suggestions
async function getSearchSuggestions(query: string, type?: string) {
  const suggestions = {
    venues: [
      'Beachfront wedding venues',
      'Garden wedding venues',
      'Hotel wedding venues',
      'Traditional Sri Lankan venues',
      'Luxury wedding venues',
      'Budget-friendly venues',
      'Outdoor wedding venues',
      'Indoor wedding venues'
    ],
    vendors: [
      'Wedding photographers',
      'Wedding videographers',
      'Wedding caterers',
      'Wedding decorators',
      'Wedding planners',
      'Wedding musicians',
      'Wedding transportation',
      'Wedding makeup artists'
    ],
    general: [
      'Wedding planning tips',
      'Wedding budget planning',
      'Wedding timeline',
      'Wedding guest list',
      'Wedding weather considerations',
      'Sri Lankan wedding traditions',
      'Wedding vendor selection',
      'Wedding venue selection'
    ]
  }

  const category = type || 'general'
  const categorySuggestions = suggestions[category as keyof typeof suggestions] || suggestions.general

  // Filter suggestions based on query
  const filteredSuggestions = categorySuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  )

  return filteredSuggestions.slice(0, 5)
}

// Helper functions for scoring
function calculateAIScore(venue: any, query: string, filters: any): number {
  let score = 0
  
  // Query relevance
  if (venue.name.toLowerCase().includes(query.toLowerCase())) score += 0.3
  if (venue.description?.toLowerCase().includes(query.toLowerCase())) score += 0.2
  
  // Filter matching
  if (filters.location && venue.location?.toLowerCase().includes(filters.location.toLowerCase())) score += 0.2
  if (filters.style && venue.style?.toLowerCase().includes(filters.style.toLowerCase())) score += 0.2
  if (filters.budget && venue.packages?.some((p: any) => p.price <= filters.budget)) score += 0.1
  
  return Math.min(score, 1.0)
}

function calculateMatchScore(venue: any, filters: any): number {
  let score = 0
  
  // Capacity matching
  if (filters.guestCount && venue.capacity >= filters.guestCount) score += 0.3
  
  // Budget matching
  if (filters.budget && venue.packages?.some((p: any) => p.price <= filters.budget)) score += 0.3
  
  // Location matching
  if (filters.location && venue.location?.toLowerCase().includes(filters.location.toLowerCase())) score += 0.2
  
  // Rating consideration
  if (venue.rating) score += (venue.rating / 5) * 0.2
  
  return Math.min(score, 1.0)
}

function calculateVendorAIScore(vendor: any, userPreferences: any, eventDetails: any): number {
  let score = 0
  
  // Category matching
  if (userPreferences.category && vendor.category?.toLowerCase().includes(userPreferences.category.toLowerCase())) score += 0.3
  
  // Location matching
  if (eventDetails.location && vendor.location?.toLowerCase().includes(eventDetails.location.toLowerCase())) score += 0.2
  
  // Budget matching
  if (eventDetails.budget && vendor.packages?.some((p: any) => p.price <= eventDetails.budget)) score += 0.2
  
  // Style matching
  if (userPreferences.style && vendor.style?.toLowerCase().includes(userPreferences.style.toLowerCase())) score += 0.2
  
  // Rating consideration
  if (vendor.rating) score += (vendor.rating / 5) * 0.1
  
  return Math.min(score, 1.0)
}

function calculateVendorMatchScore(vendor: any, eventDetails: any): number {
  let score = 0
  
  // Availability matching
  if (eventDetails.date && vendor.availability?.includes(eventDetails.date)) score += 0.4
  
  // Budget matching
  if (eventDetails.budget && vendor.packages?.some((p: any) => p.price <= eventDetails.budget)) score += 0.3
  
  // Location matching
  if (eventDetails.location && vendor.location?.toLowerCase().includes(eventDetails.location.toLowerCase())) score += 0.2
  
  // Rating consideration
  if (vendor.rating) score += (vendor.rating / 5) * 0.1
  
  return Math.min(score, 1.0)
}
