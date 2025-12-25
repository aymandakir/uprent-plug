"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, BedDouble, Ruler } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Property } from "@uprent-plus/database";

interface PropertyCardProps {
  property: Property;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
}

export function PropertyCard({ property, onSave, onApply }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const handleSave = () => {
    setSaved((s) => !s);
    onSave?.(property.id as unknown as string);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group cursor-pointer overflow-hidden card transition-all duration-300 hover:ring-2 hover:ring-white/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        {(() => {
          const photos = property.photos as string[] | null;
          const placeholderImage = `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80`;
          const imageUrl = photos && photos.length > 0 
            ? (photos[imageIndex] || placeholderImage)
            : placeholderImage;
          
          return (
            <>
              <Image
                src={imageUrl}
                alt={property.title as string}
                fill
                sizes="400px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={!photos || photos.length === 0}
              />
              {photos && photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                  {photos.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageIndex(idx);
                      }}
                      className={`h-2 w-2 rounded-full transition-all ${idx === imageIndex ? "w-6 bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition-all ${
            saved ? "bg-red-500 text-white" : "bg-white/80 text-gray-700 hover:bg-white"
          }`}
        >
          <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
        </button>

        {isNew(property.scraped_at as string) && (
          <div className="absolute left-3 top-3 rounded-full bg-electric-blue px-3 py-1 text-xs font-bold text-white">
            NEW
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-2xl font-heading font-bold text-white">
            €{Number(property.price ?? 0).toLocaleString()}
          </span>
          <span className="text-sm text-white/60">/month</span>
        </div>

        <h3 className="mb-2 line-clamp-1 font-heading font-semibold text-white">{property.title}</h3>

        <div className="mb-3 flex items-center gap-1 text-sm text-white/60">
          <MapPin className="h-4 w-4" />
          <span>
            {(property.neighborhood as string | null) ?? "—"}, {property.city}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-white/60">
          {property.bedrooms ? (
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{property.bedrooms} bed</span>
            </div>
          ) : null}
          {property.square_meters ? (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              <span>{property.square_meters}m²</span>
            </div>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          {property.furnished && (
            <span className="rounded-full bg-white/10 px-2 py-1 text-white/80">Furnished</span>
          )}
          {property.pets_allowed && (
            <span className="rounded-full bg-white/10 px-2 py-1 text-white/80">Pets OK</span>
          )}
          {property.balcony && (
            <span className="rounded-full bg-white/10 px-2 py-1 text-white/80">Balcony</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(property.source_url as string, "_blank");
            }}
            className="flex-1 rounded-lg border border-white/20 py-2 font-medium text-white transition-colors hover:bg-white/10"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(property.id as unknown as string);
            }}
            className="flex-1 rounded-lg bg-electric-blue py-2 font-medium text-white transition-colors hover:bg-electric-blue/90"
          >
            Apply with AI
          </button>
        </div>

        <div className="mt-3 text-center text-xs text-white/40">
          Found on {property.source} · {timeAgo(property.scraped_at as string)}
        </div>
      </div>
    </motion.div>
  );
}

function isNew(date: string): boolean {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 24 * 60 * 60 * 1000;
}

function timeAgo(date: string): string {
  if (!date) return "";
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

