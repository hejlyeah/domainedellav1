import Image from "next/image"
import { cn } from "@/lib/utils"

export type LogoVariant = "red" | "black" | "white"
export type LogoOrientation = "horizontal" | "vertical"

interface LogoProps {
  variant?: LogoVariant
  orientation?: LogoOrientation
  className?: string
  width?: number
  height?: number
}

const logoSources = {
  horizontal: {
    red: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Logo_Horizontal_RED-mvUngAvlcXfvwjQtGRpIj2D6u9NWLD.png",
    black:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Logo_Horizontal_BLACK-JxoWzBvFWvzO6DqDzw3dF9WgKH28UH.png",
    white:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Logo_Horizontal_WHITE-W5ykS4FnoujMmwbiARc3cjrT98AeX2.png",
  },
  vertical: {
    black:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Logo_Vertical_BLACK-V01MFkIXyy2HlPYJQX5qR06MSCN4O5.png",
    white:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Logo_Vertical_WHITE-sY4JCKRjDYwk2EyLFR5RIE8wVqJLg7.png",
  },
} as const

export function Logo({
  variant = "black",
  orientation = "horizontal",
  className,
  width = orientation === "horizontal" ? 300 : 200,
  height = orientation === "horizontal" ? 60 : 200,
}: LogoProps) {
  // Determine the correct logo source based on variant and orientation
  const logoSrc =
    orientation === "horizontal"
      ? logoSources.horizontal[variant]
      : logoSources.vertical[variant === "red" ? "black" : variant]

  return (
    <div className={cn("relative", className)}>
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt="Domaine Della"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  )
}

