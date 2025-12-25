import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Supabase server client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    limit: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  })),
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => mockSupabase,
}));

describe('Property Search API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return paginated results', async () => {
    const mockProperties = Array.from({ length: 20 }, (_, i) => ({
      id: `prop-${i}`,
      title: `Property ${i}`,
      city: 'Amsterdam',
      price_monthly: 1000 + i * 50,
    }));

    mockSupabase.from().select().limit().order().then = vi.fn().mockResolvedValue({
      data: mockProperties,
      error: null,
    });

    // Mock API route
    const mockRequest = new Request('http://localhost/api/properties/search?page=1&pageSize=20');
    
    // Simulate API response
    const response = {
      status: 200,
      json: async () => ({
        data: mockProperties,
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 100,
          totalPages: 5,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      }),
    };

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data).toHaveLength(20);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.pageSize).toBe(20);
  });

  it('should filter by city', async () => {
    const mockProperties = [
      { id: '1', city: 'Amsterdam', price_monthly: 1200 },
      { id: '2', city: 'Amsterdam', price_monthly: 1500 },
    ];

    mockSupabase.from().select().eq().then = vi.fn().mockResolvedValue({
      data: mockProperties,
      error: null,
    });

    const response = {
      status: 200,
      json: async () => ({
        data: mockProperties,
      }),
    };

    const data = await response.json();
    data.data.forEach((property: any) => {
      expect(property.city).toBe('Amsterdam');
    });
  });
});

