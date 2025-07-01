import { 
  Strategy, 
  WearRates, 
  MaintenanceIntervention, 
  CostStructure,
  ValidationError,
  WEAR_RATE_LIMITS,
  THICKNESS_LIMITS,
  OPERATING_HOURS_LIMITS
} from '../types';

/**
 * Enhanced validation utilities for TCO calculations
 * Addresses critical bugs identified in Excel analysis
 */

export class TCOValidator {
  private errors: ValidationError[] = [];

  // Validate wear rates against industry standards
  validateWearRate(value: number, field: string): number {
    if (value < WEAR_RATE_LIMITS.MIN || value > WEAR_RATE_LIMITS.MAX) {
      this.errors.push({
        field,
        value,
        expectedRange: [WEAR_RATE_LIMITS.MIN, WEAR_RATE_LIMITS.MAX],
        message: `Wear rate ${value} is outside valid range [${WEAR_RATE_LIMITS.MIN}, ${WEAR_RATE_LIMITS.MAX}] mm/1000hrs`
      });
      return Math.max(WEAR_RATE_LIMITS.MIN, Math.min(WEAR_RATE_LIMITS.MAX, value));
    }
    return value;
  }

  // Validate thickness values
  validateThickness(value: number, field: string, minThickness: number = THICKNESS_LIMITS.MIN): number {
    const min = Math.max(minThickness, THICKNESS_LIMITS.MIN);
    if (value < min || value > THICKNESS_LIMITS.MAX) {
      this.errors.push({
        field,
        value,
        expectedRange: [min, THICKNESS_LIMITS.MAX],
        message: `Thickness ${value} is outside valid range [${min}, ${THICKNESS_LIMITS.MAX}] mm`
      });
      return Math.max(min, Math.min(THICKNESS_LIMITS.MAX, value));
    }
    return value;
  }

  // Validate operating hours
  validateOperatingHours(value: number, field: string): number {
    if (value < OPERATING_HOURS_LIMITS.MIN || value > OPERATING_HOURS_LIMITS.MAX) {
      this.errors.push({
        field,
        value,
        expectedRange: [OPERATING_HOURS_LIMITS.MIN, OPERATING_HOURS_LIMITS.MAX],
        message: `Operating hours ${value} is outside valid range [${OPERATING_HOURS_LIMITS.MIN}, ${OPERATING_HOURS_LIMITS.MAX}]`
      });
      return Math.max(OPERATING_HOURS_LIMITS.MIN, Math.min(OPERATING_HOURS_LIMITS.MAX, value));
    }
    return value;
  }

  // Validate cost values
  validateCost(value: number, field: string): number {
    if (value < 0) {
      this.errors.push({
        field,
        value,
        expectedRange: [0, Number.MAX_SAFE_INTEGER],
        message: `Cost ${value} cannot be negative`
      });
      return 0;
    }
    return value;
  }

  // Validate wear rates structure
  validateWearRates(wearRates: WearRates): WearRates {
    return {
      floor: this.validateWearRate(wearRates.floor, 'wearRates.floor'),
      stage0: this.validateWearRate(wearRates.stage0, 'wearRates.stage0'),
      stage1: this.validateWearRate(wearRates.stage1, 'wearRates.stage1'),
      stage2: this.validateWearRate(wearRates.stage2, 'wearRates.stage2'),
      stage3: this.validateWearRate(wearRates.stage3, 'wearRates.stage3'),
      stage4: this.validateWearRate(wearRates.stage4, 'wearRates.stage4')
    };
  }

  // Validate intervention sequence (hours must be ascending)
  validateInterventionSequence(interventions: MaintenanceIntervention[]): MaintenanceIntervention[] {
    const validatedInterventions = [...interventions];
    
    for (let i = 0; i < validatedInterventions.length; i++) {
      const intervention = validatedInterventions[i];
      
      // Validate operating hours
      intervention.operatingHours = this.validateOperatingHours(
        intervention.operatingHours, 
        `interventions[${i}].operatingHours`
      );
      
      // Ensure ascending order
      if (i > 0 && intervention.operatingHours <= validatedInterventions[i - 1].operatingHours) {
        const correctedHours = validatedInterventions[i - 1].operatingHours + 1000;
        this.errors.push({
          field: `interventions[${i}].operatingHours`,
          value: intervention.operatingHours,
          expectedRange: [correctedHours, OPERATING_HOURS_LIMITS.MAX],
          message: `Intervention hours must be ascending. Correcting ${intervention.operatingHours} to ${correctedHours}`
        });
        intervention.operatingHours = correctedHours;
      }
      
      // Validate thickness values
      intervention.stage0Thickness = this.validateThickness(intervention.stage0Thickness, `interventions[${i}].stage0Thickness`);
      intervention.stage1Thickness = this.validateThickness(intervention.stage1Thickness, `interventions[${i}].stage1Thickness`);
      intervention.stage2Thickness = this.validateThickness(intervention.stage2Thickness, `interventions[${i}].stage2Thickness`);
      intervention.stage3Thickness = this.validateThickness(intervention.stage3Thickness, `interventions[${i}].stage3Thickness`);
      intervention.stage4Thickness = this.validateThickness(intervention.stage4Thickness, `interventions[${i}].stage4Thickness`);
      
      // Validate minimum thicknesses
      intervention.floorMinThickness = this.validateThickness(intervention.floorMinThickness, `interventions[${i}].floorMinThickness`);
      intervention.stage0MinThickness = this.validateThickness(intervention.stage0MinThickness, `interventions[${i}].stage0MinThickness`, -5); // Allow negative for stage 0
      intervention.stage1MinThickness = this.validateThickness(intervention.stage1MinThickness, `interventions[${i}].stage1MinThickness`);
      intervention.stage2MinThickness = this.validateThickness(intervention.stage2MinThickness, `interventions[${i}].stage2MinThickness`);
      intervention.stage3MinThickness = this.validateThickness(intervention.stage3MinThickness, `interventions[${i}].stage3MinThickness`);
      intervention.stage4MinThickness = this.validateThickness(intervention.stage4MinThickness, `interventions[${i}].stage4MinThickness`);
    }
    
    return validatedInterventions;
  }

  // Validate cost structure
  validateCostStructure(costs: CostStructure): CostStructure {
    return {
      // Wear plate costs
      stage4_20mm: this.validateCost(costs.stage4_20mm, 'costs.stage4_20mm'),
      stage4_25mm: this.validateCost(costs.stage4_25mm, 'costs.stage4_25mm'),
      stage3_20mm: this.validateCost(costs.stage3_20mm, 'costs.stage3_20mm'),
      stage3_25mm: this.validateCost(costs.stage3_25mm, 'costs.stage3_25mm'),
      stage2_20mm: this.validateCost(costs.stage2_20mm, 'costs.stage2_20mm'),
      stage2_25mm: this.validateCost(costs.stage2_25mm, 'costs.stage2_25mm'),
      stage1_20mm: this.validateCost(costs.stage1_20mm, 'costs.stage1_20mm'),
      stage1_25mm: this.validateCost(costs.stage1_25mm, 'costs.stage1_25mm'),
      stage0_20mm: this.validateCost(costs.stage0_20mm, 'costs.stage0_20mm'),
      stage0_25mm: this.validateCost(costs.stage0_25mm, 'costs.stage0_25mm'),
      
      // Quantities (must be positive integers)
      stage4Qty: Math.max(0, Math.floor(costs.stage4Qty)),
      stage3Qty: Math.max(0, Math.floor(costs.stage3Qty)),
      stage2Qty: Math.max(0, Math.floor(costs.stage2Qty)),
      stage1Qty: Math.max(0, Math.floor(costs.stage1Qty)),
      stage0Qty: Math.max(0, Math.floor(costs.stage0Qty)),
      sidewallQty: Math.max(0, Math.floor(costs.sidewallQty)),
      frontwallQty: Math.max(0, Math.floor(costs.frontwallQty)),
      rebuildQty: Math.max(0, Math.floor(costs.rebuildQty)),
      
      // Fixed costs
      sidewallCost: this.validateCost(costs.sidewallCost, 'costs.sidewallCost'),
      frontwallCost: this.validateCost(costs.frontwallCost, 'costs.frontwallCost'),
      rebuildCost: this.validateCost(costs.rebuildCost, 'costs.rebuildCost'),
      
      // Labor
      laborRate: this.validateCost(costs.laborRate, 'costs.laborRate'),
      laborWP20mm: this.validateCost(costs.laborWP20mm, 'costs.laborWP20mm'),
      laborWP25mm: this.validateCost(costs.laborWP25mm, 'costs.laborWP25mm'),
      laborSidewall: this.validateCost(costs.laborSidewall, 'costs.laborSidewall'),
      laborFrontwall: this.validateCost(costs.laborFrontwall, 'costs.laborFrontwall'),
      laborRebuild: this.validateCost(costs.laborRebuild, 'costs.laborRebuild')
    };
  }

  // Comprehensive strategy validation
  validateStrategy(strategy: Strategy): { validatedStrategy: Strategy; errors: ValidationError[] } {
    this.errors = []; // Reset errors

    const validatedStrategy: Strategy = {
      ...strategy,
      
      // Basic parameters
      operatingHoursPerPeriod: this.validateOperatingHours(strategy.operatingHoursPerPeriod, 'operatingHoursPerPeriod'),
      totalHours: this.validateOperatingHours(strategy.totalHours, 'totalHours'),
      
      // Initial configuration
      initialFloorThickness: this.validateThickness(strategy.initialFloorThickness, 'initialFloorThickness'),
      floorMinThickness: this.validateThickness(strategy.floorMinThickness, 'floorMinThickness'),
      
      // Wear rates
      wearRates: this.validateWearRates(strategy.wearRates),
      
      // Interventions
      interventions: this.validateInterventionSequence(strategy.interventions),
      
      // Cost structure
      costs: this.validateCostStructure(strategy.costs)
    };

    // Additional business logic validation
    if (validatedStrategy.totalHours < validatedStrategy.operatingHoursPerPeriod) {
      this.errors.push({
        field: 'totalHours',
        value: validatedStrategy.totalHours,
        expectedRange: [validatedStrategy.operatingHoursPerPeriod, OPERATING_HOURS_LIMITS.MAX],
        message: 'Total hours must be greater than operating hours per period'
      });
    }

    if (validatedStrategy.initialFloorThickness <= validatedStrategy.floorMinThickness) {
      this.errors.push({
        field: 'initialFloorThickness',
        value: validatedStrategy.initialFloorThickness,
        expectedRange: [validatedStrategy.floorMinThickness + 1, THICKNESS_LIMITS.MAX],
        message: 'Initial floor thickness must be greater than minimum thickness'
      });
    }

    return {
      validatedStrategy,
      errors: [...this.errors]
    };
  }

  // Get validation summary
  getValidationSummary(): { isValid: boolean; errorCount: number; errors: ValidationError[] } {
    return {
      isValid: this.errors.length === 0,
      errorCount: this.errors.length,
      errors: [...this.errors]
    };
  }
}

// Singleton validator instance
export const validator = new TCOValidator();

// Convenience function for quick validation
export function validateStrategy(strategy: Strategy) {
  return validator.validateStrategy(strategy);
}