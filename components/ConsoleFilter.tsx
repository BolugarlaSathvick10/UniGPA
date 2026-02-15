'use client';

import { useEffect } from 'react';

/**
 * Filters out known Next.js 15 console warnings that don't affect functionality.
 * This is a workaround for React DevTools serialization warnings.
 */
export function ConsoleFilter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalError = console.error;
    const originalWarn = console.warn;

    // Filter out Next.js 15 async API warnings (params and searchParams)
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('params are being enumerated') ||
        message.includes('params should be unwrapped with React.use()') ||
        (message.includes('searchParams') && message.includes('should be unwrapped with React.use()')) ||
        message.includes('The keys of `searchParams` were accessed directly')
      ) {
        // Suppress these specific warnings
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('params are being enumerated') ||
        message.includes('params should be unwrapped with React.use()') ||
        (message.includes('searchParams') && message.includes('should be unwrapped with React.use()')) ||
        message.includes('The keys of `searchParams` were accessed directly')
      ) {
        // Suppress these specific warnings
        return;
      }
      originalWarn.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}

