'use client';

import { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X, Clock, Flame, MapPin, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  size?: 'default' | 'large';
  className?: string;
}

const POPULAR_CITIES = [
  'Amsterdam',
  'Rotterdam',
  'Utrecht',
  'The Hague',
  'Eindhoven',
  'Groningen',
];

const POPULAR_NEIGHBORHOODS = [
  'Centrum',
  'De Pijp',
  'Jordaan',
  'Oud-Zuid',
  'Oost',
];

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search Amsterdam, Rotterdam, Utrecht...',
  initialValue = '',
  size = 'default',
  className 
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent).slice(0, 5));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [searchQuery, ...recent.filter((s: string) => s !== searchQuery)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const suggestions = [
    ...(recentSearches.length > 0 ? [
      {
        type: 'recent' as const,
        items: recentSearches.slice(0, 3),
        icon: Clock,
        label: 'Recent searches',
      }
    ] : []),
    {
      type: 'popular-cities' as const,
      items: POPULAR_CITIES,
      icon: Flame,
      label: 'Popular cities',
    },
    {
      type: 'neighborhoods' as const,
      items: POPULAR_NEIGHBORHOODS,
      icon: MapPin,
      label: 'Neighborhoods',
    },
  ];

  const isLarge = size === 'large';
  const inputHeight = isLarge ? 'h-16' : 'h-12';

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div className={cn(
        'relative flex items-center rounded-lg bg-white border border-white/10 shadow-lg',
        inputHeight
      )}>
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none">
          <SearchIcon className="h-5 w-5 text-black/40" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent border-none outline-none text-black placeholder-black/40',
            'pl-12 pr-12',
            isLarge ? 'text-lg' : 'text-base'
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="h-5 w-5 text-black/40" />
          </button>
        )}

        {/* Search Button (Desktop) */}
        <button
          onClick={() => handleSearch()}
          className={cn(
            'absolute right-2 bg-black text-white rounded-lg font-medium transition-all',
            'hover:bg-black/90 active:scale-95',
            isLarge ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
          )}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-black/10 z-50 max-h-96 overflow-y-auto">
          {suggestions.map((group, groupIdx) => {
            const Icon = group.icon;
            return (
              <div key={groupIdx} className={cn(groupIdx > 0 && 'border-t border-black/10')}>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/5">
                  <Icon className="h-4 w-4 text-black/60" />
                  <span className="text-caption font-medium text-black/60 uppercase tracking-wider">
                    {group.label}
                  </span>
                </div>
                {group.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => {
                      setQuery(item);
                      handleSearch(item);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-black/5 transition-colors flex items-center gap-3"
                  >
                    <span className="text-body text-black">{item}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

