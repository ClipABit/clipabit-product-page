'use client';

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link';
import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from '../../lib/theme';
import { InteractiveHoverButton } from './InteractiveHoverButton';

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
                    <Image
                        src={theme === 'dark' ? '/logo.svg' : '/logo-2.svg'}
                        alt="Logo"
                        width={250}
                        height={100}
                        className="w-20 md:w-[140px] h-auto logo-intro"
                        style={{ minHeight: '40px' }}
                    />
                </Link>
            </div>
            <div className='flex items-center space-x-4 md:space-x-6'>
                <Link href="https://clipabit.streamlit.app" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Demo"
                        className="text-md md:text-xl"
                        // Blue overlay for demo
                        overlayClassName="bg-[#5AB9F3]"
                    />
                </Link>
                <Link href="#waitlist" className="whitespace-nowrap">
                    <InteractiveHoverButton
                        asChild
                        text="Waitlist"
                        className="text-md md:text-lg"
                        // Orange overlay for waitlist
                        overlayClassName="bg-[#FAAF04]"
                    />
                </Link>
                <div className="flex items-center ml-2 md:ml-4">
                <button
                    onClick={() => setTheme('light')}
                    className={cn(
                        'group relative w-12 h-12 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-[var(--background)] p-2 text-center font-semibold text-[var(--foreground)]',
                        'transition-colors duration-300',
                        'flex items-center justify-center hover:bg-[#FAAF04]'
                    )}
                    aria-label="Toggle light mode"
                >
                    <span className="relative z-[1] inline-flex items-center justify-center">
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
                    <span className="relative z-[1] inline-flex items-center justify-center">
                        <LuMoon className="h-5 w-5" />
                    </span>
                </button>
                </div>
            </div>
        </header >
    );
};

export default Header