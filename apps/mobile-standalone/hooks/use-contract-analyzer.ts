import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Standalone types (replaces @uprent-plus/api-client types)
export type AnalyzeContractRequest = {
  text: string;
  language?: string;
};

export type AnalyzeContractResponse = {
  summary: string;
  risks: Array<{ severity: 'low' | 'medium' | 'high'; description: string }>;
  recommendations: string[];
  language: string;
};

export function useAnalyzeContract() {
  return useMutation({
    mutationFn: async (request: AnalyzeContractRequest): Promise<AnalyzeContractResponse> => {
      return api.post<AnalyzeContractResponse>('/api/ai/analyze-contract', request);
    },
  });
}
