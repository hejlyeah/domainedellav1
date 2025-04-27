"use client"
import Image from "next/image"

interface Wine {
  name: string
  image: string
  isNew?: boolean
}

interface WineSection {
  title: string
  wines: Wine[]
}

const wineSections: WineSection[] = [
  {
    title: "APPELLATION SERIES",
    wines: [
      {
        name: "RUSSIAN RIVER VALLEY",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02%20-%202023%20Domaine%20Della%20Russian%20River%20Valley%20Pinot%20Noir%20-%20Bottle%20Shot%20copy.png-QBWg9JGnQBe5aHu4TxQgZ8LL1251Bs.jpeg",
      },
      {
        name: "SONOMA COAST",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03%20-%202023%20Domaine%20Della%20Sonoma%20Coast%20Pinot%20Noir%20-%20Bottle%20Shot.png-yoaUO9b9nY4wzgv8phr5lNtvqU2QG4.jpeg",
      },
      {
        name: "SANTA LUCIA HIGHLANDS",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04%20-%202023%20Domaine%20Della%20Santa%20Lucia%20Highlands%20Pinot%20Noir%20-%20Bottle%20Shot.png-VTEFQNz1q5mPRbpiFekEA7kky4EsCg.jpeg",
      },
    ],
  },
  {
    title: "SINGLE VINEYARD SERIES",
    wines: [
      {
        name: "RITCHIE",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05%20-%202023%20Domaine%20Della%20%22Ritchie%20Vineyard%22%20RRV%20Chardonnay%20-%20Bottle%20Shot.png-EAfHt0wXm8j5kPUd6bfJKCbbjFv7Cq.jpeg",
      },
      {
        name: "GRAHAM FAMILY",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06%20-%202023%20Domaine%20Della%20%22Graham%20Family%20Vineyard%22%20RRV%20Pinot%20Noir%20-%20Bottle%20Shot.png-VK70M6dBjOOT0owCrIfmV1IJht2RVS.jpeg",
      },
      {
        name: "EARL STEPHENS",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07%20-%202023%20Domaine%20Della%20%22Earl%20Stephens%20Vineyard%22%20RRV%20Pinot%20Noir%20-%20Bottle%20Shot.png-A0v6uLbsABZJf1mNvPpQqFp8Q13ELf.jpeg",
      },
      {
        name: "TERRA DE PROMISSIO",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08%20-%202023%20Domaine%20Della%20%22Terra%20de%20Promissio%20Vineyard%22%20SC%20Pinot%20Noir%20-%20Bottle%20Shot.png-I0AnRgCNDFlLNhkNzP9RnZMFqybPjb.jpeg",
      },
      {
        name: "SOBERANES",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/09%20-%202023%20Domaine%20Della%20%22Soberanes%20Vineyard%22%20SLH%20Pinot%20Noir%20-%20Bottle%20Shot.png-gzdoi3Be9ZmbiT7qbwn8CeBK33nWBE.jpeg",
      },
    ],
  },
  {
    title: "SPECIAL BLEND",
    wines: [
      {
        name: "4 AMOURS",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10%20-%202023%20Domaine%20Della%20%224%20Amours%22%20Special%20Blend%20SC%20Pinot%20Noir%20-%20Bottle%20Shot.png-HoVuiQNMMD8m98BGOI3nnByY9TaLIT.jpeg",
        isNew: true,
      },
    ],
  },
]

export function WinesNav() {
  // Restore scrollToWine function
  const scrollToWine = (wineName: string) => {
    // Map wine names to their corresponding IDs as defined in the wine data
    const wineIdMap: { [key: string]: string } = {
      "RUSSIAN RIVER VALLEY": "russian-river-valley-pinot",
      "SONOMA COAST": "sonoma-coast-pinot",
      "SANTA LUCIA HIGHLANDS": "santa-lucia-highlands-pinot",
      RITCHIE: "ritchie-vineyard",
      "GRAHAM FAMILY": "graham-family",
      "EARL STEPHENS": "earl-stephens",
      "TERRA DE PROMISSIO": "terra-de-promissio",
      SOBERANES: "soberanes",
      "4 AMOURS": "four-amours",
    }

    const wineId = wineIdMap[wineName]
    const element = document.getElementById(wineId)

    if (element) {
      const headerHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
        10,
      )
      const navHeight = 48 // Approximate height of the dynamic nav
      const offset = headerHeight + navHeight

      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Calculate total wines for proportional widths
  const totalWines = wineSections.reduce((acc, section) => acc + section.wines.length, 0)

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {wineSections.map((section, sectionIndex) => {
          // Calculate section width based on number of wines
          const sectionWidth = `${(section.wines.length / totalWines) * 100}%`

          return (
            <div key={section.title} className="relative" style={{ width: sectionWidth }}>
              {/* Section Title */}
              <div className="text-center mb-8">
                <h2 className="text-[#ea182c] text-sm tracking-wider">{section.title}</h2>
              </div>

              {/* Vertical Divider */}
              {sectionIndex < wineSections.length - 1 && (
                <div className="absolute right-0 top-12 bottom-0 w-px bg-[#ea182c]" />
              )}

              {/* Wines */}
              <div className="flex justify-between items-start px-4">
                {section.wines.map((wine) => (
                  <div
                    key={wine.name}
                    className="flex flex-col items-center cursor-pointer group"
                    style={{ width: `${100 / section.wines.length - 4}%` }}
                    onClick={() => scrollToWine(wine.name)}
                  >
                    <div className="text-center mb-4 w-full px-2 h-16 flex items-center justify-center">
                      <h3 className="text-white text-sm group-hover:text-[#ea182c] transition-colors">
                        {wine.name}
                        {wine.isNew && (
                          <span className="ml-2 inline-block bg-[#ea182c] text-white text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="relative w-full bg-black h-[400px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[80px] h-[320px]">
                          <Image
                            src={wine.image || "/placeholder.svg"}
                            alt={wine.name}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            sizes={`(min-width: 1024px) ${100 / totalWines}vw, 120px`}
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-12">
        {wineSections.map((section) => (
          <div key={section.title} className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-[#ea182c] text-sm tracking-wider">{section.title}</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {section.wines.map((wine) => (
                <div
                  key={wine.name}
                  className="flex flex-col items-center w-[calc(33.333%-2rem)] cursor-pointer group"
                  onClick={() => scrollToWine(wine.name)}
                >
                  <div className="text-center mb-4 w-full h-14 flex items-center justify-center">
                    <h3 className="text-white text-sm group-hover:text-[#ea182c] transition-colors">
                      {wine.name}
                      {wine.isNew && (
                        <span className="ml-2 inline-block bg-[#ea182c] text-white text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="relative w-full bg-black h-[320px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[70px] h-[280px]">
                        <Image
                          src={wine.image || "/placeholder.svg"}
                          alt={wine.name}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 33vw, 120px"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

