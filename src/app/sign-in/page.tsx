'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    AuthError
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import { useTheme } from '@/src/lib/theme';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export default function SignIn() {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { theme } = useTheme();

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setMessage('');
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        resetForm();
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err) {
            const authError = err as AuthError;
            setError(authError.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            const authError = err as AuthError;
            setError(getErrorMessage(authError.code));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            const authError = err as AuthError;
            setError(getErrorMessage(authError.code));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            const authError = err as AuthError;
            setError(getErrorMessage(authError.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-credential':
                return 'Invalid email or password';
            default:
                return 'An error occurred. Please try again.';
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-foreground/5 rounded-2xl shadow-2xl border border-foreground/10 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <svg
                                    className="w-7 h-7 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {mode === 'signin' && 'Welcome back'}
                            {mode === 'signup' && 'Create your account'}
                            {mode === 'forgot-password' && 'Reset your password'}
                        </h2>
                        <p className="text-foreground/60 mt-2 text-sm">
                            {mode === 'signin' && 'Sign in to continue to Clipabit'}
                            {mode === 'signup' && 'Get started with Clipabit'}
                            {mode === 'forgot-password' && "We'll send you a reset link"}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="px-8 pb-8">
                        {/* Google Sign In Button */}
                        {mode !== 'forgot-password' && (
                            <>
                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'dark'
                                        ? 'bg-white hover:bg-gray-100 text-gray-800'
                                        : 'bg-foreground/10 hover:bg-foreground/20 text-foreground border border-foreground/20'
                                        }`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continue with Google
                                </button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-foreground/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-foreground/5 text-foreground/50">or continue with email</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {message && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-400 text-sm text-center">{message}</p>
                            </div>
                        )}

                        {/* Sign In Form */}
                        {mode === 'signin' && (
                            <form onSubmit={handleEmailSignIn} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('forgot-password')}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </form>
                        )}

                        {/* Sign Up Form */}
                        {mode === 'signup' && (
                            <form onSubmit={handleEmailSignUp} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating account...' : 'Create account'}
                                </button>
                            </form>
                        )}

                        {/* Forgot Password Form */}
                        {mode === 'forgot-password' && (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send reset link'}
                                </button>
                            </form>
                        )}

                        {/* Footer Links */}
                        <div className="mt-6 text-center">
                            {mode === 'signin' && (
                                <p className="text-foreground/60 text-sm">
                                    Don&apos;t have an account?{' '}
                                    <button
                                        onClick={() => handleModeChange('signup')}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            )}
                            {mode === 'signup' && (
                                <p className="text-foreground/60 text-sm">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => handleModeChange('signin')}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}
                            {mode === 'forgot-password' && (
                                <p className="text-foreground/60 text-sm">
                                    Remember your password?{' '}
                                    <button
                                        onClick={() => handleModeChange('signin')}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}
                        </div>

                        {/* Back to Home */}
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
                            >
                                Back to home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
