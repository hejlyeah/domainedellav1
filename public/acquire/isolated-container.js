/**
 * This script implements the eCellar integration in an isolated container
 * that doesn't interfere with React's virtual DOM.
 */

(function() {
  // Initialize the isolated container
  function initIsolatedContainer() {
    console.log('eCellar isolated container initializing', { 
      timestamp: new Date().toISOString(),
      location: window.location.href,
      documentReady: document.readyState
    });
    
    // Get the container element
    const container = document.getElementById('isolated-container');
    if (!container) {
      console.error('Isolated container not found', {
        allDivs: document.querySelectorAll('div').length,
        bodyChildren: document.body.children.length
      });
      return;
    }
    
    console.log('Found isolated container', {
      id: container.id,
      className: container.className,
      dataAttributes: {
        view: container.getAttribute('data-view'),
        slug: container.getAttribute('data-slug')
      }
    });
    
    // SIMPLIFIED APPROACH: Create a single wrapper element with data-ecp-wrapper
    // This matches the approach in the working ecellar-next-simple implementation
    container.innerHTML = '';
    container.setAttribute('data-ecp-wrapper', 'true');
    container.classList.add('ecp-wrapper');
    
    // Add padding to align with main navigation bar
    container.style.paddingLeft = '5%';
    container.style.paddingRight = '5%';
    container.style.maxWidth = '1400px';
    container.style.margin = '0 auto';
    
    console.log('eCellar container structure created', {
      container: {
        id: container.id,
        className: container.className,
        dataAttributes: {
          wrapper: container.getAttribute('data-ecp-wrapper'),
          view: container.getAttribute('data-view'),
          slug: container.getAttribute('data-slug')
        },
        style: {
          paddingLeft: container.style.paddingLeft,
          paddingRight: container.style.paddingRight,
          maxWidth: container.style.maxWidth,
          margin: container.style.margin
        }
      }
    });
    
    console.log('eCellar styles will be loaded via <link> tags in page.tsx');
    
    // Get URL parameters for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const slug = urlParams.get('slug');
    console.log('URL Parameters:', { 
      view, 
      slug, 
      fullUrl: window.location.href,
      allParams: Object.fromEntries(urlParams.entries())
    });
    
    // Define the error handler function
    const eCellarErrorHandler = function(event) {
      // Attempt to find the original target if available
      const targetElement = event.target || event.srcElement;
      const targetInfo = targetElement ? 
        { tag: targetElement.tagName, id: targetElement.id, class: targetElement.className } : 
        'N/A';

      // Enhanced error logging
      let logDetails = {
        message: event.message || 'No message',
        errorObject: 'No error object',
        source: event.filename || 'Unknown source',
        lineno: event.lineno || 'N/A',
        colno: event.colno || 'N/A',
        targetInfo,
        timestamp: new Date().toISOString(),
        location: window.location.href
      };

      if (event.error) {
        if (event.error.message || event.error.stack) {
          logDetails.errorObject = {
            message: event.error.message || 'No error message',
            stack: event.error.stack ? event.error.stack.substring(0, 300) + '...' : 'No stack trace'
          };
        } else {
          // If standard properties are missing, log the raw error object
          logDetails.errorObject = 'Non-standard error object (see raw details below)';
          logDetails.rawError = event.error; // Log the raw error object
        }
      }
      
      // Also log the raw event object if details seem sparse
      if (!event.message && !event.error) {
         logDetails.rawEvent = event;
      }

      console.error('eCellar isolated container caught generic error:', logDetails);
      
      // It's generally better *not* to stop propagation unless absolutely necessary,
      // as it can interfere with other error handling mechanisms (like React Error Boundaries).
      // Let's comment these out for now. If specific conflicts arise, we can reconsider.
      // event.stopPropagation(); 
      // event.preventDefault(); 
    };

    // Add the error listener
    window.addEventListener('error', eCellarErrorHandler, true); // Use capture phase

    // --- Add a cleanup function ---
    window.cleanupEcellarListeners = function() {
      console.log('Cleaning up eCellar global error listener.');
      window.removeEventListener('error', eCellarErrorHandler, true);
      delete window.cleanupEcellarListeners; // Clean up the cleanup function itself
      // Optional: Add cleanup for other listeners if they were added globally
      // document.removeEventListener('ecp:ready', ...);
      // document.removeEventListener('ecp:view', ...);
      // etc. 
    };
    // --- End cleanup function ---
    
    // Add tab functionality for product details
    function setupProductTabs() {
      console.log('Setting up product tabs');
      setTimeout(() => {
        const tabHeaders = document.querySelectorAll('.ecp-product-tab-header');
        console.log('Found tab headers:', {
          count: tabHeaders.length,
          elements: Array.from(tabHeaders).map(h => ({
            text: h.textContent,
            dataTab: h.getAttribute('data-tab'),
            isActive: h.classList.contains('active')
          }))
        });
        
        if (tabHeaders.length > 0) {
          tabHeaders.forEach(header => {
            header.addEventListener('click', function() {
              const tab = this.getAttribute('data-tab');
              console.log('Tab clicked:', {
                tab,
                text: this.textContent
              });
              
              // Remove active class from all headers and contents
              document.querySelectorAll('.ecp-product-tab-header').forEach(h => h.classList.remove('active'));
              document.querySelectorAll('.ecp-product-tab-content').forEach(c => c.classList.remove('active'));
              
              // Add active class to clicked header and corresponding content
              this.classList.add('active');
              const content = document.querySelector(`.ecp-product-tab-content[data-tab="${tab}"]`);
              if (content) {
                content.classList.add('active');
                console.log('Activated tab content:', {
                  tab,
                  contentFound: true
                });
              } else {
                console.error('Tab content not found:', {
                  tab,
                  selector: `.ecp-product-tab-content[data-tab="${tab}"]`
                });
              }
            });
          });
          console.log('Product tabs initialized');
        } else {
          // If tabs aren't found yet, try again in a moment
          console.log('No tab headers found, will retry');
          setTimeout(setupProductTabs, 500);
        }
      }, 1000);
    }
    
    // Add event listeners for eCellar events
    document.addEventListener('ecp:ready', function(e) {
      console.log('eCellar is ready:', e.detail);
      
      // Check if eCellar wrapper has content
      const wrapper = document.querySelector('[data-ecp-wrapper]');
      if (wrapper) {
        console.log('eCellar wrapper content:', {
          childCount: wrapper.children.length,
          innerHTML: wrapper.innerHTML.substring(0, 200) + '...',
          hasProducts: !!wrapper.querySelector('.ecp-products'),
          hasProduct: !!wrapper.querySelector('.ecp-product')
        });
      } else {
        console.error('eCellar wrapper not found after ready event');
      }
      
      // Initialize product tabs if needed
      setupProductTabs();
    });
    
    // Listen for view changes
    document.addEventListener('ecp:view', function(e) {
      console.log('eCellar view changed:', e.detail);
      // Re-initialize product tabs when view changes
      setupProductTabs();
    });
    
    // Listen for eCellar error event
    document.addEventListener('ecp:error', function(e) {
      console.error('eCellar error:', e.detail);
    });
    
    // Listen for template loaded event
    document.addEventListener('ecp:template', function(e) {
      console.log('eCellar template loaded:', {
        templateName: e.detail?.name || 'N/A',
        templateUrl: e.detail?.url || 'N/A',
        templateVersion: e.detail?.version || 'N/A',
        detail: e.detail // Log the full detail object for inspection
      });
    });
    
    document.addEventListener('ecp:template-error', function(e) {
      console.error('eCellar template error:', e.detail);
    });
  }
  
  // Run the initialization directly
  // Since the script is loaded 'beforeInteractive', the container should exist
  initIsolatedContainer();

})(); 