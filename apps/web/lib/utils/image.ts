/**
 * Image optimization utilities
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

/**
 * Generate optimized image URL using CDN
 * In production, use Cloudinary or similar CDN
 */
export function getOptimizedImageUrl(
  url: string,
  options: ImageOptions = {}
): string {
  if (!url) return '';

  // If already a CDN URL, append transformation params
  if (url.includes('cdn.uprent.nl') || url.includes('cloudinary')) {
    const params = new URLSearchParams();
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.fit) params.append('fit', options.fit);
    if (options.format) params.append('f', options.format);

    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }

  // For local images, return as-is (Next.js will optimize)
  return url;
}

/**
 * Generate blur placeholder data URL
 * In production, use blurhash library
 * This function should only be called on the client side
 */
export function generateBlurPlaceholder(width: number = 20, height: number = 20): string {
  if (typeof window === 'undefined') {
    // Server-side: return simple data URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMUYxRjFGIi8+PC9zdmc+';
  }

  // Client-side: use canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1F1F1F';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
}

/**
 * Get image dimensions for responsive images
 */
export function getImageSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints;
  return `(max-width: 768px) ${mobile}vw, (max-width: 1200px) ${tablet}vw, ${desktop}vw`;
}

