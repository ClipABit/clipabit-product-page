'use client';

import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../lib/theme';
import { useLoading } from '../../lib/loading-context';
import { LuSun, LuMoon } from 'react-icons/lu';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { useAuthState } from '@/src/lib/hooks/firebase';
import { auth } from '@/src/lib/firebase';
import { FluidMenu } from '../ui/FluidMenu';

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

type Props = Record<string, never>

function Header({ }: Props) {
    const { theme, setTheme } = useTheme();
    const { isLoading, setIsLoading } = useLoading();
    const user = useAuthState(auth);
    const pathname = usePathname();

    const handleLogoClick = (e: React.MouseEvent) => {
        // If already on home page, scroll to top
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Otherwise, let the Link navigate to home page
            setIsLoading(true);
        }
    };

    const handleThemeChange = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    return (
        <header className={`flex items-center justify-between px-4 sm:px-6 md:px-16 py-6 bg-background min-h-[60px]`}>
            <div className='flex items-center' >
                <Link
                    href="/"
                    className={`flex items-center mr-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onClick={handleLogoClick}
                >
                    <div
                        className="logo-intro cursor-pointer"
                        style={{
                            height: '48px',
                            width: 'clamp(176px, 22vw, 280px)',
                            maxWidth: '280px',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <Image
                            src={theme === 'dark' ? '/logo.svg' : '/logo-2.svg'}
                            alt="Logo"
                            width={280}
                            height={48}
                            style={{
                                height: '48px',
                                width: '100%',
                                objectFit: 'contain',
                                objectPosition: 'left center'
                            }}
                        />
                    </div>
                </Link>
            </div>
            {/* Mobile Navigation - FluidMenu */}
            <div className={cn("md:hidden transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100")}>
                <FluidMenu user={user} />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center justify-end gap-2'>
                <Link href="https://clipabit.streamlit.app" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Demo"
                        className="text-md md:text-xl"
                        // Blue overlay for demo
                        overlayClassName="bg-[#5AB9F3]"
                    />
                </Link>
                <Link href="https://gofund.me/e67494308" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Support Us!"
                        className="text-md md:text-xl"
                        // Purple overlay for about us
                        overlayClassName="bg-[#B37FEB]"
                    />
                </Link>
                {user ? (
                    <Link href="/dashboard" className="whitespace-nowrap">
                        <InteractiveHoverButton
                            asChild
                            text="Dashboard"
                            className="text-md md:text-xl"
                            // Orange overlay for waitlist
                            overlayClassName="bg-[#FAAF04]"
                        />
                    </Link>
                ) : (
                    <Link href="/sign-in" className="whitespace-nowrap">
                        <InteractiveHoverButton
                            asChild
                            text="Sign In"
                            className="text-md md:text-xl"
                            // Orange overlay for waitlist
                            overlayClassName="bg-[#FAAF04]"
                        />
                    </Link>
                )}
                <div className="flex items-center ml-2 md:ml-4">
                    <button
                        onClick={handleThemeChange}
                        className={cn(
                            'group relative w-12 h-12 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-background p-2 text-center font-semibold text-foreground',
                            'transition-colors duration-300',
                            'flex items-center justify-center hover:bg-[#FAAF04]'
                        )}
                        aria-label="Toggle light mode"
                    >
                        {
                            theme === 'light' ? (
                                <span className="relative z-1 inline-flex items-center justify-center">
                                    <LuSun className="h-5 w-5" />
                                </span>
                            ) : (<span className="relative z-1 inline-flex items-center justify-center">
                                <LuMoon className="h-5 w-5" />
                            </span>)
                        }
                    </button>
                </div>
            </div>
        </header >
    );
};

export default Header