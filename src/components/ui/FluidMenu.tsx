"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import { LuSun, LuMoon } from "react-icons/lu"
import { motion, AnimatePresence, type Variants } from "motion/react"
import { useTheme } from '../../lib/theme'
import Link from 'next/link'
import { User } from 'firebase/auth'

// Custom hook to safely check if component is mounted (client-side)
const emptySubscribe = () => () => { }
const useIsMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false)

interface FluidMenuProps {
  user: User | null | undefined
}

export function FluidMenu({ user }: FluidMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useIsMounted()
  const { theme, setTheme } = useTheme()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const menuItems = [
    {
      key: 'demo',
      label: 'Demo',
      href: '/demo',
      color: '#5AB9F3',
    },
    {
      key: 'support',
      label: 'Support Us!',
      href: 'https://gofund.me/e67494308',
      color: '#B37FEB',
    },
    {
      key: 'auth',
      label: user ? 'Dashboard' : 'Sign In',
      href: user ? '/dashboard' : '/sign-in',
      color: '#FAAF04',
    },
  ]

  // Animation variants
  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      }
    }
  }

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      }
    },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: "easeOut",
      }
    })
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={handleToggle}
        className="relative z-50 w-12 h-12 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-[#FAAF04] transition-colors duration-300"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-5 h-4 relative flex flex-col justify-between">
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full origin-center"
            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full"
            animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full origin-center"
            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </button>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={handleClose}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-8">
              {/* Menu Items */}
              <nav className="flex flex-col items-center gap-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      className="block text-2xl font-medium text-foreground/80 hover:text-foreground transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Subtle separator */}
                <motion.div
                  custom={menuItems.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="w-12 h-px bg-foreground/10"
                />

                {/* Theme Toggle */}
                <motion.div
                  custom={menuItems.length + 1}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <button
                    onClick={handleThemeToggle}
                    className="flex items-center gap-2 text-lg text-foreground/60 hover:text-foreground transition-colors duration-200"
                    aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {mounted ? (
                      theme === 'dark' ? (
                        <>
                          <LuSun className="h-5 w-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <LuMoon className="h-5 w-5" />
                          <span>Dark Mode</span>
                        </>
                      )
                    ) : (
                      <>
                        <LuMoon className="h-5 w-5" />
                        <span>Theme</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
