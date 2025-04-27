"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface WineSection {
  id: string
  name: string
  wines: {
    id: string
    name: string
  }[]
}

interface WinesDetailNavProps {
  categories: WineSection[]
  isVisible: boolean
}

export function WinesDetailNav({ categories, isVisible }: WinesDetailNavProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")
  const [activeWine, setActiveWine] = useState(categories[0]?.wines[0]?.id || "")
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Handle scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
        10,
      )
      const navHeight = navRef.current?.offsetHeight || 0
      const scrollPosition = window.scrollY + headerHeight + navHeight

      // Find the current wine in view
      for (const category of categories) {
        for (const wine of category.wines) {
          const element = document.getElementById(wine.id)
          if (element) {
            const { top, bottom } = element.getBoundingClientRect()
            if (top <= headerHeight + navHeight && bottom >= headerHeight + navHeight) {
              setActiveWine(wine.id)
              setActiveCategory(category.id)

              // Scroll the active item into view in the timeline
              const activeItem = document.querySelector(`[data-wine-id="${wine.id}"]`)
              if (activeItem && scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  left:
                    (activeItem as HTMLElement).offsetLeft -
                    scrollContainerRef.current.offsetWidth / 2 +
                    (activeItem as HTMLElement).offsetWidth / 2,
                  behavior: "smooth",
                })
              }

              break
            }
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  // Check if arrows should be shown based on scroll position
  useEffect(() => {
    const checkArrows = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkArrows)
      // Initial check
      checkArrows()
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkArrows)
      }
    }
  }, [])

  // Scroll to wine when clicking on timeline item
  const scrollToWine = (wineId: string) => {
    const element = document.getElementById(wineId)
    if (element) {
      const headerHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
        10,
      )
      const navHeight = navRef.current?.offsetHeight || 0
      const offset = headerHeight + navHeight

      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Handle arrow button clicks
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      })
    }
  }

  return (
    <motion.div
      ref={navRef}
      className="fixed left-0 right-0 z-30"
      style={{ top: "var(--header-height, 64px)" }} // Use CSS variable for precise positioning
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-[95%] sm:max-w-[90%] relative">
        <div className="rounded-b-[40px] border border-t-0 border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg">
          <div className="py-4 relative flex justify-center">
            {/* Left scroll arrow */}
            {showLeftArrow && (
              <button
                onClick={handleScrollLeft}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 rounded-full p-1 text-white hover:text-[#ea182c] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Right scroll arrow */}
            {showRightArrow && (
              <button
                onClick={handleScrollRight}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 rounded-full p-1 text-white hover:text-[#ea182c] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Left fade gradient overlay */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-opacity duration-300",
                "bg-gradient-to-r from-zinc-950/95 via-zinc-950/90 to-transparent",
                showLeftArrow ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Right fade gradient overlay */}
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-opacity duration-300",
                "bg-gradient-to-l from-zinc-950/95 via-zinc-950/90 to-transparent",
                showRightArrow ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Wine navigation scroll container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide whitespace-nowrap px-8 scroll-smooth max-w-full relative"
            >
              {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  {index > 0 && (
                    <div className="inline-block h-12 w-px bg-[#ea182c] mx-4 self-center" aria-hidden="true" />
                  )}
                  <div className="inline-block mx-2 first:ml-0 last:mr-0">
                    <div className="flex flex-col items-center mb-2">
                      <span
                        className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${
                          activeCategory === category.id ? "text-[#ea182c]" : "text-zinc-400 hover:text-white"
                        }`}
                        onClick={() => {
                          setActiveCategory(category.id)
                          if (category.wines.length > 0) {
                            scrollToWine(category.wines[0].id)
                          }
                        }}
                      >
                        {category.name}
                      </span>
                    </div>
                    <div className={`flex gap-3 ${category.wines.length === 1 ? "justify-center w-full" : ""}`}>
                      {category.wines.map((wine) => (
                        <button
                          key={wine.id}
                          data-wine-id={wine.id}
                          onClick={() => {
                            setActiveWine(wine.id)
                            scrollToWine(wine.id)
                          }}
                          className="relative"
                        >
                          <span
                            className={`text-xs transition-colors duration-300 ${
                              activeWine === wine.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {wine.name}
                          </span>

                          {/* Active indicator line */}
                          {activeWine === wine.id && (
                            <motion.div
                              layoutId="activeWineSection"
                              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#ea182c]"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

