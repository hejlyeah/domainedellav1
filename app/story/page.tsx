"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { StoryTimelineNav } from "@/components/story-timeline-nav"
import SiteHeader from "@/components/site-header"

// Add this component above the Story component
function StoryHeader() {
  const [showTimelineNav, setShowTimelineNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Get the intro section by its ID instead of using first-of-type
      const introSection = document.getElementById("lifelong-pursuit-section")
      if (introSection) {
        // Get the exact position where the intro section ends
        const { bottom } = introSection.getBoundingClientRect()
        // Get the header height
        const headerHeight = Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
          10,
        )

        // Show timeline nav when we've scrolled past the intro section
        // Add a small buffer (5px) to ensure smooth transition
        setShowTimelineNav(bottom < headerHeight + 5)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <SiteHeader showTimelineNav={showTimelineNav} />
}

// Define story content
const storyContent = {
  introduction: [
    {
      text: "Domaine Della is an homage to the indomitable spirit of Della, a woman of extraordinary resilience and love who shaped the foundation of our family's journey.",
      isHighlighted: true,
    },
    {
      text: "Della was more than a matriarch; she was a visionary. Della raised eleven children in a humble two-bedroom home in Lincoln, Nebraska; her remarkable ability to foster unity and compassion amidst adversity remains a guiding light for our family. Her ethos, rooted in the belief of love and in seizing one's dreams, whatever the circumstances, resonates through the very soul of our winery.",
      isHighlighted: false,
    },
    {
      text: "For David, the genesis of his wine odyssey traces back to his formative years, where he honed his palate as a waiter, sommelier, and chef, before finding enlightenment in the enchanting streets of Paris. Immersed in the city's rich tapestry of wine, cuisine, and culture, he experienced a profound awakening that would shape his destiny.",
      isHighlighted: false,
    },
    {
      text: "In 2010, David embarked on his winemaking venture, crafting our inaugural vintage in the intimate setting of our new homemade cellar. This labor of love ignited a passion that would propel him to leave private equity and assume the helm at Kosta Browne before ultimately dedicating himself completely to Domaine Della – crafting wine in honor of family and his mother – Della.",
      isHighlighted: false,
    },
    {
      type: "combined",
      content: {
        highlighted: "Della's legacy was a legacy of courage, passion, and unwavering love. ",
        regular:
          "In Domaine Della, her spirit lives on, an eternal testament to the power of dreams and the enduring bonds of family and tradition. We are grateful to our family, friends, and many mentors who have guided and supported us in our lifelong pursuit of crafting the perfect wine. With every glass raised in celebration, we honor Della's legacy and the values she held dear.",
      },
    },
    {
      text: "Our wines are made with passion, obsession, and love to celebrate what we live for. Our joy is to play a part in making your life experiences and special moments memorable by taking your breath away—always, now, and forever.",
      isHighlighted: true,
    },
    {
      text: "Onwards and Upwards,",
      isHighlighted: false,
    },
  ],
}

// Define timeline sections
const timelineSections = [
  {
    id: "early-years",
    title: "The Early Years",
    period: "1930s",
    images: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Della's portrait", caption: "Della in her youth" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Family home", caption: "The family home in Nebraska" },
    ],
  },
  {
    id: "family-grows",
    title: "A Growing Family",
    period: "1940s - 1950s",
    images: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Della with children", caption: "Della with her children" },
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "Family gathering",
        caption: "Family gathering in Nebraska",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "Nebraska home",
        caption: "The two-bedroom home in Lincoln",
      },
    ],
  },
  {
    id: "inspiration",
    title: "Finding Inspiration",
    period: "1970s - 1980s",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "David as sommelier",
        caption: "David working as a sommelier",
      },
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "Paris streets",
        caption: "The streets of Paris where inspiration struck",
      },
    ],
  },
  {
    id: "first-vintage",
    title: "First Vintage",
    period: "2010",
    images: [
      { src: "/placeholder.svg?height=600&width=800", alt: "First vintage", caption: "Crafting the first vintage" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Homemade cellar", caption: "The original homemade cellar" },
    ],
  },
  {
    id: "kosta-browne",
    title: "The Kosta Browne Years",
    period: "2010 - 2015",
    images: [
      { src: "/placeholder.svg?height=600&width=800", alt: "Kosta Browne", caption: "David's time at Kosta Browne" },
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "Wine production",
        caption: "Learning and growing at Kosta Browne",
      },
    ],
  },
  {
    id: "domaine-della",
    title: "Domaine Della Today",
    period: "2015 - Present",
    images: [
      {
        src: "/placeholder.svg?height=600&width=800",
        alt: "Modern winery",
        caption: "Our current winemaking facility",
      },
      { src: "/placeholder.svg?height=600&width=800", alt: "Wine barrels", caption: "Aging in French oak barrels" },
      { src: "/placeholder.svg?height=600&width=800", alt: "Vineyard", caption: "Our vineyard sources today" },
    ],
  },
]

export default function Story() {
  // Keep existing state and refs
  const [showTimeline, setShowTimeline] = useState(false)
  const introSectionRef = useRef<HTMLDivElement>(null)
  const timelineSectionRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Initialize section refs
  useEffect(() => {
    sectionRefs.current = Array(timelineSections.length).fill(null)
  }, [])

  // Add scroll listener to check when we've reached the first timeline section
  useEffect(() => {
    const handleScroll = () => {
      // Get the intro section by its ID
      const introSection = document.getElementById("lifelong-pursuit-section")
      // Get the timeline container
      const timelineContainer = timelineSectionRef.current

      if (introSection && timelineContainer) {
        const { bottom: introBottom } = introSection.getBoundingClientRect()
        const { top: timelineTop } = timelineContainer.getBoundingClientRect()

        // Get the header height
        const headerHeight = Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "64",
          10,
        )

        // Show timeline when we've scrolled past the intro section
        // and are approaching the timeline sections
        setShowTimeline(introBottom < headerHeight + 5)

        // Update scroll margin for all timeline sections
        const scrollMargin = headerHeight + 48 // header + approximate nav height
        document.documentElement.style.setProperty("--scroll-margin", `${scrollMargin}px`)
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <StoryHeader />
      <main className="relative min-h-screen pt-28 pb-20">
        {/* Timeline Navigation - now with visibility control */}
        <StoryTimelineNav sections={timelineSections} isVisible={showTimeline} />

        {/* Video Section with Dynamic Spacers */}
        <section className="w-full relative">
          {/* Top Dynamic Spacer (smaller) */}
          <div className="story-video-spacer-top"></div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="story-vimeo-container">
              <iframe
                src="https://player.vimeo.com/video/1052672948?h=3a5494b8ce&title=0&byline=0&portrait=0"
                className="story-vimeo-iframe"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Domaine Della Story"
              ></iframe>
            </div>
          </motion.div>

          {/* Bottom Dynamic Spacer (larger) */}
          <div className="story-video-spacer-bottom"></div>
        </section>

        {/* Full-width Story Introduction Section */}
        <section id="lifelong-pursuit-section" ref={introSectionRef} className="w-full">
          <motion.div
            className="w-full bg-zinc-950/90 backdrop-blur-xl border-y border-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-6 py-12 md:py-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center">
                  A Lifelong Pursuit – In Honor Of Family
                </h1>
                <div className="space-y-6 text-lg leading-relaxed">
                  {storyContent.introduction.map((paragraph, idx) => {
                    if (paragraph.type === "combined") {
                      return (
                        <p key={idx} className="text-center">
                          <span className="text-[#ea182c]">{paragraph.content.highlighted}</span>
                          <span className="text-zinc-200">{paragraph.content.regular}</span>
                        </p>
                      )
                    }
                    return (
                      <p
                        key={idx}
                        className={`text-center ${paragraph.isHighlighted ? "text-[#ea182c]" : "text-zinc-200"}`}
                      >
                        {paragraph.text}
                      </p>
                    )
                  })}
                </div>
                <div className="mt-12 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Label_Signature_White_Transparent-zIDE4xtbI5yvetQZZv3IeIjoU4izRa.png"
                    alt="David Hejl, Winemaker Signature"
                    width={400}
                    height={100}
                    className="opacity-80"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Timeline Sections - contained within max-width */}
        <div ref={timelineSectionRef} className="mx-auto max-w-[95%] sm:max-w-[90%] space-y-32 mt-32">
          <section className="space-y-32">
            {timelineSections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="rounded-[40px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg"
                style={{ scrollMarginTop: "var(--scroll-margin, 112px)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="px-6 py-12 md:py-16">
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-6">{section.title}</h2>
                    {section.period && <p className="text-lg text-[#ea182c] mb-12">{section.period}</p>}

                    {/* Photo Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.images.map((image, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-lg">
                          <div className="aspect-w-4 aspect-h-3 relative">
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm font-medium">{image.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      </main>
    </>
  )
}

