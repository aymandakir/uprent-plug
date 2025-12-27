// API client stub - to be implemented
export function createApiClient(options: { baseUrl: string; supabase: any }) {
  return {
    // Stub implementation - to be replaced with actual API client
    // @ts-expect-error - stub implementation
    request: async () => {
      throw new Error('API client not implemented');
    },
  };
}

export type AnalyzeContractRequest = any;
export type AnalyzeContractResponse = any;
export type GenerateLetterRequest = any;
export type GenerateLetterResponse = any;

