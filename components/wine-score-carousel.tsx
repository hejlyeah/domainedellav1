"use client"
import { Star } from "lucide-react"

// Define the type for wine score data
interface WineScore {
  score: string
  wine: string
  vintage: string
  reviewer: string
  publication?: string
}

interface WineScoreCarouselProps {
  scores: WineScore[]
}

export function WineScoreCarousel({ scores }: WineScoreCarouselProps) {
  // Create a duplicate set of scores for seamless looping
  const allScores = [...scores, ...scores, ...scores] // Add more duplicates for wider displays

  return (
    <div className="w-full overflow-hidden py-8">
      <div className="infinite-scroll-container">
        <div className="infinite-scroll-content wine-scores">
          {/* Display all scores */}
          {allScores.map((score, index) => (
            <div key={`score-${index}`} className="inline-block px-6 min-w-[300px] md:min-w-[350px]">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#ea182c] fill-[#ea182c]" />
                  ))}
                </div>
                <div className="text-5xl md:text-6xl font-light text-[#ea182c] mb-2">{score.score}</div>
                <div className="text-xl text-white mb-1 text-center">
                  {score.wine}
                </div>
                <div className="text-base text-zinc-400 text-center">
                  {score.vintage} &bull; {score.reviewer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

