"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Grape, Cloud, Thermometer, Mountain } from "lucide-react"
import SiteHeader from "@/components/site-header"

// Define vineyard data structure
interface Vineyard {
  id: string
  name: string
  region: string
  image: string
  description: string
  established: string
  elevation: string
  soilType: string
  climate: string
  varietals: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

// Sample vineyard data
const vineyards: Vineyard[] = [
  {
    id: "ritchie-vineyard",
    name: "Ritchie Vineyard",
    region: "Russian River Valley",
    image: "/placeholder.svg?height=600&width=800",
    description:
      "Planted in 1972, Ritchie Vineyard is located in the heart of the Russian River Valley. The vineyard's old-vine Chardonnay is planted in sandy Goldridge soil, producing wines of exceptional depth and character. The unique microclimate, influenced by morning fog and afternoon sunshine, creates ideal conditions for slow, even ripening.",
    established: "1972",
    elevation: "150-300 ft",
    soilType: "Goldridge sandy loam",
    climate: "Cool, maritime influence with morning fog",
    varietals: ["Chardonnay"],
    coordinates: {
      lat: 38.472,
      lng: -122.857,
    },
  },
  {
    id: "graham-family",
    name: "Graham Family Vineyard",
    region: "Russian River Valley",
    image: "/placeholder.svg?height=600&width=800",
    description:
      "The Graham Family Vineyard is situated in the cooler Green Valley sub-region of the Russian River Valley. This meticulously farmed site produces Pinot Noir of exceptional elegance and complexity. The vineyard's western exposure captures afternoon sun while benefiting from the cooling influence of coastal fog.",
    established: "1980",
    elevation: "200-350 ft",
    soilType: "Goldridge sandy loam with volcanic ash",
    climate: "Cool, with significant marine influence",
    varietals: ["Pinot Noir"],
    coordinates: {
      lat: 38.445,
      lng: -122.892,
    },
  },
  {
    id: "earl-stephens",
    name: "Earl Stephens Vineyard",
    region: "Russian River Valley",
    image: "/placeholder.svg?height=600&width=800",
    description:
      "Earl Stephens Vineyard is located on the eastern edge of the Russian River Valley, where it benefits from slightly warmer temperatures than vineyards further west. This unique microclimate, combined with meticulous farming practices, produces Pinot Noir with rich fruit character and excellent structure.",
    established: "1988",
    elevation: "100-200 ft",
    soilType: "Clay loam with river sediment",
    climate: "Moderate, with less fog influence than western sites",
    varietals: ["Pinot Noir"],
    coordinates: {
      lat: 38.502,
      lng: -122.801,
    },
  },
  {
    id: "terra-de-promissio",
    name: "Terra de Promissio Vineyard",
    region: "Sonoma Coast",
    image: "/placeholder.svg?height=600&width=800",
    description:
      "Terra de Promissio, meaning 'Land of Promise,' is a 50-acre vineyard located in the Petaluma Gap region of the Sonoma Coast. The vineyard is heavily influenced by cool ocean breezes and fog, resulting in a long growing season that produces Pinot Noir with vibrant acidity, complex aromatics, and exceptional balance.",
    established: "2002",
    elevation: "400-600 ft",
    soilType: "Gravelly clay loam",
    climate: "Cool, windy, with significant marine influence",
    varietals: ["Pinot Noir"],
    coordinates: {
      lat: 38.271,
      lng: -122.669,
    },
  },
  {
    id: "soberanes",
    name: "Soberanes Vineyard",
    region: "Santa Lucia Highlands",
    image: "/placeholder.svg?height=600&width=800",
    description:
      "Soberanes Vineyard is located in the heart of the Santa Lucia Highlands, on the terraced hillsides of the Santa Lucia mountain range. The vineyard's high elevation and eastern exposure provide excellent drainage and morning sun, while afternoon breezes from Monterey Bay moderate temperatures. These conditions produce Pinot Noir with intense flavor concentration and bright acidity.",
    established: "2007",
    elevation: "400-800 ft",
    soilType: "Decomposed granite and gravelly loam",
    climate: "Cool to moderate, with strong maritime influence",
    varietals: ["Pinot Noir"],
    coordinates: {
      lat: 36.407,
      lng: -121.456,
    },
  },
]

// Group vineyards by region
const vineyardsByRegion = vineyards.reduce(
  (acc, vineyard) => {
    if (!acc[vineyard.region]) {
      acc[vineyard.region] = []
    }
    acc[vineyard.region].push(vineyard)
    return acc
  },
  {} as Record<string, Vineyard[]>,
)

// NEW: Basic Slideshow Component
const VineyardSlideshow = () => {
  // TODO: Implement actual slideshow logic (multiple images, controls, transitions)
  const images = [
    { src: '/images/vineyard-banner-1.jpg', alt: 'Grapes hanging on a vine with sun flare' }
  ];
  const currentImage = images[0]; // Show the first image for now

  return (
    <div className="relative w-full h-[80vh] overflow-hidden"> {/* CHANGED: Replaced aspect-[16/9] with h-[80vh] */}
      <Image
        src={currentImage.src}
        alt={currentImage.alt}
        fill
        className="object-cover"
        priority // Prioritize loading this image
      />
      {/* Optional: Add gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /> */}
    </div>
  );
};

export default function Vineyards() {
  const [activeVineyard, setActiveVineyard] = useState<string | null>(null)

  return (
    <>
      <VineyardSlideshow />
      <SiteHeader />
      <main className="min-h-screen pb-20">
        <section className="w-full">
          <motion.div 
            className="w-full bg-zinc-950/90 backdrop-blur-xl border-y border-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-6 py-12 md:py-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
                  Our Vineyards
                </h2>
                <div className="space-y-6 text-lg leading-relaxed text-zinc-200 text-center">
                  <p>
                    Domaine Della sources from only the finest vineyard sources in the Russian River Valley, Sonoma Coast, and Santa Lucia Highlands.
                  </p>
                  <p>
                    All are highly renowned and acclaimed by Pinot Noir and Chardonnay enthusiasts worldwide. David feels fortunate to carry relationships with such incredible growers from his time with Kosta Browne.
                  </p>
                  <p>
                    We are pleased to share with you details from each our sites and hope you enjoy learning more about our wines from the place they started from.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mx-auto max-w-[95%] sm:max-w-[90%] space-y-32 mt-16">
          {/* Vineyards by Region */}
          {Object.entries(vineyardsByRegion).map(([region, regionVineyards], regionIndex) => (
            <section key={region}>
              <motion.div
                className="rounded-[40px] border border-zinc-800 bg-black shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="px-6 py-12 md:py-16">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-8 text-center">{region}</h2>

                    <div className="space-y-16">
                      {regionVineyards.map((vineyard, vineyardIndex) => (
                        <div key={vineyard.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Image Side - Alternate left/right based on index */}
                          <div className={`${vineyardIndex % 2 === 1 ? "lg:order-2" : ""}`}>
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                              <Image
                                src={vineyard.image || "/placeholder.svg"}
                                alt={`${vineyard.name} in ${vineyard.region}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#ea182c]" />
                                <span className="text-white font-medium">{vineyard.name}</span>
                              </div>
                            </div>
                          </div>

                          {/* Content Side */}
                          <div className="flex flex-col justify-center">
                            <h3 className="text-2xl font-light text-white mb-4">{vineyard.name}</h3>
                            <p className="text-zinc-300 mb-6">{vineyard.description}</p>

                            {/* Vineyard Details */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-start gap-2">
                                <div className="mt-1 p-1.5 rounded-full bg-zinc-800">
                                  <Grape className="h-4 w-4 text-[#ea182c]" />
                                </div>
                                <div>
                                  <p className="text-sm text-zinc-400">Varietals</p>
                                  <p className="text-zinc-200">{vineyard.varietals.join(", ")}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="mt-1 p-1.5 rounded-full bg-zinc-800">
                                  <Cloud className="h-4 w-4 text-[#ea182c]" />
                                </div>
                                <div>
                                  <p className="text-sm text-zinc-400">Climate</p>
                                  <p className="text-zinc-200">{vineyard.climate}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="mt-1 p-1.5 rounded-full bg-zinc-800">
                                  <Mountain className="h-4 w-4 text-[#ea182c]" />
                                </div>
                                <div>
                                  <p className="text-sm text-zinc-400">Elevation</p>
                                  <p className="text-zinc-200">{vineyard.elevation}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="mt-1 p-1.5 rounded-full bg-zinc-800">
                                  <Thermometer className="h-4 w-4 text-[#ea182c]" />
                                </div>
                                <div>
                                  <p className="text-sm text-zinc-400">Soil Type</p>
                                  <p className="text-zinc-200">{vineyard.soilType}</p>
                                </div>
                              </div>
                            </div>

                            <div className="text-sm text-zinc-400">
                              Established: <span className="text-zinc-300">{vineyard.established}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          ))}

          {/* Map Section - For future implementation */}
          <section>
            <motion.div
              className="rounded-[40px] border border-zinc-800 bg-black shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="px-6 py-12 md:py-16">
                <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-6">Our Vineyard Locations</h2>
                  <p className="text-lg text-zinc-300 mb-8 max-w-3xl mx-auto">
                    Explore the geographic diversity of our vineyard sources, spanning from the cool Russian River
                    Valley to the coastal-influenced Sonoma Coast and the elevated terraces of the Santa Lucia
                    Highlands.
                  </p>

                  {/* Placeholder for future map implementation */}
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-zinc-400">Interactive map coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </>
  )
}

