'use client';

import Image from 'next/image'
import Link from 'next/link';
import { useLoading } from '../../lib/loading-context';
import { FluidMenu } from '../ui/FluidMenu';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type Props = {}

function Header({ }: Props) {
    const { isLoading, setIsLoading } = useLoading();
    
    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    };
    
    return (
        <header className={`flex items-center justify-between px-8 md:px-16 py-6 bg-[var(--background)] min-h-[60px]`}>
            <div className='flex items-center' >
                <Link 
                    href="/" 
                    className={`flex items-center mr-4 text-black dark:text-white`}
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
                        {/* Render both logos and switch via CSS to avoid hydration mismatch */}
                        <Image
                            src="/logo-2.svg"
                            alt="Logo light"
                            width={280}
                            height={48}
                            className="block dark:hidden"
                            style={{ 
                                height: '48px', 
                                width: '100%',
                                objectFit: 'contain',
                                objectPosition: 'left center'
                            }}
                        />
                        <Image
                            src="/logo.svg"
                            alt="Logo dark"
                            width={280}
                            height={48}
                            className="hidden dark:block"
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
            <div className='flex items-center'>
                {/* Hide fluid menu during loading screen to prevent overlap and interactions */}
                {!isLoading && <FluidMenu />}
            </div>
        </header >
    );
};

export default Header