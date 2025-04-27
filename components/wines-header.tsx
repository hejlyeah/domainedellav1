"use client"
import { useEffect, useState } from "react"
import SiteHeader from "@/components/site-header"

export function WinesHeader() {
  const [showWinesNav, setShowWinesNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check for the intro section
      const introSection = document.querySelector("section:first-of-type")
      if (introSection) {
        // Get the exact position where the intro section ends
        const { bottom } = introSection.getBoundingClientRect()
        // Get the header height
        const headerHeight = Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
          10,
        )

        // Show wines nav when we've scrolled past the intro section
        // Add a small buffer (5px) to ensure smooth transition
        setShowWinesNav(bottom < headerHeight + 5)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <SiteHeader showWinesNav={showWinesNav} />
}

