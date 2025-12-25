'use client';

import { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: any; // Property from database
  variant?: 'grid' | 'list';
  matchScore?: number;
  onSave?: (id: string) => void;
  className?: string;
}

export function PropertyCard({
  property,
  variant = 'grid',
  matchScore,
  onSave,
  className,
}: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(property.id);
  };

  const images = property.images || property.photos || [];
  const currentImage = images[currentImageIndex] || '/placeholder-property.jpg';
  const price = property.price_monthly || property.price || 0;
  const city = property.city || '';
  const neighborhood = property.neighborhood || '';
  const size = property.size_sqm || property.square_meters || null;
  const bedrooms = property.bedrooms || null;
  const bathrooms = property.bathrooms || null;
  const availableFrom = property.available_from || null;

  if (variant === 'list') {
    return (
      <Link href={`/dashboard/search/${property.id}`}>
        <div className={cn('card group cursor-pointer', className)}>
          <div className="flex gap-6">
            {/* Image */}
            <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
              {images.length > 0 ? (
                <Image
                  src={currentImage}
                  alt={property.title || 'Property'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  No image
                </div>
              )}
              {matchScore && (
                <div className="absolute top-2 left-2 rounded-full bg-electric-blue px-2 py-1 text-caption font-medium text-white">
                  {matchScore}% match
                </div>
              )}
              <button
                onClick={handleSave}
                className={cn(
                  'absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all',
                  isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-black/60 hover:bg-white'
                )}
              >
                <Heart className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-h4 font-heading font-semibold text-white mb-1 line-clamp-1">
                    {property.title || 'Property'}
                  </h3>
                  <div className="flex items-center gap-2 text-body-sm text-white/60">
                    <MapPin className="h-4 w-4" />
                    <span>{neighborhood && `${neighborhood}, `}{city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-h3 font-heading font-bold text-white">
                    {formatCurrency(price)}
                  </div>
                  <div className="text-body-sm text-white/60">/month</div>
                </div>
              </div>

              <p className="text-body-sm text-white/70 line-clamp-2 mb-4">
                {property.description || 'No description available'}
              </p>

              <div className="flex items-center gap-6 text-body-sm text-white/60 mb-4">
                {size && (
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{size} m²</span>
                  </div>
                )}
                {bedrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {bathrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-body-sm text-white/60">
                  {availableFrom && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Available {formatDate(availableFrom)}</span>
                    </div>
                  )}
                  {property.created_at && (
                    <span>Posted {formatRelativeTime(property.created_at)}</span>
                  )}
                </div>
                <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={`/dashboard/search/${property.id}`}>
      <div className={cn('card group cursor-pointer', className)}>
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 mb-4">
          {images.length > 0 ? (
            <>
              <Image
                src={currentImage}
                alt={property.title || 'Property'}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.slice(0, 6).map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40">
              No image
            </div>
          )}

          {matchScore && (
            <div className="absolute top-3 left-3 rounded-full bg-electric-blue px-2 py-1 text-caption font-medium text-white">
              {matchScore}% match
            </div>
          )}

          <button
            onClick={handleSave}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all',
              isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-black/60 hover:bg-white'
            )}
          >
            <Heart className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-h3 font-heading font-bold text-white">
              {formatCurrency(price)}
            </div>
            <span className="text-body-sm text-white/60">/month</span>
          </div>

          <h3 className="text-body-lg font-medium text-white mb-2 line-clamp-1">
            {property.title || 'Property'}
          </h3>

          <div className="flex items-center gap-1 text-body-sm text-white/60 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{neighborhood && `${neighborhood}, `}{city}</span>
          </div>

          <div className="flex items-center gap-4 text-body-sm text-white/60 mb-4">
            {size && (
              <span>{size} m²</span>
            )}
            {bedrooms !== null && <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>}
            {bathrooms !== null && <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>}
          </div>

          {property.created_at && (
            <div className="text-body-sm text-white/60">
              Posted {formatRelativeTime(property.created_at)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
