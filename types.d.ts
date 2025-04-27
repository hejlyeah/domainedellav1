import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Add support for CSS custom properties in style objects
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// Type definitions for Tailwind CSS
type CSSVariableValue = string

declare module '@vimeo/player' {
  interface Options {
    id?: number | string;
    url?: string;
    autopause?: boolean;
    autoplay?: boolean;
    background?: boolean;
    controls?: boolean;
    dnt?: boolean;
    height?: number;
    loop?: boolean;
    maxheight?: number;
    maxwidth?: number;
    muted?: boolean;
    playsinline?: boolean;
    portrait?: boolean;
    responsive?: boolean;
    speed?: boolean;
    title?: boolean;
    transparent?: boolean;
    width?: number;
    quality?: string;
    byline?: boolean;
  }

  export default class Player {
    constructor(element: HTMLElement | string, options?: Options);
    ready(): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    destroy(): Promise<void>;
  }
}

// Add types for global functions added by external scripts
interface Window {
  epubOptions?: any; // Assuming epubOptions is set globally by eCellar
  cleanupEcellarListeners?: () => void; // Add our cleanup function
} 