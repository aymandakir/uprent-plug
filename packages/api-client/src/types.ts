/**
 * API Client Types
 * Type definitions for request/response payloads
 */

// Auth Types
export interface AuthMeResponse {
  user: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    subscription_tier: 'free' | 'basic' | 'premium';
    subscription_status: 'active' | 'canceled' | 'past_due';
    created_at: string;
    updated_at: string;
  };
}

// AI Letter Generation Types
export interface GenerateLetterRequest {
  propertyId: string;
  language: string;
  tone: 'professional' | 'friendly' | 'enthusiastic';
  length: 'short' | 'medium' | 'long';
  includePoints: string[];
  additionalInfo?: string;
}

export interface GenerateLetterResponse {
  content: string;
  wordCount: number;
  language: string;
  estimatedReadingTime: number;
  metadata: {
    generatedAt: string;
    model: string;
    tokensUsed: number;
    version: string;
  };
}

// Contract Analysis Types
export interface AnalyzeContractRequest {
  propertyId?: string;
  text?: string;
  language: string;
}

export interface ContractIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  quote: string;
  legalReference?: string;
  recommendation: string;
}

export interface AnalyzeContractResponse {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  redFlags: ContractIssue[];
  yellowFlags: ContractIssue[];
  positiveTerms: Array<{
    title: string;
    description: string;
  }>;
  keyTerms: Record<string, any>;
  summary: string;
  recommendations: string[];
  metadata: {
    analyzedAt: string;
    documentPages?: number;
    language: string;
    contractType?: string;
  };
}

// Notification Types
export interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  userId: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
}

export interface SendSMSRequest {
  to: string;
  message: string;
  userId: string;
}

export interface SendSMSResponse {
  success: boolean;
  messageId?: string;
}

// Property Types (from database package)
export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price_monthly: number;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  property_type: string;
  images?: string[];
  photos?: string[];
  description?: string;
  available_from?: string;
  source: string;
  external_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyMatch {
  id: string;
  property_id: string;
  search_profile_id: string;
  match_score: number;
  matched_at: string;
  property?: Property;
}

// Error Types
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Health Check Types
export interface HealthCheckResponse {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    stripe: boolean;
    openai: boolean;
  };
}

