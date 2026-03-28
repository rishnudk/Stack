"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { Home, User, Calendar, CreditCard, Menu, X, Sun, Moon, Github } from "lucide-react"
import { cn } from "@/lib/utils"
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

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

const Navbar = ({ className, ...props }: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);
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
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="currentColor" strokeOpacity={0.2} strokeWidth={0.5} className="text-foreground" />
              </svg>
            </div>
            {/* Content Layer */}
            <div className="relative w-full h-full flex items-center justify-between pb-0 px-4 md:px-8">



              {/* Desktop Logo */}
              <div className="hidden md:flex shrink-0 items-center justify-start h-full">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold tracking-tight text-foreground leading-none mb-0.5">stack</span>
                </Link>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Getting Started</Link>
                </Button>
                <Link
                  href="https://github.com/rishnudk/Stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
              </div>

              {/* Mobile Menu Button (Left) */}
              <button
                className="md:hidden mb-1 p-1 text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo (Center) - Mobile */}
              <div className="md:hidden flex-1 flex justify-center shrink-0 mx-2 md:mx-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold tracking-tight text-foreground leading-none">stack</span>
                </Link>
              </div>

              {/* Mobile Right Actions */}
              <div className="md:hidden flex items-center gap-3 mb-1">
                <Link
                  href="https://github.com/rishnudk/Stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
              </div>
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
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, y: -10, x: "-50%", scale: 0.95 }}
              animate={{ opacity: 1, y: 12, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: -10, x: "-50%", scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-16 z-1002 w-[90%] max-w-xs bg-white/70 dark:bg-black/70 backdrop-blur-lg border border-white/20 dark:border-white/10 p-6 md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl"
            >
              <nav className="flex flex-col gap-5 items-center">
                <NavLink href="/" icon={Home} label="Home" />
                <NavLink href="/signin" icon={User} label="Login" />
                <NavLink href="/signup" icon={CreditCard} label="Get Started" />
                <a
                  href="https://github.com/rishnudk/Stack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors py-2"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-medium text-sm">GitHub</span>
                </a>
              </nav>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>

    </>
  )
}

export default Navbar
