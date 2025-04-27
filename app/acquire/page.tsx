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
        // Reduced log noise for production
        // console.error('Could not update spacer height:', {
        //   headerExists: !!header,
        //   spacerExists: !!spacerRef.current
        // })
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
    // Removed this as pathRoot now has trailing slash and ecellar handles it
    // if (!window.location.pathname.endsWith('/') && !window.location.pathname.includes('.')) {
    //   const correctUrl = `${window.location.pathname}/${window.location.search}`
    //   console.log('Adding trailing slash for proper routing:', correctUrl)
    //   router.replace(correctUrl)
    // }

    return () => {
      window.removeEventListener('resize', updateSpacerHeight)
      console.log('Acquire page unmounted')
    }
  }, [searchParams, view, slug, router])

  // Effect to set eCellar options and listeners BEFORE loader.js runs
  useEffect(() => {
    console.log('Setting up eCellar config and listeners...');
    
    // Define configuration (moved from inline script)
    window.epubOptions = {
      APIKey: 'E5656435-E6AB-4D20-B936-87B7E23211D0', // Using the API key from the working implementation
      initQueryString: true,
      pathRoot: '/acquire/', // Ensure trailing slash
      cpv: 'v12', // Increment cache prevention value
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
    console.log('eCellar Configuration set via useEffect:', window.epubOptions);

    // Add event listeners (moved from isolated-container.js)
    const handleEcpReady = (e: Event) => {
      // Assert type to CustomEvent to access detail
      const customEvent = e as CustomEvent;
      console.log('eCellar is ready (via page component):', customEvent.detail);
      // Add any component-specific logic needed after eCellar loads
    };
    const handleEcpError = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.error('eCellar error (via page component):', customEvent.detail);
      setScriptError(`eCellar reported an error: ${JSON.stringify(customEvent.detail)}`);
    };
     const handleEcpTemplateError = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.error('eCellar template error (via page component):', customEvent.detail);
      // Potentially set error state here too
    };
     const handleEcpTemplateLoaded = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('eCellar template loaded (via page component):', customEvent.detail);
    };

    document.addEventListener('ecp:ready', handleEcpReady);
    document.addEventListener('ecp:error', handleEcpError);
    document.addEventListener('ecp:template-error', handleEcpTemplateError);
    document.addEventListener('ecp:template', handleEcpTemplateLoaded);
    console.log('eCellar event listeners added.');

    // Cleanup listeners on component unmount
    return () => {
      console.log('Cleaning up eCellar listeners.');
      document.removeEventListener('ecp:ready', handleEcpReady);
      document.removeEventListener('ecp:error', handleEcpError);
      document.removeEventListener('ecp:template-error', handleEcpTemplateError);
      document.removeEventListener('ecp:template', handleEcpTemplateLoaded);
      // We might not need to delete epubOptions, but good practice if state isn't preserved
      // delete window.epubOptions; 
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to update data attributes when URL parameters change (remains the same)
  useEffect(() => {
    if (containerRef.current) {
      // Update attributes directly here
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

  // Effect to monitor eCellar loading (remains useful for debugging)
  useEffect(() => {
    if (scriptLoaded) {
      console.log('eCellar loader.js script loaded, monitoring for initialization')
      
      // Optional: Monitor for content appearance
      // const observer = new MutationObserver((mutations) => { ... });
      // observer.observe(document.body, { childList: true, subtree: true });
      
      // Check for eCellar API availability
      const checkApiInterval = setInterval(() => {
        if (window.eCellarAPI) {
          console.log('eCellarAPI is now available')
          clearInterval(checkApiInterval)
        }
      }, 500)
      
      return () => {
        // observer?.disconnect();
        clearInterval(checkApiInterval)
      }
    }
  }, [scriptLoaded])

  const handleScriptLoad = () => {
    console.log('eCellar loader.js script load event fired')
    setScriptLoaded(true)
    setScriptError(null)
  }

  const handleScriptError = (e: any) => { // Changed type to 'any' to capture potential non-Error objects
    console.error('Error loading eCellar loader.js script:', e)
    // Try to get a more specific message if available
    const errorMessage = e?.message || (typeof e === 'string' ? e : 'Unknown error');
    setScriptError(`Failed to load eCellar script: ${errorMessage}`)
    setScriptLoaded(false)
  }

  // No need for the cleanup function effect, handled in listener effect
  // useEffect(() => { ... window.cleanupEcellarListeners ... }, []);

  return (
    <>
      <SiteHeader />

      {/* CSS links are now in layout.tsx */}

      {/* Dynamic spacer that adjusts to the height of the navbar */}
      <div ref={spacerRef} className="w-full"></div>
      
      {/* Container for eCellar */}
      {/* Added data-ecp-wrapper and class directly, removed isolated-container.js logic */}
      <div 
        ref={containerRef}
        id="isolated-container" // Keep ID for potential targeting
        className="ecp-wrapper w-full px-[5%] max-w-[1400px] mx-auto" // Added class and styles from isolated-container.js
        data-ecp-wrapper="true" // Add wrapper attribute
        data-view={view || ''} // View/slug are now set via useEffect
        data-slug={slug || ''}
        suppressHydrationWarning={true}
      >
        {scriptError && (
          <div className="p-10 text-center text-white">
            <h2 className="text-xl mb-4">Error loading wine store</h2>
            <p>{scriptError}</p>
          </div>
        )}
        {/* eCellar content will be injected here */}
      </div>

      {/* REMOVED: Inline script for epubOptions */}
      {/* <script dangerouslySetInnerHTML={{ __html: `...` }} /> */}

      {/* REMOVED: Script tag for isolated-container.js */}
      {/* <Script src="/acquire/isolated-container.js" ... /> */}
      
      {/* Load the eCellar loader script - MUST come AFTER the useEffect that sets epubOptions */}
      {/* 'afterInteractive' should be safe now as epubOptions is set reliably on mount */}
      <Script
        src="https://cdn.ecellar-rw.com/js/loader.js"
        strategy="afterInteractive" 
        key={`ecellar-loader-${view}-${slug}`} // Keying might still cause remounts on param change, maybe remove? Let's keep for now.
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </>
  )
}

// Add TypeScript interface for global window properties (remains useful)
declare global {
  interface Window {
    // eCellar configuration options
    epubOptions?: any;
    
    // eCellar API object added by the eCellar script
    eCellarAPI?: {
      navigate: (view: string, params: Record<string, string | null>) => void;
      getState: () => any;
      refreshCart: () => void;
      [key: string]: any;
    };

    // REMOVED: cleanupEcellarListeners is no longer needed/defined globally
    // cleanupEcellarListeners?: () => void; 
  }
}

