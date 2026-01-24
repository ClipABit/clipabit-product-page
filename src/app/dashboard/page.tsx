'use client';

import { useState } from 'react';
import { auth } from '@/src/lib/firebase';
import { useAuthState } from '@/src/lib/hooks/firebase';
import { signOut } from 'firebase/auth';
import SignInModal from '@/src/components/auth/SignInModal';

export default function Dashboard() {
    const user = useAuthState(auth);
    const [showModal, setShowModal] = useState(true);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Show sign in modal if not authenticated
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to Clipabit</h1>
                    <p className="text-foreground/60 mb-6">Please sign in to access your dashboard</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                    >
                        Sign In
                    </button>
                </div>
                <SignInModal isOpen={showModal} onClose={() => setShowModal(false)} />
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
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Welcome back!</h2>
                    <p className="text-foreground/60">
                        You&apos;re signed in as <span className="text-foreground">{user.email}</span>
                    </p>
                </div>
            </main>
        </div>
    );
}