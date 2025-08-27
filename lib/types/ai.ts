export interface AIRecommendation {
  id: string;
  name: string;
  score: number;
  type: 'venue' | 'vendor' | 'timeline' | 'budget';
  title: string;
  description: string;
  confidence: number;
  data: Record<string, any>;
  [key: string]: any;
}

export interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
  summary: string;
  recommendations: string[];
}

export interface ContentGenerationResult {
  content: string;
  type: 'email' | 'description' | 'proposal';
  metadata: Record<string, any>;
}

export interface PredictiveInsights {
  type: string;
  predictions: Array<{
    metric: string;
    value: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}
