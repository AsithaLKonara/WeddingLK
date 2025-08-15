import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { Vendor } from "@/lib/models/vendor"
import { performSemanticSearch } from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    // Query length validation (prevent extremely long queries)
    if (query.length > 500) {
      return NextResponse.json({ 
        error: "Query too long. Maximum length is 500 characters." 
      }, { status: 400 })
    }

    // Basic input sanitization (remove potentially dangerous characters)
    const sanitizedQuery = query
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .trim()

    if (sanitizedQuery.length === 0) {
      return NextResponse.json({ error: "Query cannot be empty after sanitization" }, { status: 400 })
    }

    await connectDB()

    const semanticResults = await performSemanticSearch(sanitizedQuery) as any

    // Safely extract results with fallbacks
    const venues = Array.isArray(semanticResults) ? [] : (semanticResults?.venues || [])
    const vendors = Array.isArray(semanticResults) ? [] : (semanticResults?.vendors || [])
    const extractedParams = Array.isArray(semanticResults) ? {} : (semanticResults?.extractedParams || {})

    return NextResponse.json({
      query: sanitizedQuery,
      venues,
      vendors,
      extractedParams,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: "Valid query string is required" }, { status: 400 })
    }

    // Query length validation
    if (query.length > 500) {
      return NextResponse.json({ 
        error: "Query too long. Maximum length is 500 characters." 
      }, { status: 400 })
    }

    // Input sanitization
    const sanitizedQuery = query
      .replace(/[<>]/g, '')
      .trim()

    if (sanitizedQuery.length === 0) {
      return NextResponse.json({ error: "Query cannot be empty after sanitization" }, { status: 400 })
    }

    await connectDB()

    const semanticResults = await performSemanticSearch(sanitizedQuery) as any

    const venues = Array.isArray(semanticResults) ? [] : (semanticResults?.venues || [])
    const vendors = Array.isArray(semanticResults) ? [] : (semanticResults?.vendors || [])
    const extractedParams = Array.isArray(semanticResults) ? {} : (semanticResults?.extractedParams || {})

    return NextResponse.json({
      query: sanitizedQuery,
      venues,
      vendors,
      extractedParams,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("AI search POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 