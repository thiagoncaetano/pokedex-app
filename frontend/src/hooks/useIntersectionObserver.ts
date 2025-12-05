import { useEffect } from 'react';

export type UseIntersectionObserverOptions = IntersectionObserverInit & {
  disabled?: boolean;
};

export function useIntersectionObserver(
  targetRef: React.RefObject<Element | null>,
  onIntersect: () => void,
  { disabled, ...options }: UseIntersectionObserverOptions = {},
) {
  useEffect(() => {
    if (disabled) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        onIntersect();
      }
    }, options);

    let rafId: number | null = null;

    const observe = () => {
      const el = targetRef.current;
      if (el) {
        observer.observe(el);
      } else {
        rafId = requestAnimationFrame(observe);
      }
    };

    observe();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [targetRef, onIntersect, disabled, options.root, options.rootMargin, options.threshold]);
}
