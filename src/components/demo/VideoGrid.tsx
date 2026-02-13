'use client';

import { VideoCard } from './VideoCard';
import type { Video, SearchResult } from '@/src/lib/demo/api';

interface VideoGridProps {
  // Either videos (repository) or searchResults (search mode)
  videos?: Video[];
  searchResults?: SearchResult[] | null;
  // Delete handler
  onDelete?: (hashedIdentifier: string, filename: string) => void;
  // Empty state
  emptyMessage?: string;
}

export function VideoGrid({
  videos,
  searchResults,
  onDelete,
  emptyMessage = 'No videos found.',
}: VideoGridProps) {
  // Determine which data source to use
  const isSearchMode = searchResults !== undefined && searchResults !== null;
  const items = isSearchMode ? searchResults : (videos || []);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-foreground/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isSearchMode
        ? // Search results
          (items as SearchResult[]).map((result, idx) => (
            <VideoCard
              key={`search-${idx}-${result.metadata.hashed_identifier}`}
              fileName={result.metadata.file_filename}
              presignedUrl={result.metadata.presigned_url}
              hashedIdentifier={result.metadata.hashed_identifier}
              score={result.score}
              startTime={result.metadata.start_time_s}
              rawData={result as unknown as Record<string, unknown>}
              onDelete={onDelete}
            />
          ))
        : // Repository videos
          (items as Video[]).map((video, idx) => (
            <VideoCard
              key={`repo-${idx}-${video.hashed_identifier}`}
              fileName={video.file_name}
              presignedUrl={video.presigned_url}
              hashedIdentifier={video.hashed_identifier}
              rawData={video as unknown as Record<string, unknown>}
              onDelete={onDelete}
            />
          ))}
    </div>
  );
}
