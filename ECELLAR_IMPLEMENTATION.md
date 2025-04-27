# eCellar Integration: WordPress vs Next.js Implementation Analysis

## 1. Overview of Current Implementations

This document analyzes how the working WordPress implementation loads eCellar compared to the current Next.js implementation, and provides best practices for the dd_new_new project.

### 1.1 Quick Comparison

| Feature | Working WordPress Implementation | Current Next.js Implementation |
|---------|----------------------------------|--------------------------------|
| Integration Method | Direct DOM manipulation | Isolated container approach |
| Script Loading | Simple script tags in footer | Next.js Script component with loading states |
| DOM Structure | Simple `data-ecp-wrapper` div | Isolated container with complex initialization |
| Style Management | WordPress enqueued styles + CDN | Dynamically added stylesheets |
| Error Handling | Minimal (eCellar native) | Enhanced with React error boundaries |

## 2. WordPress Working Implementation Analysis

### 2.1 DOM Structure & Initialization

The working WordPress implementation follows these basic steps:

1. **Container Element**: Adds a simple `<div data-ecp-wrapper="true" class="ecp-wrapper"></div>` directly in the page template
2. **Configuration**: Defines `epubOptions` object in the `<head>` section:
   ```javascript
   <script>
     epubOptions = {
       APIKey: 'E5656435-E6AB-4D20-B936-87B7E23211D0',
       initQueryString: true,
       pathRoot: '/shop/',
       // Additional configuration options
     };
   </script>
   ```
3. **Style Loading**: Adds the eCellar default CSS in the `<head>`:
   ```html
   <link rel="stylesheet" type="text/css" href="https://cdn.ecellar-rw.com/1/css/ecp-theme.css" />
   ```
4. **Script Loading**: Loads the main eCellar script at the end of the `<body>`:
   ```html
   <script src="https://cdn.ecellar-rw.com/js/loader.js"></script>
   ```

### 2.2 Template Customization

The WordPress implementation registers custom templates by setting paths in the `epubOptions`:

```javascript
addTemplates: [
  { 
    "products": {
      "en": {            
        "CategoryWithProducts__Product": {
          "url": "/wp-content/themes/domainedella/templates/CategoryWithProducts__Product.html"
        },
        // Other templates...
      }
    }
  }
]
```

### 2.3 Key Insights from WordPress Implementation

1. **Simplicity**: The WordPress implementation is notably simple with minimal interference
2. **Direct DOM Access**: eCellar has direct access to modify the DOM
3. **Minimal Custom Code**: Very little custom JavaScript beyond the initial configuration
4. **Linear Loading**: Script and styles are loaded in a predictable sequence

## 3. Next.js dd_new_new Implementation

### 3.1 Current Approach

The dd_new_new project uses an isolated container approach:

1. **Isolated Container**: Creates a container that doesn't interfere with React's virtual DOM:
   ```html
   <div id="isolated-container" data-view="..." data-slug="..."></div>
   ```

2. **Script Management**: Uses Next.js Script components to load scripts:
   ```jsx
   <Script 
     src="/acquire/isolated-container.js"
     strategy="afterInteractive"
     key={`isolated-container-${view}-${slug}`}
     onLoad={() => console.log('Isolated container script loaded')}
     onError={(e) => console.error('Error loading isolated container script:', e)}
   />
   
   <Script 
     src="https://cdn.ecellar-rw.com/js/loader.js"
     strategy="afterInteractive"
     key={`ecellar-loader-${view}-${slug}`}
     onLoad={handleScriptLoad}
     onError={handleScriptError}
   />
   ```

3. **Dynamic Initialization**: The isolated-container.js script:
   - Gets the container element
   - Adds data attributes (`data-ecp-wrapper="true"`)
   - Adds CSS classes (`ecp-wrapper`)
   - Dynamically loads CSS stylesheets
   - Sets up the eCellar configuration
   - Adds event listeners for eCellar events

### 3.2 Potential Issues with the Current Next.js Approach

1. **Timing Issues**: React's rendering cycle may interfere with eCellar initialization
2. **Complex Initialization**: Extra code in isolated-container.js adds complexity
3. **Script Dependencies**: The order of script loading is critical but more complex in Next.js
4. **DOM Manipulation Conflicts**: React's virtual DOM and eCellar's direct DOM manipulation may conflict

## 4. Best Practices for dd_new_new Project

Based on the working WordPress implementation and eCellar setup guidelines, here are the recommended best practices for the dd_new_new project:

### 4.1 Simplify the Container Approach

Follow the WordPress model more closely:

1. **Dedicated Container Page**: Create a dedicated route in Next.js for the eCellar shop (/acquire)
2. **Direct Wrapper Element**: Use a simpler wrapper structure:
   ```jsx
   // In app/acquire/page.tsx
   <div data-ecp-wrapper="true" className="ecp-wrapper" id="isolated-container"></div>
   ```

### 4.2 Configuration Approach

Simplify the configuration by following these best practices:

1. **Direct Configuration**: Set `window.epubOptions` directly in a client component:
   ```jsx
   useEffect(() => {
     window.epubOptions = {
       APIKey: 'E5656435-E6AB-4D20-B936-87B7E23211D0',
       initQueryString: true,
       pathRoot: '/acquire/',
       cpv: 'v1', // Cache prevention value
       addTemplates: [
         // Template configuration
       ]
     };
   }, []);
   ```

2. **Minimal DOM Manipulation**: Avoid excessive DOM manipulation in the initialization

### 4.3 Script and Style Loading

Optimize the loading sequence:

1. **Style First**: Load eCellar styles in the `<head>` using Next.js `<Head>` component
2. **Script Loading**: Use `next/script` with proper sequencing:
   ```jsx
   <Script 
     src="https://cdn.ecellar-rw.com/js/loader.js"
     strategy="afterInteractive"
     onLoad={() => console.log('eCellar script loaded')}
     onError={(e) => setScriptError('Failed to load eCellar: ' + e)}
   />
   ```

### 4.4 Event Handling

Set up minimal event handlers for critical eCellar events:

```jsx
useEffect(() => {
  const handleEcpReady = (e) => {
    console.log('eCellar is ready:', e.detail);
  };
  
  const handleEcpError = (e) => {
    console.error('eCellar error:', e.detail);
  };
  
  document.addEventListener('ecp:ready', handleEcpReady);
  document.addEventListener('ecp:error', handleEcpError);
  
  return () => {
    document.removeEventListener('ecp:ready', handleEcpReady);
    document.removeEventListener('ecp:error', handleEcpError);
  };
}, []);
```

### 4.5 URL Parameter Handling

Properly handle eCellar view parameters:

```jsx
// In app/acquire/page.tsx
const searchParams = useSearchParams();
const view = searchParams.get('view');
const slug = searchParams.get('slug');

// Pass these to the container
<div 
  data-ecp-wrapper="true" 
  className="ecp-wrapper"
  data-view={view || ''} 
  data-slug={slug || ''}
></div>
```

### 4.6 Custom Templates

Follow the WordPress approach for custom templates by keeping the structure simple:

```javascript
addTemplates: [
  { 
    "products": {
      "en": {            
        "CategoryWithProducts__Product": {
          "url": "/acquire/templates/CategoryWithProducts__Product.html",
          "version": "1.0"
        },
        // Other templates
      }
    }
  }
]
```

## 5. Implementation Checklist for dd_new_new

Follow this checklist to implement eCellar in the dd_new_new project:

1. **Container Setup**:
   - [ ] Create a dedicated route for eCellar (/acquire)
   - [ ] Use a simple wrapper div with `data-ecp-wrapper="true"` attribute
   - [ ] Set appropriate view and slug data attributes

2. **Configuration**:
   - [ ] Set up window.epubOptions with the correct API key
   - [ ] Configure path root, template locations, and other settings
   - [ ] Set initQueryString to true to enable deep linking

3. **Style Loading**:
   - [ ] Load the default eCellar CSS from CDN
   - [ ] Load custom CSS for eCellar templates

4. **Script Loading**:
   - [ ] Load the eCellar script at the appropriate time
   - [ ] Handle loading errors gracefully

5. **Event Handling**:
   - [ ] Set up handlers for ecp:ready, ecp:error, and other events
   - [ ] Implement error boundaries for eCellar container

6. **Testing**:
   - [ ] Test with common view parameters (products, cart, etc.)
   - [ ] Verify template loading and rendering
   - [ ] Test adding products to cart and checkout process

## 6. Troubleshooting & Common Pitfalls

### 6.1 Grid Layout Not Applying to Specific Views (e.g., Allocation Cart)

*   **Symptom:** A view that should display products in a grid (like the allocation cart or category pages) renders them as a list or block elements, even though `display: grid` rules exist in the custom CSS.
*   **Investigation:**
    1.  **Verify CSS:** Confirm that the CSS file (`ecellar-custom.css` or `ecellar-products.css`) contains the necessary `display: grid` rules for the intended view.
    2.  **Inspect Rendered HTML:** Use browser developer tools (Elements/Inspector tab) to examine the *actual* HTML structure rendered for the product list container in the problematic view (e.g., allocation).
    3.  **Check `data-ecp-handle`:** Pay close attention to the `data-ecp-handle` attribute on the product list container element. **Crucially, different eCellar views may use different handles.** For example, category views often use `data-ecp-handle="products"`, while the allocation cart view might use `data-ecp-handle="allocated_products"`.
    4.  **Check Classes/IDs:** Note the specific classes and IDs on the container and its relevant parent elements.
    5.  **Compare Template:** Compare the inspected HTML structure with the corresponding template file (e.g., `public/acquire/templates/allocation/AllocationCart.html`).
    6.  **Compare CSS Selector:** Compare the CSS selector used to apply the grid style with the actual rendered HTML structure (classes, IDs, handle).
    7.  **Check Computed Styles:** Use the Computed Styles panel in the developer tools to see which CSS rule is ultimately determining the `display` property of the product list container and if the intended grid rule is being overridden.
*   **Root Cause (Example - Allocation Grid):** The `AllocationCart.html` template might be generating a product list container with the wrong `data-ecp-handle` (e.g., `products` instead of `allocated_products`) or incorrect/missing classes compared to what the CSS selector expects or what a working implementation uses.
*   **Solution (Example - Allocation Grid):**
    1.  **Modify Template:** Update the template file (e.g., `AllocationCart.html`) to generate the product list container with the *correct* `data-ecp-handle` (e.g., `allocated_products`) and structure, matching a known working example or the base eCellar structure for that view.
    2.  **Modify CSS:** Ensure the CSS selector accurately targets the corrected container element using the correct `data-ecp-handle` and necessary parent context (e.g., `.ecp_AllocationCart div[data-ecp-handle="allocated_products"]`).
*   **Key Takeaway:** Always inspect the rendered HTML of the *specific view* you are styling to confirm element structure, classes, and especially `data-ecp-handle` attributes before writing or debugging CSS selectors. Do not assume handles or structures are consistent across all eCellar views.

## 7. Conclusion

The key to successfully implementing eCellar in the dd_new_new Next.js project is to follow the simplicity of the WordPress implementation. By minimizing the amount of custom JavaScript and letting eCellar handle its own DOM manipulation, the integration is more likely to work correctly.

The current isolated container approach in dd_new_new is on the right track, but should be simplified to more closely match the successful WordPress implementation. By following the best practices outlined in this document, the dd_new_new project can achieve a stable and maintainable eCellar integration. 