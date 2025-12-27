import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Standalone types (replaces @uprent-plus/api-client types)
export type GenerateLetterRequest = {
  propertyId?: string;
  language?: string;
  tone?: 'professional' | 'friendly' | 'enthusiastic';
  length?: 'short' | 'medium' | 'long';
  keyPoints?: string;
  fullName?: string;
  occupation?: string;
  income?: string;
};

export type GenerateLetterResponse = {
  content: string;
  language: string;
};

export function useGenerateLetter() {
  return useMutation({
    mutationFn: async (request: GenerateLetterRequest): Promise<GenerateLetterResponse> => {
      return api.post<GenerateLetterResponse>('/api/ai/generate-letter', request);
    },
  });
}
