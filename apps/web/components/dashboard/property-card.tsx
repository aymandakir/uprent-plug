"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, BedDouble, Ruler } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Property } from "@rentfusion/database";

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
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {property.photos && property.photos.length > 0 ? (
          <>
            <Image
              src={(property.photos as string[])[imageIndex] || "/placeholder.jpg"}
              alt={property.title as string}
              fill
              sizes="400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {property.photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                {property.photos.map((_: string, idx: number) => (
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
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}

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
          <div className="absolute left-3 top-3 rounded-full bg-brand-400 px-3 py-1 text-xs font-bold text-white">
            NEW
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            €{Number(property.price ?? 0).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">/month</span>
        </div>

        <h3 className="mb-2 line-clamp-1 font-semibold text-gray-900">{property.title}</h3>

        <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {(property.neighborhood as string | null) ?? "—"}, {property.city}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
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
            <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">Furnished</span>
          )}
          {property.pets_allowed && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">Pets OK</span>
          )}
          {property.balcony && (
            <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-700">Balcony</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(property.source_url as string, "_blank");
            }}
            className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(property.id as unknown as string);
            }}
            className="flex-1 rounded-lg bg-brand-400 py-2 font-medium text-white transition-colors hover:bg-brand-500"
          >
            Apply with AI
          </button>
        </div>

        <div className="mt-3 text-center text-xs text-gray-400">
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

