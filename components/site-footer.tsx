"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter } from "lucide-react"

const navigation = {
  main: [
    { name: "Acquire", href: "/acquire" },
    { name: "Story", href: "/story" },
    { name: "Wines", href: "/wines" },
    { name: "Visit", href: "/visit" },
    { name: "Join Us", href: "/join" },
    { name: "Member Login", href: "/login" },
  ],
  social: [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
    },
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
    },
  ],
}

export function SiteFooter() {
  const [email, setEmail] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="relative mt-32">
      <div className="mx-auto max-w-[95%] sm:max-w-[90%]">
        <div className="rounded-[40px] border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg">
          <div className="mx-auto px-6 pb-8 pt-12 sm:pt-16 lg:px-8 lg:pt-16">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              {/* Brand Column */}
              <div className="space-y-8">
                <div className="flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DomaineDella_Iris_Transparent-W8yTWLN3eGnZKudwbNvHLe3ys5v8Gk.png"
                    alt="Domaine Della Iris"
                    width={40}
                    height={53}
                    className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <p className="text-sm leading-6 text-zinc-300 text-center xl:text-left">
                  Crafting exceptional wines that express the unique terroir of our vineyards, where tradition meets
                  innovation in every bottle.
                </p>
                <div className="flex justify-center xl:justify-start space-x-6">
                  {navigation.social.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-zinc-400 hover:text-[#ea182c] transition-colors duration-200"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Column */}
              <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-white">Navigation</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.main.slice(0, 3).map((item) => {
                        const isAcquireLink = item.name === "Acquire"
                        const linkHref = isAcquireLink ? "/acquire/?view=categorieslist&slug=wines" : item.href
                        
                        return (
                          <li key={item.name}>
                            {isAcquireLink ? (
                              <a
                                href={linkHref}
                                className="text-sm leading-6 text-zinc-300 hover:text-[#ea182c] transition-colors duration-200"
                              >
                                {item.name}
                              </a>
                            ) : (
                              <Link
                                href={linkHref}
                                className="text-sm leading-6 text-zinc-300 hover:text-[#ea182c] transition-colors duration-200"
                              >
                                {item.name}
                              </Link>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.main.slice(3).map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="text-sm leading-6 text-zinc-300 hover:text-[#ea182c] transition-colors duration-200"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Newsletter Column */}
                <div className="md:grid md:grid-cols-1 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Stay updated with release dates, events, and exclusive offers.
                    </p>
                    <form className="mt-6 sm:flex sm:max-w-md" onSubmit={handleSubmit}>
                      <Input
                        type="email"
                        name="email-address"
                        id="email-address"
                        autoComplete="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full min-w-0 bg-white/5 px-4 text-white sm:text-sm sm:leading-6 border-zinc-700 focus-visible:ring-[#ea182c]"
                      />
                      <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                        <Button type="submit" className="bg-[#ea182c] text-white hover:bg-[#ea182c]/90 w-full">
                          Subscribe
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs leading-5 text-zinc-400">
                  &copy; {new Date().getFullYear()} Domaine Della. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <Link href="/privacy" className="text-xs leading-5 text-zinc-400 hover:text-[#ea182c]">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-xs leading-5 text-zinc-400 hover:text-[#ea182c]">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

