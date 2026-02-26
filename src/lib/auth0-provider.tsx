'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '';
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '';
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  if (typeof window !== 'undefined' && (!domain || !clientId)) {
    throw new Error('Missing required Auth0 environment variables: NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID must be set');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        ...(typeof window !== 'undefined' && { redirect_uri: window.location.origin }),
        ...(audience && { audience }),
      }}
    >
      {children}
    </Auth0Provider>
  );
}
