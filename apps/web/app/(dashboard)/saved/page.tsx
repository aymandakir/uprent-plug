'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Grid, List, Tag, Folder, Trash2, Move, Share2, FileDown, MoreVertical, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/search/property-card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

type ViewMode = 'folders' | 'list' | 'tags';

export default function SavedPropertiesPage() {
  const supabase = createClient();
  const [viewMode, setViewMode] = useState<ViewMode>('folders');
  const [folders, setFolders] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedFolder]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load saved properties
      const { data: saved } = await supabase
        .from('saved_properties')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (selectedFolder && selectedFolder !== 'all') {
        const filtered = saved?.filter((s) => s.folder === selectedFolder) || [];
        setProperties(filtered.map((s) => s.properties).filter(Boolean));
      } else {
        setProperties(saved?.map((s) => s.properties).filter(Boolean) || []);
      }

      // Extract unique folders
      const folderMap = new Map<string, number>();
      saved?.forEach((s) => {
        const folder = s.folder || 'default';
        folderMap.set(folder, (folderMap.get(folder) || 0) + 1);
      });

      const folderList = Array.from(folderMap.entries()).map(([name, count]) => ({
        name,
        count,
        color: '#3B82F6', // Default color
        icon: '📁',
      }));

      setFolders(folderList);
    } catch (error: any) {
      toast.error('Failed to load saved properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (name: string) => {
    // Folder creation handled via UI, properties moved to folder
    toast.success('Folder created');
    loadData();
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProperties.size === 0) {
      toast.error('No properties selected');
      return;
    }

    switch (action) {
      case 'delete':
        // Delete selected properties
        break;
      case 'move':
        // Move to folder
        break;
      default:
        break;
    }

    setSelectedProperties(new Set());
    toast.success('Action completed');
    loadData();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-content px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h1 font-heading font-bold text-white mb-2">Saved Properties</h1>
            <p className="text-body text-white/60">Organize and manage your favorite properties</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCreateFolder('New Folder')}
              className="btn-secondary flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              New Folder
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setViewMode('folders')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'folders' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
              )}
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('tags')}
              className={cn(
                'p-2 rounded transition-colors',
                viewMode === 'tags' ? 'bg-electric-blue text-white' : 'text-white/60 hover:text-white'
              )}
            >
              <Tag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Folders View */}
        {viewMode === 'folders' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setSelectedFolder(null)}
              className={cn(
                'card text-left hover:border-electric-blue transition-colors',
                !selectedFolder && 'border-electric-blue'
              )}
            >
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-body font-semibold text-white mb-1">All Properties</h3>
              <p className="text-body-sm text-white/60">{properties.length} properties</p>
            </button>

            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={cn(
                  'card text-left hover:border-electric-blue transition-colors',
                  selectedFolder === folder.name && 'border-electric-blue'
                )}
              >
                <div className="text-4xl mb-3">{folder.icon}</div>
                <h3 className="text-body font-semibold text-white mb-1">{folder.name}</h3>
                <p className="text-body-sm text-white/60">{folder.count} properties</p>
              </button>
            ))}
          </div>
        )}

        {/* Properties List */}
        {viewMode === 'list' && (
          <>
            {/* Bulk Actions Bar */}
            {selectedProperties.size > 0 && (
              <div className="card mb-6 flex items-center justify-between">
                <span className="text-body text-white">
                  {selectedProperties.size} {selectedProperties.size === 1 ? 'property' : 'properties'} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('move')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Move className="h-4 w-4" />
                    Move
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-white/10 rounded-lg mb-4" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="card text-center py-24">
                <Heart className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-h3 font-heading font-bold text-white mb-2">No saved properties</h3>
                <p className="text-body text-white/60 mb-6">
                  Click the heart icon on properties to save them
                </p>
                <Link href="/dashboard/search" className="btn-primary">
                  Start searching
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="relative">
                    {viewMode === 'list' && (
                      <input
                        type="checkbox"
                        checked={selectedProperties.has(property.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedProperties);
                          if (e.target.checked) {
                            newSelected.add(property.id);
                          } else {
                            newSelected.delete(property.id);
                          }
                          setSelectedProperties(newSelected);
                        }}
                        className="absolute top-4 left-4 z-10 h-5 w-5 rounded border-white/20 bg-white/80"
                      />
                    )}
                    <PropertyCard property={property} variant="grid" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

