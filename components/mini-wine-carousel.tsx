"use client"

import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { MiniWineCard } from "./mini-wine-card"

// Basic Embla Carousel CSS (can be moved to a global CSS file)
const emblaStyles = `
.embla {
  overflow: hidden;
  position: relative; /* Needed for scrollbar positioning */
  padding-bottom: 30px; /* Space for scrollbar */
}
.embla__container {
  display: flex;
}
.embla__slide {
  flex: 0 0 auto; /* Ensure slides don't shrink */
  min-width: 0;
  position: relative;
}
.embla__scrollbar {
  position: absolute;
  left: 5%; /* Indent scrollbar */
  right: 5%;
  bottom: 10px; /* Position at bottom */
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: grab;
}
.embla__scrollbar__thumb {
  position: absolute;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 2px;
}
`

// Define the type for the essential wine data needed by the mini card
interface MiniWineData {
  id: string // Use ID for key
  image: string
  title: string
  subtitle: string
  series: string
  varietal: string
  name?: string
  appellation?: string
}

interface MiniWineCarouselProps {
  wines: MiniWineData[]
}

export function MiniWineCarousel({ wines }: MiniWineCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start', 
    containScroll: 'trimSnaps' 
  })
  const [scrollProgress, setScrollProgress] = useState(0)

  const onScroll = useCallback(() => {
    if (!emblaApi) return
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onScroll()
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onScroll) // Re-calculate on resize etc.
    return () => {
      emblaApi.off('scroll', onScroll)
      emblaApi.off('reInit', onScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <div className="embla w-full py-8" ref={emblaRef}>
      <style>{emblaStyles}</style> {/* Inject basic styles */}
      <div className="embla__container">
        {wines.map((wine) => (
          <div 
            className="embla__slide inline-block px-2 py-2 w-[250px]" 
            key={wine.id} 
          >
            <a href="/acquire/?view=categorieslist&slug=wines" className="block h-full">
              <MiniWineCard
                image={wine.image}
                title={wine.title}
                subtitle={wine.subtitle}
                series={wine.series}
              />
            </a>
          </div>
        ))}
      </div>
      {/* Scrollbar Implementation */}
      <div className="embla__scrollbar">
        <div 
          className="embla__scrollbar__thumb" 
          style={{ left: `${scrollProgress}%` }} 
        />
      </div>
    </div>
  )
} 