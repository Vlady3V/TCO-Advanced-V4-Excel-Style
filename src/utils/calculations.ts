import { Strategy, WearAccumulation, CostAccumulation } from '../types';

// Calculate wear accumulation over time
export function calculateWearAccumulation(strategy: Strategy): WearAccumulation[] {
  const accumulation: WearAccumulation[] = [];
  // Track periods and hours per period for potential future use
  // const hoursPerPeriod = strategy.operatingHoursPerPeriod;
  // const periods = Math.ceil(strategy.totalHours / hoursPerPeriod);
  
  // Initialize current thicknesses
  let currentThickness = {
    floor: strategy.initialFloorThickness,
    stage0: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0
  };
  
  // Track what's installed
  let installed = {
    stage0: false,
    stage1: false,
    stage2: false,
    stage3: false,
    stage4: false
  };
  
  // Process each intervention
  for (let i = 0; i < strategy.interventions.length; i++) {
    const intervention = strategy.interventions[i];
    const nextIntervention = strategy.interventions[i + 1];
    const endHours = nextIntervention ? nextIntervention.operatingHours : strategy.totalHours;
    
    // Apply interventions
    if (intervention.stage0Thickness > 0) {
      currentThickness.stage0 = intervention.stage0Thickness;
      installed.stage0 = true;
    }
    if (intervention.stage1Thickness > 0) {
      currentThickness.stage1 = intervention.stage1Thickness;
      installed.stage1 = true;
    }
    if (intervention.stage2Thickness > 0) {
      currentThickness.stage2 = intervention.stage2Thickness;
      installed.stage2 = true;
    }
    if (intervention.stage3Thickness > 0) {
      currentThickness.stage3 = intervention.stage3Thickness;
      installed.stage3 = true;
    }
    if (intervention.stage4Thickness > 0) {
      currentThickness.stage4 = intervention.stage4Thickness;
      installed.stage4 = true;
    }
    
    // Calculate wear for each hour period from intervention to next
    for (let hours = intervention.operatingHours; hours <= endHours; hours += 1000) {
      const wearHours = Math.min(1000, endHours - hours);
      
      // Only the topmost installed layer wears
      if (installed.stage4 && currentThickness.stage4 > 0) {
        currentThickness.stage4 -= strategy.wearRates.stage4 * (wearHours / 1000);
        if (currentThickness.stage4 <= 0) {
          currentThickness.stage4 = 0;
          installed.stage4 = false;
        }
      } else if (installed.stage3 && currentThickness.stage3 > 0) {
        currentThickness.stage3 -= strategy.wearRates.stage3 * (wearHours / 1000);
        if (currentThickness.stage3 <= 0) {
          currentThickness.stage3 = 0;
          installed.stage3 = false;
        }
      } else if (installed.stage2 && currentThickness.stage2 > 0) {
        currentThickness.stage2 -= strategy.wearRates.stage2 * (wearHours / 1000);
        if (currentThickness.stage2 <= 0) {
          currentThickness.stage2 = 0;
          installed.stage2 = false;
        }
      } else if (installed.stage1 && currentThickness.stage1 > 0) {
        currentThickness.stage1 -= strategy.wearRates.stage1 * (wearHours / 1000);
        if (currentThickness.stage1 <= 0) {
          currentThickness.stage1 = 0;
          installed.stage1 = false;
        }
      } else if (installed.stage0 && currentThickness.stage0 > 0) {
        currentThickness.stage0 -= strategy.wearRates.stage0 * (wearHours / 1000);
        if (currentThickness.stage0 <= 0) {
          currentThickness.stage0 = 0;
          installed.stage0 = false;
        }
      } else {
        // Floor wears when no protection
        currentThickness.floor -= strategy.wearRates.floor * (wearHours / 1000);
      }
      
      // Record accumulation
      accumulation.push({
        hours,
        floor: currentThickness.floor,
        stage0: currentThickness.stage0,
        stage1: currentThickness.stage1,
        stage2: currentThickness.stage2,
        stage3: currentThickness.stage3,
        stage4: currentThickness.stage4
      });
    }
  }
  
  return accumulation;
}

// Calculate cost accumulation over time
export function calculateCostAccumulation(strategy: Strategy): CostAccumulation[] {
  const accumulation: CostAccumulation[] = [];
  let cumulativeCost = 0;
  
  // Add initial cost (hour 0)
  accumulation.push({
    hours: 0,
    periodCost: 0,
    cumulativeCost: 0,
    costPerHour: 0
  });
  
  // Calculate costs for each intervention
  for (let i = 0; i < strategy.interventions.length; i++) {
    const intervention = strategy.interventions[i];
    let periodCost = 0;
    
    // Calculate wear plate costs
    if (intervention.stage0Thickness > 0) {
      const thickness = intervention.stage0Thickness;
      const cost = thickness === 20 ? strategy.costs.stage0_20mm : strategy.costs.stage0_25mm;
      const laborHours = thickness === 20 ? strategy.costs.laborWP20mm : strategy.costs.laborWP25mm;
      periodCost += strategy.costs.stage0Qty * cost;
      periodCost += strategy.costs.stage0Qty * laborHours * strategy.costs.laborRate / 60;
    }
    
    if (intervention.stage1Thickness > 0) {
      const thickness = intervention.stage1Thickness;
      const cost = thickness === 20 ? strategy.costs.stage1_20mm : strategy.costs.stage1_25mm;
      const laborHours = thickness === 20 ? strategy.costs.laborWP20mm : strategy.costs.laborWP25mm;
      periodCost += strategy.costs.stage1Qty * cost;
      periodCost += strategy.costs.stage1Qty * laborHours * strategy.costs.laborRate / 60;
    }
    
    if (intervention.stage2Thickness > 0) {
      const thickness = intervention.stage2Thickness;
      const cost = thickness === 20 ? strategy.costs.stage2_20mm : strategy.costs.stage2_25mm;
      const laborHours = thickness === 20 ? strategy.costs.laborWP20mm : strategy.costs.laborWP25mm;
      periodCost += strategy.costs.stage2Qty * cost;
      periodCost += strategy.costs.stage2Qty * laborHours * strategy.costs.laborRate / 60;
    }
    
    if (intervention.stage3Thickness > 0) {
      const thickness = intervention.stage3Thickness;
      const cost = thickness === 20 ? strategy.costs.stage3_20mm : strategy.costs.stage3_25mm;
      const laborHours = thickness === 20 ? strategy.costs.laborWP20mm : strategy.costs.laborWP25mm;
      periodCost += strategy.costs.stage3Qty * cost;
      periodCost += strategy.costs.stage3Qty * laborHours * strategy.costs.laborRate / 60;
    }
    
    if (intervention.stage4Thickness > 0) {
      const thickness = intervention.stage4Thickness;
      const cost = thickness === 20 ? strategy.costs.stage4_20mm : strategy.costs.stage4_25mm;
      const laborHours = thickness === 20 ? strategy.costs.laborWP20mm : strategy.costs.laborWP25mm;
      periodCost += strategy.costs.stage4Qty * cost;
      periodCost += strategy.costs.stage4Qty * laborHours * strategy.costs.laborRate / 60;
    }
    
    // Add fixed costs
    if (intervention.sidewallReplacement) {
      periodCost += strategy.costs.sidewallQty * strategy.costs.sidewallCost;
      periodCost += strategy.costs.laborSidewall * strategy.costs.laborRate;
    }
    
    if (intervention.frontwallReplacement) {
      periodCost += strategy.costs.frontwallQty * strategy.costs.frontwallCost;
      periodCost += strategy.costs.laborFrontwall * strategy.costs.laborRate;
    }
    
    if (intervention.rebuild) {
      periodCost += strategy.costs.rebuildCost;
      periodCost += strategy.costs.laborRebuild * strategy.costs.laborRate;
    }
    
    // Update cumulative cost
    if (periodCost > 0) {
      cumulativeCost += periodCost;
      const costPerHour = intervention.operatingHours > 0 ? cumulativeCost / intervention.operatingHours : 0;
      
      accumulation.push({
        hours: intervention.operatingHours,
        periodCost,
        cumulativeCost,
        costPerHour
      });
    }
  }
  
  // Add final point
  if (accumulation[accumulation.length - 1].hours < strategy.totalHours) {
    const finalCostPerHour = cumulativeCost / strategy.totalHours;
    accumulation.push({
      hours: strategy.totalHours,
      periodCost: 0,
      cumulativeCost,
      costPerHour: finalCostPerHour
    });
  }
  
  return accumulation;
}

// Get color for wear rate
export function getWearRateColor(value: number): string {
  if (value === 0) return 'bg-gray-100';
  if (value <= 0.12) return 'bg-green-200';
  if (value <= 0.18) return 'bg-yellow-200';
  if (value <= 0.36) return 'bg-orange-200';
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