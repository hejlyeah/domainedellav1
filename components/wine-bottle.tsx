"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type WineVariety = "Pinot Noir" | "Chardonnay"

interface WineBottleProps {
  name: string
  region: string
  variety: WineVariety
  categoryIndex: number
  wineIndex: number
  className?: string
  onClick?: () => void
}

export function WineBottle({ name, region, variety, categoryIndex, wineIndex, className, onClick }: WineBottleProps) {
  // Calculate the position of the bottle in the source image
  // This is a simplified approach - in a real implementation, you would use actual cropped images
  const getBottleImageSrc = () => {
    // For the demo, we'll use placeholder images
    // In a real implementation, you would have individual bottle images
    return "/placeholder.svg?height=400&width=100"
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105",
        className,
      )}
      onClick={onClick}
    >
      <div className="relative h-80 w-24 mb-6 bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <Image
          src={getBottleImageSrc() || "/placeholder.svg"}
          alt={`${name} ${variety}`}
          fill
          className="object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="text-[#ea182c] font-medium uppercase tracking-wider text-sm mb-1">{name}</h3>
        <p className="text-zinc-300 text-sm mb-1">{region}</p>
        <p className="text-zinc-400 text-sm italic">{variety}</p>
      </div>
    </div>
  )
}

