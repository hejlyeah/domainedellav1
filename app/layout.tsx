import type React from "react"
import { Inter } from "next/font/google"
import Script from "next/script"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      style={{ 
        scrollBehavior: "auto", 
        "--header-height": "64px" 
      }}
    >
      <head>
        {/* Add meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* eCellar CSS - Load base theme first, then custom overrides */}
        <link rel="stylesheet" type="text/css" href="https://cdn.ecellar-rw.com/1/css/ecp-theme.css" />
        <link rel="stylesheet" type="text/css" href="/acquire/styles/ecellar-custom.css" />
        <link rel="stylesheet" type="text/css" href="/acquire/styles/ecellar-products.css" />
        
        {/* Tock Initialization Script was removed from here */}
      </head>
      <body className={inter.className}>
        <Script id="header-height-init" strategy="beforeInteractive">
          {`
          // Initialize header height CSS variable
          (function() {
            // Set a default header height
            document.documentElement.style.setProperty('--header-height', '64px');
            
            // Update header height on resize
            window.addEventListener('resize', function() {
              const header = document.querySelector('header');
              if (header) {
                const height = header.offsetHeight;
                document.documentElement.style.setProperty('--header-height', height + 'px');
              }
            });
          })();
          `}
        </Script>
        <ScrollToTop />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
