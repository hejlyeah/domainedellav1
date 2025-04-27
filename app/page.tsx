"use client"

import { useEffect, useRef, useState } from "react"
import Player from "@vimeo/player"
import { ArrowRight, Star } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { WineScoreCarousel } from "@/components/wine-score-carousel"
import { MiniWineCarousel } from "@/components/mini-wine-carousel"
import { wineData } from "@/data/wine-data"
import { googleReviewsData, Review } from "@/data/googleReviews"

// Filter out placeholder reviews before using the data
const filteredReviews = googleReviewsData.filter(
  (review) => 
    review.time !== "Placeholder Date" && 
    review.text !== "(No text provided in review)"
);

// Process wineData to get top scores >= 95
const allScoredWines = wineData.categories.flatMap((category) =>
  category.wines.flatMap((wine) =>
    Object.values(wine.allGroupedAwards || {})
      .flatMap((group) => group.reviews)
      .filter((review) => review.numericScore >= 95) // Ensure >= 95 filter here as well
      .map((review) => ({
        score: review.scoreStr,
        wine: wine.name.replace(/^\\"|\\"$/g, ''), // Clean wine name
        vintage: String(review.vintage),
        reviewer: review.reviewer,
      })),
  ),
)

// Sort by score (desc), then vintage (desc), and take top 5
const topFiveScores = allScoredWines
  .sort((a, b) => {
    const scoreA = parseFloat(a.score.replace('+', '.5'));
    const scoreB = parseFloat(b.score.replace('+', '.5'));
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    const vintageA = parseInt(a.vintage, 10);
    const vintageB = parseInt(b.vintage, 10);
    return vintageB - vintageA;
  })
  .slice(0, 5)

const ROTATING_TEXTS = ["Pinot Noir.", "Chardonnay.", "Wicked Juice.", "Are you on the list?"]

// Add image configuration constants
const IMAGES = {
  acquire: {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Domaine%20Della%20Pouring.jpg-KwzghQsIgHFVF0q1tUiKiEm87zwpNc.jpeg",
    alt: "Wine being poured into glasses",
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFdOPUJXRjBPTVRaYVpIZXFhd3tqeXBYZHR+dXX/2wBDARUXFx0dHR4eHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  },
  story: {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Della's%20Portrait.jpg-aFLHYnuUElpkQBV4leXihg7k0Xaxdm.jpeg",
    alt: "Historical portrait in an elegant silver frame",
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFdOPUJXRjBPTVRaYVpIZXFhd3tqeXBYZHR+dXX2wBDARUXFx0dHR4eHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  },
  wines: {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Full%20DD%20Lineup,%20eighth%20size%202-N12wvVKao0TnJz3nCJ2wUP1k2tGmDl.png",
    alt: "Domaine Della wine collection",
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFdOPUJXRjBPTVRaYVpIZXFhd3tqeXBYZHR+dXX2wBDARUXFx0dHR4eHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  },
  visit: {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Domaine%20Della%20Barrel%20Shot.jpg-Cu3SCZ10c63TMvzYCbnT0K01b3U4Dn.jpeg",
    alt: "Domaine Della wine barrel",
    blurDataURL:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyUC08LSw1NDBAQFdOPUJXRjBPTVRaYVpIZXFhd3tqeXBYZHR+dXX2wBDARUXFx0dHR4eHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
  },
} as const

const SECTIONS = [
  {
    title: "Acquire",
    description:
      "Join our exclusive allocation list to access our limited production wines, crafted with precision and passion.",
    image: IMAGES.acquire,
    href: "/acquire",
  },
  {
    title: "Story",
    description:
      "Discover the heritage and dedication behind Domaine Della, where family legacy meets winemaking excellence.",
    image: IMAGES.story,
    href: "/story",
  },
  {
    title: "Wines",
    description:
      "Explore our collection of exceptional Pinot Noir and Chardonnay, each bottle a testament to terroir and craft.",
    image: IMAGES.wines,
    href: "/wines",
  },
  {
    title: "Visit",
    description: "Experience the artistry of Domaine Della through private tastings and exclusive winery experiences.",
    image: IMAGES.visit,
    href: "/visit",
  },
] as const

// Flatten wine data for the mini carousel
const allWinesForCarousel = wineData.categories.flatMap((category) =>
  category.wines.map((wine) => {
    let title = wine.name.replace(/^\\"|\\"$/g, '') // Default clean name
    let subtitle = ""

    // Logic for abbreviated title
    const quotedMatch = wine.name.match(/^\"(.*?)\"/)
    if (quotedMatch) {
      title = quotedMatch[1] // Use text within quotes
    } else if (category.name === "APPELLATION SERIES") {
      title = wine.appellation // Use appellation for Appellation series
    }

    // Logic for subtitle
    if (category.name === "APPELLATION SERIES") {
      subtitle = wine.varietal // Only varietal for Appellation series
    } else {
      subtitle = `${wine.appellation} • ${wine.varietal}` // Appellation and varietal for others
    }

    return {
      id: wine.id,
      image: wine.image,
      series: category.name,
      // Pass new title and subtitle
      title: title,
      subtitle: subtitle,
      // Keep original name and appellation if needed elsewhere, though MiniWineCard won't use them directly
      name: wine.name,
      appellation: wine.appellation,
      varietal: wine.varietal, // Ensure varietal is included
    }
  }),
)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isPlayerReady, setIsPlayerReady] = useState(true)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { scrollYProgress } = useScroll()
  const cardY = useTransform(scrollYProgress, [0, 0.2], [0, 0])
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 1])
  const delayedCardY = useTransform(scrollYProgress, [0, 0.2], [100, 0])
  const delayedCardOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  useEffect(() => {
    console.log("Component mounted, setting initial states")
    setIsMounted(true)
    
    console.log(`Current states - isPlayerReady: ${isPlayerReady}, isVideoLoading: ${isVideoLoading}, isMounted: ${isMounted}`)
  }, [])

  useEffect(() => {
    if (isMounted) {
      cardY.set(0)
      cardOpacity.set(1)
      
      const timer = setTimeout(() => {
        cardY.set(delayedCardY.get())
        cardOpacity.set(delayedCardOpacity.get())
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isMounted, cardY, cardOpacity, delayedCardY, delayedCardOpacity])

  useEffect(() => {
    if (!containerRef.current) return
    console.log("Initializing video player")

    const initVideoPlayer = async () => {
      try {
        const updateVideoSize = () => {
          const iframe = containerRef.current?.querySelector("iframe")
          if (!iframe) return

          iframe.style.height = "100vh"
          const viewportHeight = window.innerHeight
          const aspectRatio = 16 / 9
          const requiredWidth = viewportHeight * aspectRatio
          iframe.style.width = `${requiredWidth}px`
          iframe.style.left = `${(window.innerWidth - requiredWidth) / 2}px`
          iframe.style.top = "0"
          iframe.style.position = "absolute"
        }

        const safetyTimeout = setTimeout(() => {
          console.log("Safety timeout triggered: ensuring content visibility")
          setIsVideoLoading(false)
        }, 500)

        if (!containerRef.current) {
          console.log("Container ref is not available, skipping video initialization")
          setIsVideoLoading(false)
          return
        }

        const player = new Player(containerRef.current, {
          id: 1052676660,
          background: true,
          autopause: false,
          autoplay: true,
          loop: true,
          muted: true,
          controls: false,
          responsive: true,
          dnt: true,
          title: false,
          byline: false,
          portrait: false,
        })

        player.ready()
          .then(() => {
            console.log("Vimeo player ready")
            clearTimeout(safetyTimeout)
            setIsVideoLoading(false)
            updateVideoSize()
            player.setVolume(0)
            return player.play()
          })
          .catch((error: Error) => {
            console.error("Error with Vimeo player:", error)
            setIsVideoLoading(false)
          })

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeName === "IFRAME") {
                  console.log("Iframe added to DOM, updating size")
                  updateVideoSize()
                  observer.disconnect()
                }
              })
            }
          })
        })

        if (containerRef.current) {
          observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
          })
        }

        window.addEventListener("resize", updateVideoSize)

        return () => {
          window.removeEventListener("resize", updateVideoSize)
          clearTimeout(safetyTimeout)
          observer.disconnect()
          player.destroy().catch(console.error)
        }
      } catch (error: unknown) {
        console.error("Failed to initialize video player:", error)
        setIsVideoLoading(false)
      }
    }

    initVideoPlayer()

    const rotationInterval = setInterval(() => {
      setCurrentTextIndex((current) => (current === ROTATING_TEXTS.length - 1 ? 0 : current + 1))
    }, 3000)

    return () => {
      clearInterval(rotationInterval)
    }
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="relative">
        <div className="fixed inset-0 bg-black">
          <div className="absolute inset-0 overflow-hidden">
            <div ref={containerRef} className="absolute inset-0 vimeo-container" />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 transition-opacity duration-500 opacity-100"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        <div className="relative">
          <section className="relative h-screen flex flex-col items-center justify-center px-4 text-center">
            <div className="opacity-100 transition-opacity duration-500 content-fallback">
              <h1 className="text-5xl md:text-7xl font-light mb-6 text-white">
                {ROTATING_TEXTS[currentTextIndex]}
              </h1>
              <div className="flex flex-col items-center space-y-3 w-full max-w-[95vw] sm:max-w-[90vw] mx-auto mb-12">
                <p className="regions-text text-zinc-200 whitespace-nowrap">
                  RUSSIAN RIVER VALLEY | SONOMA COAST | SANTA LUCIA HIGHLANDS
                </p>
                <p className="regions-text text-zinc-200 whitespace-nowrap">
                  FAMILY-OWNED, ARTISAN, LUXURY PINOT NOIR AND CHARDONNAY
                </p>
              </div>

              <div className="mt-8">
                <a href="/acquire/?view=signup" className="group inline-flex items-center transition-all duration-300">
                  <button className="px-8 py-3 border border-white text-white text-sm tracking-widest uppercase transition-all duration-300 hover:border-[#ea182c] hover:text-[#ea182c] hover:shadow-[0_0_15px_rgba(234,24,44,0.5)] hover:scale-110 active:scale-95 group-hover:bg-black/20 group-hover:backdrop-blur-sm">
                    Join the List
                    <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </button>
                </a>
              </div>
            </div>
          </section>

          <section className="min-h-screen relative flex items-center justify-center py-24">
            <motion.div
              className="w-full"
              style={{
                y: cardY,
                opacity: cardOpacity,
              }}
            >
              <div className="backdrop-blur-sm bg-black/[0.05] border-y border-white/10 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">Welcome to Domaine Della</h2>
                  <div className="space-y-8 text-lg md:text-xl text-zinc-200 leading-relaxed">
                    <p>
                      Crafting exceptional wines that express the unique terroir of our vineyards, where tradition meets
                      innovation in every bottle.
                    </p>

                    <p>
                      Domaine Della is a luxury, artisan producer of Pinot Noir and Chardonnay, crafted in extremely
                      limited quantities. Our wines are sourced from the most exceptional vineyards in the Russian River
                      Valley, Sonoma Coast, and Santa Lucia Highlands.
                    </p>

                    <p>
                      Founded by David Hejl, Domaine Della began as a passion project during his tenure as CEO and
                      General Manager of Kosta Browne. After successfully leading the company to a landmark sale in
                      2015, David pursued his dream of creating a luxury wine label. Domaine Della is a tribute to his
                      mother, an extraordinary woman who raised eleven children and left an indelible legacy.
                    </p>

                    <p>
                      In 2025, we proudly celebrate 15 years of winemaking excellence with the release of our 2023
                      vintage. Our recent vintages have earned widespread acclaim, with ratings of 93-99 points from
                      leading wine critics.
                    </p>

                    <p>
                      Domaine Della wines are released exclusively to our active list members three times a year. Join
                      our list to experience the artistry and passion behind every bottle.
                    </p>
                  </div>
                  <div className="mt-10">
                    <a
                      href="/acquire/?view=categorieslist&slug=wines"
                      className="group inline-flex items-center transition-all duration-300"
                    >
                      <button className="px-8 py-3 border border-white text-white text-sm tracking-widest uppercase transition-all duration-300 hover:border-[#ea182c] hover:text-[#ea182c] hover:shadow-[0_0_15px_rgba(234,24,44,0.5)] hover:scale-110 active:scale-95 group-hover:bg-black/20 group-hover:backdrop-blur-sm">
                        Acquire Now
                        <ArrowRight className="inline-block ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="relative bg-black/[0.05] backdrop-blur-sm border-y border-white/10 py-8">
            <div className="w-full mx-auto text-center mb-6 px-4">
              <h2 className="text-2xl md:text-3xl font-light text-white">
                "The wines are brilliant across the board" - Jeb Dunnuck
              </h2>
            </div>
            <WineScoreCarousel scores={topFiveScores} />
          </section>

          {/* New section for MiniWineCarousel */}
          <section className="relative bg-black/[0.05] backdrop-blur-sm border-y border-white/10 py-6 overflow-hidden">
            <div className="w-full mx-auto text-center mb-4 px-4">
              <h2 className="text-2xl md:text-3xl font-light text-white">
                Ten Wines – Each A Unique And Evolving Expression
              </h2>
            </div>
            <div className="infinite-scroll-container">
              <div className="mini-wines-fast">
                <div className="inline-block"><MiniWineCarousel wines={allWinesForCarousel} /></div>
                <div className="inline-block"><MiniWineCarousel wines={allWinesForCarousel} /></div>
              </div>
            </div>
          </section>

          <section className="w-full relative -mx-[calc(50vw-50%)] my-12 md:my-16">
            <div className="w-screen bg-black/[0.05] backdrop-blur-sm border-y border-white/10 py-8 space-y-8">
              <div className="text-center mb-12 px-4">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  What Our Tasting Room Guests Say: A Perfect 5-Star Record
                </h2>
              </div>

              <div className="infinite-scroll-container">
                <div className="infinite-scroll-content">
                  {filteredReviews.map((review, index) => (
                    <div key={`home-review-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                        <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-home-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
                          ))}
                        </div>
                        <p className="text-base font-semibold text-zinc-100 mb-4 flex-shrink-0">
                          {review.author_name} - <span className="italic font-normal text-zinc-400">{review.time}</span>
                        </p>
                        <div className="flex-grow overflow-y-auto review-text-scroll pr-2">
                           <p className="text-zinc-200">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredReviews.map((review, index) => (
                     <div key={`home-review-dup1-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                        <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-home-dup1-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
                          ))}
                        </div>
                        <p className="text-base font-semibold text-zinc-100 mb-4 flex-shrink-0">
                          {review.author_name} - <span className="italic font-normal text-zinc-400">{review.time}</span>
                        </p>
                        <div className="flex-grow overflow-y-auto review-text-scroll pr-2">
                            <p className="text-zinc-200">{review.text}</p>
                        </div>
                      </div>
                     </div>
                   ))}
                   {filteredReviews.map((review, index) => (
                     <div key={`home-review-dup2-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                       <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-home-dup2-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
                          ))}
                        </div>
                        <p className="text-base font-semibold text-zinc-100 mb-4 flex-shrink-0">
                          {review.author_name} - <span className="italic font-normal text-zinc-400">{review.time}</span>
                        </p>
                         <div className="flex-grow overflow-y-auto review-text-scroll pr-2">
                            <p className="text-zinc-200">{review.text}</p>
                        </div>
                      </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative px-4 py-24">
            <div className="w-full mx-auto max-w-[95%] sm:max-w-[90%] space-y-32">
              {SECTIONS.map((section, index) => {
                // Determine if this is the Acquire section
                const isAcquireSection = section.title === "Acquire"
                // Set the correct href based on the section
                const sectionHref = isAcquireSection ? "/acquire/?view=categorieslist&slug=wines" : section.href

                return (
                  <motion.div
                    key={section.title}
                    className={`flex flex-col gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Use <a> tag for Acquire section card, Link for others */}
                    {isAcquireSection ? (
                      <a href={sectionHref} className="lg:w-2/3 relative aspect-[16/9] lg:aspect-[3/2] overflow-hidden rounded-2xl group block w-full h-full">
                        <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50 z-10" />
                        <Image
                          src={section.image.src || "/placeholder.svg"}
                          alt={section.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 66vw"
                          quality={90}
                          priority={index < 2}
                          placeholder="blur"
                          blurDataURL={section.image.blurDataURL}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </a>
                    ) : (
                      <div className="lg:w-2/3 relative aspect-[16/9] lg:aspect-[3/2] overflow-hidden rounded-2xl">
                        <Link href={sectionHref} className="group block w-full h-full">
                          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50 z-10" />
                          <Image
                            src={section.image.src || "/placeholder.svg"}
                            alt={section.image.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 66vw"
                            quality={90}
                            priority={index < 2}
                            placeholder="blur"
                            blurDataURL={section.image.blurDataURL}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </Link>
                      </div>
                    )}

                    <div className="lg:w-1/3 flex flex-col justify-center">
                      <div className={`space-y-6 ${index % 2 === 0 ? "lg:pl-8" : "lg:pr-8"}`}>
                        <motion.div
                          initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <h3 className="text-3xl md:text-4xl font-light text-white mb-4">{section.title}</h3>
                          <p className="text-lg text-zinc-200 leading-relaxed mb-6">{section.description}</p>
                          {/* Use <a> tag for Acquire section Explore button, Link for others */}
                          {isAcquireSection ? (
                            <a
                              href={sectionHref}
                              className="inline-flex items-center text-white hover:text-[#ea182c] transition-colors duration-200 group"
                            >
                              <span className="text-sm tracking-widest uppercase">Explore</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                          ) : (
                            <Link
                              href={sectionHref}
                              className="inline-flex items-center text-white hover:text-[#ea182c] transition-colors duration-200 group"
                            >
                              <span className="text-sm tracking-widest uppercase">Explore</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

