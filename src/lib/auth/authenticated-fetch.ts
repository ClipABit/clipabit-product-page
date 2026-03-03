/**
 * Authenticated fetch utility for protected API endpoints.
 *
 * Usage in a component:
 *   const { getAccessTokenSilently } = useAuth0();
 *   const authFetch = getAuthenticatedFetch(getAccessTokenSilently);
 *   const res = await authFetch('/api/protected-endpoint');
 */

type GetAccessTokenSilently = (options?: {
  authorizationParams?: { audience?: string; scope?: string };
}) => Promise<string>;

/**
 * Returns a fetch wrapper that adds an Authorization header with an Auth0 access token.
 * The returned function has the same signature as window.fetch.
 */
export function getAuthenticatedFetch(
  getAccessTokenSilently: GetAccessTokenSilently
) {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const token = await getAccessTokenSilently();

    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return fetch(input, {
      ...init,
      headers,
    });
  };
}
