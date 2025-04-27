"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Star } from "lucide-react"
import React, { useState, useEffect } from "react"
import SiteHeader from "@/components/site-header"
import Image from "next/image"
import { googleReviewsData, Review } from "@/data/googleReviews"
import Script from "next/script"

// Filter out placeholder reviews before using the data
const filteredReviews = googleReviewsData.filter(
  (review) => 
    review.time !== "Placeholder Date" && 
    review.text !== "(No text provided in review)"
);

export default function Visit() {
  // Use the filtered data for the state
  const [reviews, setReviews] = React.useState<Review[]>(filteredReviews)
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [filteredTastings, setFilteredTastings] = useState<Tasting[]>([])

  const reserveRef = React.useRef<HTMLDivElement>(null)

  // Tock Initialization Script (moved here)
  const tockInitScript = `
    !function(t,o,c,k){if(!t.tock){var e=t.tock=function(){e.callMethod?
    e.callMethod.apply(e,arguments):e.queue.push(arguments)};t._tock||(t._tock=e),
    e.push=e,e.loaded=!0,e.version='1.0',e.queue=[];var f=o.createElement(c);f.async=!0,
    f.src=k;var g=o.getElementsByTagName(c)[0];g.parentNode.insertBefore(f,g)}}(
    window,document,'script','https://www.exploretock.com/tock.js');
    tock('init', 'domainedella');
  `;

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  const scrollToReserve = () => {
    const offset = 100 // Adjust this value based on your header height
    if (reserveRef.current) {
      const elementPosition = reserveRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <>
      {/* Tock Script loading specific to this page */}
      <Script id="tock-init" strategy="lazyOnload">
        {tockInitScript}
      </Script>

      {/* NEW: Full-width image container */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Domaine%20Della%20Barrel%20Shot.jpg-Cu3SCZ10c63TMvzYCbnT0K01b3U4Dn.jpeg"
          alt="Domaine Della wine barrel interior"
          fill
          className="object-cover"
          priority
        />
        {/* Optional: Add gradient overlay if needed */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /> */}
      </div>

      <SiteHeader />
      {/* REMOVED pt-28 from main */}
      <main className="relative min-h-screen pb-20">
        {/* NEW: Introduction section styled like Story/Vineyards page */}
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
                  Join Our Family at Domaine Della: A Personal Tasting Experience
                </h2>
                <div className="space-y-8 text-lg leading-relaxed text-zinc-200 text-center">
                  <p>
                    We warmly invite you to step into our world at Domaine Della, where every bottle reflects our
                    family's passion and our winemaker's personal touch. During this intimate tasting, led by the very
                    people who craft our small-lot Pinot Noir and Chardonnay, you'll explore the artistry behind our
                    wines, learn about our hands-on approach, and truly feel what sets Domaine Della apart. Come share
                    in our story, one sip at a time.
                  </p>
                  <p className="text-[#ea182c]">
                    For a more elevated perspective on our limited-production wines, experience a guided tasting
                    alongside our family and winemaker, where you'll gain insight into the nuanced techniques and
                    heartfelt dedication that define every glass of Domaine Della.
                  </p>

                  {/* Book Experience Button (using existing onClick) */}
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={scrollToReserve} // Kept existing function call
                      className="group inline-flex items-center px-8 py-3 border border-white text-white text-sm tracking-widest uppercase transition-all duration-200 hover:border-[#ea182c] hover:text-[#ea182c] rounded-full"
                    >
                      Book Your Experience
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ADDED mt-16 for spacing, REMOVED original intro section wrapper */}
        <div className="mx-auto max-w-[95%] sm:max-w-[90%] space-y-32 mt-16">
          {/* Reviews Section - Truly End to End */}
          <section className="w-full relative -mx-[calc(50vw-50%)] my-32">
            <div className="w-screen bg-black/[0.05] backdrop-blur-sm border-y border-white/10 py-12 space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-light text-white mb-4">What Our Guests Say: A Perfect 5-Star Record</h2>
                <div className="flex justify-center items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-[#ea182c] text-[#ea182c]" />
                    ))}
                  </div>
                  <span className="text-lg text-zinc-400">on Google Reviews</span>
                </div>
              </div>

              {/* First Row (Reverse Direction - Swapped) */}
              <div className="infinite-scroll-container">
                <div className="infinite-scroll-content-reverse"> {/* Swapped class */}
                  {reviews.map((review, index) => (
                    <div key={`first-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                        {/* Stars (Fixed) */}
                        <div className="flex items-center gap-1 mb-3 flex-shrink-0"> {/* Added flex-shrink-0 */}
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-first-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
                          ))}
                        </div>
                        {/* Name and Time (Fixed) */}
                        <p className="text-base font-semibold text-zinc-100 mb-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                          {review.author_name} - <span className="italic font-normal text-zinc-400">{review.time}</span>
                        </p>
                        {/* Scrollable Text Area */}
                        <div className="flex-grow overflow-y-auto review-text-scroll pr-2">
                          <p className="text-zinc-200">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate reviews 1 */}
                  {reviews.map((review, index) => (
                     <div key={`first-dup1-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                        <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-first-dup1-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
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
                   {/* Duplicate reviews 2 */}
                   {reviews.map((review, index) => (
                     <div key={`first-dup2-${index}`} className="review-card">
                      <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                       <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={`star-first-dup2-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
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

               {/* Second Row (Original Direction - Swapped) */}
               <div className="infinite-scroll-container">
                 <div className="infinite-scroll-content"> {/* Swapped class */}
                   {reviews.map((review, index) => (
                     <div key={`second-${index}`} className="review-card">
                       <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                         {/* Stars (Fixed) */}
                         <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                           {[...Array(review.rating)].map((_, i) => (
                             <Star key={`star-second-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
                           ))}
                         </div>
                         {/* Name and Time (Fixed) */}
                         <p className="text-base font-semibold text-zinc-100 mb-4 flex-shrink-0">
                          {review.author_name} - <span className="italic font-normal text-zinc-400">{review.time}</span>
                         </p>
                          {/* Scrollable Text Area */}
                          <div className="flex-grow overflow-y-auto review-text-scroll pr-2">
                              <p className="text-zinc-200">{review.text}</p>
                          </div>
                       </div>
                     </div>
                   ))}
                   {/* Duplicate reviews 1 */}
                   {reviews.map((review, index) => (
                     <div key={`second-dup1-${index}`} className="review-card">
                       <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                         <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                           {[...Array(review.rating)].map((_, i) => (
                             <Star key={`star-second-dup1-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
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
                    {/* Duplicate reviews 2 */}
                    {reviews.map((review, index) => (
                      <div key={`second-dup2-${index}`} className="review-card">
                       <div className="mx-2 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col h-full">
                         <div className="flex items-center gap-1 mb-3 flex-shrink-0">
                           {[...Array(review.rating)].map((_, i) => (
                             <Star key={`star-second-dup2-${index}-${i}`} className="w-5 h-5 fill-[#ea182c] text-[#ea182c]" />
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

          {/* Reservation Section */}
          <section ref={reserveRef} className="scroll-mt-32">
            <motion.div
              className="rounded-[40px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Text Content */}
                <div className="lg:w-1/2 px-6 py-12 md:py-16">
                  <div className="max-w-xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center lg:text-left">
                      Reserve your Tasting
                    </h1>
                    <div className="space-y-6 text-lg leading-relaxed">
                      <p className="text-center lg:text-left text-zinc-200">
                        We welcome our list members and their guests by appointment only. Reservations are typically
                        made 6 weeks in advance.
                      </p>
                      <p className="text-center lg:text-left text-zinc-200">
                        Choose your reservation below for an 80 minute immersive experience inside our winery and
                        discover how Domaine Della crafts its artisan, critically-acclaimed, distinctive Pinot Noir and
                        Chardonnay.
                      </p>
                      <p className="text-center lg:text-left text-zinc-200">
                        Your visit with us will include a tour of the winery, followed by a seated tasting flight of our
                        most current release led by a member of our winemaking team. Tasting Fee covers parties of 1 to
                        8 people.
                      </p>
                      <p className="text-center lg:text-left text-[#ea182c]">We look forward to hosting you!</p>

                      {/* Tock Widget Placeholder (Replaces Reserve Now Button) */}
                      <div className="pt-6 flex justify-center lg:justify-start">
                        {isClientMounted && (
                          <div 
                            id="Tock_widget_container" 
                            data-tock-display-mode="Button" 
                            data-tock-color-mode="Blue" 
                            data-tock-locale="en-us" 
                            data-tock-timezone="America/Los_Angeles"
                          ></div>
                        )}
                      </div>
                      <div className="pt-8">
                        <p className="text-sm italic text-center lg:text-left text-zinc-400">
                          Please note we require at least 48 hours notice prior to the date of your booking for any
                          cancellations or changes to reservations. Tasting fees are never waived or applied to
                          purchases. Thank you!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Glasses%20small%20copy.jpg-Pfrz5r9FW10Ry9Kqy2EBfpJVSdJT6G.jpeg"
                      alt="Wine glasses arranged on burgundy tablecloth"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:from-zinc-950/90 lg:via-transparent lg:to-transparent"
                      style={{ mixBlendMode: "multiply" }}
                    />
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

