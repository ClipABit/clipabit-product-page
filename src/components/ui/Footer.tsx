'use client'
import React from 'react'
import { useTheme } from '../../lib/theme'

type Props = {}

function Footer({ }: Props) {
    const { theme } = useTheme();
    return (
        <footer className={`flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <div className="flex items-center gap-2">
                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>© 2025 Clipabit. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer