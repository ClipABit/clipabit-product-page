'use client';

/**
 * Simplified hooks for demo page state management.
 * Split into focused, single-purpose hooks.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  searchVideos,
  fetchVideosPage,
  deleteVideo,
  type SearchResult,
  type Video,
} from './api';
import { REPO_PAGE_SIZE } from './config';

// ============================================================================
// useToast - Simple toast notifications
// ============================================================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

export function useToast(autoHideMs = 5000) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  // Auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [toast, autoHideMs, clearToast]);

  return { toast, showToast, clearToast };
}

// ============================================================================
// useSearch - Video search functionality
// ============================================================================

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setError(null);

    const response = await searchVideos(searchQuery);

    if (response.error) {
      setError(response.error);
      setResults(null);
    } else {
      setResults(response.results || []);
    }

    setIsSearching(false);
  }, []);

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

      const response = await fetchVideosPage(null, REPO_PAGE_SIZE);

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
    };

    load();
  }, [autoLoad, status]);

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

    const response = await fetchVideosPage(nextToken, REPO_PAGE_SIZE);

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
  }, [isLoading, currentPage, nextToken, pageCache]);

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
  const handleDelete = useCallback(async (hashedIdentifier: string, filename: string): Promise<boolean> => {
    const result = await deleteVideo(hashedIdentifier, filename);

    if (result.success) {
      showToast(`Video '${filename}' deleted successfully!`, 'success');
      onSuccess();
      return true;
    } else {
      showToast(result.error || 'Delete failed', 'error');
      return false;
    }
  }, [onSuccess, showToast]);

  return { handleDelete };
}
