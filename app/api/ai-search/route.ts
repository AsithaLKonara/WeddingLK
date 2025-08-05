import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/database'
import Venue from '@/lib/models/Venue'
import Vendor from '@/lib/models/Vendor'
import AIService from '@/lib/ai-service'
import SecurityService from '@/lib/security-service'
import PerformanceMonitor from '@/lib/performance-monitor'

// Helper functions
function calculateAIScore(item: any, query: string, filters: any): number {
  let score = 0
  
  // Location match
  if (filters?.location && item.location?.toLowerCase().includes(filters.location.toLowerCase())) {
    score += 30
  }
  
  // Price range match
  if (filters?.maxPrice && item.price <= filters.maxPrice) {
    score += 20
  }
  
  // Capacity match for venues
  if (filters?.guestCount && item.capacity >= filters.guestCount) {
    score += 25
  }
  
  // Rating boost
  if (item.rating) {
    score += item.rating * 5
  }
  
  // Query relevance
  const queryLower = query.toLowerCase()
  if (item.name?.toLowerCase().includes(queryLower)) score += 15
  if (item.description?.toLowerCase().includes(queryLower)) score += 10
  
  return Math.min(score, 100)
}

function generateMatchReasons(item: any, query: string, filters: any): string[] {
  const reasons = []
  
  if (filters?.location && item.location?.toLowerCase().includes(filters.location.toLowerCase())) {
    reasons.push(`Located in ${filters.location}`)
  }
  
  if (filters?.maxPrice && item.price <= filters.maxPrice) {
    reasons.push(`Within your budget`)
  }
  
  if (item.rating && item.rating >= 4.5) {
    reasons.push(`Highly rated (${item.rating}/5)`)
  }
  
  if (item.capacity && filters?.guestCount && item.capacity >= filters.guestCount) {
    reasons.push(`Perfect capacity for your guest count`)
  }
  
  return reasons
}

function generateSearchSuggestions(query: string): string[] {
  const baseSuggestions = [
    'Wedding venues in Colombo',
    'Photography services',
    'Catering for 200 guests',
    'Wedding decoration',
    'Bridal makeup services',
    'Wedding transportation',
    'Wedding music and entertainment',
    'Wedding planning services'
  ]
  
  if (!query) return baseSuggestions.slice(0, 5)
  
  return baseSuggestions
    .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
}

async function generateAISuggestions(query: string): Promise<string[]> {
  try {
    // In a real implementation, this would use AI to generate contextual suggestions
    const suggestions = [
      'Wedding venues in Colombo',
      'Photography services near me',
      'Catering for large weddings',
      'Wedding decoration packages',
      'Bridal makeup and hair',
      'Wedding transportation services',
      'Wedding music and DJ',
      'Complete wedding planning'
    ]
    
    if (!query) return suggestions.slice(0, 5)
    
    return suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
  } catch (error) {
    console.error('AI suggestions generation error:', error)
    return []
  }
}

// POST /api/ai-search - Advanced AI-powered search
export async function POST(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('ai-search', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      await connectToDatabase()
      
      const body = await request.json()
      const { query, searchType, filters, userId } = body

      if (!query) {
        return NextResponse.json({ 
          error: 'Search query is required' 
        }, { status: 400 })
      }

      // Input validation
      const validation = SecurityService.validateInput(body, {
        preventXSS: true,
        preventSQLInjection: true
      })

      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'Invalid input', 
          details: validation.errors 
        }, { status: 400 })
      }

      // AI-powered semantic search
      const semanticResults = await AIService.semanticSearch(query, filters)
      
      // Get personalized recommendations if user is provided
      let aiRecommendations: any[] = []
      if (userId) {
        aiRecommendations = await AIService.getPersonalizedRecommendations(userId)
      }

      // Enhanced search results with AI insights
      const enhancedResults = {
        venues: semanticResults.venues.map((venue: any) => ({
          ...venue.toObject(),
          aiScore: calculateAIScore(venue, query, filters),
          matchReasons: generateMatchReasons(venue, query, filters)
        })),
        vendors: semanticResults.vendors.map((vendor: any) => ({
          ...vendor.toObject(),
          aiScore: calculateAIScore(vendor, query, filters),
          matchReasons: generateMatchReasons(vendor, query, filters)
        })),
        aiRecommendations,
        searchInsights: {
          query: query,
          searchType: searchType || 'general',
          totalResults: semanticResults.venues.length + semanticResults.vendors.length,
          extractedParams: semanticResults.extractedParams,
          suggestions: generateSearchSuggestions(query)
        }
      }

      return NextResponse.json({
        success: true,
        data: enhancedResults,
        query,
        searchType,
        filters
      })

    } catch (error) {
      console.error('AI search error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'AI search failed',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
}

// GET /api/ai-search - Search suggestions
export async function GET(request: NextRequest) {
  return PerformanceMonitor.trackAPIPerformance('ai-search-suggestions', async () => {
    try {
      // Security validation
      const securityCheck = SecurityService.validateRequest(request)
      if (!securityCheck.isValid) {
        return NextResponse.json({ 
          error: 'Security validation failed', 
          details: securityCheck.errors 
        }, { status: 403 })
      }

      await connectToDatabase()
      
      const { searchParams } = new URL(request.url)
      const query = searchParams.get('q') || ''

      // Input validation
      const validation = SecurityService.validateInput({ query }, {
        preventXSS: true
      })

      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'Invalid input', 
          details: validation.errors 
        }, { status: 400 })
      }

      // Generate AI-powered suggestions
      const suggestions = await generateAISuggestions(query)

      return NextResponse.json({
        success: true,
        data: suggestions
      })

    } catch (error) {
      console.error('AI suggestions error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate suggestions',
          message: 'Internal server error'
        },
        { status: 500 }
      )
    }
  })
} 