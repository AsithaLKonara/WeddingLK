export interface AIRecommendation {
  _id: string;
  _name: string;
  score: number;
  type: 'venue' | 'vendor' | 'timeline' | 'budget';
  _title: string;
  _description: string;
  _confidence: number;
  data: Record<string, any>;
  [_key: string]: any;
}

export interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  _confidence: number;
  _keywords: string[];
  _summary: string;
  _recommendations: string[];
}

export interface ContentGenerationResult {
  _content: string;
  type: 'email' | 'description' | 'proposal';
  metadata: Record<string, any>;
}

export interface PredictiveInsights {
  _type: string;
  predictions: Array<{
    _metric: string;
    _value: number;
    _confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}
