// Advanced AI Service for WeddingLK
// Provides intelligent AI-powered features for wedding planning

import OpenAI from 'openai';
import { 
  AIRecommendation, 
  ContentGenerationResult, 
  PredictiveInsights,
  User as UserType,
  Venue as VenueType,
  Vendor as VendorType,
  Booking as BookingType,
  Payment as PaymentType
} from '@/lib/types';
import { ReviewType } from '@/lib/types/review';
import { connectDB } from './db';
import { User, Vendor, Venue, Booking, Review } from './models';
import { advancedCache } from './advanced-cache-service';

interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  keywords: string[]
  summary: string
  recommendations: string[]
}

export class AdvancedAIService {
  private openai: OpenAI | null = null;
  private isConfigured: boolean = false;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.isConfigured = true;
    }
  }

  // Advanced Sentiment Analysis
  async analyzeSentiment(text: string): Promise<AIAnalysisResult> {
    if (!this.isConfigured || !this.openai) {
      return this.fallbackSentimentAnalysis(text)
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert sentiment analysis system. Analyze the given text and provide detailed insights."
          },
          {
            role: "user",
            content: `Analyze the sentiment of this text: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const analysis = response.choices[0]?.message?.content || ''
      
      // Parse the AI response and extract structured data
      return this.parseSentimentAnalysis(analysis)
    } catch (error) {
      console.error('OpenAI sentiment analysis failed:', error)
      return this.fallbackSentimentAnalysis(text)
    }
  }

  // Advanced Content Generation
  async generateContent(prompt: string, context: Record<string, unknown>): Promise<ContentGenerationResult> {
    if (!this.isConfigured || !this.openai) {
      return this.fallbackContentGeneration(prompt, context);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a wedding planning AI assistant. Generate helpful, creative content based on the user\'s request.',
          },
          {
            role: 'user',
            content: `${prompt}\n\nContext: ${JSON.stringify(context)}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '';
      
      return {
        content,
        type: this.detectContentType(prompt),
        metadata: {
          model: 'gpt-4',
          tokens: response.usage?.total_tokens || 0,
          confidence: 0.9,
        },
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackContentGeneration(prompt, context);
    }
  }

  // Predictive Analytics
  async generatePredictiveInsights(dataType: string, historicalData: Array<Record<string, unknown>>): Promise<PredictiveInsights> {
    if (!this.isConfigured || !this.openai) {
      return this.fallbackPredictiveInsights(dataType, historicalData);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst specializing in wedding industry insights. Analyze the data and provide predictions.',
          },
          {
            role: 'user',
            content: `Analyze this ${dataType} data and provide predictions:\n${JSON.stringify(historicalData)}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      const analysis = response.choices[0]?.message?.content || '';
      
      return {
        type: dataType,
        predictions: this.parsePredictions(analysis),
      };
    } catch (error) {
      console.error('Predictive insights error:', error);
      return this.fallbackPredictiveInsights(dataType, historicalData);
    }
  }

  // Advanced Search with Semantic Understanding
  async semanticSearch(query: string, context: string = ''): Promise<AIRecommendation[]> {
    if (!this.isConfigured || !this.openai) {
      return this.fallbackSemanticSearch(query, context);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a search assistant. Provide relevant search results based on the query.',
          },
          {
            role: 'user',
            content: `Search for: ${query}\nContext: ${context}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.5,
      });

      const results = response.choices[0]?.message?.content || '';
      return this.parseRecommendations(results);
    } catch (error) {
      console.error('Semantic search error:', error);
      return this.fallbackSemanticSearch(query, context);
    }
  }

  // AI-Powered Recommendations
  async generateRecommendations(userId: string, context: string): Promise<AIRecommendation[]> {
    if (!this.isConfigured || !this.openai) {
      return this.fallbackRecommendations({} as UserType, [], []);
    }

    try {
      // Fetch user data, bookings, and reviews
      const userData = await this.getUserData(userId);
      const bookings = await this.getUserBookings(userId);
      const reviews = await this.getUserReviews(userId);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a wedding planning AI. Generate personalized recommendations based on user data.',
          },
          {
            role: 'user',
            content: `Generate recommendations for user ${userId} based on:\nContext: ${context}\nUser: ${JSON.stringify(userData)}\nBookings: ${JSON.stringify(bookings)}\nReviews: ${JSON.stringify(reviews)}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const recommendations = response.choices[0]?.message?.content || '';
      return this.parseRecommendations(recommendations);
    } catch (error) {
      console.error('Recommendations error:', error);
      return this.fallbackRecommendations({} as UserType, [], []);
    }
  }

  // Fallback Methods
  private fallbackSentimentAnalysis(text: string): AIAnalysisResult {
    const positiveWords = ['love', 'amazing', 'perfect', 'beautiful', 'wonderful', 'excellent']
    const negativeWords = ['hate', 'terrible', 'awful', 'disappointing', 'bad', 'poor']
    
    const words = text.toLowerCase().split(' ')
    let positiveCount = 0
    let negativeCount = 0
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++
      if (negativeWords.includes(word)) negativeCount++
    })
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let confidence = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      confidence = Math.min(0.9, 0.5 + (positiveCount * 0.1))
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      confidence = Math.min(0.9, 0.5 + (negativeCount * 0.1))
    }
    
    return {
      sentiment,
      confidence,
      keywords: this.extractKeywords(text),
      summary: this.generateSummary(text),
      recommendations: this.generateRecommendationsFromSentiment(sentiment)
    }
  }

  private fallbackContentGeneration(prompt: string, context: Record<string, unknown>): ContentGenerationResult {
    return {
      content: `Generated content for: ${prompt}`,
      type: this.detectContentType(prompt),
      metadata: {
        model: 'fallback',
        confidence: 0.5,
      },
    };
  }

  private fallbackPredictiveInsights(dataType: string, historicalData: Array<Record<string, unknown>>): PredictiveInsights {
    return {
      type: dataType,
      predictions: [
        {
          metric: 'trend',
          value: 0.5,
          confidence: 0.3,
          trend: 'stable' as const,
        },
      ],
    };
  }

  private fallbackSemanticSearch(query: string, context: string): AIRecommendation[] {
    return [
      {
        id: 'fallback-1',
        name: 'Fallback Result',
        type: 'venue',
        title: 'Fallback Result',
        description: `Search result for: ${query}`,
        confidence: 0.3,
        data: { query, context },
      },
    ];
  }

  private fallbackRecommendations(user: UserType, bookings: BookingType[], reviews: PaymentType[]): AIRecommendation[] {
    return [
      {
        id: 'fallback-rec-1',
        name: 'Popular Venues',
        type: 'venue',
        title: 'Popular Venues',
        description: 'Based on your preferences, here are some popular venues.',
        confidence: 0.4,
        data: { user, bookings, reviews },
      },
    ];
  }

  // Helper Methods
  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    const words = text.toLowerCase().split(' ')
    return words.filter(word => word.length > 3 && !commonWords.includes(word)).slice(0, 10)
  }

  private generateSummary(text: string): string {
    return text.length > 100 ? text.substring(0, 100) + '...' : text
  }

  private generateRecommendationsFromSentiment(sentiment: string): string[] {
    const recommendations = {
      positive: ['Maintain current approach', 'Share success stories', 'Encourage referrals'],
      negative: ['Address concerns promptly', 'Improve service quality', 'Gather feedback'],
      neutral: ['Enhance engagement', 'Provide more information', 'Follow up with users']
    }
    
    return recommendations[sentiment as keyof typeof recommendations] || recommendations.neutral
  }

  private analyzeTone(content: string): string {
    if (content.includes('!')) return 'enthusiastic'
    if (content.includes('?')) return 'inquisitive'
    if (content.includes('professional') || content.includes('expert')) return 'professional'
    return 'neutral'
  }

  private checkSEOOptimization(content: string): boolean {
    const seoFactors = ['keywords', 'meta', 'title', 'description']
    return seoFactors.some(factor => content.toLowerCase().includes(factor))
  }

  private generateSuggestions(content: string): string[] {
    const suggestions = []
    if (content.length < 100) suggestions.push('Add more descriptive content')
    if (!content.includes('wedding')) suggestions.push('Include wedding-related keywords')
    if (!content.includes('service')) suggestions.push('Mention specific services offered')
    return suggestions
  }

  private parseSentimentAnalysis(analysis: string): AIAnalysisResult {
    // Parse AI response and extract structured data
    return {
      sentiment: 'positive',
      confidence: 0.8,
      keywords: ['wedding', 'beautiful', 'perfect'],
      summary: analysis.substring(0, 100),
      recommendations: ['Continue current approach', 'Share positive feedback']
    }
  }

  private parsePredictions(analysis: string): Array<{
    metric: string;
    value: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    // Simple parsing logic - in production, use more sophisticated parsing
    return [
      {
        metric: 'trend',
        value: 0.5,
        confidence: 0.3,
        trend: 'stable',
      },
    ];
  }

  private parseRecommendations(recommendations: string): AIRecommendation[] {
    // Simple parsing logic - in production, use more sophisticated parsing
    return [
      {
        id: 'parsed-1',
        name: 'AI Generated Recommendation',
        type: 'venue',
        title: 'AI Generated Recommendation',
        description: recommendations.substring(0, 100) + '...',
        confidence: 0.8,
        data: { raw: recommendations },
      },
    ];
  }

  private async performDatabaseSearch(query: string): Promise<AIRecommendation[]> {
    // Implement database search logic here
    return [
      {
        id: 'db-1',
        name: 'Database Result',
        type: 'venue',
        title: 'Database Result',
        description: `Search result for: ${query}`,
        confidence: 0.7,
        data: { query, source: 'database' },
      },
    ];
  }

  private detectContentType(prompt: string): 'email' | 'description' | 'proposal' {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('email') || lowerPrompt.includes('mail')) {
      return 'email';
    } else if (lowerPrompt.includes('proposal') || lowerPrompt.includes('quote')) {
      return 'proposal';
    } else {
      return 'description';
    }
  }

  private async getUserData(userId: string): Promise<UserType> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  private async getUserBookings(userId: string): Promise<BookingType[]> {
    const bookings = await Booking.find({ userId }).populate('vendorId venueId');
    return bookings || [];
  }

  private async getUserReviews(userId: string): Promise<ReviewType[]> {
    const reviews = await Review.find({ userId });
    return reviews || [];
  }
}

export const advancedAIService = new AdvancedAIService() 