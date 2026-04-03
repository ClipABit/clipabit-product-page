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

// Dev name for Modal app
export const DEV_NAME = process.env.NEXT_PUBLIC_DEV_NAME || '';


// Page size for video repository
export const REPO_PAGE_SIZE = 18;

// Validate environment
const VALID_ENVIRONMENTS = ['dev', 'prod', 'staging'] as const;
if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT as typeof VALID_ENVIRONMENTS[number])) {
  throw new Error(
    `Invalid NEXT_PUBLIC_DEMO_ENV value: "${ENVIRONMENT}". Must be one of: ${VALID_ENVIRONMENTS.join(', ')}`
  );
}

// Validate DEV_NAME is set in dev mode
if (ENVIRONMENT === 'dev' && !DEV_NAME) {
  throw new Error(
    'NEXT_PUBLIC_DEV_NAME is required in dev mode. Add it to your .env.local file.'
  );
}

// Determine URL portion based on environment
const urlPortion = ENVIRONMENT === 'dev' ? 'dev' : '';
const urlPortion2 = ENVIRONMENT === 'dev' ? '-dev' : '';

// App prefix for Modal app name in dev environment
const appPrefix = ENVIRONMENT === 'dev' ? `${DEV_NAME}-${ENVIRONMENT}` : ENVIRONMENT;

// Server API URL (handles upload, status, videos, delete)
export const SERVER_BASE_URL = `https://clipabit01--${appPrefix}-server-${urlPortion}server-asgi-app${urlPortion2}.modal.run`;

// Search API URL (in dev it's server-searchservice, else it's search-searchservice)
const searchPrefix = ENVIRONMENT === 'dev' ? 'server' : 'search';
export const SEARCH_BASE_URL = `https://clipabit01--${appPrefix}-${searchPrefix}-searchservice-asgi-app${urlPortion2}.modal.run`;

// API Endpoints
export const API_ENDPOINTS = {
  // Server endpoints
  UPLOAD: `${SERVER_BASE_URL}/upload`,
  STATUS: `${SERVER_BASE_URL}/status`,
  LIST_VIDEOS: `${SERVER_BASE_URL}/videos`,
  DELETE_VIDEO: (hashedIdentifier: string) => `${SERVER_BASE_URL}/videos/${hashedIdentifier}`,
  
  // Search endpoints
  SEARCH: `${SEARCH_BASE_URL}/demo-search`,
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
