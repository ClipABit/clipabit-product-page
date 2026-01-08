'use client';

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link';
import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from '../../lib/theme';

type Props = {}

function Header({ }: Props) {
    const { theme, setTheme } = useTheme();
    
    return (
        <header className={`flex items-center justify-between px-4 py-2 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <div className='flex items-center' >
                <Link href="/" className={`flex items-center mr-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    <Image
                        src={theme === 'dark' ? '/logo.svg' : '/logo-2.svg'}
                        alt="Logo"
                        width={250}
                        height={100}
                        className="w-28 md:w-[180px] h-auto mt-1"
                    />
                </Link>
            </div>
            <div className='flex items-center space-x-3 md:space-x-8 mr-2 md:mr-8 justify-end'>
                <Link 
                    href="https://clipabit.streamlit.app" 
                    className={`text-md md:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'} hover:text-gray-600 dark:hover:text-gray-300 active:scale-95 transition-all whitespace-nowrap`}
                >
                    Try the Demo
                </Link>
                <Link 
                    href="#waitlist" 
                    className={`px-2 py-1 md:px-4 md:py-2 text-md md:text-lg bg-[#FAAF04] ${theme === 'dark' ? 'text-white' : 'text-black'} rounded-lg font-semibold hover:bg-[#e6a800] active:bg-[#cc9600] active:scale-95 transition-all whitespace-nowrap`}
                >
                    Join Waitlist
                </Link>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-xl">
                <button onClick={() => {
                    setTheme('light');
                }}
                 className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-black dark:text-black">
                    <LuSun/>
                </button>
                <button onClick={() => {
                    setTheme('dark');
                }}
                className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-black dark:text-black">
                    <LuMoon/>
                </button>
            </div>
        </header >
    );
};

export default Header