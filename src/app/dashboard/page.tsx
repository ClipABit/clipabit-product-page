'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/src/lib/firebase';
import { useAuthState } from '@/src/lib/hooks/firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
    const user = useAuthState(auth);
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Wait for component to mount
    useEffect(() => {
        setMounted(true);
    }, []);

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
        try {
            await signOut(auth);
            // Redirect to homepage after signing out
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
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
                <div className="text-center p-6">
                    <p className="text-foreground">
                    Keep an eye out... ClipABit is launching really soon! 👀
                    </p>
                </div>
            </main>
        </div>
    );
}