"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

// Add TypeScript declaration for the window property
declare global {
  interface Window {
    reinitializeIsolatedContainer?: () => void;
  }
}

const navigationItems = [
  { href: "/acquire/?view=categorieslist&slug=wines", label: "Acquire" },
  { href: "/story/", label: "Story" },
  { href: "/wines/", label: "Wines" },
  { href: "/vineyards/", label: "Vineyards" },
  { href: "/visit/", label: "Visit" },
] as const

// Rest of the component remains unchanged
const SiteHeader = ({
  showTimelineNav = false,
  showWinesNav = false,
}: {
  showTimelineNav?: boolean
  showWinesNav?: boolean
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Expose header height through a data attribute for dynamic navs to reference
  useEffect(() => {
    if (headerRef.current) {
      const updateHeight = () => {
        const height = headerRef.current?.offsetHeight || 0
        document.documentElement.style.setProperty("--header-height", `${height}px`)
      }

      updateHeight()
      window.addEventListener("resize", updateHeight)
      return () => window.removeEventListener("resize", updateHeight)
    }
  }, [])

  useEffect(() => {
    // Only animate once when the component mounts
    if (!hasAnimated) {
      setHasAnimated(true)
    }
  }, [hasAnimated])

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      y: 10,
      transition: {
        delay: custom * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  // Check if either timeline or wines nav is showing
  const showDynamicNav = showTimelineNav || showWinesNav

  // Add this function inside the SiteHeader component, before the return statement
  const handleNavClick = (href: string) => () => {
    // Close the mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }

    // Add a class to disable smooth scrolling temporarily
    document.documentElement.classList.add("navigation-scroll")

    // Force window reload for Acquire link
    if (href.includes('/acquire/')) {
      // Start navigation
      setTimeout(() => {
        if (window.reinitializeIsolatedContainer && typeof window.reinitializeIsolatedContainer === 'function') {
          window.reinitializeIsolatedContainer()
        }
        // Force reload after a short delay
        window.location.href = href;
        return;
      }, 50)
    }

    // Remove the class after navigation is complete
    setTimeout(() => {
      document.documentElement.classList.remove("navigation-scroll")
    }, 100)
  }

  // Special handler for Join Us and List Members links
  const handleSpecialNavClick = (href: string) => () => {
    // Add a class to disable smooth scrolling temporarily
    document.documentElement.classList.add("navigation-scroll")

    // Force window reload
    setTimeout(() => {
      if (window.reinitializeIsolatedContainer && typeof window.reinitializeIsolatedContainer === 'function') {
        window.reinitializeIsolatedContainer()
      }
      
      // Force reload
      window.location.href = href;
      return;
    }, 50)

    // Remove the class after navigation is complete
    setTimeout(() => {
      document.documentElement.classList.remove("navigation-scroll")
    }, 100)
  }

  return (
    <header
      ref={headerRef}
      className="fixed top-4 left-0 right-0 z-50"
      data-show-dynamic-nav={showDynamicNav ? "true" : "false"}
    >
      <div className="mx-auto max-w-[95%] sm:max-w-[90%]">
        <div
          className={cn(
            "rounded-t-[40px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg",
            // Always keep rounded bottom corners when menu is open, regardless of dynamic nav
            isMenuOpen ? "rounded-b-[40px]" : "",
            // Only remove bottom rounded corners when dynamic nav is visible AND menu is closed
            showDynamicNav && !isMenuOpen ? "rounded-b-none border-b-0 shadow-none" : "rounded-b-[40px]",
          )}
        >
          <div className="px-6 w-full">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="group flex items-center"
              >
                <div className="relative w-[195px] h-[36px]">
                  <div className="absolute inset-0 duration-200 ease-out">
                    <Logo
                      variant="white"
                      className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <Logo
                      variant="red"
                      className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-zinc-100 hover:text-[#ea182c] hover:scale-110 active:scale-95 transition-all duration-200"
                    onClick={handleNavClick(item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Desktop Buttons and Mobile Menu */}
              <div className="flex items-center">
                <div className="hidden lg:flex items-center space-x-4 mr-2">
                  <Link
                    href="/acquire/?view=signup"
                    className="inline-flex h-8 items-center justify-center rounded-full border border-zinc-200 bg-transparent px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 hover:scale-110 active:scale-95 transition-all duration-200"
                    onClick={handleSpecialNavClick("/acquire/?view=signup")}
                  >
                    Join Us
                  </Link>
                  <Link
                    href="/acquire//?view=account"
                    className="inline-flex h-8 items-center justify-center rounded-full bg-[#ea182c] px-4 py-2 text-sm text-white hover:bg-[#ea182c]/90 hover:scale-110 active:scale-95 transition-all duration-200"
                    onClick={handleSpecialNavClick("/acquire//?view=account")}
                  >
                    List Members
                  </Link>
                  <Link
                    href="/acquire/?view=cart"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-100 hover:text-[#ea182c] hover:scale-110 active:scale-95 transition-all duration-200"
                    onClick={handleSpecialNavClick("/acquire/?view=cart")}
                    aria-label="Shopping Cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </div>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "lg:hidden flex items-center justify-center w-12 h-12 rounded-full text-zinc-100 hover:text-[#ea182c] transition-colors",
                    !hasAnimated && "animate-bounce-in opacity-0",
                  )}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu with Animation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="lg:hidden overflow-hidden"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ul className="flex flex-col items-center space-y-5 pt-6 pb-6">
                    {navigationItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link
                          href={item.href}
                          className="block text-lg text-zinc-100 hover:text-[#ea182c] transition-colors tracking-wide"
                          onClick={() => {
                            setIsMenuOpen(false)
                            // For Acquire link in mobile menu, force reload
                            if (item.href.includes('/acquire/')) {
                              setTimeout(() => {
                                window.location.href = item.href;
                                return;
                              }, 50);
                            } else {
                              handleNavClick(item.href)();
                            }
                          }}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}

                    <motion.li
                      className="flex flex-col items-center space-y-3 pt-3"
                      custom={navigationItems.length}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        href="/acquire/?view=signup"
                        className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 bg-transparent px-5 py-2 text-base text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() => {
                          setIsMenuOpen(false)
                          // Use the existing reload logic
                          handleSpecialNavClick("/acquire/?view=signup")();
                        }}
                      >
                        Join Us
                      </Link>
                      <Link
                        href="/acquire//?view=account"
                        className="inline-flex h-9 items-center justify-center rounded-full bg-[#ea182c] px-5 py-2 text-base text-white hover:bg-[#ea182c]/90 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setTimeout(() => {
                            window.location.href = "/acquire//?view=account";
                          }, 50);
                        }}
                      >
                        List Members
                      </Link>
                      <Link
                        href="/acquire/?view=cart"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-100 hover:text-[#ea182c] hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setTimeout(() => {
                            window.location.href = "/acquire/?view=cart";
                          }, 50);
                        }}
                        aria-label="Shopping Cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Link>
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader

