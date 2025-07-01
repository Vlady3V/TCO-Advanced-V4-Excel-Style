import { Strategy, WearAccumulation, CostAccumulation, CalculationMetrics } from '../types';

/**
 * Performance optimization utilities for TCO calculations
 * Addresses computational complexity issues identified in Excel analysis
 */

export class PerformanceMonitor {
  private startTime: number = 0;
  private metrics: CalculationMetrics = {
    calculationTime: 0,
    dataPoints: 0,
    errors: []
  };

  startTimer(): void {
    this.startTime = performance.now();
  }

  endTimer(): number {
    const endTime = performance.now();
    this.metrics.calculationTime = endTime - this.startTime;
    return this.metrics.calculationTime;
  }

  setDataPoints(count: number): void {
    this.metrics.dataPoints = count;
  }

  getMetrics(): CalculationMetrics {
    return { ...this.metrics };
  }

  // Memory usage estimation (simplified)
  estimateMemoryUsage(dataPoints: number): number {
    // Rough estimation: each data point uses approximately 200 bytes
    return dataPoints * 200;
  }
}

/**
 * Optimized calculation engine with caching and batch processing
 */
export class OptimizedCalculationEngine {
  private wearCache = new Map<string, WearAccumulation[]>();
  private costCache = new Map<string, CostAccumulation[]>();
  private monitor = new PerformanceMonitor();

  // Generate cache key from strategy
  private generateCacheKey(strategy: Strategy): string {
    // Create a hash-like key from critical strategy parameters
    const keyData = {
      totalHours: strategy.totalHours,
      wearRates: strategy.wearRates,
      interventions: strategy.interventions.map(i => ({
        hours: i.operatingHours,
        thicknesses: [i.stage0Thickness, i.stage1Thickness, i.stage2Thickness, i.stage3Thickness, i.stage4Thickness]
      })),
      initialFloor: strategy.initialFloorThickness
    };
    return JSON.stringify(keyData);
  }

  // Optimized wear calculation with caching
  calculateWearAccumulationOptimized(strategy: Strategy): { 
    accumulation: WearAccumulation[]; 
    metrics: CalculationMetrics;
    fromCache: boolean;
  } {
    this.monitor.startTimer();
    
    const cacheKey = this.generateCacheKey(strategy);
    
    // Check cache first
    const cachedResult = this.wearCache.get(cacheKey);
    if (cachedResult) {
      this.monitor.endTimer();
      return {
        accumulation: cachedResult,
        metrics: this.monitor.getMetrics(),
        fromCache: true
      };
    }

    // Calculate if not in cache
    const accumulation = this.calculateWearAccumulationBatched(strategy);
    
    // Cache the result
    this.wearCache.set(cacheKey, accumulation);
    
    this.monitor.endTimer();
    this.monitor.setDataPoints(accumulation.length);
    
    // Limit cache size to prevent memory bloat
    if (this.wearCache.size > 50) {
      const firstKey = this.wearCache.keys().next().value;
      if (firstKey) {
        this.wearCache.delete(firstKey);
      }
    }

    return {
      accumulation,
      metrics: this.monitor.getMetrics(),
      fromCache: false
    };
  }

  // Batch processing for improved performance
  private calculateWearAccumulationBatched(strategy: Strategy): WearAccumulation[] {
    const accumulation: WearAccumulation[] = [];
    const batchSize = 5000; // Process in 5000 hour batches
    
    // Initialize state
    let currentThickness = {
      floor: strategy.initialFloorThickness,
      stage0: 0,
      stage1: 0,
      stage2: 0,
      stage3: 0,
      stage4: 0
    };

    let installed = {
      stage0: false,
      stage1: false,
      stage2: false,
      stage3: false,
      stage4: false
    };

    let minimumThickness = {
      floor: strategy.floorMinThickness,
      stage0: 0,
      stage1: 0,
      stage2: 0,
      stage3: 0,
      stage4: 0
    };

    // Process interventions
    for (let i = 0; i < strategy.interventions.length; i++) {
      const intervention = strategy.interventions[i];
      const nextIntervention = strategy.interventions[i + 1];
      const endHours = nextIntervention ? nextIntervention.operatingHours : strategy.totalHours;

      // Apply interventions
      this.applyIntervention(intervention, currentThickness, installed, minimumThickness);

      // Process hours in batches
      for (let hours = intervention.operatingHours; hours <= endHours; hours += batchSize) {
        const batchEndHours = Math.min(hours + batchSize, endHours);
        const batchDuration = batchEndHours - hours;

        if (batchDuration > 0) {
          // Apply wear for the entire batch at once
          this.applyWearBatch(
            currentThickness,
            installed,
            minimumThickness,
            strategy.wearRates,
            batchDuration
          );

          // Record state at batch intervals
          const recordInterval = 1000;
          for (let recordHours = hours; recordHours <= batchEndHours; recordHours += recordInterval) {
            accumulation.push({
              hours: Math.min(recordHours, endHours),
              floor: Math.max(0, currentThickness.floor),
              stage0: Math.max(0, currentThickness.stage0),
              stage1: Math.max(0, currentThickness.stage1),
              stage2: Math.max(0, currentThickness.stage2),
              stage3: Math.max(0, currentThickness.stage3),
              stage4: Math.max(0, currentThickness.stage4)
            });
          }
        }
      }
    }

    return accumulation;
  }

  private applyIntervention(
    intervention: any,
    currentThickness: any,
    installed: any,
    minimumThickness: any
  ): void {
    if (intervention.stage0Thickness > 0) {
      currentThickness.stage0 = intervention.stage0Thickness;
      installed.stage0 = true;
      minimumThickness.stage0 = intervention.stage0MinThickness;
    }
    if (intervention.stage1Thickness > 0) {
      currentThickness.stage1 = intervention.stage1Thickness;
      installed.stage1 = true;
      minimumThickness.stage1 = intervention.stage1MinThickness;
    }
    if (intervention.stage2Thickness > 0) {
      currentThickness.stage2 = intervention.stage2Thickness;
      installed.stage2 = true;
      minimumThickness.stage2 = intervention.stage2MinThickness;
    }
    if (intervention.stage3Thickness > 0) {
      currentThickness.stage3 = intervention.stage3Thickness;
      installed.stage3 = true;
      minimumThickness.stage3 = intervention.stage3MinThickness;
    }
    if (intervention.stage4Thickness > 0) {
      currentThickness.stage4 = intervention.stage4Thickness;
      installed.stage4 = true;
      minimumThickness.stage4 = intervention.stage4MinThickness;
    }
    minimumThickness.floor = intervention.floorMinThickness;
  }

  private applyWearBatch(
    currentThickness: any,
    installed: any,
    minimumThickness: any,
    wearRates: any,
    hours: number
  ): void {
    // Determine which layer is wearing
    const wearHours = hours / 1000; // Convert to thousands

    if (installed.stage4 && currentThickness.stage4 > minimumThickness.stage4) {
      currentThickness.stage4 -= wearRates.stage4 * wearHours;
      if (currentThickness.stage4 <= minimumThickness.stage4) {
        currentThickness.stage4 = minimumThickness.stage4;
        installed.stage4 = false;
      }
    } else if (installed.stage3 && currentThickness.stage3 > minimumThickness.stage3) {
      currentThickness.stage3 -= wearRates.stage3 * wearHours;
      if (currentThickness.stage3 <= minimumThickness.stage3) {
        currentThickness.stage3 = minimumThickness.stage3;
        installed.stage3 = false;
      }
    } else if (installed.stage2 && currentThickness.stage2 > minimumThickness.stage2) {
      currentThickness.stage2 -= wearRates.stage2 * wearHours;
      if (currentThickness.stage2 <= minimumThickness.stage2) {
        currentThickness.stage2 = minimumThickness.stage2;
        installed.stage2 = false;
      }
    } else if (installed.stage1 && currentThickness.stage1 > minimumThickness.stage1) {
      currentThickness.stage1 -= wearRates.stage1 * wearHours;
      if (currentThickness.stage1 <= minimumThickness.stage1) {
        currentThickness.stage1 = minimumThickness.stage1;
        installed.stage1 = false;
      }
    } else if (installed.stage0 && currentThickness.stage0 > minimumThickness.stage0) {
      currentThickness.stage0 -= wearRates.stage0 * wearHours;
      if (currentThickness.stage0 <= minimumThickness.stage0) {
        currentThickness.stage0 = minimumThickness.stage0;
        installed.stage0 = false;
      }
    } else {
      currentThickness.floor -= wearRates.floor * wearHours;
      currentThickness.floor = Math.max(currentThickness.floor, minimumThickness.floor);
    }
  }

  // Clear caches to free memory
  clearCache(): void {
    this.wearCache.clear();
    this.costCache.clear();
  }

  // Get cache statistics
  getCacheStats(): { wearCacheSize: number; costCacheSize: number } {
    return {
      wearCacheSize: this.wearCache.size,
      costCacheSize: this.costCache.size
    };
  }
}

// Singleton instance
export const optimizedEngine = new OptimizedCalculationEngine();

// Web Worker support for heavy calculations (if available)
export function calculateInWorker(strategy: Strategy): Promise<WearAccumulation[]> {
  return new Promise((resolve, reject) => {
    if (typeof Worker !== 'undefined') {
      try {
        // Create worker blob
        const workerScript = `
          self.onmessage = function(e) {
            const strategy = e.data;
            // Perform calculation here
            // This would contain the actual calculation logic
            const result = []; // Placeholder
            self.postMessage(result);
          };
        `;
        
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
        
        worker.onerror = (error) => {
          reject(error);
          worker.terminate();
        };
        
        worker.postMessage(strategy);
      } catch (error) {
        // Fallback to main thread
        reject(error);
      }
    } else {
      reject(new Error('Web Workers not supported'));
    }
  });
}