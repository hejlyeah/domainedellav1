"use client"

import React, { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { useSearchParams, useRouter } from "next/navigation"
import SiteHeader from "@/components/site-header"

export default function Acquire() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  // Get the view and slug from URL parameters
  const view = searchParams.get('view')
  const slug = searchParams.get('slug')

  useEffect(() => {
    // Function to update the spacer height based on navbar height
    const updateSpacerHeight = () => {
      const header = document.querySelector('header')
      if (header && spacerRef.current) {
        const headerBottom = header.getBoundingClientRect().bottom
        spacerRef.current.style.height = `${headerBottom}px`
        // console.log('Updated spacer height:', {
        //   headerBottom,
        //   spacerHeight: spacerRef.current.style.height
        // })
      } else {
        console.error('Could not update spacer height:', {
          headerExists: !!header,
          spacerExists: !!spacerRef.current
        })
      }
    }

    // Initial update
    updateSpacerHeight()

    // Update on resize
    window.addEventListener('resize', updateSpacerHeight)

    // Log URL parameters for debugging
    console.log('Acquire page mounted with params:', { 
      view, 
      slug, 
      fullUrl: window.location.href,
      searchParams: Object.fromEntries(searchParams.entries()),
      pathname: window.location.pathname,
      search: window.location.search
    })

    // Fix for incorrect URL format (when users access /acquire/view=... instead of /acquire/?view=...)
    if (window.location.pathname.includes('/view=') || window.location.pathname.includes('/slug=')) {
      const pathParts = window.location.pathname.split('/')
      const incorrectPart = pathParts.find(part => part.includes('view=') || part.includes('slug='))
      if (incorrectPart) {
        const correctUrl = `/acquire/?${incorrectPart}`
        console.log('Redirecting to correct URL format:', correctUrl)
        router.replace(correctUrl)
      }
    }

    // Ensure trailing slash for proper routing
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('.')) {
      const correctUrl = `${window.location.pathname}/${window.location.search}`
      console.log('Adding trailing slash for proper routing:', correctUrl)
      router.replace(correctUrl)
    }

    return () => {
      window.removeEventListener('resize', updateSpacerHeight)
      console.log('Acquire page unmounted')
    }
  }, [searchParams, view, slug, router])

  // Effect to update data attributes when URL parameters change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-view', view || '')
      containerRef.current.setAttribute('data-slug', slug || '')
      console.log('Updated container data attributes:', { 
        view, 
        slug,
        containerView: containerRef.current.getAttribute('data-view'),
        containerSlug: containerRef.current.getAttribute('data-slug')
      })
    } else {
      console.error('Container ref not found when updating data attributes')
    }
  }, [view, slug])

  // Effect to monitor eCellar loading
  useEffect(() => {
    if (scriptLoaded) {
      console.log('eCellar script loaded, monitoring for initialization')
      
      // Set up a MutationObserver to detect when eCellar content appears
      const observer = new MutationObserver((mutations) => {
        // Check for eCellar content
        const ecContent = document.querySelector('.ecp-products, .ecp-product, .ecp-sidecart')
        if (ecContent) {
          console.log('eCellar content detected in DOM:', {
            type: ecContent.className,
            parent: ecContent.parentElement?.className || 'none'
          })
        }
      })
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      })
      
      // Check for eCellar API availability
      const checkApiInterval = setInterval(() => {
        if (window.eCellarAPI) {
          console.log('eCellarAPI is now available')
          clearInterval(checkApiInterval)
        }
      }, 500)
      
      // Clean up
      return () => {
        observer.disconnect()
        clearInterval(checkApiInterval)
      }
    }
  }, [scriptLoaded])

  const handleScriptLoad = () => {
    console.log('eCellar script loaded')
    setScriptLoaded(true)
    setScriptError(null)
  }

  const handleScriptError = (e: Error) => {
    console.error('Error loading eCellar script:', e)
    setScriptError(e.message)
    setScriptLoaded(false)
  }

  // Call cleanup function on component unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (window.cleanupEcellarListeners) {
        window.cleanupEcellarListeners();
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return (
    <>
      <SiteHeader />

      {/* Add eCellar CSS links here - Load base theme first, then our custom overrides */}
      {/* REMOVED: CSS links moved to layout.tsx */}
      {/* <link rel="stylesheet" type="text/css" href="https://cdn.ecellar-rw.com/1/css/ecp-theme.css" /> */}
      {/* Load custom styles LAST to ensure overrides work. ecellar-custom.css imports ecellar-products.css */}
      {/* <link rel="stylesheet" type="text/css" href="/acquire/styles/ecellar-custom.css" /> */}
      {/* <link rel="stylesheet" type="text/css" href="/acquire/styles/ecellar-products.css" /> */}

      {/* Dynamic spacer that adjusts to the height of the navbar */}
      <div ref={spacerRef} className="w-full"></div>
      
      {/* Container for eCellar */}
      <div 
        ref={containerRef}
        id="isolated-container"
        className="w-full"
        data-view={view || ''}
        data-slug={slug || ''}
        suppressHydrationWarning={true}
      >
        {scriptError && (
          <div className="p-10 text-center text-white">
            <h2 className="text-xl mb-4">Error loading wine store</h2>
            <p>{scriptError}</p>
          </div>
        )}
      </div>

      {/* Define eCellar configuration globally BEFORE any scripts run */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.epubOptions = {
              APIKey: 'E5656435-E6AB-4D20-B936-87B7E23211D0', // Using the API key from the working implementation
              initQueryString: true,
              pathRoot: '/acquire/', // Ensure trailing slash
              cpv: 'v11', // Increment cache prevention value (just in case)
              debug: true, // Enable debug mode
              addTemplates: [
                { 
                  "cart": {
                    "en": {
                      "SideCart": { "url": "/acquire/templates/cart/SideCart.html", "version": "1.1" }
                    }
                  },
                  "product": {
                    "en": {
                      "Product": { "url": "/acquire/templates/product/Product.html", "version": "1.1" },
                      "Product__Option": { "url": "/acquire/templates/product/Product__Option.html", "version": "1.1" },
                      "Product__Related": { "url": "/acquire/templates/product/Product__Related.html", "version": "1.1" }
                    }
                  },
                  "products": {
                    "en": {
                      "Products": { "url": "/acquire/templates/category/Products.html", "version": "1.1" },
                      "Products__Product": { "url": "/acquire/templates/category/Products__Product.html", "version": "1.1" },
                      "Products__Page": { "url": "/acquire/templates/category/Products__Page.html", "version": "1.1" }
                    }
                  },
                  "categorywithproducts": {
                    "en": {
                      "CategoryWithProducts__Product": { "url": "/acquire/templates/category/CategoryWithProducts__Product.html", "version": "1.6" },
                      "CategoryWithProducts_Option": { "url": "/acquire/templates/category/CategoryWithProducts_Option.html", "version": "1.6" }
                    }
                  },
                  "categorieslist": {
                    "en": {
                      "CategoriesList__Product": { "url": "/acquire/templates/category/CategoriesList__Product.html", "version": "1.6" }
                    }
                  },
                  "allocationcart": {
                    "en": {
                      "AllocationCart": { "url": "/acquire/templates/allocation/AllocationCart.html", "version": "1.1" },
                      "AllocationCart__Product": { "url": "/acquire/templates/allocation/AllocationCart__Product.html", "version": "1.1" },
                      "AllocationCart__Product__Variant": { "url": "/acquire/templates/allocation/AllocationCart__Product__Variant.html", "version": "1.1" },
                      "AllocationUnavailable": { "url": "/acquire/templates/allocation/AllocationUnavailable.html", "version": "1.1" }
                    }
                  }
                }
              ]
            };
            console.log('eCellar Configuration set inline:', window.epubOptions);
          `,
        }}
      />

      {/* Load the isolated container script EARLIER */}
      <Script
        src="/acquire/isolated-container.js"
        strategy="beforeInteractive"
        key={`isolated-container-${view}-${slug}`}
        onLoad={() => console.log('Isolated container script loaded (beforeInteractive)')}
        onError={(e) => console.error('Error loading isolated container script:', e)}
      />
      
      {/* Then load the eCellar loader script */}
      <Script
        src="https://cdn.ecellar-rw.com/js/loader.js"
        strategy="afterInteractive"
        key={`ecellar-loader-${view}-${slug}`}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </>
  )
}

// Add TypeScript interface for global window properties
declare global {
  interface Window {
    // eCellar configuration options
    epubOptions?: any;
    
    // eCellar API object added by the eCellar script
    eCellarAPI?: {
      // Navigate to a specific eCellar view with optional parameters
      navigate: (view: string, params: Record<string, string | null>) => void;
      
      // Get the current eCellar state
      getState: () => any;
      
      // Refresh the cart display
      refreshCart: () => void;
      
      // Allow for additional properties
      [key: string]: any;
    };

    // Optional cleanup function added by isolated-container.js
    cleanupEcellarListeners?: () => void;
  }
}

