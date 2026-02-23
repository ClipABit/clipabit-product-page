'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        ...(audience && { audience }),
      }}
    >
      {children}
    </Auth0Provider>
  );
}
