'use client';

import Image from 'next/image'
import Link from 'next/link';
import { useTheme } from '../../lib/theme';
import { FluidMenu } from './FluidMenu';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type Props = {}

function Header({ }: Props) {
    const { theme, setTheme } = useTheme();
    
    return (
        <header className={`flex items-center justify-between px-8 md:px-16 py-2 bg-[var(--background)] min-h-[60px]`}>
            <div className='flex items-center' >
                <Link href="/" className={`flex items-center mr-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    <div 
                        className="logo-intro"
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
            <div className='flex items-center'>
                <FluidMenu />
            </div>
        </header >
    );
};

export default Header