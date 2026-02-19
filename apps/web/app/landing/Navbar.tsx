"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
<<<<<<< Updated upstream
import { Home, User, Calendar, CreditCard, Menu, X, Sun, Moon } from "lucide-react"
=======
import { Home, User, Calendar, CreditCard, Menu, X, Sun, Moon, Github } from "lucide-react"
>>>>>>> Stashed changes
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useSound } from "@/hooks/use-sound"
<<<<<<< Updated upstream


=======
import SidebarLogo from "../feed/components/LeftSidebar/SidebarLogo"
>>>>>>> Stashed changes

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const playClick = useSound("/audio/ui-sounds/click.wav");

  const isDark = (theme === 'dark' || resolvedTheme === 'dark')

  const switchTheme = useCallback(() => {
    playClick();
    setTheme(isDark ? 'light' : 'dark');
  }, [setTheme, isDark, playClick])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={switchTheme}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <Link
    href={href}
    className="group flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
  >
    <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
    <span>{label}</span>
  </Link>
)

// Simple Theme Toggle for Mobile
const MobileThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  const isDark = (theme === 'dark' || resolvedTheme === 'dark')

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}


const Navbar = ({ className, ...props }: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLElement | null>(null);


  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-1001 h-16 flex px-0", className)} {...props} >

        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white dark:bg-black z-20 relative min-w-0">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">

          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white dark:bg-black" style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0 bg-white dark:bg-black">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
<<<<<<< Updated upstream
=======
                {/* To adjust these lines: 
                    - y1/y2: vertical position (current: 63.5 and 60.5)
                    - strokeOpacity: line visibility (current: 0.2)
                    - strokeWidth: line thickness (current: 0.5)
                */}
>>>>>>> Stashed changes
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              </svg>
            </div>
            {/* Content Layer */}
            <div className="relative w-full h-full flex items-end justify-between pb-2 px-4 md:px-8">



<<<<<<< Updated upstream
              {/* Desktop Logo - centered */}
              <div className="hidden md:flex shrink-0 items-center justify-center translate-x-2">
                {props.logo || (
                  <Link href="/" className="transition-opacity hover:opacity-80">
                    <img
                      src="/logo/bg-less.png"
                      alt="Logo"
                      className="h-8 w-auto dark:invert rotate-180"
                    />
                  </Link>
                )}
=======
              {/* Desktop Logo - Left Aligned */}
              <div className="hidden md:flex shrink-0 items-center translate-y-[-2px]">
                <SidebarLogo />
>>>>>>> Stashed changes
              </div>

              {/* Mobile Menu Button (Left) */}
              <button
                className="md:hidden mb-1 p-1 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

<<<<<<< Updated upstream
              {/* Logo (Center) - Mobile */}
              <div className="md:hidden flex-1 flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                {props.logo || (
                  <Link href="/" className="transition-opacity hover:opacity-80">
                    <img
                      src="/logo/bg-less.png"
                      alt="Logo"
                      className="h-8 w-auto dark:invert"
                    />
                  </Link>
                )}
              </div>



=======
              {/* Logo - Mobile */}
              <div className="md:hidden flex-1 flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                <SidebarLogo />
              </div>              {/* Desktop Right Actions */}
              <div className="hidden md:flex items-center gap-6 mb-1">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>

                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="px-4 py-1.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Getting Started
                </Link>

                <ThemeToggle />
              </div>

>>>>>>> Stashed changes
              {/* Mobile Right Actions */}
              <div className="md:hidden flex items-center gap-2 mb-1">
                <MobileThemeToggle />
              </div>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white dark:bg-black" style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white dark:bg-black z-20 relative min-w-0 -ml-px">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-neutral-50 dark:bg-neutral-900 border-b border-foreground/5 p-4 md:hidden shadow-lg"
          >

          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

export default Navbar