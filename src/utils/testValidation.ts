import { Strategy } from '../types';
import { calculateWearAccumulation, calculateCostAccumulation } from './calculations';
import { defaultStrategies } from '../data/defaultStrategies';

export interface ValidationResult {
  passed: boolean;
  message: string;
  expected?: number;
  actual?: number;
  tolerance?: number;
}

export interface TestSuite {
  name: string;
  tests: ValidationResult[];
  passed: number;
  total: number;
  success: boolean;
}

// Expected results from Excel analysis (based on comprehensive analysis)
const EXCEL_EXPECTED_RESULTS = {
  scenario1: {
    totalCost: 138360,
    costPerHour: 1.26,
    maintenanceEvents: 3,
    finalFloorThickness: 14, // At end of lifecycle
    wearRates: {
      floor: 0.45,
      stage0: 0.45,
      stage1: 0.38,
      stage2: 0.26,
      stage3: 0.18,
      stage4: 0.12
    }
  },
  scenario2: {
    totalCost: 138940,
    costPerHour: 1.26,
    maintenanceEvents: 4,
    finalFloorThickness: 14,
    wearRates: {
      floor: 0.45,
      stage0: 0.45,
      stage1: 0.38,
      stage2: 0.26,
      stage3: 0.18,
      stage4: 0.12
    }
  }
};

// Validation tolerance for financial calculations (1% tolerance)
const COST_TOLERANCE = 0.01;
const WEAR_TOLERANCE = 0.001; // 0.1% tolerance for wear rates

export const validateWearRates = (strategy: Strategy): ValidationResult[] => {
  const results: ValidationResult[] = [];
  const expectedRates = EXCEL_EXPECTED_RESULTS[strategy.id as keyof typeof EXCEL_EXPECTED_RESULTS]?.wearRates;
  
  if (!expectedRates) {
    return [{
      passed: false,
      message: `No expected wear rates found for strategy: ${strategy.id}`,
    }];
  }

  Object.entries(expectedRates).forEach(([stage, expectedRate]) => {
    const actualRate = strategy.wearRates[stage as keyof typeof strategy.wearRates];
    const tolerance = Math.abs(expectedRate - actualRate);
    const passed = tolerance <= WEAR_TOLERANCE;

    results.push({
      passed,
      message: `${stage} wear rate validation`,
      expected: expectedRate,
      actual: actualRate,
      tolerance: WEAR_TOLERANCE
    });
  });

  return results;
};

export const validateCostCalculation = (strategy: Strategy): ValidationResult[] => {
  const results: ValidationResult[] = [];
  const expectedResults = EXCEL_EXPECTED_RESULTS[strategy.id as keyof typeof EXCEL_EXPECTED_RESULTS];
  
  if (!expectedResults) {
    return [{
      passed: false,
      message: `No expected results found for strategy: ${strategy.id}`,
    }];
  }

  try {
    const costData = calculateCostAccumulation(strategy);
    const finalCost = costData[costData.length - 1];

    // Validate total cost
    const costDifference = Math.abs(finalCost.cumulativeCost - expectedResults.totalCost) / expectedResults.totalCost;
    results.push({
      passed: costDifference <= COST_TOLERANCE,
      message: 'Total cost validation',
      expected: expectedResults.totalCost,
      actual: finalCost.cumulativeCost,
      tolerance: COST_TOLERANCE
    });

    // Validate cost per hour
    const costPerHourDifference = Math.abs(finalCost.costPerHour - expectedResults.costPerHour) / expectedResults.costPerHour;
    results.push({
      passed: costPerHourDifference <= COST_TOLERANCE,
      message: 'Cost per hour validation',
      expected: expectedResults.costPerHour,
      actual: finalCost.costPerHour,
      tolerance: COST_TOLERANCE
    });

  } catch (error) {
    results.push({
      passed: false,
      message: `Cost calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return results;
};

export const validateWearProgression = (strategy: Strategy): ValidationResult[] => {
  const results: ValidationResult[] = [];
  
  try {
    const wearData = calculateWearAccumulation(strategy);
    
    // Validate wear progression logic
    let previousWear = 0;
    for (const dataPoint of wearData) {
      // Floor wear should always be monotonically increasing
      const floorWearIncreasing = dataPoint.floor >= previousWear;
      results.push({
        passed: floorWearIncreasing,
        message: `Floor wear progression at ${dataPoint.hours} hours`,
        expected: previousWear,
        actual: dataPoint.floor
      });
      
      previousWear = dataPoint.floor;
      
      // All wear values should be non-negative
      const allNonNegative = [
        dataPoint.floor, dataPoint.stage0, dataPoint.stage1,
        dataPoint.stage2, dataPoint.stage3, dataPoint.stage4
      ].every(value => value >= 0);
      
      results.push({
        passed: allNonNegative,
        message: `Non-negative wear values at ${dataPoint.hours} hours`
      });
    }

    // Validate final floor thickness
    const finalFloorWear = wearData[wearData.length - 1].floor;
    const finalFloorThickness = strategy.initialFloorThickness - finalFloorWear;
    const expectedFinalThickness = EXCEL_EXPECTED_RESULTS[strategy.id as keyof typeof EXCEL_EXPECTED_RESULTS]?.finalFloorThickness;
    
    if (expectedFinalThickness !== undefined) {
      const thicknessDifference = Math.abs(finalFloorThickness - expectedFinalThickness);
      results.push({
        passed: thicknessDifference <= 1, // 1mm tolerance
        message: 'Final floor thickness validation',
        expected: expectedFinalThickness,
        actual: finalFloorThickness,
        tolerance: 1
      });
    }

  } catch (error) {
    results.push({
      passed: false,
      message: `Wear progression calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  return results;
};

export const validateMaintenanceScheduling = (strategy: Strategy): ValidationResult[] => {
  const results: ValidationResult[] = [];
  const expectedResults = EXCEL_EXPECTED_RESULTS[strategy.id as keyof typeof EXCEL_EXPECTED_RESULTS];
  
  if (!expectedResults) {
    return [{
      passed: false,
      message: `No expected results found for strategy: ${strategy.id}`,
    }];
  }

  // Count actual maintenance events
  const maintenanceEvents = strategy.interventions.filter(intervention => 
    intervention.stage0Thickness > 0 || intervention.stage1Thickness > 0 || 
    intervention.stage2Thickness > 0 || intervention.stage3Thickness > 0 || 
    intervention.stage4Thickness > 0 || intervention.sidewallReplacement || 
    intervention.frontwallReplacement || intervention.rebuild
  ).length;

  results.push({
    passed: maintenanceEvents === expectedResults.maintenanceEvents,
    message: 'Maintenance event count validation',
    expected: expectedResults.maintenanceEvents,
    actual: maintenanceEvents
  });

  // Validate intervention timing logic
  const sortedInterventions = [...strategy.interventions].sort((a, b) => a.operatingHours - b.operatingHours);
  
  for (let i = 1; i < sortedInterventions.length; i++) {
    const currentHours = sortedInterventions[i].operatingHours;
    const previousHours = sortedInterventions[i - 1].operatingHours;
    
    results.push({
      passed: currentHours >= previousHours,
      message: `Intervention timing sequence at ${currentHours} hours`,
      expected: previousHours,
      actual: currentHours
    });
  }

  return results;
};

export const runComprehensiveValidation = (): TestSuite[] => {
  const testSuites: TestSuite[] = [];

  defaultStrategies.forEach(strategy => {
    const wearRateTests = validateWearRates(strategy);
    const costTests = validateCostCalculation(strategy);
    const wearProgressionTests = validateWearProgression(strategy);
    const maintenanceTests = validateMaintenanceScheduling(strategy);

    const allTests = [
      ...wearRateTests,
      ...costTests,
      ...wearProgressionTests,
      ...maintenanceTests
    ];

    const passed = allTests.filter(test => test.passed).length;
    const total = allTests.length;

    testSuites.push({
      name: strategy.name,
      tests: allTests,
      passed,
      total,
      success: passed === total
    });
  });

  return testSuites;
};

export const generateValidationReport = (): string => {
  const testSuites = runComprehensiveValidation();
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.total, 0);
  const overallSuccess = totalPassed === totalTests;

  let report = `# TCO Advanced V4 - Validation Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Overall Status:** ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}\n`;
  report += `**Tests Passed:** ${totalPassed}/${totalTests} (${((totalPassed / totalTests) * 100).toFixed(1)}%)\n\n`;

  testSuites.forEach(suite => {
    const status = suite.success ? '✅' : '❌';
    report += `## ${status} ${suite.name}\n`;
    report += `**Passed:** ${suite.passed}/${suite.total}\n\n`;

    suite.tests.forEach(test => {
      const testStatus = test.passed ? '✅' : '❌';
      report += `- ${testStatus} ${test.message}`;
      
      if (!test.passed && test.expected !== undefined && test.actual !== undefined) {
        report += ` (Expected: ${test.expected}, Actual: ${test.actual})`;
      }
      
      report += '\n';
    });

    report += '\n';
  });

  return report;
};

// Export functions for use in components
export const runQuickValidation = (strategy: Strategy): { passed: number; total: number; success: boolean } => {
  const wearRateTests = validateWearRates(strategy);
  const costTests = validateCostCalculation(strategy);
  
  const allTests = [...wearRateTests, ...costTests];
  const passed = allTests.filter(test => test.passed).length;
  const total = allTests.length;

  return {
    passed,
    total,
    success: passed === total
  };
};