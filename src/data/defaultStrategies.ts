import { Strategy } from '../types';

export const defaultStrategies: Strategy[] = [
  {
    id: 'scenario1',
    name: 'Scenario 1 - No Stage 0 WP (Initial Install)',
    operatingHoursPerPeriod: 6000,
    totalHours: 110000,
    
    // Initial configuration
    initialFloorThickness: 25,
    floorMinThickness: 14,
    
    // Interventions
    interventions: [
      {
        operatingHours: 0,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 25,
        stage1MinThickness: 2,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 24000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 25,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 36000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 25,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 60000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: true,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 78000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 25,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 90000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 96000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 102000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 108000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 114000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      }
    ],
    
    // Wear rates (mm per 1000 hours) - FIXED: Stage 0 rate corrected to match Excel examples
    wearRates: {
      floor: 0.45,
      stage0: 0.45, // FIXED: Was 0, should be 0.45 based on Excel analysis
      stage1: 0.38, // FIXED: Was 0.36, should be 0.38 based on Excel examples
      stage2: 0.26, // FIXED: Was 0.36, should be 0.26 based on Excel examples
      stage3: 0.18,
      stage4: 0.12
    },
    
    // Cost structure - FIXED: Based on Excel analysis, corrected material and labor costs
    costs: {
      // Wear plate costs per tile (material only)
      stage4_20mm: 5,  // FIXED: Base material cost from Excel
      stage4_25mm: 8,  // FIXED: Base material cost from Excel
      stage3_20mm: 5,  // FIXED: Base material cost from Excel
      stage3_25mm: 8,  // FIXED: Base material cost from Excel
      stage2_20mm: 5,  // FIXED: Base material cost from Excel
      stage2_25mm: 8,  // FIXED: Base material cost from Excel
      stage1_20mm: 5,  // FIXED: Base material cost from Excel
      stage1_25mm: 8,  // FIXED: Base material cost from Excel
      stage0_20mm: 5,  // FIXED: Base material cost from Excel
      stage0_25mm: 8,  // FIXED: Base material cost from Excel
      
      // Quantities
      stage4Qty: 60,
      stage3Qty: 50,
      stage2Qty: 40,
      stage1Qty: 30,
      stage0Qty: 20,
      sidewallQty: 2,
      frontwallQty: 1,
      rebuildQty: 0,
      
      // Fixed costs
      sidewallCost: 36000,
      frontwallCost: 20000,
      rebuildCost: 0,
      
      // Labor (minutes per tile for WP, hours for major maintenance)
      laborRate: 120,           // $/hour
      laborWP20mm: 7,          // FIXED: 7 minutes per tile from Excel
      laborWP25mm: 7,          // FIXED: 7 minutes per tile from Excel
      laborSidewall: 520,      // hours
      laborFrontwall: 640,     // hours
      laborRebuild: 1200       // hours
    }
  },
  {
    id: 'scenario2',
    name: 'Scenario 2 - 25 mm Wear Plate installed in Stage 0 (Initial Install)',
    operatingHoursPerPeriod: 6000,
    totalHours: 110000,
    
    // Initial configuration
    initialFloorThickness: 25,
    floorMinThickness: 14,
    
    // Interventions
    interventions: [
      {
        operatingHours: 0,
        floorMinThickness: 14,
        stage0Thickness: 25,
        stage0MinThickness: -2, // Allow wearing into floor
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 24000,
        floorMinThickness: 14,
        stage0Thickness: 25,
        stage0MinThickness: 2,
        stage1Thickness: 25,
        stage1MinThickness: 2,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 36000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 20,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 60000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 25,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: true,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 78000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 84000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 20,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 90000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 96000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 102000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      },
      {
        operatingHours: 108000,
        floorMinThickness: 14,
        stage0Thickness: 0,
        stage0MinThickness: 0,
        stage1Thickness: 0,
        stage1MinThickness: 0,
        stage2Thickness: 0,
        stage2MinThickness: 0,
        stage3Thickness: 0,
        stage3MinThickness: 0,
        stage4Thickness: 0,
        stage4MinThickness: 0,
        sidewallReplacement: false,
        frontwallReplacement: false,
        rebuild: false
      }
    ],
    
    // Wear rates (mm per 1000 hours)
    wearRates: {
      floor: 0.45,
      stage0: 0.45,
      stage1: 0.36,
      stage2: 0.36,
      stage3: 0.18,
      stage4: 0.12
    },
    
    // Cost structure - FIXED: Consistent with scenario 1 corrections
    costs: {
      // Wear plate costs per tile (material only)
      stage4_20mm: 5,  // FIXED: Base material cost from Excel
      stage4_25mm: 8,  // FIXED: Base material cost from Excel
      stage3_20mm: 5,  // FIXED: Base material cost from Excel
      stage3_25mm: 8,  // FIXED: Base material cost from Excel
      stage2_20mm: 5,  // FIXED: Base material cost from Excel
      stage2_25mm: 8,  // FIXED: Base material cost from Excel
      stage1_20mm: 5,  // FIXED: Base material cost from Excel
      stage1_25mm: 8,  // FIXED: Base material cost from Excel
      stage0_20mm: 5,  // FIXED: Base material cost from Excel
      stage0_25mm: 8,  // FIXED: Base material cost from Excel
      
      // Quantities
      stage4Qty: 60,
      stage3Qty: 50,
      stage2Qty: 40,
      stage1Qty: 30,
      stage0Qty: 20,
      sidewallQty: 2,
      frontwallQty: 1,
      rebuildQty: 0,
      
      // Fixed costs
      sidewallCost: 36000,
      frontwallCost: 20000,
      rebuildCost: 0,
      
      // Labor (minutes per tile for WP, hours for major maintenance)
      laborRate: 120,           // $/hour
      laborWP20mm: 7,          // FIXED: 7 minutes per tile from Excel
      laborWP25mm: 7,          // FIXED: 7 minutes per tile from Excel
      laborSidewall: 520,      // hours
      laborFrontwall: 640,     // hours
      laborRebuild: 1200       // hours
    }
  }
];