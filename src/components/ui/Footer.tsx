'use client'
import React from 'react'
import { useTheme } from '../../lib/theme'

type Props = {}

function Footer({ }: Props) {
    return (
        <footer className={`flex items-center justify-center p-4 bg-[var(--background)]`}>
            <div className="flex items-center gap-2">
                <p className={`text-sm text-black dark:text-white`}>© 2026 Clipabit. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer