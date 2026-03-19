/**
 * API functions for the ClipABit demo.
 */

import { API_ENDPOINTS, NAMESPACE, REPO_PAGE_SIZE, IS_FILE_CHANGE_ENABLED, ENVIRONMENT } from './config';

// Default timeout for API requests (60 seconds to account for cold starts)
const API_TIMEOUT_MS = 60000;

/**
 * Create an AbortSignal with timeout fallback for browser compatibility.
 * Note: In the fallback implementation, the timeout timer is not cleaned up
 * if the fetch completes early, but this is safe since abort() is idempotent.
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  // Check if AbortSignal.timeout is available (modern browsers)
  if (typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeoutMs);
  }
  
  // Fallback for browsers without AbortSignal.timeout support
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

// Types
export interface VideoMetadata {
  presigned_url: string;
  start_time_s?: number;
  file_filename: string;
  hashed_identifier: string;
}

export interface SearchResult {
  score: number;
  metadata: VideoMetadata;
}

export interface SearchResponse {
  results?: SearchResult[];
  error?: string;
}

export interface Video {
  file_name: string;
  presigned_url: string;
  hashed_identifier: string;
}

export interface VideosPageResponse {
  videos: Video[];
  next_page_token: string | null;
  total_videos: number;
  total_pages: number;
  error?: string;
}

export interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  progress_percent?: number;
  completed_count?: number;
  failed_count?: number;
  processing_count?: number;
  metrics?: {
    total_chunks?: number;
    total_frames?: number;
  };
  failed_jobs?: Array<{
    filename: string;
    error: string;
  }>;
  error?: string;
}

export interface UploadResponse {
  job_id?: string;
  batch_job_id?: string;
  total_videos?: number;
  error?: string;
}

export interface ChildJobStatus {
  job_id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  progress_percent: number;
  current_stage: string;
  chunks_processed: number;
  total_chunks: number | null;
  size_bytes: number;
  error: string | null;
}

export interface BatchStatusResponse {
  batch_job_id: string;
  status: 'processing' | 'completed' | 'partial' | 'failed';
  namespace: string;
  total_videos: number;
  completed_count: number;
  failed_count: number;
  processing_count: number;
  overall_progress_percent: number;
  child_jobs: ChildJobStatus[];
  error?: string;
}

/**
 * Search videos by semantic query.
 */
export async function searchVideos(query: string, token?: string): Promise<SearchResponse> {
  try {
    const params = new URLSearchParams({
      query,
      namespace: NAMESPACE,
    });

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINTS.SEARCH}?${params}`, {
      method: 'GET',
      headers,
      signal: createTimeoutSignal(API_TIMEOUT_MS),
    });

    if (response.ok) {
      return await response.json();
    } else {
      return { error: `Search failed with status ${response.status}` };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Search failed' };
  }
}

/**
 * Fetch a page of videos from the repository.
 */
export async function fetchVideosPage(
  pageToken?: string | null,
  pageSize: number = REPO_PAGE_SIZE,
  token?: string
): Promise<VideosPageResponse> {
  try {
    const params = new URLSearchParams({
      namespace: NAMESPACE,
      page_size: pageSize.toString(),
    });

    if (pageToken) {
      params.append('page_token', pageToken);
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINTS.LIST_VIDEOS}?${params}`, {
      method: 'GET',
      headers,
      signal: createTimeoutSignal(API_TIMEOUT_MS),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        videos: data.videos || [],
        next_page_token: data.next_page_token || null,
        total_videos: data.total_videos || 0,
        total_pages: data.total_pages || 0,
      };
    } else {
      return {
        videos: [],
        next_page_token: null,
        total_videos: 0,
        total_pages: 0,
        error: `Fetch failed with status ${response.status}`,
      };
    }
  } catch (error) {
    return {
      videos: [],
      next_page_token: null,
      total_videos: 0,
      total_pages: 0,
      error: error instanceof Error ? error.message : 'Fetch failed',
    };
  }
}

/**
 * Upload one or more video files.
 */
export async function uploadFiles(files: File[], token?: string): Promise<UploadResponse> {
  if (!IS_FILE_CHANGE_ENABLED) {
    return { error: `Upload not allowed in ${ENVIRONMENT} environment` };
  }

  console.log(`Token: ${token}`)

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('namespace', NAMESPACE);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Dynamic timeout: 300s base + 30s per file, minimum 600s
    const timeout = Math.max(600000, 300000 + files.length * 30000);

    const response = await fetch(API_ENDPOINTS.UPLOAD, {
      method: 'POST',
      body: formData,
      headers,
      signal: createTimeoutSignal(timeout),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const text = await response.text();
      const errorMsg = `Upload failed with status ${response.status}. ${text}`;
      console.error('Upload error:', errorMsg);
      return { error: errorMsg };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload exception:', error);
    return { error: errorMsg };
  }
}

/**
 * Poll job status until completion or timeout.
 */
export async function pollJobStatus(jobId: string, token?: string): Promise<JobStatus> {
  try {
    const params = new URLSearchParams({ job_id: jobId });
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINTS.STATUS}?${params}`, {
      method: 'GET',
      headers,
      signal: createTimeoutSignal(API_TIMEOUT_MS),
    });

    if (response.ok) {
      return await response.json();
    } else {
      return { status: 'failed', error: `Status check failed with status ${response.status}` };
    }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : 'Status check failed' };
  }
}

/**
 * Poll batch status to get per-video progress.
 */
export async function pollBatchStatus(batchJobId: string, token?: string): Promise<BatchStatusResponse> {
  try {
    const params = new URLSearchParams({ batch_job_id: batchJobId });
    // Replace /status with /batch-status in the endpoint
    const batchStatusUrl = API_ENDPOINTS.STATUS.replace('/status', '/batch-status');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${batchStatusUrl}?${params}`, {
      method: 'GET',
      headers,
      signal: createTimeoutSignal(API_TIMEOUT_MS),
    });

    if (response.ok) {
      return await response.json();
    } else {
      return {
        batch_job_id: batchJobId,
        status: 'failed',
        namespace: '',
        total_videos: 0,
        completed_count: 0,
        failed_count: 0,
        processing_count: 0,
        overall_progress_percent: 0,
        child_jobs: [],
        error: `Batch status check failed with status ${response.status}`
      };
    }
  } catch (error) {
    return {
      batch_job_id: batchJobId,
      status: 'failed',
      namespace: '',
      total_videos: 0,
      completed_count: 0,
      failed_count: 0,
      processing_count: 0,
      overall_progress_percent: 0,
      child_jobs: [],
      error: error instanceof Error ? error.message : 'Batch status check failed'
    };
  }
}

/**
 * Delete a video by its hashed identifier.
 */
export async function deleteVideo(
  hashedIdentifier: string,
  filename: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  if (!IS_FILE_CHANGE_ENABLED) {
    return { success: false, error: `Deletion not allowed in ${ENVIRONMENT} environment` };
  }

  try {
    const params = new URLSearchParams({
      filename,
      namespace: NAMESPACE,
    });

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ENDPOINTS.DELETE_VIDEO(hashedIdentifier)}?${params}`, {
      method: 'DELETE',
      headers,
      signal: createTimeoutSignal(API_TIMEOUT_MS),
    });

    if (response.ok) {
      return { success: true };
    } else if (response.status === 404) {
      return { success: false, error: `Video '${filename}' not found` };
    } else if (response.status === 403) {
      return { success: false, error: `Deletion not allowed in ${ENVIRONMENT} environment` };
    } else {
      return { success: false, error: `Delete failed with status ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' };
  }
}
