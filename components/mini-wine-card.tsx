"use client"

import Image from "next/image"

interface MiniWineCardProps {
  image: string
  title: string
  subtitle: string
  series: string
}

export function MiniWineCard({ image, title, subtitle, series }: MiniWineCardProps) {
  return (
    <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden p-3 flex flex-col h-full backdrop-blur-sm hover:border-zinc-600 transition-all duration-300 ease-in-out cursor-pointer">
      <div className="relative aspect-[2/3] w-full mb-2">
        <Image
          src={image || "/placeholder.svg"}
          alt={title || "Domaine Della wine bottle"}
          fill
          sizes="150px"
          className="object-contain"
        />
      </div>
      <div className="text-center flex flex-col flex-1">
        <div>
          <p className="text-[#ea182c] text-xs tracking-wider uppercase mb-1">{series}</p>
          <h3 className="text-white font-light text-sm leading-tight mb-1">{title}</h3>
          <p className="text-zinc-400 text-xs leading-tight mb-1">{subtitle}</p>
        </div>

        <div className="mt-2">
          {series === "APPELLATION SERIES" ? (
            <button className="bg-[#ea182c] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#c81425] transition-colors w-full">
              ACQUIRE
            </button>
          ) : (
            <button className="bg-zinc-800 text-[#ea182c] border border-[#ea182c] px-4 py-2 rounded-full text-xs font-semibold w-full tracking-wider">
              LIST MEMBER ONLY
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 