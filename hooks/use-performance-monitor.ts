import { useEffect, useState } from 'react';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    // Simple performance monitoring
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setMetrics({
        loadTime,
        renderTime: loadTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      });
    };

    // Measure after component mount
    setTimeout(measurePerformance, 100);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return metrics;
}