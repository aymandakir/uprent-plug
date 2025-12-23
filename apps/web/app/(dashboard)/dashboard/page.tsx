"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/dashboard/property-card";
import { FilterPanel } from "@/components/dashboard/filter-panel";
import { supabase } from "@rentfusion/database";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { LetterGeneratorModal } from "@/components/dashboard/letter-generator-modal";
import { toast } from "sonner";
import type { Property } from "@rentfusion/database";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    cities: [] as string[],
    priceRange: [500, 2500] as [number, number],
    bedrooms: null as number | null,
    furnished: null as boolean | null,
    petsAllowed: null as boolean | null,
    keywords: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["properties", filters],
    queryFn: async (): Promise<Property[]> => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_active", true)
        .gte("price", filters.priceRange[0])
        .lte("price", filters.priceRange[1])
        .order("scraped_at", { ascending: false })
        .limit(50);

      if (filters.cities.length > 0) {
        query = query.in("city", filters.cities);
      }
      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }
      if (filters.furnished !== null) {
        query = query.eq("furnished", filters.furnished);
      }
      if (filters.petsAllowed !== null) {
        query = query.eq("pets_allowed", filters.petsAllowed);
      }

      const { data, error } = await query;
      if (error) throw error;
      // Ensure proper typing for Supabase response
      return (data ?? []) as Property[];
    },
    refetchInterval: 30000
  });

  // Type-safe property list
  const propertyList = (properties ?? []) as Property[];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Search</h1>
          <p className="mt-1 text-gray-600">{properties?.length || 0} properties found</p>
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-80 flex-shrink-0"
          >
            <FilterPanel filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
          </motion.div>
        )}

        <div className="flex-1">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {/* @ts-expect-error - TypeScript inference issue with Supabase types */}
                {propertyList.map((property: Property) => (
                  <PropertyCard
                    key={String(property.id)}
                    property={property}
                    onSave={(id) => console.log("Saved:", id)}
                    onApply={(id) => {
                      const found = propertyList.find((p: Property) => String(p.id) === id);
                      setSelectedProperty(found ?? property);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {selectedProperty && (
        <LetterGeneratorModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSubmit={() => {
            toast.success("Application sent!");
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}

