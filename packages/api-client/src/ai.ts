/**
 * AI API Endpoints
 */

import { ApiClient } from './client';
import type {
  GenerateLetterRequest,
  GenerateLetterResponse,
  AnalyzeContractRequest,
  AnalyzeContractResponse,
} from './types';

export class AiApi {
  constructor(private client: ApiClient) {}

  /**
   * Generate AI application letter
   */
  async generateLetter(request: GenerateLetterRequest): Promise<GenerateLetterResponse> {
    return this.client.post<GenerateLetterResponse>('/api/ai/generate-letter', request);
  }

  /**
   * Analyze rental contract
   */
  async analyzeContract(request: AnalyzeContractRequest): Promise<AnalyzeContractResponse> {
    return this.client.post<AnalyzeContractResponse>('/api/ai/analyze-contract', request);
  }
}

