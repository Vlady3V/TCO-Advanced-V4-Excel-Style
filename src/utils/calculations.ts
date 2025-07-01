import { Strategy, WearAccumulation, CostAccumulation } from '../types';
import { validateStrategy } from './validation';

// Calculate wear accumulation over time with enhanced logic
export function calculateWearAccumulation(strategy: Strategy): WearAccumulation[] {
  // Validate strategy first
  const { validatedStrategy, errors } = validateStrategy(strategy);
  
  if (errors.length > 0) {
    console.warn('TCO Calculation Warnings:', errors);
  }
  
  const accumulation: WearAccumulation[] = [];
  
  // Initialize current thicknesses with validation
  let currentThickness = {
    floor: validatedStrategy.initialFloorThickness,
    stage0: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0
  };
  
  // Track what's installed and minimum thicknesses for each stage
  let installed = {
    stage0: false,
    stage1: false,
    stage2: false,
    stage3: false,
    stage4: false
  };
  
  let minimumThickness = {
    floor: validatedStrategy.floorMinThickness,
    stage0: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0
  };

  // Process each intervention with enhanced validation
  for (let i = 0; i < validatedStrategy.interventions.length; i++) {
    const intervention = validatedStrategy.interventions[i];
    const nextIntervention = validatedStrategy.interventions[i + 1];
    const endHours = nextIntervention ? nextIntervention.operatingHours : validatedStrategy.totalHours;
    
    // Apply interventions with validation and update minimum thicknesses
    if (intervention.stage0Thickness > 0) {
      currentThickness.stage0 = Math.max(0, intervention.stage0Thickness);
      installed.stage0 = true;
      minimumThickness.stage0 = intervention.stage0MinThickness;
    }
    if (intervention.stage1Thickness > 0) {
      currentThickness.stage1 = Math.max(0, intervention.stage1Thickness);
      installed.stage1 = true;
      minimumThickness.stage1 = intervention.stage1MinThickness;
    }
    if (intervention.stage2Thickness > 0) {
      currentThickness.stage2 = Math.max(0, intervention.stage2Thickness);
      installed.stage2 = true;
      minimumThickness.stage2 = intervention.stage2MinThickness;
    }
    if (intervention.stage3Thickness > 0) {
      currentThickness.stage3 = Math.max(0, intervention.stage3Thickness);
      installed.stage3 = true;
      minimumThickness.stage3 = intervention.stage3MinThickness;
    }
    if (intervention.stage4Thickness > 0) {
      currentThickness.stage4 = Math.max(0, intervention.stage4Thickness);
      installed.stage4 = true;
      minimumThickness.stage4 = intervention.stage4MinThickness;
    }
    
    // Update floor minimum thickness
    minimumThickness.floor = intervention.floorMinThickness;

    // Calculate wear for each period with enhanced logic
    for (let hours = intervention.operatingHours; hours <= endHours; hours += 1000) {
      const wearHours = Math.min(1000, endHours - hours);
      
      // Apply wear using enhanced calculation with minimum thickness validation
      if (installed.stage4 && currentThickness.stage4 > minimumThickness.stage4) {
        const wearAmount = validatedStrategy.wearRates.stage4 * (wearHours / 1000);
        currentThickness.stage4 = Math.max(currentThickness.stage4 - wearAmount, minimumThickness.stage4);
        if (currentThickness.stage4 <= minimumThickness.stage4) {
          installed.stage4 = false;
        }
      } else if (installed.stage3 && currentThickness.stage3 > minimumThickness.stage3) {
        const wearAmount = validatedStrategy.wearRates.stage3 * (wearHours / 1000);
        currentThickness.stage3 = Math.max(currentThickness.stage3 - wearAmount, minimumThickness.stage3);
        if (currentThickness.stage3 <= minimumThickness.stage3) {
          installed.stage3 = false;
        }
      } else if (installed.stage2 && currentThickness.stage2 > minimumThickness.stage2) {
        const wearAmount = validatedStrategy.wearRates.stage2 * (wearHours / 1000);
        currentThickness.stage2 = Math.max(currentThickness.stage2 - wearAmount, minimumThickness.stage2);
        if (currentThickness.stage2 <= minimumThickness.stage2) {
          installed.stage2 = false;
        }
      } else if (installed.stage1 && currentThickness.stage1 > minimumThickness.stage1) {
        const wearAmount = validatedStrategy.wearRates.stage1 * (wearHours / 1000);
        currentThickness.stage1 = Math.max(currentThickness.stage1 - wearAmount, minimumThickness.stage1);
        if (currentThickness.stage1 <= minimumThickness.stage1) {
          installed.stage1 = false;
        }
      } else if (installed.stage0 && currentThickness.stage0 > minimumThickness.stage0) {
        const wearAmount = validatedStrategy.wearRates.stage0 * (wearHours / 1000);
        currentThickness.stage0 = Math.max(currentThickness.stage0 - wearAmount, minimumThickness.stage0);
        if (currentThickness.stage0 <= minimumThickness.stage0) {
          installed.stage0 = false;
        }
      } else {
        // Floor wears when no protection, with minimum thickness enforcement
        const wearAmount = validatedStrategy.wearRates.floor * (wearHours / 1000);
        currentThickness.floor = Math.max(currentThickness.floor - wearAmount, minimumThickness.floor);
      }

      // Record accumulation with validation
      accumulation.push({
        hours: Math.max(0, hours),
        floor: Math.max(0, currentThickness.floor),
        stage0: Math.max(0, currentThickness.stage0),
        stage1: Math.max(0, currentThickness.stage1),
        stage2: Math.max(0, currentThickness.stage2),
        stage3: Math.max(0, currentThickness.stage3),
        stage4: Math.max(0, currentThickness.stage4)
      });
    }
  }
  
  return accumulation;
}

// Calculate cost accumulation over time with enhanced validation
export function calculateCostAccumulation(strategy: Strategy): CostAccumulation[] {
  // Validate strategy first
  const { validatedStrategy, errors } = validateStrategy(strategy);
  
  if (errors.length > 0) {
    console.warn('TCO Cost Calculation Warnings:', errors);
  }
  
  const accumulation: CostAccumulation[] = [];
  let cumulativeCost = 0;
  
  // Add initial cost (hour 0)
  accumulation.push({
    hours: 0,
    periodCost: 0,
    cumulativeCost: 0,
    costPerHour: 0
  });
  
  // Helper function for labor cost calculation (FIXED BUG: removed incorrect division by 60)
  const calculateLaborCost = (qty: number, laborMinutes: number, laborRate: number): number => {
    return Math.max(0, qty * (laborMinutes / 60) * laborRate);
  };
  
  // Calculate costs for each intervention with corrected labor calculation
  for (let i = 0; i < validatedStrategy.interventions.length; i++) {
    const intervention = validatedStrategy.interventions[i];
    let periodCost = 0;
    
    // Calculate wear plate costs with validation
    if (intervention.stage0Thickness > 0) {
      const thickness = Math.max(0, intervention.stage0Thickness);
      const cost = thickness === 20 ? validatedStrategy.costs.stage0_20mm : validatedStrategy.costs.stage0_25mm;
      const laborMinutes = thickness === 20 ? validatedStrategy.costs.laborWP20mm : validatedStrategy.costs.laborWP25mm;
      periodCost += Math.max(0, validatedStrategy.costs.stage0Qty * cost);
      periodCost += calculateLaborCost(validatedStrategy.costs.stage0Qty, laborMinutes, validatedStrategy.costs.laborRate);
    }
    
    if (intervention.stage1Thickness > 0) {
      const thickness = Math.max(0, intervention.stage1Thickness);
      const cost = thickness === 20 ? validatedStrategy.costs.stage1_20mm : validatedStrategy.costs.stage1_25mm;
      const laborMinutes = thickness === 20 ? validatedStrategy.costs.laborWP20mm : validatedStrategy.costs.laborWP25mm;
      periodCost += Math.max(0, validatedStrategy.costs.stage1Qty * cost);
      periodCost += calculateLaborCost(validatedStrategy.costs.stage1Qty, laborMinutes, validatedStrategy.costs.laborRate);
    }
    
    if (intervention.stage2Thickness > 0) {
      const thickness = Math.max(0, intervention.stage2Thickness);
      const cost = thickness === 20 ? validatedStrategy.costs.stage2_20mm : validatedStrategy.costs.stage2_25mm;
      const laborMinutes = thickness === 20 ? validatedStrategy.costs.laborWP20mm : validatedStrategy.costs.laborWP25mm;
      periodCost += Math.max(0, validatedStrategy.costs.stage2Qty * cost);
      periodCost += calculateLaborCost(validatedStrategy.costs.stage2Qty, laborMinutes, validatedStrategy.costs.laborRate);
    }
    
    if (intervention.stage3Thickness > 0) {
      const thickness = Math.max(0, intervention.stage3Thickness);
      const cost = thickness === 20 ? validatedStrategy.costs.stage3_20mm : validatedStrategy.costs.stage3_25mm;
      const laborMinutes = thickness === 20 ? validatedStrategy.costs.laborWP20mm : validatedStrategy.costs.laborWP25mm;
      periodCost += Math.max(0, validatedStrategy.costs.stage3Qty * cost);
      periodCost += calculateLaborCost(validatedStrategy.costs.stage3Qty, laborMinutes, validatedStrategy.costs.laborRate);
    }
    
    if (intervention.stage4Thickness > 0) {
      const thickness = Math.max(0, intervention.stage4Thickness);
      const cost = thickness === 20 ? validatedStrategy.costs.stage4_20mm : validatedStrategy.costs.stage4_25mm;
      const laborMinutes = thickness === 20 ? validatedStrategy.costs.laborWP20mm : validatedStrategy.costs.laborWP25mm;
      periodCost += Math.max(0, validatedStrategy.costs.stage4Qty * cost);
      periodCost += calculateLaborCost(validatedStrategy.costs.stage4Qty, laborMinutes, validatedStrategy.costs.laborRate);
    }
    
    // Add fixed costs with validation
    if (intervention.sidewallReplacement) {
      periodCost += Math.max(0, validatedStrategy.costs.sidewallQty * validatedStrategy.costs.sidewallCost);
      periodCost += Math.max(0, validatedStrategy.costs.laborSidewall * validatedStrategy.costs.laborRate);
    }
    
    if (intervention.frontwallReplacement) {
      periodCost += Math.max(0, validatedStrategy.costs.frontwallQty * validatedStrategy.costs.frontwallCost);
      periodCost += Math.max(0, validatedStrategy.costs.laborFrontwall * validatedStrategy.costs.laborRate);
    }
    
    if (intervention.rebuild) {
      periodCost += Math.max(0, validatedStrategy.costs.rebuildCost);
      periodCost += Math.max(0, validatedStrategy.costs.laborRebuild * validatedStrategy.costs.laborRate);
    }
    
    // Update cumulative cost with proper validation
    if (periodCost > 0) {
      cumulativeCost += periodCost;
      const validHours = Math.max(0, intervention.operatingHours);
      const costPerHour = validHours > 0 ? cumulativeCost / validHours : 0;
      
      accumulation.push({
        hours: validHours,
        periodCost: Math.max(0, periodCost),
        cumulativeCost: Math.max(0, cumulativeCost),
        costPerHour: Math.max(0, costPerHour)
      });
    }
  }
  
  // Add final point with validation
  const lastAccumulation = accumulation[accumulation.length - 1];
  if (!lastAccumulation || lastAccumulation.hours < validatedStrategy.totalHours) {
    const finalCostPerHour = validatedStrategy.totalHours > 0 ? cumulativeCost / validatedStrategy.totalHours : 0;
    accumulation.push({
      hours: validatedStrategy.totalHours,
      periodCost: 0,
      cumulativeCost: Math.max(0, cumulativeCost),
      costPerHour: Math.max(0, finalCostPerHour)
    });
  }
  
  return accumulation;
}

// Get color for wear rate with validation
export function getWearRateColor(value: number): string {
  const validValue = Math.max(0, value);
  if (validValue === 0) return 'bg-gray-100';
  if (validValue <= 0.12) return 'bg-green-200';
  if (validValue <= 0.18) return 'bg-yellow-200';
  if (validValue <= 0.36) return 'bg-orange-200';
  return 'bg-red-200';
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Format number with commas
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}