import React from 'react'

type Props = {}

function Footer({ }: Props) {
    return (
        <footer className="flex items-center justify-center p-4 bg-white dark:bg-black">
            <p className="text-sm text-black dark:text-white">© 2025 Clipabit. All rights reserved.</p>
        </footer>
    )
}

export default Footer