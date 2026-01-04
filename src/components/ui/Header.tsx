'use client';

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link';

type Props = {}

function Header({ }: Props) {
    const [isBrightMode, setIsBrightMode] = useState(true);

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-black pb-0">
            <div className='flex row items-center' >
                <Link href="/" className="text-2xl font-bold text-black dark:text-white mr-4">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={250}
                        height={100}
                        className="w-40 md:w-[250px] h-auto"
                    />
                </Link>
            </div>
            <div className='row-gap-8 flex space-x-8 mr-2 md:mr-8 justify-end'>
                {/* <Link href="/" className="font-semibold text-black dark:text-white">
                    <h3 className="text-lg font-semibold text-black dark:text-white">About</h3>
                </Link> */}
                <Link href="https://clipabit.streamlit.app" className="text-xl font-semibold text-black dark:text-white">
                    <h3 className="text-xl font-semibold text-black dark:text-white">Try the Demo</h3>
                </Link> 
                {/* <Image
                    src={isBrightMode ? "/bright_mode.svg" : "/dark_mode.svg"}
                    alt="GitHub Icon"
                    width={27}
                    height={27}
                    onClick={() => setIsBrightMode(!isBrightMode)}
                /> */}
            </div>
        </header >
    )
}

export default Header