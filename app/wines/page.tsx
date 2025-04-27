"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { WinesNav } from "@/components/wines-nav"
import { WineDetail } from "@/components/wine-detail"
import { WinesDetailNav } from "@/components/wines-detail-nav"
import { WinesHeader } from "@/components/wines-header"
import { wineData } from "@/data/wine-data"

// Sample release seasons to demonstrate functionality
// In a real implementation, this would come from your wine data
const sampleReleaseSeasons: Record<string, "Spring" | "Summer" | "Fall"> = {
  "russian-river-valley-pinot": "Spring",
  "sonoma-coast-pinot": "Summer",
  "santa-lucia-highlands-pinot": "Fall",
  "ritchie-vineyard": "Spring",
  "graham-family": "Summer",
  "earl-stephens": "Fall",
  "terra-de-promissio": "Spring",
  soberanes: "Summer",
  "four-amours": "Fall",
}

export default function Wines() {
  const [showDetailNav, setShowDetailNav] = useState(false)
  const introSectionRef = useRef<HTMLDivElement>(null)

  // Format the wine data for the WinesDetailNav component
  const formattedCategories = wineData.categories.map((category) => ({
    id: category.name.toLowerCase().replace(/\s+/g, "-"),
    name: category.name,
    wines: category.wines.map((wine) => ({
      id: wine.id,
      name: wine.name,
    })),
  }))

  // Add scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      // Use consistent logic with WinesHeader
      const introSection = document.querySelector("section:first-of-type")
      if (introSection) {
        const { bottom } = introSection.getBoundingClientRect()
        const headerHeight = Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
          10,
        )
        setShowDetailNav(bottom < headerHeight + 5)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <WinesHeader />
      <main className="min-h-screen pt-28 pb-20">
        {/* Scrolling Navigation - positioned properly */}
        <WinesDetailNav categories={formattedCategories} isVisible={showDetailNav} />

        {/* Full-width section with WinesNav */}
        <section ref={introSectionRef} className="w-full mb-32">
          <motion.div
            className="w-full bg-black border-y border-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-6 py-12 md:py-16">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">Our Wines</h1>
                <div className="space-y-6 text-lg leading-relaxed mb-12">
                  <p className="text-center text-zinc-200">
                    Each wine in our collection tells its own story, reflecting the unique characteristics of our
                    vineyards and our commitment to excellence in winemaking.
                  </p>
                </div>

                {/* WinesNav component moved here and adjusted for full width */}
                <div className="max-w-7xl mx-auto">
                  <WinesNav />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mx-auto max-w-[95%] sm:max-w-[90%] space-y-32">
          {/* All Wine Cards */}
          <section className="space-y-32">
            {wineData.categories.map((category) =>
              category.wines.map((wine) => (
                <motion.div
                  key={wine.id}
                  id={wine.id}
                  style={{ scrollMarginTop: "var(--scroll-margin, 112px)" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <WineDetail
                    {...wine}
                    series={category.name}
                    isActive={true}
                    releaseSeason={sampleReleaseSeasons[wine.id]}
                  />
                </motion.div>
              )),
            )}
          </section>
        </div>
      </main>
    </>
  )
}

