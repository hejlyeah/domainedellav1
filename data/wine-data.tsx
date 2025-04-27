import reviewsData from "./reviews.json"

// --- Types moved/defined here for static processing ---

type ReviewAward = {
  reviewer: string
  scoreStr: string
  scoreNum?: number | null
  excerpt: string
  vintage: string | number
  reviewedBy?: string
}

type AwardWithScore = ReviewAward & {
  numericScore: number
  logoPath?: string
}

type GroupedAwards = Record<
  string,
  { logoPath?: string; reviews: AwardWithScore[] }
>

// --- Helper functions moved here ---

// Helper function to parse scores like "94+"
const parseScore = (score: string): number => {
  if (typeof score !== "string") return 0 // Handle potential non-string scores
  const scoreString = score.trim()
  if (scoreString.endsWith("+")) {
    return parseFloat(scoreString.slice(0, -1)) + 0.5
  }
  return parseFloat(scoreString) || 0 // Return 0 if parsing fails
}

// Helper function to generate SVG/PNG logo path from critic name
const getCriticLogoPath = (criticName: string): string => {
  if (!criticName || typeof criticName !== "string") return ""
  
  // Reviewers to always fallback to text (no logo file exists)
  const noLogoReviewers = [
    "Greg Walters - Pinot Report", 
    "Wilfred Wong", 
    "Rusty Gaffney - PrinceofPinot"
  ];
  if (noLogoReviewers.includes(criticName)) {
    return ""; // Return empty path to force text fallback
  }
  
  // Specific reviewers using SVG
  const svgReviewers = ["Jeb Dunnuck", "The New Wine Review"];
  const extension = svgReviewers.includes(criticName) ? "svg" : "png";

  const slug = criticName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  
  return slug ? `/logos/${slug}.${extension}` : ""; // Use dynamic extension
}

// --- Original wine data structure ---

const baseWineData = {
  categories: [
    {
      name: "APPELLATION SERIES",
      wines: [
        {
          id: "russian-river-valley-pinot",
          name: "Russian River Valley Pinot Noir",
          appellation: "Russian River Valley",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.5%",
            production: "250 cases",
            fermentation: {
              vessel: "Open-top fermenters",
              aging: "16 months in French oak",
              coopers: ["Francois Freres", "Damy"],
            },
          },
          tastingNotes: [
            "Aromas of ripe cherry and plum",
            "Hints of spice and earth",
            "Silky tannins and a long finish",
          ],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02%20-%202023%20Domaine%20Della%20Russian%20River%20Valley%20Pinot%20Noir%20-%20Bottle%20Shot%20copy.png-QBWg9JGnQBe5aHu4TxQgZ8LL1251Bs.jpeg",
          criticLogos: {
            wilfredWong: "https://example.com/wilfred_wong_logo.png",
          },
        },
        {
          id: "sonoma-coast-pinot",
          name: "Sonoma Coast Pinot Noir",
          appellation: "Sonoma Coast",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.2%",
            production: "200 cases",
            fermentation: {
              vessel: "Stainless steel tanks",
              aging: "14 months in French oak",
              coopers: ["Remond", "Saury"],
            },
          },
          tastingNotes: [
            "Bright red fruit and floral notes",
            "Balanced acidity and a smooth texture",
            "Elegant and refined",
          ],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/03%20-%202023%20Domaine%20Della%20Sonoma%20Coast%20Pinot%20Noir%20-%20Bottle%20Shot.png-yoaUO9b9nY4wzgv8phr5lNtvqU2QG4.jpeg",
          criticLogos: {
            jebDunnuck: "https://example.com/jeb_dunnuck_logo.png",
          },
        },
        {
          id: "santa-lucia-highlands-pinot",
          name: "Santa Lucia Highlands Pinot Noir",
          appellation: "Santa Lucia Highlands",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.8%",
            production: "180 cases",
            fermentation: {
              vessel: "Concrete tanks",
              aging: "18 months in French oak",
              coopers: ["Taransaud", "Seguin Moreau"],
            },
          },
          tastingNotes: [
            "Dark fruit and earthy undertones",
            "Firm tannins and a complex structure",
            "Powerful and age-worthy",
          ],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04%20-%202023%20Domaine%20Della%20Santa%20Lucia%20Highlands%20Pinot%20Noir%20-%20Bottle%20Shot.png-VTEFQNz1q5mPRbpiFekEA7kky4EsCg.jpeg",
          criticLogos: {
            newWineReview: "https://example.com/new_wine_review_logo.png",
          },
        },
      ],
    },
    {
      name: "SINGLE VINEYARD SERIES",
      wines: [
        {
          id: "ritchie-vineyard",
          name: "\"Ritchie Vineyard\" RRV Chardonnay",
          appellation: "Russian River Valley",
          varietal: "Chardonnay",
          vintage: "2023",
          technicalNotes: {
            alcohol: "13.5%",
            production: "100 cases",
            fermentation: {
              vessel: "Stainless steel tanks",
              aging: "12 months in French oak",
              coopers: ["Francois Freres"],
            },
          },
          tastingNotes: ["Citrus and floral aromas", "Crisp acidity and a mineral finish", "Elegant and refreshing"],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05%20-%202023%20Domaine%20Della%20%22Ritchie%20Vineyard%22%20RRV%20Chardonnay%20-%20Bottle%20Shot.png-EAfHt0wXm8j5kPUd6bfJKCbbjFv7Cq.jpeg",
          criticLogos: {
            wineEnthusiast: "https://example.com/wine_enthusiast_logo.png",
          },
        },
        {
          id: "graham-family",
          name: "\"Graham Family Vineyard\" RRV Pinot Noir",
          appellation: "Russian River Valley",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.7%",
            production: "120 cases",
            fermentation: {
              vessel: "Open-top fermenters",
              aging: "17 months in French oak",
              coopers: ["Damy"],
            },
          },
          tastingNotes: ["Dark cherry and spice notes", "Full-bodied with firm tannins", "Long and complex finish"],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/06%20-%202023%20Domaine%20Della%20%22Graham%20Family%20Vineyard%22%20RRV%20Pinot%20Noir%20-%20Bottle%20Shot.png-VK70M6dBjOOT0owCrIfmV1IJht2RVS.jpeg",
          criticLogos: {
            wilfredWong: "https://example.com/wilfred_wong_logo.png",
          },
        },
        {
          id: "earl-stephens",
          name: "\"Earl Stephens Vineyard\" RRV Pinot Noir",
          appellation: "Russian River Valley",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.6%",
            production: "110 cases",
            fermentation: {
              vessel: "Stainless steel tanks",
              aging: "15 months in French oak",
              coopers: ["Remond"],
            },
          },
          tastingNotes: ["Red fruit and earthy aromas", "Balanced acidity and silky tannins", "Elegant and refined"],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/07%20-%202023%20Domaine%20Della%20%22Earl%20Stephens%20Vineyard%22%20RRV%20Pinot%20Noir%20-%20Bottle%20Shot.png-A0v6uLbsABZJf1mNvPpQqFp8Q13ELf.jpeg",
          criticLogos: {
            jebDunnuck: "https://example.com/jeb_dunnuck_logo.png",
          },
        },
        {
          id: "terra-de-promissio",
          name: "\"Terra de Promissio Vineyard\" SC Pinot Noir",
          appellation: "Sonoma Coast",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.9%",
            production: "90 cases",
            fermentation: {
              vessel: "Concrete tanks",
              aging: "19 months in French oak",
              coopers: ["Taransaud"],
            },
          },
          tastingNotes: [
            "Dark fruit and spice notes",
            "Firm tannins and a complex structure",
            "Powerful and age-worthy",
          ],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/08%20-%202023%20Domaine%20Della%20%22Terra%20de%20Promissio%20Vineyard%22%20SC%20Pinot%20Noir%20-%20Bottle%20Shot.png-I0AnRgCNDFlLNhkNzP9RnZMFqybPjb.jpeg",
          criticLogos: {
            newWineReview: "https://example.com/new_wine_review_logo.png",
          },
        },
        {
          id: "soberanes",
          name: "\"Soberanes Vineyard\" SLH Pinot Noir",
          appellation: "Santa Lucia Highlands",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.7%",
            production: "80 cases",
            fermentation: {
              vessel: "Open-top fermenters",
              aging: "17 months in French oak",
              coopers: ["Seguin Moreau"],
            },
          },
          tastingNotes: ["Red fruit and floral aromas", "Balanced acidity and silky tannins", "Elegant and refined"],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/09%20-%202023%20Domaine%20Della%20%22Soberanes%20Vineyard%22%20SLH%20Pinot%20Noir%20-%20Bottle%20Shot.png-gzdoi3Be9ZmbiT7qbwn8CeBK33nWBE.jpeg",
          criticLogos: {
            wineEnthusiast: "https://example.com/wine_enthusiast_logo.png",
          },
        },
      ],
    },
    {
      name: "SPECIAL BLEND",
      wines: [
        {
          id: "four-amours",
          name: "\"4 Amours\" Special Blend SC Pinot Noir",
          appellation: "Sonoma Coast",
          varietal: "Pinot Noir",
          vintage: "2023",
          technicalNotes: {
            alcohol: "14.5%",
            production: "60 cases",
            fermentation: {
              vessel: "Stainless steel tanks",
              aging: "16 months in French oak",
              coopers: ["Francois Freres", "Damy"],
            },
          },
          tastingNotes: ["Complex blend of red and dark fruits", "Spice and earthy notes", "Long and lingering finish"],
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10%20-%202023%20Domaine%20Della%20%224%20Amours%22%20Special%20Blend%20SC%20Pinot%20Noir%20-%20Bottle%20Shot.png-HoVuiQNMMD8m98BGOI3nnByY9TaLIT.jpeg",
          criticLogos: {
            wilfredWong: "https://example.com/wilfred_wong_logo.png",
          },
        },
      ],
    },
  ],
}

// --- Process reviews and add them to the base data ---

const allReviews = reviewsData as Record<string, ReviewAward[]>

const processedWineData = {
  ...baseWineData,
  categories: baseWineData.categories.map((category) => ({
    ...category,
    wines: category.wines.map((wine) => {
      const wineReviews = allReviews[wine.name] || []
      let topTwoAwards: AwardWithScore[] = []
      let allGroupedAwards: GroupedAwards = {}

      if (Array.isArray(wineReviews) && wineReviews.length > 0) {
        // 1. Filter reviews first (include score >= 93 check)
        const validReviews = wineReviews.filter((award) => {
          if (
            !award ||
            typeof award.scoreStr !== "string" ||
            award.scoreStr.trim() === ""
          ) {
            return false
          }
          const numericScore = parseScore(award.scoreStr)
          // Only keep reviews with a valid score (filtering moved to components)
          return !isNaN(numericScore)
        })

        // 2. Map the filtered, valid reviews
        const processedAwards: AwardWithScore[] = validReviews.map((award) => ({
          ...award,
          numericScore: parseScore(award.scoreStr),
          logoPath: getCriticLogoPath(award.reviewer),
        }))

        // 3. Sort the processed awards
        const sortedAwards = processedAwards.sort((a, b) => {
          if (b.numericScore !== a.numericScore) {
            return b.numericScore - a.numericScore
          }
          const vintageA = parseInt(String(a.vintage), 10) || 0
          const vintageB = parseInt(String(b.vintage), 10) || 0
          return vintageB - vintageA
        })

        // 4. Split and Group
        topTwoAwards = sortedAwards.slice(0, 2)

        // Group *all* sorted awards (including the top two)
        allGroupedAwards = sortedAwards.reduce((acc, award) => {
          const criticKey = award.reviewer
          if (!acc[criticKey]) {
            acc[criticKey] = { logoPath: award.logoPath, reviews: [] }
          }
          acc[criticKey].reviews.push(award)
          return acc
        }, {} as GroupedAwards)
      }

      return {
        ...wine, // Spread the original wine object
        // Remove criticLogos as it's not used anymore and logoPath is generated
        criticLogos: undefined, 
        topTwoAwards,
        allGroupedAwards, // Pass the newly named grouped data
      }
    }),
  })),
}

// Export the processed data
export const wineData = processedWineData;

