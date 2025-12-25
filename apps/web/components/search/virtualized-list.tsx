'use client';

import { useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { Property } from '@/types';
import { PropertyCard } from './property-card';

interface VirtualizedPropertyListProps {
  properties: Property[];
  variant?: 'grid' | 'list';
  height?: number;
}

export function VirtualizedPropertyList({
  properties,
  variant = 'grid',
  height = 800,
}: VirtualizedPropertyListProps) {
  const itemSize = variant === 'grid' ? 400 : 200;

  const Row = ({ index, style }: ListChildComponentProps) => {
    const property = properties[index];
    if (!property) return null;

    return (
      <div style={style} className="px-2">
        <PropertyCard property={property} variant={variant} />
      </div>
    );
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={properties.length}
      itemSize={itemSize}
      width="100%"
      overscanCount={5} // Render 5 extra items outside visible area
    >
      {Row}
    </FixedSizeList>
  );
}

