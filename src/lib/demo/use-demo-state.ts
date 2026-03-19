'use client';

/**
 * Simplified hooks for demo page state management.
 * Split into focused, single-purpose hooks.
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  searchVideos,
  fetchVideosPage,
  deleteVideo,
  type SearchResult,
  type Video,
} from './api';
import { REPO_PAGE_SIZE } from './config';

type ToastType = 'success' | 'error' | 'info' | 'warning';

// ... (useToast remains unchanged)

// ============================================================================
// useSearch - Video search functionality
// ============================================================================

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      const response = await searchVideos(searchQuery, token);

      if (response.error) {
        setError(response.error);
        setResults(null);
      } else {
        setResults(response.results || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    search,
    clear,
    isActive: results !== null,
  };
}

// ============================================================================
// useVideoRepository - Paginated video list with page caching
// ============================================================================

interface PageCache {
  videos: Video[];
  nextToken: string | null;
}

export function useVideoRepository(autoLoad = true) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Pagination with cache
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [pageCache, setPageCache] = useState<Map<number, PageCache>>(new Map());

  // Auto-load on mount
  useEffect(() => {
    if (!autoLoad || status !== 'idle') return;
    
    const load = async () => {
      setStatus('loading');
      setIsLoading(true);
      setError(null);

      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
        const response = await fetchVideosPage(null, REPO_PAGE_SIZE, token);

        setIsLoading(false);

        if (response.error) {
          setError(response.error);
          setStatus('error');
        } else {
          setVideos(response.videos);
          setNextToken(response.next_page_token);
          setTotalPages(response.total_pages);
          setTotalVideos(response.total_videos);
          setCurrentPage(1);
          setStatus('loaded');
          // Cache page 1
          setPageCache(new Map([[1, { videos: response.videos, nextToken: response.next_page_token }]]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch failed');
        setStatus('error');
        setIsLoading(false);
      }
    };

    load();
  }, [autoLoad, status, getAccessTokenSilently, isAuthenticated]);

  const goNext = useCallback(async () => {
    if (isLoading) return;
    
    const nextPage = currentPage + 1;
    
    // Check cache first
    const cached = pageCache.get(nextPage);
    if (cached) {
      setVideos(cached.videos);
      setNextToken(cached.nextToken);
      setCurrentPage(nextPage);
      return;
    }
    
    // Need to fetch
    if (!nextToken) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      const response = await fetchVideosPage(nextToken, REPO_PAGE_SIZE, token);

      setIsLoading(false);

      if (response.error) {
        setError(response.error);
      } else {
        setVideos(response.videos);
        setNextToken(response.next_page_token);
        setCurrentPage(nextPage);
        // Cache this page
        setPageCache(prev => new Map(prev).set(nextPage, { 
          videos: response.videos, 
          nextToken: response.next_page_token 
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
      setIsLoading(false);
    }
  }, [isLoading, currentPage, nextToken, pageCache, getAccessTokenSilently, isAuthenticated]);

  const goPrev = useCallback(() => {
    if (isLoading || currentPage <= 1) return;
    
    const prevPage = currentPage - 1;
    const cached = pageCache.get(prevPage);
    
    if (cached) {
      setVideos(cached.videos);
      setNextToken(cached.nextToken);
      setCurrentPage(prevPage);
    }
  }, [isLoading, currentPage, pageCache]);

  const reset = useCallback(() => {
    setVideos([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalVideos(0);
    setNextToken(null);
    setError(null);
    setStatus('idle');
    setIsLoading(false);
    setPageCache(new Map());
  }, []);

  return {
    videos,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalVideos,
    hasNext: nextToken !== null || pageCache.has(currentPage + 1),
    hasPrev: currentPage > 1,
    goNext,
    goPrev,
    reset,
  };
}

// ============================================================================
// useDeleteVideo - Handle video deletion
// ============================================================================

export function useDeleteVideo(onSuccess: () => void, showToast: (msg: string, type: ToastType) => void) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const handleDelete = useCallback(async (hashedIdentifier: string, filename: string): Promise<boolean> => {
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined;
      const result = await deleteVideo(hashedIdentifier, filename, token);

      if (result.success) {
        showToast(`Video '${filename}' deleted successfully!`, 'success');
        onSuccess();
        return true;
      } else {
        showToast(result.error || 'Delete failed', 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
      return false;
    }
  }, [onSuccess, showToast, getAccessTokenSilently, isAuthenticated]);

  return { handleDelete };
}
