"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Define the wine regions with their data
interface WineRegion {
  id: string
  name: string
  description: string
  color: string
  path: string
  vineyards: string[]
  coordinates: {
    x: number
    y: number
  }
}

// Define the vineyard markers
interface VineyardMarker {
  id: string
  name: string
  region: string
  coordinates: {
    x: number
    y: number
  }
}

// Wine region data with SVG paths
const wineRegions: WineRegion[] = [
  {
    id: "russian-river-valley",
    name: "Russian River Valley",
    description:
      "Known for cool climate and fog influence, producing exceptional Pinot Noir and Chardonnay with bright acidity and complex flavors.",
    color: "#9c27b0", // Purple
    path: "M90,115 Q88,110 86,108 Q84,106 80,105 Q76,104 74,102 Q72,100 70,96 Q68,92 66,90 Q64,88 60,87 Q56,86 54,84 Q52,82 50,78 Q48,74 46,72 Q44,70 40,69 L38,75 Q40,77 42,79 Q44,81 46,85 Q48,89 50,91 Q52,93 56,94 Q60,95 62,97 Q64,99 66,103 Q68,107 70,109 Q72,111 76,112 Q80,113 82,115 Q84,117 86,121 Q88,125 90,127 Q92,129 96,130 L98,124 Q96,122 94,120 Q92,118 90,115",
    vineyards: ["Ritchie Vineyard", "Graham Family Vineyard", "Earl Stephens Vineyard"],
    coordinates: {
      x: 68,
      y: 100,
    },
  },
  {
    id: "sonoma-coast",
    name: "Sonoma Coast",
    description:
      "A cool coastal region with maritime influence, producing elegant Pinot Noir with vibrant acidity and distinctive minerality.",
    color: "#2196f3", // Blue
    path: "M30,80 L28,90 L26,100 L24,110 L22,120 L30,125 L38,130 L46,135 L54,140 L62,135 L70,130 L78,125 L86,120 L84,110 L82,100 L80,90 L78,80 L70,85 L62,90 L54,95 L46,90 L38,85 L30,80",
    vineyards: ["Terra de Promissio Vineyard"],
    coordinates: {
      x: 54,
      y: 110,
    },
  },
  {
    id: "santa-lucia-highlands",
    name: "Santa Lucia Highlands",
    description:
      "Elevated terraces with morning sun and afternoon maritime breezes, producing intense and structured Pinot Noir with excellent aging potential.",
    color: "#e91e63", // Pink
    path: "M100,280 L105,275 L110,270 L115,265 L120,260 L125,255 L130,250 L125,245 L120,240 L115,235 L110,230 L105,225 L100,220 L95,225 L90,230 L85,235 L80,240 L75,245 L70,250 L75,255 L80,260 L85,265 L90,270 L95,275 L100,280",
    vineyards: ["Soberanes Vineyard"],
    coordinates: {
      x: 100,
      y: 250,
    },
  },
]

// Vineyard marker data
const vineyardMarkers: VineyardMarker[] = [
  {
    id: "ritchie-vineyard",
    name: "Ritchie Vineyard",
    region: "russian-river-valley",
    coordinates: {
      x: 68,
      y: 95,
    },
  },
  {
    id: "graham-family",
    name: "Graham Family Vineyard",
    region: "russian-river-valley",
    coordinates: {
      x: 64,
      y: 102,
    },
  },
  {
    id: "earl-stephens",
    name: "Earl Stephens Vineyard",
    region: "russian-river-valley",
    coordinates: {
      x: 72,
      y: 98,
    },
  },
  {
    id: "terra-de-promissio",
    name: "Terra de Promissio Vineyard",
    region: "sonoma-coast",
    coordinates: {
      x: 54,
      y: 105,
    },
  },
  {
    id: "soberanes",
    name: "Soberanes Vineyard",
    region: "santa-lucia-highlands",
    coordinates: {
      x: 100,
      y: 245,
    },
  },
]

// California outline path (simplified)
const californiaOutlinePath =
  "M30,40 L25,80 L20,120 L15,160 L10,200 L15,240 L20,280 L25,320 L30,360 L60,370 L90,380 L120,390 L150,380 L180,370 L170,330 L160,290 L150,250 L140,210 L130,170 L120,130 L110,90 L100,50 L70,45 L30,40"

export function CaliforniaWineMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [activeVineyard, setActiveVineyard] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile for responsive adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Handle region hover/click
  const handleRegionInteraction = (regionId: string | null) => {
    setActiveRegion(regionId)
    // Reset vineyard when changing regions
    setActiveVineyard(null)
  }

  // Handle vineyard hover/click
  const handleVineyardInteraction = (vineyardId: string | null, event?: React.MouseEvent) => {
    setActiveVineyard(vineyardId)

    // Update tooltip position if we have an event
    if (event && vineyardId) {
      // Get the target element and its position
      const target = event.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()

      // Calculate position relative to the SVG
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
    }
  }

  // Find the active region object
  const activeRegionData = activeRegion ? wineRegions.find((region) => region.id === activeRegion) : null

  // Find the active vineyard object
  const activeVineyardData = activeVineyard ? vineyardMarkers.find((vineyard) => vineyard.id === activeVineyard) : null

  return (
    <div className="relative w-full">
      {/* Map Container */}
      <div className="relative w-full aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/9] mx-auto max-w-4xl">
        {/* SVG Map */}
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))" }}
        >
          {/* California Outline */}
          <path
            d={californiaOutlinePath}
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="1"
            className="transition-all duration-300"
          />

          {/* Wine Regions */}
          {wineRegions.map((region) => (
            <g key={region.id}>
              <path
                d={region.path}
                fill={activeRegion === region.id ? region.color : `${region.color}80`}
                stroke={activeRegion === region.id ? "#fff" : "#ccc"}
                strokeWidth={activeRegion === region.id ? "1.5" : "1"}
                className="transition-all duration-300 cursor-pointer hover:opacity-90"
                onMouseEnter={() => !isMobile && handleRegionInteraction(region.id)}
                onMouseLeave={() => !isMobile && handleRegionInteraction(null)}
                onClick={() => handleRegionInteraction(activeRegion === region.id ? null : region.id)}
              />

              {/* Region Labels */}
              <text
                x={region.coordinates.x}
                y={region.coordinates.y}
                textAnchor="middle"
                fill={activeRegion === region.id ? "#fff" : "#ccc"}
                fontSize="4"
                fontWeight={activeRegion === region.id ? "bold" : "normal"}
                className="pointer-events-none transition-all duration-300"
                style={{ textShadow: "0px 0px 2px rgba(0, 0, 0, 0.8)" }}
              >
                {region.name}
              </text>
            </g>
          ))}

          {/* Vineyard Markers */}
          {vineyardMarkers.map((vineyard) => {
            const isActive = activeVineyard === vineyard.id
            const isInActiveRegion = activeRegion === vineyard.region
            const shouldShow = !activeRegion || isInActiveRegion

            return (
              shouldShow && (
                <g
                  key={vineyard.id}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={(e) => !isMobile && handleVineyardInteraction(vineyard.id, e)}
                  onMouseLeave={() => !isMobile && handleVineyardInteraction(null)}
                  onClick={(e) => handleVineyardInteraction(activeVineyard === vineyard.id ? null : vineyard.id, e)}
                >
                  {/* Marker Circle */}
                  <circle
                    cx={vineyard.coordinates.x}
                    cy={vineyard.coordinates.y}
                    r={isActive ? 2 : 1.5}
                    fill={isActive ? "#ea182c" : "#fff"}
                    stroke={isActive ? "#fff" : "#ccc"}
                    strokeWidth="0.5"
                    className="transition-all duration-300"
                  />

                  {/* Pulse Animation for Active Marker */}
                  {isActive && (
                    <>
                      <circle
                        cx={vineyard.coordinates.x}
                        cy={vineyard.coordinates.y}
                        r="2"
                        fill="none"
                        stroke="#ea182c"
                        strokeWidth="0.5"
                        className="animate-ping opacity-75"
                      />
                      <circle
                        cx={vineyard.coordinates.x}
                        cy={vineyard.coordinates.y}
                        r="3"
                        fill="none"
                        stroke="#ea182c"
                        strokeWidth="0.25"
                        className="animate-ping opacity-50"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </>
                  )}
                </g>
              )
            )
          })}

          {/* Map Legend */}
          <g transform="translate(10, 370)">
            <rect x="0" y="0" width="60" height="25" fill="rgba(0,0,0,0.7)" rx="2" ry="2" />

            {wineRegions.map((region, index) => (
              <g key={region.id} transform={`translate(5, ${5 + index * 7})`}>
                <rect width="5" height="5" fill={region.color} />
                <text x="8" y="4" fontSize="3" fill="#fff">
                  {region.name}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Information Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeRegion && (
              <motion.div
                key={`region-${activeRegion}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 md:p-6 shadow-lg"
              >
                {activeRegionData && (
                  <>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">{activeRegionData.name}</h3>
                    <p className="text-zinc-300 text-sm md:text-base mb-4">{activeRegionData.description}</p>

                    {/* Vineyards in this region */}
                    <div>
                      <h4 className="text-[#ea182c] text-sm font-medium mb-2">Featured Vineyards:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeRegionData.vineyards.map((vineyard) => {
                          const vineyardData = vineyardMarkers.find((v) => v.name === vineyard)
                          return (
                            <li
                              key={vineyard}
                              className={cn(
                                "text-sm py-1 px-2 rounded cursor-pointer transition-colors",
                                activeVineyard === vineyardData?.id
                                  ? "bg-[#ea182c] text-white"
                                  : "text-zinc-200 hover:bg-zinc-800",
                              )}
                              onClick={() => vineyardData && handleVineyardInteraction(vineyardData.id)}
                            >
                              {vineyard}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {!activeRegion && activeVineyard && (
              <motion.div
                key={`vineyard-${activeVineyard}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 md:p-6 shadow-lg"
              >
                {activeVineyardData && (
                  <>
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">{activeVineyardData.name}</h3>
                    <p className="text-[#ea182c] text-sm">
                      {wineRegions.find((r) => r.id === activeVineyardData.region)?.name}
                    </p>
                    <div className="mt-4">
                      <a
                        href={`/vineyards#${activeVineyardData.id}`}
                        className="text-white hover:text-[#ea182c] transition-colors text-sm underline"
                      >
                        View vineyard details
                      </a>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden text-center mt-4 text-zinc-400 text-sm italic">
        Tap on regions or vineyard markers to explore
      </div>

      {/* Desktop Instructions */}
      <div className="hidden md:block text-center mt-4 text-zinc-400 text-sm italic">
        Hover over regions or vineyard markers to explore, click to lock selection
      </div>
    </div>
  )
}

