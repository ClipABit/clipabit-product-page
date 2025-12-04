'use client';

import { useState } from 'react'

import Image from 'next/image'

type Props = {}

const testing_border_style = {
    // border: '1px solid red'
};

function Header({ }: Props) {
    const [isBrightMode, setIsBrightMode] = useState(true);

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-black" style={testing_border_style}>
            <div className='flex row items-center' style={testing_border_style}>
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={292}
                    height={135}
                    style={testing_border_style}
                />
            </div>
            <div className='row-gap-8 flex space-x-8 mr-8 justify-end' style={testing_border_style}>
                <h3 className="text-xl font-semibold text-black dark:text-white">About</h3>
                <h3 className="text-xl font-semibold text-black dark:text-white">Demo</h3>
                <Image
                    src={isBrightMode ? "/bright_mode.svg" : "/dark_mode.svg"}
                    alt="GitHub Icon"
                    width={32}
                    height={32}
                    style={testing_border_style}
                    onClick={() => setIsBrightMode(!isBrightMode)}
                />
            </div>
        </header>
    )
}

export default Header