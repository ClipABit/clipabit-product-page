'use client';

import { useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const RELEASE_ASSET_BASE = 'https://github.com/ClipABit/clipabit-product-page/releases/latest/download';
const WINDOWS_INSTALLER_URL = `${RELEASE_ASSET_BASE}/ClipABit-Installer.exe`;
const MAC_INSTALLER_URL = `${RELEASE_ASSET_BASE}/ClipABit.pkg`;

export default function Dashboard() {
    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
    const redirectingRef = useRef(false);

    // Redirect to Auth0 login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated && !redirectingRef.current) {
            redirectingRef.current = true;
            loginWithRedirect();
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    // Sign out handler
    const handleSignOut = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    // Show loading state while checking auth
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-foreground">Loading...</div>
            </div>
        );
    }

    // Render dashboard for authenticated users
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-foreground/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold text-foreground hidden md:block">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-foreground/70 text-sm">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="justify-between px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Welcome back!</h2>
                    <p className="text-foreground/60">
                        You&apos;re signed in as <span className="text-foreground">{user?.email}</span>
                    </p>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Installers</h2>
                    <p className="text-foreground/60 mb-4">
                        Download the latest ClipABit installer for your operating system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={MAC_INSTALLER_URL}
                            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Download for macOS (.pkg)
                        </a>
                        <a
                            href={WINDOWS_INSTALLER_URL}
                            className="inline-flex items-center justify-center rounded-lg border border-foreground/20 text-foreground px-4 py-2 text-sm font-medium hover:bg-foreground/5 transition-colors"
                        >
                            Download for Windows (.exe)
                        </a>
                    </div>
                </div>
                <div className="text-center p-6">
                    <p className="text-foreground">
                        Keep an eye out... ClipABit is launching really soon! 👀
                    </p>
                </div>
            </main>
        </div>
    );
}
