# DOMAINE DELLA PROJECT OVERVIEW

## 🌟 Introduction

The Domaine Della website is a sophisticated, modern web application built with Next.js 15.2.2 and React 19. It serves as a premium digital presence for a winery, offering an immersive experience for wine enthusiasts, collectors, and customers. The application combines cutting-edge web technologies with elegant design to create a seamless, responsive, and engaging user experience.

## 🏗️ Architecture

### Core Architecture

The application follows a modern, component-based architecture leveraging the power of Next.js App Router and React 19's latest features:

- **Next.js App Router**: Utilizes the file-system based routing structure with app directory
- **Server Components**: Leverages React Server Components for improved performance and SEO
- **Client Components**: Uses client-side interactivity where needed for dynamic user experiences
- **Hybrid Rendering**: Combines static generation, server-side rendering, and client-side rendering as appropriate

### Key Architectural Principles

1. **Integrated E-commerce**: Custom e-commerce functionality built directly into the Next.js application
2. **Context-based State Management**: React Context API for global state management
3. **Responsive Design**: Mobile-first approach with adaptive layouts
4. **Performance Optimization**: Optimized for core web vitals and user experience

## 🚀 Initialization Sequence

The application follows a sophisticated initialization sequence:

1. **Next.js Bootstrap**:
   - Next.js initializes the application environment
   - Loads configuration from `next.config.mjs`
   - Sets up experimental features (webpackBuildWorker, parallelServerBuildTraces, parallelServerCompiles)

2. **Root Layout Initialization**:
   - Loads the Inter font from Google Fonts
   - Sets up meta tags and viewport settings
   - Initializes the header height CSS variable via a beforeInteractive script
   - Mounts the ScrollToTop component for improved navigation

3. **Component Tree Mounting**:
   - Renders the page-specific components based on the current route
   - Loads the SiteFooter component globally

4. **E-Cellar Integration**:
   - Initializes the e-commerce functionality
   - Connects to the eCellar API for wine sales and allocation management

## 🛠️ Technology Stack

### Core Technologies

- **Next.js 15.2.2**: React framework for production with App Router
- **React 19**: Latest version of React with improved performance and features
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS**: For utility-first styling approach

### UI Components and Design

- **Radix UI**: Comprehensive set of accessible UI primitives
- **Shadcn/UI**: High-quality UI components built on Radix
- **Framer Motion**: For sophisticated animations and transitions
- **Tailwind CSS**: For styling with utility classes
- **Tailwind Merge**: For conditional class name merging
- **Class Variance Authority**: For component style variants

### Form Handling and Validation

- **React Hook Form**: For efficient form state management
- **Zod**: For schema validation
- **Hookform Resolvers**: For connecting Zod with React Hook Form

### Data Visualization and UI Enhancement

- **Recharts**: For data visualization
- **Embla Carousel**: For carousel/slider functionality
- **Sonner**: For toast notifications
- **cmdk**: For command palette interfaces
- **Lucide React**: For SVG icons
- **Date-fns**: For date manipulation

### Development Tools

- **ESLint**: For code linting
- **TypeScript**: For static type checking
- **Postcss**: For CSS processing
- **Autoprefixer**: For CSS vendor prefixing

## 📁 Project Structure

### Directory Organization

- **/app**: Next.js App Router pages and layouts
  - /acquire: E-commerce and wine acquisition pages
  - /story: Brand storytelling and history
  - /vineyards: Information about vineyards
  - /visit: Visitation information and booking
  - /wines: Wine catalog and details
  - layout.tsx: Root layout component
  - page.tsx: Homepage component
  - globals.css: Global styles

- **/components**: Reusable UI components
  - /ui: Shadcn UI components
  - site-header.tsx: Main navigation header
  - site-footer.tsx: Footer component
  - wine-*.tsx: Wine-related components
  - california-wine-map.tsx: Interactive wine region map

- **/hooks**: Custom React hooks
  - use-mobile.tsx: Hook for responsive design
  - use-toast.ts: Toast notification hook

- **/lib**: Utility functions and shared code
  - utils.ts: General utility functions

- **/data**: Data sources and management
  - wine-data.tsx: Wine catalog data

- **/public**: Static assets
  - Images, fonts, and other static files

- **/styles**: Additional styling resources

### Configuration Files

- **next.config.mjs**: Next.js configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.mjs**: PostCSS configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Dependencies and scripts
- **components.json**: Shadcn UI configuration

## 🔄 Data Flow

### Client-Server Interaction

1. **Request Handling**:
   - Next.js App Router handles incoming requests
   - Server components fetch necessary data
   - Pages are rendered on the server when appropriate

2. **State Management**:
   - React Context API for global state
   - Component-level state for UI interactions
   - Server components for data fetching

3. **E-commerce Integration**:
   - Custom integration with eCellar for wine sales
   - Secure checkout process
   - Allocation management for limited releases

## 🧩 Component Architecture

### Component Hierarchy

- **Layout Components**: Define the overall structure
  - RootLayout: Base HTML structure
  - Page-specific layouts: Section-specific layouts

- **Page Components**: Route-specific content
  - Home page
  - Wine catalog
  - Vineyard information
  - Visit booking

- **UI Components**: Reusable interface elements
  - Navigation components
  - Wine display components
  - Interactive maps
  - Form elements

### Component Communication

- **Props**: For parent-child communication
- **Context**: For global state sharing
- **Custom Hooks**: For shared behavior

## 🚦 Routing and Navigation

### App Router Structure

- File-based routing through the app directory
- Dynamic routes for wine details, vineyard information
- Layout nesting for consistent UI across routes

### Navigation Features

- Smooth scrolling with ScrollToTop component
- Responsive navigation with mobile considerations
- SEO-friendly URLs and metadata

## 🎨 Styling Approach

### Tailwind Integration

- Utility-first CSS approach
- Custom theme configuration
- Responsive design utilities

### Animation Strategy

- Framer Motion for complex animations
- CSS transitions for simple effects
- Performance-optimized animation techniques

## 🔒 Security Considerations

- HTTPS enforcement
- Input validation with Zod
- Secure API integration with eCellar
- Content Security Policy implementation

## 📱 Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Custom hook (use-mobile) for responsive behavior
- Tailwind breakpoints for consistent responsive design

## 🚀 Performance Optimization

### Next.js Optimizations

- Image optimization
- Font optimization with next/font
- Script loading strategies
- Experimental features enabled for better performance

### Code Optimization

- Code splitting
- Lazy loading
- Memoization where appropriate
- Efficient re-rendering strategies

## 📊 Analytics and Monitoring

- Performance monitoring
- User behavior tracking
- Error logging and reporting
- A/B testing capabilities

## 🧪 Testing Strategy

- Component testing with React Testing Library
- Integration testing
- Accessibility testing
- Performance testing

## 🚀 Deployment

- Vercel-optimized deployment
- CI/CD pipeline integration
- Environment-specific configurations
- Rollback capabilities

## 🔄 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Version Control

- Git-based workflow
- Feature branch approach
- Pull request reviews
- Semantic versioning

## 🔮 Future Roadmap

- Enhanced personalization features
- Advanced search capabilities
- International shipping optimization
- AR/VR vineyard tours
- Wine recommendation engine

## 📚 Documentation

- Architecture documentation (ARCHITECTURE.md)
- E-Cellar implementation details (ECELLAR_IMPLEMENTATION.md)
- This comprehensive overview (PROJECT_OVERVIEW.md)
- Inline code documentation

---

This overview represents the current state of the Domaine Della project as of March 2025, running on Next.js 15.2.2 and React 19. 