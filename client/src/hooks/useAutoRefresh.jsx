import { useEffect, useRef } from 'react';

export const useAutoRefresh = (dependencies, refreshFn, delay = 1000) => {
  const timeoutRef = useRef(null);
  const lastDepsRef = useRef(dependencies);

  useEffect(() => {
    const depsChanged = dependencies.some((dep, index) => 
      dep !== lastDepsRef.current[index]
    );

    if (depsChanged) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for refresh
      timeoutRef.current = setTimeout(() => {
        refreshFn();
      }, delay);

      // Update last dependencies
      lastDepsRef.current = dependencies;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, dependencies);
};
