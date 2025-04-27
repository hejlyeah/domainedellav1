"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Award, CalendarClock, ShoppingCart } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Add TypeScript interface for global window properties
declare global {
  interface Window {
    eCellarAPI?: {
      navigate: (view: string, params: Record<string, string | null>) => void;
      getState: () => any;
      refreshCart: () => void;
      [key: string]: any;
    };
    reinitializeIsolatedContainer?: () => void;
  }
}

// Define the base award type explicitly for clarity
type BaseAward = {
  score: string
  critic: string
  review: string
  reviewVintage: string
}

// Use type intersection for the extended award type
type ReviewAward = {
  reviewer: string;
  scoreStr: string;
  scoreNum?: number | null; // scoreNum might exist in JSON, keep it optional
  excerpt: string;
  vintage: string | number; // Vintage can be string or number
  reviewedBy?: string;
}

type AwardWithScore = ReviewAward & {
  numericScore: number;
  logoPath?: string; // Add logo path to the award object
};

type GroupedAwards = Record<
  string,
  { logoPath?: string; reviews: AwardWithScore[] }
>;

// Re-define WineDetailProps including the new review props
interface WineDetailProps {
  id: string
  name: string // Now primarily for display
  series: string
  appellation: string
  varietal: string
  vintage: string
  releaseSeason?: "Spring" | "Summer" | "Fall"
  technicalNotes: {
    alcohol: string
    ta?: string
    ph?: string
    production: string
    fermentation?: {
      vessel: string
      aging: string
      coopers: string[]
    }
  }
  tastingNotes: string[]
  image: string
  isActive: boolean
  topTwoAwards: AwardWithScore[] 
  allGroupedAwards: GroupedAwards
}

export function WineDetail({
  id,
  name,
  series,
  appellation,
  varietal,
  vintage,
  releaseSeason, // Default to "Spring" if not provided
  technicalNotes,
  tastingNotes,
  image,
  isActive,
  topTwoAwards,
  allGroupedAwards,
}: WineDetailProps) {
  const [textScale, setTextScale] = useState(1)
  const specsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter awards for this page (>= 93 points)
  const filteredTopTwoAwards = topTwoAwards.filter(award => award.numericScore >= 93);
  const filteredGroupedAwards = Object.entries(allGroupedAwards)
    .reduce((acc, [critic, data]) => {
      const filteredReviews = data.reviews.filter(review => review.numericScore >= 93);
      if (filteredReviews.length > 0) {
        acc[critic] = { ...data, reviews: filteredReviews };
      }
      return acc;
    }, {} as GroupedAwards);

  // Function to calculate and set text scale
  useEffect(() => {
    const calculateScale = () => {
      if (!specsRef.current || !containerRef.current) return

      const container = containerRef.current
      const specs = specsRef.current

      // Reset scale to measure natural width
      specs.style.transform = "scale(1)"

      const containerWidth = container.clientWidth
      const specsWidth = specs.scrollWidth

      if (specsWidth > containerWidth) {
        const scale = containerWidth / specsWidth
        setTextScale(Math.max(0.75, scale)) // Don't scale smaller than 75%
      } else {
        setTextScale(1)
      }
    }

    calculateScale()
    window.addEventListener("resize", calculateScale)
    return () => window.removeEventListener("resize", calculateScale)
  }, [])

  // Use dynamic scroll margin based on header and nav height
  useEffect(() => {
    const updateScrollMargin = () => {
      const headerHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
        10,
      )
      const navHeight = 48 // Approximate height of the dynamic nav
      document.documentElement.style.setProperty("--scroll-margin", `${headerHeight + navHeight}px`)
    }

    updateScrollMargin()
    window.addEventListener("resize", updateScrollMargin)
    return () => window.removeEventListener("resize", updateScrollMargin)
  }, [])

  // Function to get the release season color
  const getReleaseSeasonColor = () => {
    switch (releaseSeason) {
      case "Spring":
        return "text-green-400"
      case "Summer":
        return "text-yellow-400"
      case "Fall":
        return "text-amber-500"
      default:
        return "text-zinc-400"
    }
  }

  // Add the handleAcquireClick function to match site header behavior
  const handleAcquireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Add a class to disable smooth scrolling temporarily
    document.documentElement.classList.add("navigation-scroll");
    
    // Use the same approach as in the site header
    setTimeout(() => {
      if (window.reinitializeIsolatedContainer && typeof window.reinitializeIsolatedContainer === 'function') {
        window.reinitializeIsolatedContainer();
      }
      
      // Force reload with the correct URL
      window.location.href = "/acquire/?view=categorieslist&slug=wines";
    }, 50);
    
    // Remove the class after navigation is complete
    setTimeout(() => {
      document.documentElement.classList.remove("navigation-scroll");
    }, 100);
  };

  // Component to render SVG logo with fallback
  const CriticLogo = ({ path, criticName, className, width = 80, height = 32 }: { path?: string; criticName: string; className?: string, width?: number, height?: number }) => {
      const [imgError, setImgError] = useState(!path); // Initialize error state based on path presence

      useEffect(() => {
          // Reset error only if path changes to a valid one
          if (path) {
             setImgError(false);
          }
      }, [path]);

      // Fallback condition: no path, error loading, or invalid path generated
      if (!path || imgError || path === '/logos/.svg') {
          return <span className={`font-medium text-zinc-300 ${className}`}>{criticName || 'Reviewer'}</span>;
      }

      const isSvg = path.endsWith('.svg');
      const isJebDunnuck = criticName === "Jeb Dunnuck";
      const isWineEnthusiast = criticName === "Wine Enthusiast";
      const isTastingPanel = criticName === "The Tasting Panel";
      const isAntonioGalloni = criticName === "Antonio Galloni";

      // Base Image component
      const imgComponent = (
         <Image 
             src={path}
             alt={`${criticName} Logo`}
             width={width} 
             height={height} 
             className={`object-contain ${className || ''}`} // Use contain, allow className override
             onError={() => setImgError(true)}
             loading="lazy"
             unoptimized={isSvg} // Unoptimize only SVGs
         />
      );

      // Add white background for specific critics/formats
      const needsWhiteBackground = 
         (isJebDunnuck && isSvg) || // Jeb Dunnuck SVG
         (isWineEnthusiast && !isSvg) || // Wine Enthusiast PNG
         (isTastingPanel && !isSvg) || // The Tasting Panel PNG
         (isAntonioGalloni && !isSvg); // Antonio Galloni PNG

      if (needsWhiteBackground) { 
         return (
            <div className="bg-white p-1 rounded inline-flex items-center justify-center"> 
               {/* Adjust padding (p-1) as needed */} 
               {imgComponent}
            </div>
         );
      }

      // Return the image directly for others
      return imgComponent;
   };

  return (
    <motion.div
      id={id}
      className="scroll-mt-36"
      style={{ scrollMarginTop: "var(--scroll-margin, 112px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-[40px] border border-zinc-800 bg-black shadow-lg overflow-hidden">
        {/* Top Section */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
            {/* Left Column - Content */}
            <div className="space-y-6">
              {/* Header with Release Season */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-3xl text-zinc-400 font-light">{vintage}</p>
                  {releaseSeason && (
                    <div className="flex items-center gap-1.5">
                      <CalendarClock className="h-4 w-4 text-zinc-400" />
                      <span className={`text-sm font-medium ${getReleaseSeasonColor()}`}>{releaseSeason} Release</span>
                    </div>
                  )}
                </div>
                {series !== "APPELLATION SERIES" && <p className="text-zinc-200 text-lg">{appellation}</p>}
                <p className="text-[#ea182c] text-sm tracking-wider">{series}</p>
                <h2 className="text-3xl md:text-4xl font-light text-white">{name}</h2>
              </div>

              {/* Tasting Notes */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Tasting Notes</h3>
                <ul className="list-disc list-inside space-y-2 text-zinc-200">
                  {tastingNotes.map((note: string, index: number) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* Technical Details Card */}
              <div className="bg-black rounded-xl p-6 space-y-6 border border-zinc-800">
                {/* Production and Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Cases Produced
                    </div>
                    <div className="text-lg text-zinc-200">{technicalNotes.production}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Alcohol</div>
                    <div className="text-lg text-zinc-200">{technicalNotes.alcohol}</div>
                  </div>
                  {technicalNotes.ta && (
                    <div>
                      <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">TA</div>
                      <div className="text-lg text-zinc-200">{technicalNotes.ta}</div>
                    </div>
                  )}
                  {technicalNotes.ph && (
                    <div>
                      <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">pH</div>
                      <div className="text-lg text-zinc-200">{technicalNotes.ph}</div>
                    </div>
                  )}
                </div>

                {/* Fermentation and Aging Details */}
                {technicalNotes.fermentation && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Fermentation & Aging
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg text-zinc-200">
                          Fermentation Vessel: {technicalNotes.fermentation.vessel}
                        </div>
                        <div className="text-lg text-zinc-200">Barrel Aging: {technicalNotes.fermentation.aging}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Coopers</div>
                      <div className="text-lg text-zinc-200">{technicalNotes.fermentation.coopers.join(", ")}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Acquire Button - Updated to match main nav bar behavior */}
              <div className="pt-4">
                <Link 
                  href="/acquire/?view=categorieslist&slug=wines" 
                  className="group"
                  onClick={handleAcquireClick}
                >
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#ea182c] text-white rounded-full hover:bg-[#ea182c]/90 transition-colors duration-200 group-hover:shadow-lg">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">Add to Collection</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column - Bottle Image */}
            <div className="relative flex items-center justify-center lg:justify-center lg:px-12">
              <div className="relative w-[280px] h-[700px] bg-black">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 280px, 280px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Critical Acclaim Section - Full Width - Refactored */}
        {Object.keys(filteredGroupedAwards).length > 0 && (
          <div className="border-t border-white/10">
            <motion.div
              className="bg-black px-8 md:px-12 py-12"
              initial="hidden"
              animate="visible"
              variants={{
                 hidden: { opacity: 0 },
                 visible: {
                   opacity: 1,
                   transition: {
                     delayChildren: 0.1,
                     staggerChildren: 0.1
                   }
                 }
              }}
            >
              <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div className="text-center mb-10" variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                  <div className="inline-flex items-center gap-3">
                    <Award className="w-6 h-6 text-[#ea182c]" />
                    <h3 className="text-2xl font-light text-white tracking-wide">Critical Acclaim</h3>
                  </div>
                </motion.div>

                {/* Top Two Reviews - Use filtered data */}
                {filteredTopTwoAwards.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  >
                    {filteredTopTwoAwards.map((award: AwardWithScore, index: number) => (
                      <motion.div
                        key={`top-${index}-${award.reviewer}-${award.vintage}`}
                        className="bg-zinc-900/60 rounded-2xl p-6 shadow-lg border border-zinc-700/60 flex flex-col"
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                      >
                        {/* Top Row: Score and Logo */} 
                        <div className="flex items-start justify-between mb-4">
                          {/* Score */} 
                          <div className="text-left">
                              <span className="text-5xl font-bold text-[#ea182c] leading-none">{award.scoreStr}</span>
                              <span className="text-lg font-light text-white ml-1.5">Points</span>
                          </div>
                           {/* Container with fixed height and max-width */} 
                           <div className="text-right flex-shrink-0 pl-4 h-12 w-[150px] flex items-center justify-end"> 
                               <CriticLogo 
                                 path={award.logoPath} 
                                 criticName={award.reviewer} 
                                 width={150} // Corresponds to container width
                                 height={48} // Increased height slightly
                                 className="max-h-full max-w-full" // Ensure it scales down if needed
                               />
                           </div>
                        </div>

                        {/* Middle: Excerpt */} 
                        <p className="text-zinc-200 italic leading-relaxed flex-grow mb-3">
                          {award.excerpt ? `\"${award.excerpt}\"` : <span className="text-zinc-500">(Review excerpt not available)</span>}
                        </p>
                          
                        {/* Bottom: Critic Name and Vintage */} 
                        <p className="text-sm text-zinc-400 mt-auto">
                          {award.reviewer} &ndash; {String(award.vintage)} Vintage
                          {award.reviewedBy && <span className="block text-xs text-zinc-500">Reviewed by {award.reviewedBy}</span>}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* All Grouped Reviews Grid - Use filtered data */}
                {Object.keys(filteredGroupedAwards).length > 0 && (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 pt-8 border-t border-zinc-700/50 mt-8"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  >
                    {Object.entries(filteredGroupedAwards).map(([critic, data]: [string, { logoPath?: string; reviews: AwardWithScore[] }]) => (
                      <motion.div
                        key={critic} 
                        className="bg-zinc-900/60 rounded-2xl p-4 shadow-lg border border-zinc-700/60 flex flex-col items-center text-center"
                        variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                      >
                        {/* Logo / Critic Name Fallback */} 
                        <div className="h-12 flex items-center justify-center mb-3">
                           <CriticLogo 
                            path={data.logoPath} 
                            criticName={critic} 
                            className="max-h-full w-auto" // Let height control, width auto
                            height={48} // Max height for logo area
                           />
                        </div>
                        {/* Scores list - Removed mt-auto to align top */}
                        <div className="space-y-1.5 w-full">
                          {data.reviews.map((review: AwardWithScore, idx: number) => (
                            <div key={`${critic}-${idx}-${review.vintage}`} className="text-base font-light text-zinc-200 flex items-center justify-center gap-2">
                              <span className="font-semibold text-[#ea182c]">{review.scoreStr}</span>
                              <span className="text-zinc-600">|</span>
                              <span className="text-zinc-400 text-sm">{String(review.vintage)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

