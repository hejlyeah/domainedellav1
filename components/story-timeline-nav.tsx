"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineSection {
  id: string
  title: string
  period: string
}

interface StoryTimelineNavProps {
  sections: TimelineSection[]
  isVisible: boolean
}

export function StoryTimelineNav({ sections, isVisible }: StoryTimelineNavProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "")
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
      const scrollPosition = window.scrollY + headerHeight + navHeight + 20 // Added extra offset for better detection

      // Find the current section in view
      let currentSectionId = ""
      let smallestDistance = Number.POSITIVE_INFINITY

      // Find the section closest to the top of the viewport
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { top } = element.getBoundingClientRect()
          const distance = Math.abs(top - (headerHeight + navHeight))

          // If this section is closer to the top of the viewport than the current closest
          if (distance < smallestDistance) {
            smallestDistance = distance
            currentSectionId = section.id
          }

          // If this section is fully visible and at the top, prioritize it
          if (top <= headerHeight + navHeight && top > -100) {
            currentSectionId = section.id
            break
          }
        }
      }

      // Only update if we found a section and it's different from the current active section
      if (currentSectionId && currentSectionId !== activeSection) {
        setActiveSection(currentSectionId)

        // Scroll the active item into view in the timeline
        const activeItem = document.querySelector(`[data-section-id="${currentSectionId}"]`)
        if (activeItem && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left:
              (activeItem as HTMLElement).offsetLeft -
              scrollContainerRef.current.offsetWidth / 2 +
              (activeItem as HTMLElement).offsetWidth / 2,
            behavior: "smooth",
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections, activeSection])

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
  }, [isVisible]) // Re-run when visibility changes

  // Scroll to section when clicking on timeline item
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
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

            {/* Left fade gradient overlay - increased width and adjusted gradient */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-opacity duration-300",
                "bg-gradient-to-r from-zinc-950/95 via-zinc-950/90 to-transparent",
                showLeftArrow ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Right fade gradient overlay - increased width and adjusted gradient */}
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-opacity duration-300",
                "bg-gradient-to-l from-zinc-950/95 via-zinc-950/90 to-transparent",
                showRightArrow ? "opacity-100" : "opacity-0",
              )}
            />

            {/* Timeline scroll container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide whitespace-nowrap px-8 scroll-smooth max-w-full relative"
            >
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="inline-block mx-3 first:ml-0 last:mr-0 text-center relative"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        activeSection === section.id ? "text-[#ea182c]" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {section.title}
                    </span>
                    <span
                      className={`text-xs transition-colors duration-300 ${
                        activeSection === section.id ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      {section.period}
                    </span>

                    {/* Active indicator line */}
                    {activeSection === section.id && (
                      <motion.div
                        layoutId="activeTimelineSection"
                        className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#ea182c]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

