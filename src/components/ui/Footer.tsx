'use client'

function Footer() {
    return (
        <footer className={`flex items-center justify-center p-4 bg-[var(--background)]`}>
            <div className="flex items-center gap-2">
                <p className={`text-sm text-black dark:text-white`}>© 2025 Clipabit. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer