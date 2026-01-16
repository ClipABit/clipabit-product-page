'use client';

import Image from 'next/image'
import Link from 'next/link';
import { useTheme } from '../../lib/theme';
import { useLoading } from '../../lib/loading-context';
import { LuSun, LuMoon } from 'react-icons/lu';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type Props = {}

function Header({ }: Props) {
    const { theme, setTheme } = useTheme();
    const { setIsLoading } = useLoading();
    
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    
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
            <div className='flex items-center justify-end gap-2 sm:gap-4 md:gap-8'>
                <Link href="https://clipabit.streamlit.app" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Demo"
                        className="text-md md:text-2xl"
                        // Blue overlay for demo
                        overlayClassName="bg-[#5AB9F3]"
                    />
                </Link>
                <Link href="#waitlist" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Waitlist"
                        className="text-md md:text-xl"
                        // Orange overlay for waitlist
                        overlayClassName="bg-[#FAAF04]"
                    />
                </Link>
                <div className="hidden md:flex items-center ml-2 md:ml-4">
                <button
                    onClick={() => setTheme('light')}
                    className={cn(
                        'group relative w-12 h-12 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-[var(--background)] p-2 text-center font-semibold text-[var(--foreground)]',
                        'transition-colors duration-300',
                        'flex items-center justify-center hover:bg-[#FAAF04]'
                    )}
                    aria-label="Toggle light mode"
                >
                    <span className="relative z-1 inline-flex items-center justify-center">
                        <LuSun className="h-5 w-5" />
                    </span>
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                        'group relative w-12 h-12 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-[var(--background)] p-2 text-center font-semibold text-[var(--foreground)]',
                        'transition-colors duration-300',
                        'flex items-center justify-center ml-2 hover:bg-[#FAAF04]'
                    )}
                    aria-label="Toggle dark mode"
                >
                    <span className="relative z-1 inline-flex items-center justify-center">
                        <LuMoon className="h-5 w-5" />
                    </span>
                </button>
                </div>
            </div>
        </header >
    );
};

export default Header