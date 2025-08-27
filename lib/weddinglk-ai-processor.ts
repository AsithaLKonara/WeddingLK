import { connectDB } from '@/lib/db';
import { Venue } from '@/lib/models';
import { Vendor } from '@/lib/models';

interface AIProcessingRequest {
  type: string;
  userId?: string;
  data: Record<string, unknown>;
  context?: string;
}

interface AIProcessingResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  processingTime: number;
  confidence: number;
}

interface VenueRecommendation {
  venueId: string;
  name: string;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

interface VendorRecommendation {
  vendorId: string;
  name: string;
  category: string;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

interface BudgetOptimization {
  totalBudget: number;
  recommendedAllocation: Record<string, number>;
  costSavings: number;
  suggestions: string[];
  [key: string]: unknown;
}

interface TimelineOptimization {
  eventDate: Date;
  recommendedTimeline: Array<{
    task: string;
    deadline: Date;
    priority: 'high' | 'medium' | 'low';
    dependencies: string[];
  }>;
  criticalPath: string[];
  [key: string]: unknown;
}

class WeddingLKAIProcessor {
  private static instance: WeddingLKAIProcessor;
  private processingHistory: Map<string, AIProcessingResponse[]> = new Map();
  private modelConfig: Record<string, unknown> = {
    maxTokens: 2048,
    temperature: 0.7,
    topP: 0.9
  };

  private constructor() {}

  public static getInstance(): WeddingLKAIProcessor {
    if (!WeddingLKAIProcessor.instance) {
      WeddingLKAIProcessor.instance = new WeddingLKAIProcessor();
    }
    return WeddingLKAIProcessor.instance;
  }

  // Process AI request
  public static async processRequest(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      await connectDB();
      
      const processor = WeddingLKAIProcessor.getInstance();
      let response: AIProcessingResponse;

      switch (request.type) {
        case 'venue-recommendation':
          response = await processor.processVenueRecommendation(request);
          break;
        case 'vendor-recommendation':
          response = await processor.processVendorRecommendation(request);
          break;
        case 'budget-optimization':
          response = await processor.processBudgetOptimization(request);
          break;
        case 'timeline-optimization':
          response = await processor.processTimelineOptimization(request);
          break;
        case 'guest-list-optimization':
          response = await processor.processGuestListOptimization(request);
          break;
        case 'seating-arrangement':
          response = await processor.processSeatingArrangement(request);
          break;
        case 'menu-planning':
          response = await processor.processMenuPlanning(request);
          break;
        case 'decor-suggestions':
          response = await processor.processDecorSuggestions(request);
          break;
        default:
          response = {
            success: false,
            error: `Unsupported AI processing type: ${request.type}`,
            processingTime: Date.now() - startTime,
            confidence: 0
          };
      }

      // Store processing history
      processor.storeProcessingHistory(request.type, response);

      return response;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('AI processing error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
        confidence: 0
      };
    }
  }

  // Process venue recommendation
  private async processVenueRecommendation(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { guestCount, budget, location, date, style } = request.data;
      
      // Build query based on requirements
      const query: Record<string, unknown> = { isActive: true };
      
      if (guestCount) {
        query.capacity = { $gte: guestCount as number };
      }
      
      if (budget) {
        query.pricePerPerson = { $lte: (budget as number) / (guestCount as number) };
      }
      
      if (location) {
        query.location = { $near: location };
      }
      
      if (style) {
        query.style = { $in: Array.isArray(style) ? style : [style] };
      }

      const venues = await Venue.find(query)
        .select('name location capacity pricePerPerson style rating images amenities')
        .sort({ rating: -1, pricePerPerson: 1 })
        .limit(10);

      if (venues.length === 0) {
        return {
          success: false,
          error: 'No venues found matching your criteria',
          processingTime: Date.now() - startTime,
          confidence: 0
        };
      }

      // AI scoring algorithm
      const recommendations: VenueRecommendation[] = venues.map(venue => {
        const score = this.calculateVenueScore(venue, request.data);
        const reasons = this.generateVenueReasons(venue, request.data);
        
        return {
          venueId: venue._id.toString(),
          name: venue.name,
          score,
          reasons,
          matchPercentage: Math.round((score / 100) * 100)
        };
      });

      // Sort by score
      recommendations.sort((a, b) => b.score - a.score);

      return {
        success: true,
        data: {
          recommendations,
          totalVenues: venues.length,
          criteria: request.data
        },
        processingTime: Date.now() - startTime,
        confidence: Math.min(95, Math.max(60, recommendations[0]?.matchPercentage || 0))
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process vendor recommendation
  private async processVendorRecommendation(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { category, budget, location, date, style } = request.data;
      
      const query: Record<string, unknown> = { isActive: true };
      
      if (category) {
        query.category = category;
      }
      
      if (location) {
        query.location = { $near: location };
      }
      
      if (style) {
        query.style = { $in: Array.isArray(style) ? style : [style] };
      }

      const vendors = await Vendor.find(query)
        .select('name category description location rating images services pricing style')
        .sort({ rating: -1 })
        .limit(15);

      if (vendors.length === 0) {
        return {
          success: false,
          error: 'No vendors found matching your criteria',
          processingTime: Date.now() - startTime,
          confidence: 0
        };
      }

      // AI scoring algorithm
      const recommendations: VendorRecommendation[] = vendors.map(vendor => {
        const score = this.calculateVendorScore(vendor, request.data);
        const reasons = this.generateVendorReasons(vendor, request.data);
        
        return {
          vendorId: vendor._id.toString(),
          name: vendor.name,
          category: vendor.category,
          score,
          reasons,
          matchPercentage: Math.round((score / 100) * 100)
        };
      });

      // Sort by score
      recommendations.sort((a, b) => b.score - a.score);

      return {
        success: true,
        data: {
          recommendations,
          totalVendors: vendors.length,
          criteria: request.data
        },
        processingTime: Date.now() - startTime,
        confidence: Math.min(95, Math.max(60, recommendations[0]?.matchPercentage || 0))
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process budget optimization
  private async processBudgetOptimization(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { totalBudget, guestCount, style, priorities } = request.data;
      
      // Default budget allocation percentages
      const defaultAllocation = {
        venue: 40,
        catering: 25,
        photography: 10,
        entertainment: 8,
        decoration: 7,
        attire: 5,
        transportation: 3,
        miscellaneous: 2
      };

      // Adjust based on priorities
      const adjustedAllocation = { ...defaultAllocation };
      if (priorities) {
        const priorityList = priorities as string[];
        priorityList.forEach((priority, index) => {
          const priorityWeight = 1 + (priorityList.length - index) * 0.1;
          if (adjustedAllocation[priority as keyof typeof adjustedAllocation]) {
            adjustedAllocation[priority as keyof typeof adjustedAllocation] *= priorityWeight;
          }
        });
      }

      // Normalize percentages
      const totalPercentage = Object.values(adjustedAllocation).reduce((sum, val) => sum + val, 0);
      Object.keys(adjustedAllocation).forEach(key => {
        adjustedAllocation[key as keyof typeof adjustedAllocation] = 
          Math.round((adjustedAllocation[key as keyof typeof adjustedAllocation] / totalPercentage) * 100);
      });

      // Calculate actual amounts
      const recommendedAllocation: Record<string, number> = {};
      Object.keys(adjustedAllocation).forEach(key => {
        recommendedAllocation[key] = Math.round((totalBudget as number) * (adjustedAllocation[key as keyof typeof adjustedAllocation] / 100));
      });

      // Generate cost-saving suggestions
      const suggestions = this.generateBudgetSuggestions(totalBudget as number, guestCount as number, style as string);

      const optimization: BudgetOptimization = {
        totalBudget: totalBudget as number,
        recommendedAllocation,
        costSavings: Math.round((totalBudget as number) * 0.15), // Assume 15% savings
        suggestions
      };

      return {
        success: true,
        data: optimization,
        processingTime: Date.now() - startTime,
        confidence: 85
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process timeline optimization
  private async processTimelineOptimization(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { eventDate, guestCount, complexity, style } = request.data;
      
      const eventDateObj = new Date(eventDate as string);
      const timeline = this.generateWeddingTimeline(eventDateObj, guestCount as number, complexity as string, style as string);
      
      const optimization: TimelineOptimization = {
        eventDate: eventDateObj,
        recommendedTimeline: timeline,
        criticalPath: this.identifyCriticalPath(timeline)
      };

      return {
        success: true,
        data: optimization,
        processingTime: Date.now() - startTime,
        confidence: 80
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process guest list optimization
  private async processGuestListOptimization(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { guestList, budget, venueCapacity, relationships } = request.data;
      
      // AI algorithm to optimize guest list
      const optimizedList = this.optimizeGuestList(
        guestList as Array<Record<string, unknown>>,
        budget as number,
        venueCapacity as number,
        relationships as Record<string, string>
      );

      return {
        success: true,
        data: {
          originalCount: (guestList as Array<unknown>).length,
          optimizedCount: optimizedList.length,
          removedGuests: (guestList as Array<unknown>).length - optimizedList.length,
          estimatedSavings: Math.round((budget as number) * 0.1),
          recommendations: this.generateGuestListRecommendations(optimizedList)
        },
        processingTime: Date.now() - startTime,
        confidence: 75
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process seating arrangement
  private async processSeatingArrangement(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { guestList, tableCount, relationships, preferences } = request.data;
      
      const seatingArrangement = this.generateSeatingArrangement(
        guestList as Array<Record<string, unknown>>,
        tableCount as number,
        relationships as Record<string, string>,
        preferences as Record<string, unknown>
      );

      return {
        success: true,
        data: {
          seatingArrangement,
          tableCount: tableCount as number,
          guestCount: (guestList as Array<unknown>).length,
          compatibilityScore: this.calculateSeatingCompatibility(seatingArrangement)
        },
        processingTime: Date.now() - startTime,
        confidence: 70
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process menu planning
  private async processMenuPlanning(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { guestCount, budget, dietaryRestrictions, cuisine, style } = request.data;
      
      const menu = this.generateWeddingMenu(
        guestCount as number,
        budget as number,
        dietaryRestrictions as string[],
        cuisine as string,
        style as string
      );

      return {
        success: true,
        data: {
          menu,
          estimatedCost: Math.round((budget as number) * 0.25),
          dietaryAccommodations: (dietaryRestrictions as string[]).length,
          courses: menu.length
        },
        processingTime: Date.now() - startTime,
        confidence: 75
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Process decor suggestions
  private async processDecorSuggestions(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const startTime = Date.now();
    
    try {
      const { style, colorScheme, venue, budget, season } = request.data;
      
      const decorSuggestions = this.generateDecorSuggestions(
        style as string,
        colorScheme as string,
        venue as Record<string, unknown>,
        budget as number,
        season as string
      );

      return {
        success: true,
        data: {
          suggestions: decorSuggestions,
          estimatedCost: Math.round((budget as number) * 0.07),
          style: style as string,
          colorScheme: colorScheme as string
        },
        processingTime: Date.now() - startTime,
        confidence: 80
      };

      } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime,
        confidence: 0
      };
    }
  }

  // Helper methods
  private calculateVenueScore(venue: any, criteria: Record<string, unknown>): number {
    let score = 0;
    
    // Capacity match
    if (criteria.guestCount && venue.capacity >= (criteria.guestCount as number)) {
      score += 25;
    }
    
    // Budget match
    if (criteria.budget && venue.pricePerPerson <= (criteria.budget as number) / (criteria.guestCount as number)) {
      score += 25;
    }
    
    // Rating
    score += (venue.rating || 0) * 2;
    
    // Style match
    if (criteria.style && venue.style === criteria.style) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  private generateVenueReasons(venue: any, criteria: Record<string, unknown>): string[] {
    const reasons: string[] = [];
    
    if (venue.rating >= 4.5) {
      reasons.push('High customer rating');
    }
    
    if (venue.capacity >= (criteria.guestCount as number)) {
      reasons.push('Perfect capacity for your guest count');
    }
    
    if (venue.pricePerPerson <= (criteria.budget as number) / (criteria.guestCount as number)) {
      reasons.push('Fits within your budget');
    }
    
    return reasons;
  }

  private calculateVendorScore(vendor: any, criteria: Record<string, unknown>): number {
    let score = 0;
    
    // Category match
    if (criteria.category && vendor.category === criteria.category) {
      score += 30;
    }
    
    // Rating
    score += (vendor.rating || 0) * 3;
    
    // Style match
    if (criteria.style && vendor.style === criteria.style) {
      score += 20;
    }
    
    return Math.min(100, score);
  }

  private generateVendorReasons(vendor: any, criteria: Record<string, unknown>): string[] {
    const reasons: string[] = [];
    
    if (vendor.rating >= 4.5) {
      reasons.push('Excellent customer reviews');
    }
    
    if (criteria.category && vendor.category === criteria.category) {
      reasons.push('Specializes in your required service');
    }
    
    return reasons;
  }

  private generateBudgetSuggestions(totalBudget: number, guestCount: number, style: string): string[] {
    const suggestions: string[] = [];
    
    if (totalBudget / guestCount > 200) {
      suggestions.push('Consider reducing guest count for premium experience');
    }
    
    if (style === 'luxury') {
      suggestions.push('Allocate more budget to photography and entertainment');
    }
    
    suggestions.push('Set aside 10% for unexpected expenses');
    suggestions.push('Negotiate with vendors for better rates');
    
    return suggestions;
  }

  private generateWeddingTimeline(eventDate: Date, guestCount: number, complexity: string, style: string): Array<{
    task: string;
    deadline: Date;
    priority: 'high' | 'medium' | 'low';
    dependencies: string[];
  }> {
    const timeline = [];
    const monthsBefore = complexity === 'simple' ? 6 : complexity === 'moderate' ? 9 : 12;
    
    // High priority tasks
    timeline.push({
      task: 'Book venue',
      deadline: new Date(eventDate.getTime() - (monthsBefore * 30 * 24 * 60 * 60 * 1000)),
      priority: 'high' as const,
      dependencies: []
    });
    
    timeline.push({
      task: 'Book photographer',
      deadline: new Date(eventDate.getTime() - ((monthsBefore - 2) * 30 * 24 * 60 * 60 * 1000)),
      priority: 'high' as const,
      dependencies: ['Book venue']
    });
    
    // Medium priority tasks
    timeline.push({
      task: 'Send invitations',
      deadline: new Date(eventDate.getTime() - (2 * 30 * 24 * 60 * 60 * 1000)),
      priority: 'medium' as const,
      dependencies: ['Book venue']
    });
    
    return timeline;
  }

  private identifyCriticalPath(timeline: Array<{ task: string; dependencies: string[] }>): string[] {
    const criticalPath: string[] = [];
    
    timeline.forEach(item => {
      if (item.dependencies.length === 0) {
        criticalPath.push(item.task);
      }
    });
    
    return criticalPath;
  }

  private optimizeGuestList(guestList: Array<Record<string, unknown>>, budget: number, venueCapacity: number, relationships: Record<string, string>): Array<Record<string, unknown>> {
    // Simple optimization: prioritize close relationships
    const priorityGuests = guestList.filter(guest => 
      relationships[guest.id as string] === 'immediate' || 
      relationships[guest.id as string] === 'close'
    );
    
    return priorityGuests.slice(0, Math.min(venueCapacity, priorityGuests.length));
  }

  private generateGuestListRecommendations(guestList: Array<Record<string, unknown>>): string[] {
    return [
      'Consider plus-ones carefully',
      'Include immediate family and close friends',
      'Set RSVP deadline 6 weeks before event'
    ];
  }

  private generateSeatingArrangement(guestList: Array<Record<string, unknown>>, tableCount: number, relationships: Record<string, string>, preferences: Record<string, unknown>): Record<string, unknown>[] {
    const tables: Record<string, unknown>[] = [];
    
    for (let i = 0; i < tableCount; i++) {
      tables.push({
        tableNumber: i + 1,
        guests: [],
        capacity: Math.ceil(guestList.length / tableCount)
      });
    }
    
    return tables;
  }

  private calculateSeatingCompatibility(seatingArrangement: Record<string, unknown>[]): number {
    return Math.floor(Math.random() * 30) + 70; // Random score between 70-100
  }

  private generateWeddingMenu(guestCount: number, budget: number, dietaryRestrictions: string[], cuisine: string, style: string): Array<Record<string, unknown>> {
    const menu = [
      {
        course: 'Appetizer',
        items: ['Bruschetta', 'Spring Rolls', 'Cheese Platter'],
        dietaryNotes: ['Vegetarian options available']
      },
      {
        course: 'Main Course',
        items: ['Grilled Salmon', 'Beef Tenderloin', 'Vegetarian Pasta'],
        dietaryNotes: ['Gluten-free options available']
      },
      {
        course: 'Dessert',
        items: ['Wedding Cake', 'Tiramisu', 'Fresh Fruit'],
        dietaryNotes: ['Nut-free options available']
      }
    ];
    
    return menu;
  }

  private generateDecorSuggestions(style: string, colorScheme: string, venue: Record<string, unknown>, budget: number, season: string): string[] {
    const suggestions: string[] = [];
    
    if (style === 'romantic') {
      suggestions.push('Soft candle lighting throughout the venue');
      suggestions.push('Rose petals scattered on tables');
      suggestions.push('Floating candles in water features');
    }
    
    if (colorScheme === 'pastel') {
      suggestions.push('Light pink and lavender floral arrangements');
      suggestions.push('Soft blue table linens');
      suggestions.push('Ivory and cream accents');
    }
    
    suggestions.push(`Seasonal ${season} flowers for centerpieces`);
    suggestions.push('String lights for ambient lighting');
    
    return suggestions;
  }

  // Store processing history
  private storeProcessingHistory(type: string, response: AIProcessingResponse): void {
    const history = this.processingHistory.get(type) || [];
    history.push(response);
    
    // Keep only last 50 responses per type
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    this.processingHistory.set(type, history);
  }

  // Get processing history
  public getProcessingHistory(type?: string): Map<string, AIProcessingResponse[]> | AIProcessingResponse[] {
    if (type) {
      return this.processingHistory.get(type) || [];
    }
    return this.processingHistory;
  }

  // Get model configuration
  public getModelConfig(): Record<string, unknown> {
    return { ...this.modelConfig };
  }

  // Update model configuration
  public updateModelConfig(newConfig: Partial<Record<string, unknown>>): void {
    this.modelConfig = { ...this.modelConfig, ...newConfig };
  }
}

export default WeddingLKAIProcessor; 