'use client';

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link';

type Props = {}

function Header({ }: Props) {
    const [isBrightMode, setIsBrightMode] = useState(true);

    return (
        <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-black">
            <div className='flex items-center' >
                <Link href="/" className="flex items-center mr-4">
                    <Image
                        src="/logo.svg"
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
                    className="text-md md:text-xl font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 active:scale-95 transition-all whitespace-nowrap"
                >
                    Try the Demo
                </Link>
                <Link 
                    href="#waitlist" 
                    className="px-2 py-1 md:px-4 md:py-2 text-md md:text-lg bg-[#FAAF04] text-black rounded-lg font-semibold hover:bg-[#e6a800] active:bg-[#cc9600] active:scale-95 transition-all whitespace-nowrap"
                >
                    Join Waitlist
                </Link>
            </div>
        </header >
    )
}

export default Header