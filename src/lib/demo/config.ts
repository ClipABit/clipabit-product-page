/**
 * Configuration for the ClipABit demo page.
 * Mirrors the Streamlit config pattern from monorepo/frontend/streamlit/config.py
 */

// Environment (defaults to "prod" for safety in production)
export const ENVIRONMENT = process.env.NEXT_PUBLIC_DEMO_ENV || 'prod';

// File change operations (upload/delete) are disabled by default
export const IS_FILE_CHANGE_ENABLED = process.env.NEXT_PUBLIC_FILE_CHANGE_ENABLED === 'true';

// Namespace for Pinecone and R2 (web-demo for public demo)
export const NAMESPACE = process.env.NEXT_PUBLIC_NAMESPACE || 'web-demo';

// Page size for video repository
export const REPO_PAGE_SIZE = 18;

// Validate environment
const VALID_ENVIRONMENTS = ['dev', 'prod', 'staging'] as const;
if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT as typeof VALID_ENVIRONMENTS[number])) {
  console.warn(`Invalid ENVIRONMENT value: ${ENVIRONMENT}. Defaulting to 'prod'.`);
}

// Determine URL portion based on environment
const urlPortion = ENVIRONMENT === 'dev' ? 'dev' : '';
const urlPortion2 = ENVIRONMENT === 'dev' ? '-dev' : '';

// Server API URL (handles upload, status, videos, delete)
export const SERVER_BASE_URL = `https://clipabit01--${ENVIRONMENT}-server-${urlPortion}server-asgi-app${urlPortion2}.modal.run`;

// Search API URL (in dev it's server-searchservice, else it's search-searchservice)
const searchPrefix = ENVIRONMENT === 'dev' ? 'server' : 'search';
export const SEARCH_BASE_URL = `https://clipabit01--${ENVIRONMENT}-${searchPrefix}-searchservice-asgi-app${urlPortion2}.modal.run`;

// API Endpoints
export const API_ENDPOINTS = {
  // Server endpoints
  UPLOAD: `${SERVER_BASE_URL}/upload`,
  STATUS: `${SERVER_BASE_URL}/status`,
  LIST_VIDEOS: `${SERVER_BASE_URL}/videos`,
  DELETE_VIDEO: (hashedIdentifier: string) => `${SERVER_BASE_URL}/videos/${hashedIdentifier}`,
  
  // Search endpoints
  SEARCH: `${SEARCH_BASE_URL}/search`,
  SEARCH_STATUS: `${SEARCH_BASE_URL}/status`,
} as const;

// Export config object for debugging
export const getConfig = () => ({
  environment: ENVIRONMENT,
  isFileChangeEnabled: IS_FILE_CHANGE_ENABLED,
  namespace: NAMESPACE,
  serverBaseUrl: SERVER_BASE_URL,
  searchBaseUrl: SEARCH_BASE_URL,
  endpoints: API_ENDPOINTS,
});
