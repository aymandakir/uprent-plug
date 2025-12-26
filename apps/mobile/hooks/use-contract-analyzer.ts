import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnalyzeContractRequest, AnalyzeContractResponse } from '@uprent-plus/api-client';

export function useAnalyzeContract() {
  return useMutation({
    mutationFn: async (request: AnalyzeContractRequest): Promise<AnalyzeContractResponse> => {
      return api.ai.analyzeContract(request);
    },
  });
}

