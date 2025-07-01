export interface WearRates {
  floor: number;   // Range: 0.12-0.45 mm/1000hrs (validated)
  stage0: number;  // Range: 0.12-0.45 mm/1000hrs (validated)
  stage1: number;  // Range: 0.12-0.45 mm/1000hrs (validated)
  stage2: number;  // Range: 0.12-0.45 mm/1000hrs (validated)
  stage3: number;  // Range: 0.12-0.45 mm/1000hrs (validated)
  stage4: number;  // Range: 0.12-0.45 mm/1000hrs (validated)
}

// Validation constants
export const WEAR_RATE_LIMITS = {
  MIN: 0.12,
  MAX: 0.45
} as const;

export const THICKNESS_LIMITS = {
  MIN: 0,
  MAX: 50
} as const;

export const OPERATING_HOURS_LIMITS = {
  MIN: 0,
  MAX: 200000
} as const;

export interface MaintenanceIntervention {
  operatingHours: number;
  floorMinThickness: number;
  stage0Thickness: number;
  stage0MinThickness: number;
  stage1Thickness: number;
  stage1MinThickness: number;
  stage2Thickness: number;
  stage2MinThickness: number;
  stage3Thickness: number;
  stage3MinThickness: number;
  stage4Thickness: number;
  stage4MinThickness: number;
  sidewallReplacement: boolean;
  frontwallReplacement: boolean;
  rebuild: boolean;
}

export interface CostStructure {
  // Wear plate costs per tile
  stage4_20mm: number;
  stage4_25mm: number;
  stage3_20mm: number;
  stage3_25mm: number;
  stage2_20mm: number;
  stage2_25mm: number;
  stage1_20mm: number;
  stage1_25mm: number;
  stage0_20mm: number;
  stage0_25mm: number;
  
  // Quantities
  stage4Qty: number;
  stage3Qty: number;
  stage2Qty: number;
  stage1Qty: number;
  stage0Qty: number;
  sidewallQty: number;
  frontwallQty: number;
  rebuildQty: number;
  
  // Fixed costs
  sidewallCost: number;
  frontwallCost: number;
  rebuildCost: number;
  
  // Labor
  laborRate: number;
  laborWP20mm: number;
  laborWP25mm: number;
  laborSidewall: number;
  laborFrontwall: number;
  laborRebuild: number;
}

export interface Strategy {
  id: string;
  name: string;
  operatingHoursPerPeriod: number;
  totalHours: number;
  
  // Initial configuration
  initialFloorThickness: number;
  floorMinThickness: number;
  
  // Maintenance interventions (up to 10)
  interventions: MaintenanceIntervention[];
  
  // Wear rates
  wearRates: WearRates;
  
  // Cost structure
  costs: CostStructure;
}

export interface WearAccumulation {
  hours: number;
  floor: number;
  stage0: number;
  stage1: number;
  stage2: number;
  stage3: number;
  stage4: number;
}

export interface CostAccumulation {
  hours: number;          // Operating hours (>= 0)
  periodCost: number;     // Cost for this period (>= 0)
  cumulativeCost: number; // Total accumulated cost (>= 0)
  costPerHour: number;    // Cost per operating hour (>= 0)
}

// Enhanced error types for better debugging
export interface ValidationError {
  field: string;
  value: number;
  expectedRange: [number, number];
  message: string;
}

// Performance monitoring interface
export interface CalculationMetrics {
  calculationTime: number;  // milliseconds
  dataPoints: number;
  memoryUsage?: number;
  errors: ValidationError[];
}