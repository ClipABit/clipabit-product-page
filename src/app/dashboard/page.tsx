'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/src/lib/firebase';
import { useAuthState } from '@/src/lib/hooks/firebase';
import { signOut } from 'firebase/auth';

// Custom hook to safely check if component is mounted (client-side)
const emptySubscribe = () => () => { };
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

// Modal web endpoint for DevServer.asgi_app 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
if(!API_BASE_URL){
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
}

export default function Dashboard() {
    const user = useAuthState(auth);
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const mounted = useIsMounted();
    
    // Device authorization state
    const [userCode, setUserCode] = useState('');
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Redirect to sign-in if not authenticated
    useEffect(() => {
        // Only check after component is mounted and give auth state time to stabilize
        if (!mounted) return;

        // Add a small delay to ensure auth state is stable after navigation
        const timer = setTimeout(() => {
            if (user === null && !isRedirecting) {
                setIsRedirecting(true);
                router.push('/sign-in');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user, router, isRedirecting, mounted]);

    // Sign out handler
    const handleSignOut = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            // Redirect to homepage after signing out
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Device authorization handler
    const handleAuthorize = async () => {
        if (!user || !userCode.trim()) return;
        
        setIsAuthorizing(true);
        setAuthStatus('idle');
        setErrorMessage('');
        
        try {
            const idToken = await user.getIdToken();
            const refreshToken = user.refreshToken || '';
            
            const response = await fetch(`${API_BASE_URL}/auth/device/authorize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_code: userCode.trim(),
                    firebase_id_token: idToken,
                    firebase_refresh_token: refreshToken
                }),
            });
            
            if (response.ok) {
                setAuthStatus('success');
                setUserCode('');
            } else {
                const data = await response.json().catch(() => ({}));
                setAuthStatus('error');
                setErrorMessage(data.detail || data.message || 'Authorization failed. Please check the code and try again.');
            }
        } catch (error) {
            console.error('Authorization error:', error);
            setAuthStatus('error');
            setErrorMessage('Failed to connect to server. Please try again.');
        } finally {
            setIsAuthorizing(false);
        }
    };

    // Show loading state while checking auth
    if (user === undefined || user === null) {
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-foreground/70 text-sm">{user.email}</span>
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
                        You&apos;re signed in as <span className="text-foreground">{user.email}</span>
                    </p>
                </div>

                {/* Device Authorization Section */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6">
                    {authStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Authentication complete</h3>
                            <p className="text-foreground/60">You can close this window.</p>
                            <button
                                onClick={() => setAuthStatus('idle')}
                                className="mt-6 px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                            >
                                Authorize another device
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Link Plugin</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="userCode" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Enter code from plugin:
                                    </label>
                                    <input
                                        id="userCode"
                                        type="text"
                                        value={userCode}
                                        onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. ABCD-1234"
                                        className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#FAAF04] focus:border-transparent font-mono text-lg tracking-wider"
                                        disabled={isAuthorizing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && userCode.trim()) {
                                                handleAuthorize();
                                            }
                                        }}
                                    />
                                </div>
                                
                                {authStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                )}
                                
                                <button
                                    onClick={handleAuthorize}
                                    disabled={!userCode.trim() || isAuthorizing}
                                    className="w-full px-4 py-3 bg-[#FAAF04] text-black font-semibold rounded-lg hover:bg-[#e6a003] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAuthorizing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Authorizing...
                                        </>
                                    ) : (
                                        'Confirm'
                                    )}
                                </button>
                            </div>
                            <p className="mt-4 text-xs text-foreground/40">
                                Open ClipABit in DaVinci Resolve to get your authorization code.
                            </p>
                        </>
                    )}
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