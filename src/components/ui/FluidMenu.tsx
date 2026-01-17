"use client"

import React, { useState, useEffect } from "react"
import { LuSun, LuMoon, LuMenu } from "react-icons/lu"
import { useTheme } from '../../lib/theme'
import { InteractiveHoverButton } from './InteractiveHoverButton'
import Link from 'next/link'

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function FluidMenu() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const menuItems = [
    {
      key: 'demo',
      content: (
        <Link href="https://clipabit.streamlit.app" className="whitespace-nowrap">
          <InteractiveHoverButton
            asChild
            text="Demo"
            className="text-md md:text-xl"
            overlayClassName="bg-[#5AB9F3]"
          />
        </Link>
      ),
      width: 112, // w-28 = 7rem = 112px
    },
    {
      key: 'waitlist',
      content: (
        <Link href="#waitlist" className="whitespace-nowrap">
          <InteractiveHoverButton
            asChild
            text="Waitlist"
            className="text-md md:text-lg"
            overlayClassName="bg-[#FAAF04]"
          />
        </Link>
      ),
      width: 112, // w-28 = 7rem = 112px
    },
    {
      key: 'theme',
      content: (
        <button
          onClick={handleThemeToggle}
          className={cn(
            'group relative w-12 h-12 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-[var(--background)] p-2 text-center font-semibold text-[var(--foreground)]',
            'transition-colors duration-300',
            'flex items-center justify-center hover:bg-[#FAAF04]'
          )}
          aria-label={mounted && theme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'}
        >
          <span className="relative z-[1] inline-flex items-center justify-center">
            {mounted ? (
              theme === 'dark' ? <LuSun className="h-5 w-5" /> : <LuMoon className="h-5 w-5" />
            ) : (
              <LuMoon className="h-5 w-5" />
            )}
          </span>
        </button>
      ),
      width: 48, // w-12 = 3rem = 48px
    },
  ]

  // Calculate spacing between items
  const spacing = 16 // 1rem = 16px (space-x-4)

  return (
    <div className="relative flex items-center" data-expanded={isExpanded}>
      <div className="relative flex items-center">
        {/* Menu icon trigger */}
        <div
          className="relative w-16 h-16 cursor-pointer rounded-full group will-change-transform z-50 flex items-center justify-center ml-4 bg-gray-100 dark:bg-gray-800 hover:bg-[#FAAF04] transition-colors duration-300"
          onClick={handleToggle}
        >
          <LuMenu className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-black transition-colors duration-300" />
        </div>

        {/* Other items - expand to the left */}
        {menuItems.map((item, index) => {
          // Calculate cumulative width for positioning
          let offset = 0
          for (let i = 0; i < index; i++) {
            offset += menuItems[i].width + spacing
          }
          offset += 64 + spacing // Add trigger width (64px) and spacing

          return (
            <div
              key={item.key}
              className="absolute right-0 top-1/2 -translate-y-1/2 will-change-transform"
              style={{
                transform: `translateX(${isExpanded ? -offset : 0}px)`,
                opacity: isExpanded ? 1 : 0,
                zIndex: 40 - index,
                transition: `transform ${isExpanded ? '300ms' : '300ms'} cubic-bezier(0.4, 0, 0.2, 1),
                           opacity ${isExpanded ? '300ms' : '350ms'}`,
                backfaceVisibility: 'hidden',
                perspective: 1000,
                WebkitFontSmoothing: 'antialiased',
                pointerEvents: isExpanded ? 'auto' : 'none'
              }}
            >
              {item.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
