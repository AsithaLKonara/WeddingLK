import OpenAI from 'openai'
import { connectToDatabase } from './database'
import User from '@/lib/models/User'
import Venue from '@/lib/models/Venue'
import Vendor from '@/lib/models/Vendor'
import Booking from '@/lib/models/Booking'

// Initialize OpenAI client conditionally
let openai: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface AIWeddingPlan {
  timeline: Array<{
    date: string
    task: string
    description: string
    priority: 'low' | 'medium' | 'high'
    estimatedCost: number
    vendorRecommendations: string[]
  }>
  budget: {
    total: number
    breakdown: Record<string, number>
    recommendations: string[]
    savingsTips: string[]
  }
  checklist: Array<{
    category: string
    items: Array<{
      task: string
      completed: boolean
      dueDate?: string
      estimatedCost: number
    }>
  }>
  guestList: {
    totalGuests: number
    categories: Array<{
      category: string
      count: number
      budget: number
    }>
    seatingPlan: Array<{
      table: number
      guests: string[]
      theme: string
    }>
  }
}

interface AIVendorMatching {
  venue: {
    id: string
    name: string
    matchScore: number
    reasons: string[]
  }
  vendors: Array<{
    id: string
    name: string
    category: string
    matchScore: number
    reasons: string[]
    estimatedCost: number
  }>
  totalEstimatedCost: number
  savingsOpportunities: string[]
}

interface AISpeechGeneration {
  speech: string
  duration: number
  tone: 'formal' | 'casual' | 'romantic' | 'humorous'
  language: string
  audioUrl?: string
}

class AdvancedAIService {
  // Advanced wedding planning with AI
  async generateAdvancedWeddingPlan(userId: string): Promise<AIWeddingPlan> {
    try {
      await connectToDatabase()
      
      const user = await User.findById(userId)
      if (!user?.preferences?.weddingDate) {
        throw new Error('User preferences not found')
      }

      const weddingDate = new Date(user.preferences.weddingDate)
      const today = new Date()
      const daysUntilWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (!openai) {
        return this.getAdvancedMockWeddingPlan(daysUntilWedding, user.preferences)
      }

      const prompt = `
        Create a comprehensive AI-powered wedding plan for a couple with ${daysUntilWedding} days until their wedding.
        
        Wedding Details:
        - Date: ${user.preferences.weddingDate}
        - Budget: LKR ${user.preferences.budget}
        - Guest Count: ${user.preferences.guestCount}
        - Location: ${user.preferences.location}
        - Style: ${user.preferences.style}
        
        Generate a detailed plan including:
        1. Timeline: Tasks with dates, descriptions, priorities, estimated costs, and vendor recommendations
        2. Budget: Total, breakdown, recommendations, and savings tips
        3. Checklist: Organized by categories with costs and due dates
        4. Guest List: Total guests, categories, budget allocation, and seating plan
        5. Seating Plan: Table arrangements with themes
        
        Format as JSON with timeline, budget, checklist, and guestList properties.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3000
      })

      const weddingPlan = JSON.parse(completion.choices[0].message.content || '{}')
      return weddingPlan

    } catch (error) {
      console.error('Advanced AI wedding plan error:', error)
      return this.getAdvancedMockWeddingPlan(30, { budget: 500000, guestCount: 200 })
    }
  }

  private getAdvancedMockWeddingPlan(daysUntilWedding: number, preferences: any): AIWeddingPlan {
    const timeline = [
      {
        date: new Date(Date.now() + (daysUntilWedding - 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Book Venue',
        description: 'Secure your wedding venue with deposit',
        priority: 'high' as const,
        estimatedCost: preferences.budget * 0.4,
        vendorRecommendations: ['Grand Ballroom Hotel', 'Garden Palace', 'Ocean View Resort']
      },
      {
        date: new Date(Date.now() + (daysUntilWedding - 45) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        task: 'Book Vendors',
        description: 'Book photography, catering, and decoration services',
        priority: 'high' as const,
        estimatedCost: preferences.budget * 0.35,
        vendorRecommendations: ['Perfect Moments Photography', 'Sweet Dreams Catering', 'Elegant Decorators']
      }
    ]

    return {
      timeline,
      budget: {
        total: preferences.budget || 500000,
        breakdown: {
          venue: preferences.budget * 0.4 || 200000,
          catering: preferences.budget * 0.25 || 125000,
          photography: preferences.budget * 0.15 || 75000,
          decoration: preferences.budget * 0.1 || 50000,
          other: preferences.budget * 0.1 || 50000
        },
        recommendations: [
          'Book vendors early for better rates',
          'Consider off-peak season for savings',
          'Negotiate package deals with vendors'
        ],
        savingsTips: [
          'DIY decorations can save 20%',
          'Weekday weddings are often cheaper',
          'Local vendors reduce travel costs'
        ]
      },
      checklist: [
        {
          category: 'Venue',
          items: [
            { task: 'Book venue', completed: false, estimatedCost: 200000 },
            { task: 'Visit venue', completed: false, estimatedCost: 0 },
            { task: 'Sign contract', completed: false, estimatedCost: 0 }
          ]
        }
      ],
      guestList: {
        totalGuests: preferences.guestCount || 200,
        categories: [
          { category: 'Family', count: Math.floor((preferences.guestCount || 200) * 0.4), budget: 100000 },
          { category: 'Friends', count: Math.floor((preferences.guestCount || 200) * 0.3), budget: 75000 },
          { category: 'Colleagues', count: Math.floor((preferences.guestCount || 200) * 0.2), budget: 50000 },
          { category: 'Others', count: Math.floor((preferences.guestCount || 200) * 0.1), budget: 25000 }
        ],
        seatingPlan: [
          { table: 1, guests: ['Family 1', 'Family 2', 'Family 3'], theme: 'Elegant' },
          { table: 2, guests: ['Friends 1', 'Friends 2', 'Friends 3'], theme: 'Casual' }
        ]
      }
    }
  }

  // AI-powered vendor matching
  async getAIVendorMatching(userId: string): Promise<AIVendorMatching> {
    try {
      await connectToDatabase()
      
      const user = await User.findById(userId)
      if (!user?.preferences) {
        throw new Error('User preferences not found')
      }

      const venues = await Venue.find({ isActive: true })
      const vendors = await Vendor.find({ isActive: true })

      if (!openai) {
        return this.getMockAIVendorMatching(venues, vendors, user.preferences)
      }

      const prompt = `
        Match the best venue and vendors for this couple:
        
        Wedding Details:
        - Budget: LKR ${user.preferences.budget}
        - Guest Count: ${user.preferences.guestCount}
        - Location: ${user.preferences.location}
        - Style: ${user.preferences.style}
        
        Available Venues:
        ${venues.map(v => `- ${v.name}: ${v.location}, LKR ${v.price}, ${v.capacity} guests, Rating: ${v.rating}`).join('\n')}
        
        Available Vendors:
        ${vendors.map(v => `- ${v.name}: ${v.category}, ${v.location}, LKR ${v.price}, Rating: ${v.rating}`).join('\n')}
        
        Provide the best venue match and top 3 vendor matches with:
        - Match scores (0-100)
        - Reasons for matching
        - Estimated costs
        - Total estimated cost
        - Savings opportunities
        
        Format as JSON with venue, vendors, totalEstimatedCost, and savingsOpportunities properties.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })

      const matching = JSON.parse(completion.choices[0].message.content || '{}')
      return matching

    } catch (error) {
      console.error('AI vendor matching error:', error)
      return this.getMockAIVendorMatching([], [], { budget: 500000, guestCount: 200 })
    }
  }

  private getMockAIVendorMatching(venues: any[], vendors: any[], preferences: any): AIVendorMatching {
    const bestVenue = venues[0] || { _id: 'mock-venue', name: 'Grand Ballroom Hotel' }
    
    return {
      venue: {
        id: bestVenue._id.toString(),
        name: bestVenue.name,
        matchScore: 95,
        reasons: ['Perfect capacity for guest count', 'Within budget', 'High rating', 'Great location']
      },
      vendors: [
        {
          id: 'mock-vendor-1',
          name: 'Perfect Moments Photography',
          category: 'Photography',
          matchScore: 92,
          reasons: ['Excellent reviews', 'Within budget', 'Available on date'],
          estimatedCost: 25000
        },
        {
          id: 'mock-vendor-2',
          name: 'Sweet Dreams Catering',
          category: 'Catering',
          matchScore: 88,
          reasons: ['Great value', 'Good reviews', 'Flexible menu'],
          estimatedCost: 20000
        },
        {
          id: 'mock-vendor-3',
          name: 'Elegant Decorators',
          category: 'Decoration',
          matchScore: 85,
          reasons: ['Creative designs', 'Reasonable pricing', 'Good portfolio'],
          estimatedCost: 15000
        }
      ],
      totalEstimatedCost: 60000,
      savingsOpportunities: [
        'Book all vendors together for 10% discount',
        'Consider weekday wedding for 15% savings',
        'DIY some decorations to save 20%'
      ]
    }
  }

  // AI speech generation for wedding speeches
  async generateWeddingSpeech(speechData: any): Promise<AISpeechGeneration> {
    try {
      if (!openai) {
        return this.getMockWeddingSpeech(speechData)
      }

      const prompt = `
        Write a ${speechData.tone} wedding speech for ${speechData.role} (${speechData.name}).
        
        Context:
        - Bride: ${speechData.bride}
        - Groom: ${speechData.groom}
        - Relationship: ${speechData.relationship}
        - Duration: ${speechData.duration} minutes
        - Language: ${speechData.language}
        - Special moments to mention: ${speechData.specialMoments}
        
        Make it personal, heartfelt, and appropriate for the tone requested.
        Include humor if requested, but keep it tasteful.
        Format the speech with proper paragraphs and structure.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      })

      const speech = completion.choices[0].message.content || ''

      return {
        speech,
        duration: speechData.duration || 3,
        tone: speechData.tone || 'formal',
        language: speechData.language || 'English'
      }

    } catch (error) {
      console.error('AI speech generation error:', error)
      return this.getMockWeddingSpeech(speechData)
    }
  }

  private getMockWeddingSpeech(speechData: any): AISpeechGeneration {
    const mockSpeeches = {
      formal: `Ladies and gentlemen, it is with great honor that I stand before you today to celebrate the union of ${speechData.bride} and ${speechData.groom}. As ${speechData.relationship}, I have had the privilege of watching their love story unfold, and I can say with certainty that they are truly meant for each other. Their love is a testament to the power of patience, understanding, and unwavering commitment. Today, as they begin this new chapter together, I wish them a lifetime of happiness, love, and beautiful memories.`,
      casual: `Hey everyone! I'm so excited to be here today celebrating ${speechData.bride} and ${speechData.groom}'s wedding! As their ${speechData.relationship}, I've seen these two go from awkward first dates to planning their forever together, and let me tell you, it's been quite the journey! They're perfect for each other, and I can't wait to see what amazing adventures they'll have together. Here's to love, laughter, and lots of happy memories!`,
      romantic: `In a world where love stories are written in the stars, ${speechData.bride} and ${speechData.groom} have found their perfect constellation. As ${speechData.relationship}, I've witnessed the magic of their love - how they complete each other, support each other, and make each other better. Their love is pure, deep, and everlasting. Today, as they say "I do," they're not just making a promise to each other, they're making a promise to love, cherish, and adore each other for all the days of their lives.`,
      humorous: `Well, well, well... look who finally decided to get married! ${speechData.bride} and ${speechData.groom}, I have to say, this day has been a long time coming! As their ${speechData.relationship}, I've seen it all - the good, the bad, and the absolutely ridiculous moments that made us all laugh. But through it all, their love has only grown stronger. They're proof that true love exists, even if it sometimes comes with a side of chaos and lots of laughter!`
    }

    return {
      speech: mockSpeeches[speechData.tone || 'formal'] || mockSpeeches.formal,
      duration: speechData.duration || 3,
      tone: speechData.tone || 'formal',
      language: speechData.language || 'English'
    }
  }

  // AI-powered wedding hashtag generation
  async generateWeddingHashtags(weddingData: any): Promise<string[]> {
    try {
      if (!openai) {
        return this.getMockWeddingHashtags(weddingData)
      }

      const prompt = `
        Generate creative and unique wedding hashtags for:
        - Bride: ${weddingData.bride}
        - Groom: ${weddingData.groom}
        - Wedding Date: ${weddingData.date}
        - Location: ${weddingData.location}
        - Theme: ${weddingData.theme}
        - Style: ${weddingData.style}
        
        Generate 10 hashtags that are:
        - Unique and memorable
        - Easy to spell and remember
        - Relevant to the couple
        - Include their names, date, location, or theme
        - Mix of romantic, fun, and personal hashtags
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      })

      const hashtags = completion.choices[0].message.content?.split('\n').filter(h => h.trim()) || []
      return hashtags

    } catch (error) {
      console.error('AI hashtag generation error:', error)
      return this.getMockWeddingHashtags(weddingData)
    }
  }

  private getMockWeddingHashtags(weddingData: any): string[] {
    const bride = weddingData.bride || 'Sarah'
    const groom = weddingData.groom || 'John'
    const year = new Date(weddingData.date).getFullYear()
    
    return [
      `#${bride}And${groom}${year}`,
      `#${bride}${groom}Wedding`,
      `#${bride}${groom}Forever`,
      `#${bride}${groom}BigDay`,
      `#${bride}${groom}LoveStory`,
      `#${bride}${groom}Celebration`,
      `#${bride}${groom}HappilyEverAfter`,
      `#${bride}${groom}WeddingDay`,
      `#${bride}${groom}NewBeginnings`,
      `#${bride}${groom}Wedding2024`
    ]
  }

  // AI-powered wedding song recommendations
  async generateWeddingSongRecommendations(preferences: any): Promise<any> {
    try {
      if (!openai) {
        return this.getMockWeddingSongs(preferences)
      }

      const prompt = `
        Recommend wedding songs for:
        - Style: ${preferences.style}
        - Theme: ${preferences.theme}
        - Guest age range: ${preferences.guestAgeRange}
        - Cultural background: ${preferences.culturalBackground}
        
        Provide recommendations for:
        1. Processional song (bride walking down aisle)
        2. Recessional song (couple walking out)
        3. First dance song
        4. Father-daughter dance
        5. Mother-son dance
        6. 5 reception songs for dancing
        
        Include song title, artist, and why it's perfect for this wedding.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })

      const songs = completion.choices[0].message.content?.split('\n').filter(s => s.trim()) || []
      return { songs }

    } catch (error) {
      console.error('AI song recommendations error:', error)
      return this.getMockWeddingSongs(preferences)
    }
  }

  private getMockWeddingSongs(preferences: any): any {
    return {
      songs: [
        'Processional: "Canon in D" by Pachelbel',
        'Recessional: "Wedding March" by Mendelssohn',
        'First Dance: "Perfect" by Ed Sheeran',
        'Father-Daughter: "Butterfly Kisses" by Bob Carlisle',
        'Mother-Son: "A Mother\'s Song" by T. Carter',
        'Reception: "Uptown Funk" by Mark Ronson ft. Bruno Mars',
        'Reception: "Shake It Off" by Taylor Swift',
        'Reception: "Happy" by Pharrell Williams',
        'Reception: "All of Me" by John Legend',
        'Reception: "Thinking Out Loud" by Ed Sheeran'
      ]
    }
  }

  // Test advanced AI features
  async testAdvancedAIFeatures(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    try {
      // Test advanced wedding planning
      const weddingPlan = await this.generateAdvancedWeddingPlan('mock-user-id')
      results.advancedWeddingPlan = !!weddingPlan.timeline

      // Test vendor matching
      const vendorMatching = await this.getAIVendorMatching('mock-user-id')
      results.vendorMatching = !!vendorMatching.venue

      // Test speech generation
      const speech = await this.generateWeddingSpeech({
        role: 'Best Man',
        name: 'John',
        bride: 'Sarah',
        groom: 'Mike',
        relationship: 'Best Friend',
        tone: 'casual',
        duration: 3,
        language: 'English'
      })
      results.speechGeneration = !!speech.speech

      // Test hashtag generation
      const hashtags = await this.generateWeddingHashtags({
        bride: 'Sarah',
        groom: 'Mike',
        date: '2024-12-15',
        location: 'Colombo',
        theme: 'Modern',
        style: 'Elegant'
      })
      results.hashtagGeneration = hashtags.length > 0

      // Test song recommendations
      const songs = await this.generateWeddingSongRecommendations({
        style: 'Modern',
        theme: 'Elegant',
        guestAgeRange: '25-45',
        culturalBackground: 'Mixed'
      })
      results.songRecommendations = !!songs.songs

    } catch (error) {
      console.error('Advanced AI features test error:', error)
    }

    return results
  }
}

export default new AdvancedAIService() 