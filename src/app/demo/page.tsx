'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearch, useVideoRepository, useToast, useDeleteVideo } from '@/src/lib/demo/use-demo-state';
import { IS_FILE_CHANGE_ENABLED } from '@/src/lib/demo/config';
import { VideoGrid } from '@/src/components/demo/VideoGrid';
import { SearchBar } from '@/src/components/demo/SearchBar';
import { Pagination } from '@/src/components/demo/Pagination';
import { UploadModal } from '@/src/components/demo/UploadModal';
import { DeleteModal } from '@/src/components/demo/DeleteModal';

export default function DemoPage() {
  // Simple, focused hooks
  const { toast, showToast, clearToast } = useToast();
  const searchState = useSearch();
  // Only auto-load when not in search mode
  const repo = useVideoRepository(!searchState.isActive);

  // Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Handle content changes (after upload/delete)
  const handleContentChange = () => {
    searchState.clear();
    repo.reset();
  };

  const { handleDelete } = useDeleteVideo(handleContentChange, showToast);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">ClipABit</h1>
          <p className="text-lg sm:text-xl text-foreground/60">Semantic Video Search - Demo</p>
        </div>

        {/* Upload Button or Info Text */}
        {IS_FILE_CHANGE_ENABLED ? (
          <div className="mb-6">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-foreground/5 border border-foreground/10 rounded-xl">
            <p className="text-foreground/70 text-sm sm:text-base">
              The repository below mimics the footage you would have in your video editor&apos;s media pool.
              Try searching for specific actions, settings, objects in the videos using natural language!
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchState.query}
            onChange={searchState.setQuery}
            onSearch={searchState.search}
            onClear={searchState.clear}
            isSearching={searchState.isSearching}
            hasResults={searchState.isActive}
          />
        </div>

        {/* Search Error */}
        {searchState.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">{searchState.error}</p>
          </div>
        )}

        <hr className="border-foreground/10 mb-6" />

        {/* Content - Search Results or Repository */}
        {searchState.isActive ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">
              Search Results for: &quot;{searchState.query}&quot;
            </h2>
            <VideoGrid
              searchResults={searchState.results}
              onDelete={(id, name) => setDeleteTarget({ id, name })}
              emptyMessage="No matching videos found."
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">Video Repository</h2>
              {repo.videos.length > 0 && (
                <Pagination
                  currentPage={repo.currentPage}
                  totalPages={repo.totalPages}
                  totalVideos={repo.totalVideos}
                  hasNextPage={repo.hasNext}
                  hasPrevPage={repo.hasPrev}
                  isLoading={repo.isLoading}
                  onPrev={repo.goPrev}
                  onNext={repo.goNext}
                />
              )}
            </div>

            {/* Loading */}
            {repo.isLoading && repo.videos.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-foreground/60">
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Loading videos...</span>
                </div>
              </div>
            )}

            {/* Error */}
            {repo.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400">{repo.error}</p>
              </div>
            )}

            {/* Videos */}
            {repo.videos.length > 0 && (
              <>
                <VideoGrid
                  videos={repo.videos}
                  onDelete={(id, name) => setDeleteTarget({ id, name })}
                  emptyMessage="No videos found."
                />
                <Pagination
                  currentPage={repo.currentPage}
                  totalPages={repo.totalPages}
                  totalVideos={repo.totalVideos}
                  hasNextPage={repo.hasNext}
                  hasPrevPage={repo.hasPrev}
                  isLoading={repo.isLoading}
                  onPrev={repo.goPrev}
                  onNext={repo.goNext}
                />
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-foreground/10">
          <p className="text-center text-foreground/50 text-sm">
            ClipABit - Powered by CLIP embeddings and semantic search
          </p>
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleContentChange}
        showToast={showToast}
      />

      <DeleteModal
        isOpen={deleteTarget !== null}
        filename={deleteTarget?.name || ''}
        hashedIdentifier={deleteTarget?.id || ''}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-md ${
              toast.type === 'success' ? 'bg-green-500/90 text-white' :
              toast.type === 'error' ? 'bg-red-500/90 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500/90 text-black' :
              'bg-blue-500/90 text-white'
            }`}>
              <span className="text-sm font-medium">{toast.message}</span>
              <button onClick={clearToast} className="p-1 hover:bg-white/20 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
