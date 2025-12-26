import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { GenerateLetterRequest, GenerateLetterResponse } from '@uprent-plus/api-client';

export function useGenerateLetter() {
  return useMutation({
    mutationFn: async (request: GenerateLetterRequest): Promise<GenerateLetterResponse> => {
      return api.ai.generateLetter(request);
    },
  });
}

