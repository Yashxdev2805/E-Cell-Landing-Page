import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Zero-jank IntersectionObserver hook.
 * Used for: Navbar active-section tracking, one-shot counter animations.
 * Properly disconnects on unmount to prevent memory leaks.
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): {
  ref: React.RefCallback<Element>;
  isIntersecting: boolean;
  hasIntersected: boolean;
} {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const cleanup = useCallback(() => {
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }
    observerRef.current = null;
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      cleanup();
      elementRef.current = node;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasIntersected(true);
          }
        },
        { threshold: 0.15, ...options }
      );

      observerRef.current.observe(node);
    },
    [options.threshold, options.rootMargin, cleanup]
  );

  useEffect(() => cleanup, [cleanup]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Track multiple sections for active-section highlighting (Navbar).
 */
export function useSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    const elements: Element[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
}
