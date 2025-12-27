/**
 * PropertyCard component tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertyMatch } from '@/types/property';

// Mock dependencies
jest.mock('@/hooks/use-matches', () => ({
  useSaveProperty: () => ({
    mutateAsync: jest.fn(),
  }),
  useUnsaveProperty: () => ({
    mutateAsync: jest.fn(),
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    show: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }),
}));

const mockMatch: PropertyMatch = {
  id: '1',
  property_id: 'prop-1',
  search_profile_id: 'search-1',
  user_id: 'user-1',
  match_score: 85,
  status: 'new',
  matched_at: new Date().toISOString(),
  property: {
    id: 'prop-1',
    title: 'Test Property',
    address: '123 Test St',
    city: 'Amsterdam',
    price_monthly: 1500,
    bedrooms: 2,
    bathrooms: 1,
    size_sqm: 75,
    property_type: 'apartment',
    images: ['https://example.com/image.jpg'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

describe('PropertyCard', () => {
  it('renders correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard match={mockMatch} onPress={onPress} />
    );

    expect(getByText('€1,500/mo')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
  });

  it('calls onPress when card is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard match={mockMatch} onPress={onPress} />
    );

    fireEvent.press(getByText('123 Test St'));
    expect(onPress).toHaveBeenCalled();
  });

  it('displays match score badge', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PropertyCard match={mockMatch} onPress={onPress} />
    );

    expect(getByText('85%')).toBeTruthy();
  });
});

