/**
 * Lazy loading utilities for heavy components
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Lazy load map component (heavy library)
 */
export const MapView = dynamic(
  () => import('@/components/search/map-view').then((mod) => mod.MapView),
  {
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-neutral-900 rounded-lg">
        <div className="text-white/60">Loading map...</div>
      </div>
    ),
    ssr: false, // Don't render on server
  }
);

/**
 * Lazy load chart components
 */
export const PropertyChart = dynamic(
  () => import('@/components/charts/property-chart').then((mod) => mod.PropertyChart),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-neutral-900 rounded-lg animate-pulse">
        <div className="text-white/60">Loading chart...</div>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy load rich text editor
 */
export const RichTextEditor = dynamic(
  () => import('@/components/editor/rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-neutral-900 rounded-lg animate-pulse">
        <div className="text-white/60">Loading editor...</div>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Generic lazy loading wrapper
 */
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFunc, {
    loading: options?.loading,
    ssr: options?.ssr !== false,
  });
}

