import * as XLSX from 'xlsx';
import { Strategy, WearRates, CostStructure, MaintenanceIntervention } from '../types';

export interface ExcelStrategy {
  name: string;
  operatingHoursPerPeriod: number;
  totalHours: number;
  initialFloorThickness: number;
  floorMinThickness: number;
  wearRates: WearRates;
  costs: CostStructure;
  interventions: MaintenanceIntervention[];
}

export const exportToExcel = (strategies: Strategy[]): void => {
  const workbook = XLSX.utils.book_new();

  strategies.forEach((strategy) => {
    // Create strategy overview sheet
    const overviewData = [
      ['Parameter', 'Value'],
      ['Strategy Name', strategy.name],
      ['Operating Hours per Period', strategy.operatingHoursPerPeriod],
      ['Total Hours', strategy.totalHours],
      ['Initial Floor Thickness (mm)', strategy.initialFloorThickness],
      ['Floor Minimum Thickness (mm)', strategy.floorMinThickness],
      [],
      ['Wear Rates (mm/1000hrs)', ''],
      ['Floor', strategy.wearRates.floor],
      ['Stage 0', strategy.wearRates.stage0],
      ['Stage 1', strategy.wearRates.stage1],
      ['Stage 2', strategy.wearRates.stage2],
      ['Stage 3', strategy.wearRates.stage3],
      ['Stage 4', strategy.wearRates.stage4],
      [],
      ['Cost Structure', ''],
      ['Labor Rate ($/hr)', strategy.costs.laborRate.toString()],
      ['Stage 4 20mm Cost', strategy.costs.stage4_20mm.toString()],
      ['Stage 4 25mm Cost', strategy.costs.stage4_25mm.toString()],
      ['Stage 3 20mm Cost', strategy.costs.stage3_20mm.toString()],
      ['Stage 3 25mm Cost', strategy.costs.stage3_25mm.toString()],
      ['Stage 2 20mm Cost', strategy.costs.stage2_20mm.toString()],
      ['Stage 2 25mm Cost', strategy.costs.stage2_25mm.toString()],
      ['Stage 1 20mm Cost', strategy.costs.stage1_20mm.toString()],
      ['Stage 1 25mm Cost', strategy.costs.stage1_25mm.toString()],
      ['Stage 0 20mm Cost', strategy.costs.stage0_20mm.toString()],
      ['Stage 0 25mm Cost', strategy.costs.stage0_25mm.toString()],
      ['Sidewall Cost', strategy.costs.sidewallCost.toString()],
      ['Frontwall Cost', strategy.costs.frontwallCost.toString()],
      ['Rebuild Cost', strategy.costs.rebuildCost.toString()]
    ];

    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, `${strategy.name.substring(0, 25)}_Overview`);

    // Create interventions sheet
    const interventionsData = [
      [
        'Operating Hours',
        'Floor Min Thickness',
        'Stage 0 Thickness',
        'Stage 0 Min Thickness',
        'Stage 1 Thickness',
        'Stage 1 Min Thickness',
        'Stage 2 Thickness',
        'Stage 2 Min Thickness',
        'Stage 3 Thickness',
        'Stage 3 Min Thickness',
        'Stage 4 Thickness',
        'Stage 4 Min Thickness',
        'Sidewall Replacement',
        'Frontwall Replacement',
        'Rebuild'
      ]
    ];

    strategy.interventions.forEach(intervention => {
      interventionsData.push([
        intervention.operatingHours.toString(),
        intervention.floorMinThickness.toString(),
        intervention.stage0Thickness.toString(),
        intervention.stage0MinThickness.toString(),
        intervention.stage1Thickness.toString(),
        intervention.stage1MinThickness.toString(),
        intervention.stage2Thickness.toString(),
        intervention.stage2MinThickness.toString(),
        intervention.stage3Thickness.toString(),
        intervention.stage3MinThickness.toString(),
        intervention.stage4Thickness.toString(),
        intervention.stage4MinThickness.toString(),
        intervention.sidewallReplacement ? 'Yes' : 'No',
        intervention.frontwallReplacement ? 'Yes' : 'No',
        intervention.rebuild ? 'Yes' : 'No'
      ]);
    });

    const interventionsSheet = XLSX.utils.aoa_to_sheet(interventionsData);
    XLSX.utils.book_append_sheet(workbook, interventionsSheet, `${strategy.name.substring(0, 25)}_Interventions`);
  });

  // Write file
  const fileName = `TCO_Strategies_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const importFromExcel = (file: File): Promise<Strategy[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const strategies: Strategy[] = [];
        const strategyNames: string[] = [];
        
        // Find strategy overview sheets
        workbook.SheetNames.forEach(sheetName => {
          if (sheetName.endsWith('_Overview')) {
            const strategyName = sheetName.replace('_Overview', '');
            strategyNames.push(strategyName);
          }
        });

        // Process each strategy
        strategyNames.forEach(strategyName => {
          const overviewSheetName = `${strategyName}_Overview`;
          const interventionsSheetName = `${strategyName}_Interventions`;
          
          if (!workbook.Sheets[overviewSheetName] || !workbook.Sheets[interventionsSheetName]) {
            console.warn(`Missing sheets for strategy: ${strategyName}`);
            return;
          }

          const overviewSheet = workbook.Sheets[overviewSheetName];
          const interventionsSheet = workbook.Sheets[interventionsSheetName];
          
          // Parse overview data
          const overviewData = XLSX.utils.sheet_to_json(overviewSheet, { header: 1 }) as any[][];
          const interventionsData = XLSX.utils.sheet_to_json(interventionsSheet, { header: 1 }) as any[][];

          // Extract strategy data from overview
          const getValue = (key: string) => {
            const row = overviewData.find(row => row[0] === key);
            return row ? row[1] : null;
          };

          const strategy: Strategy = {
            id: `imported-${Date.now()}-${Math.random()}`,
            name: getValue('Strategy Name') || strategyName,
            operatingHoursPerPeriod: getValue('Operating Hours per Period') || 6000,
            totalHours: getValue('Total Hours') || 110000,
            initialFloorThickness: getValue('Initial Floor Thickness (mm)') || 25,
            floorMinThickness: getValue('Floor Minimum Thickness (mm)') || 14,
            wearRates: {
              floor: getValue('Floor') || 0.45,
              stage0: getValue('Stage 0') || 0.45,
              stage1: getValue('Stage 1') || 0.38,
              stage2: getValue('Stage 2') || 0.26,
              stage3: getValue('Stage 3') || 0.18,
              stage4: getValue('Stage 4') || 0.12
            },
            costs: {
              laborRate: getValue('Labor Rate ($/hr)') || 120,
              stage4_20mm: getValue('Stage 4 20mm Cost') || 5,
              stage4_25mm: getValue('Stage 4 25mm Cost') || 8,
              stage3_20mm: getValue('Stage 3 20mm Cost') || 5,
              stage3_25mm: getValue('Stage 3 25mm Cost') || 8,
              stage2_20mm: getValue('Stage 2 20mm Cost') || 5,
              stage2_25mm: getValue('Stage 2 25mm Cost') || 8,
              stage1_20mm: getValue('Stage 1 20mm Cost') || 5,
              stage1_25mm: getValue('Stage 1 25mm Cost') || 8,
              stage0_20mm: getValue('Stage 0 20mm Cost') || 5,
              stage0_25mm: getValue('Stage 0 25mm Cost') || 8,
              sidewallCost: getValue('Sidewall Cost') || 36000,
              frontwallCost: getValue('Frontwall Cost') || 20000,
              rebuildCost: getValue('Rebuild Cost') || 0,
              // Default quantities
              stage4Qty: 60,
              stage3Qty: 50,
              stage2Qty: 40,
              stage1Qty: 30,
              stage0Qty: 20,
              sidewallQty: 2,
              frontwallQty: 1,
              rebuildQty: 0,
              laborWP20mm: 7,
              laborWP25mm: 7,
              laborSidewall: 520,
              laborFrontwall: 640,
              laborRebuild: 1200
            },
            interventions: []
          };

          // Parse interventions (skip header row)
          for (let i = 1; i < interventionsData.length; i++) {
            const row = interventionsData[i];
            if (row && row[0] !== undefined) {
              const intervention: MaintenanceIntervention = {
                operatingHours: Number(row[0]) || 0,
                floorMinThickness: Number(row[1]) || 14,
                stage0Thickness: Number(row[2]) || 0,
                stage0MinThickness: Number(row[3]) || 0,
                stage1Thickness: Number(row[4]) || 0,
                stage1MinThickness: Number(row[5]) || 0,
                stage2Thickness: Number(row[6]) || 0,
                stage2MinThickness: Number(row[7]) || 0,
                stage3Thickness: Number(row[8]) || 0,
                stage3MinThickness: Number(row[9]) || 0,
                stage4Thickness: Number(row[10]) || 0,
                stage4MinThickness: Number(row[11]) || 0,
                sidewallReplacement: row[12] === 'Yes' || row[12] === true,
                frontwallReplacement: row[13] === 'Yes' || row[13] === true,
                rebuild: row[14] === 'Yes' || row[14] === true
              };
              strategy.interventions.push(intervention);
            }
          }

          strategies.push(strategy);
        });

        resolve(strategies);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

// Create Excel template for users
export const createExcelTemplate = (): void => {
  const workbook = XLSX.utils.book_new();

  // Template overview sheet
  const templateOverviewData = [
    ['Parameter', 'Value', 'Description'],
    ['Strategy Name', 'My TCO Strategy', 'Name of your strategy'],
    ['Operating Hours per Period', 6000, 'Operating hours per maintenance period'],
    ['Total Hours', 110000, 'Total operating hours for analysis'],
    ['Initial Floor Thickness (mm)', 25, 'Starting floor thickness'],
    ['Floor Minimum Thickness (mm)', 14, 'Minimum allowable floor thickness'],
    [],
    ['Wear Rates (mm/1000hrs)', '', 'Wear rates for each component'],
    ['Floor', 0.45, 'Floor wear rate'],
    ['Stage 0', 0.45, 'Stage 0 wear plate wear rate'],
    ['Stage 1', 0.38, 'Stage 1 wear plate wear rate'],
    ['Stage 2', 0.26, 'Stage 2 wear plate wear rate'],
    ['Stage 3', 0.18, 'Stage 3 wear plate wear rate'],
    ['Stage 4', 0.12, 'Stage 4 wear plate wear rate'],
    [],
    ['Cost Structure', '', 'Cost parameters'],
    ['Labor Rate ($/hr)', 120, 'Hourly labor rate'],
    ['Stage 4 20mm Cost', 5, 'Cost per Stage 4 20mm wear plate'],
    ['Stage 4 25mm Cost', 8, 'Cost per Stage 4 25mm wear plate'],
    ['Stage 3 20mm Cost', 5, 'Cost per Stage 3 20mm wear plate'],
    ['Stage 3 25mm Cost', 8, 'Cost per Stage 3 25mm wear plate'],
    ['Stage 2 20mm Cost', 5, 'Cost per Stage 2 20mm wear plate'],
    ['Stage 2 25mm Cost', 8, 'Cost per Stage 2 25mm wear plate'],
    ['Stage 1 20mm Cost', 5, 'Cost per Stage 1 20mm wear plate'],
    ['Stage 1 25mm Cost', 8, 'Cost per Stage 1 25mm wear plate'],
    ['Stage 0 20mm Cost', 5, 'Cost per Stage 0 20mm wear plate'],
    ['Stage 0 25mm Cost', 8, 'Cost per Stage 0 25mm wear plate'],
    ['Sidewall Cost', 36000, 'Cost for sidewall replacement'],
    ['Frontwall Cost', 20000, 'Cost for frontwall replacement'],
    ['Rebuild Cost', 0, 'Cost for complete rebuild']
  ];

  const templateOverviewSheet = XLSX.utils.aoa_to_sheet(templateOverviewData);
  XLSX.utils.book_append_sheet(workbook, templateOverviewSheet, 'My TCO Strategy_Overview');

  // Template interventions sheet
  const templateInterventionsData = [
    [
      'Operating Hours',
      'Floor Min Thickness', 
      'Stage 0 Thickness',
      'Stage 0 Min Thickness',
      'Stage 1 Thickness',
      'Stage 1 Min Thickness',
      'Stage 2 Thickness', 
      'Stage 2 Min Thickness',
      'Stage 3 Thickness',
      'Stage 3 Min Thickness',
      'Stage 4 Thickness',
      'Stage 4 Min Thickness',
      'Sidewall Replacement',
      'Frontwall Replacement',
      'Rebuild'
    ],
    [0, 14, 0, 0, 25, 2, 0, 0, 0, 0, 0, 0, 'No', 'No', 'No'],
    [24000, 14, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 'No', 'No', 'No'],
    [36000, 14, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 'No', 'No', 'No']
  ];

  const templateInterventionsSheet = XLSX.utils.aoa_to_sheet(templateInterventionsData);
  XLSX.utils.book_append_sheet(workbook, templateInterventionsSheet, 'My TCO Strategy_Interventions');

  // Instructions sheet
  const instructionsData = [
    ['TCO Advanced V4 - Excel Template Instructions'],
    [],
    ['How to use this template:'],
    ['1. Fill in the Overview sheet with your strategy parameters'],
    ['2. Define your maintenance interventions in the Interventions sheet'],
    ['3. Save the file and import it into TCO Advanced V4'],
    [],
    ['Sheet Naming Convention:'],
    ['- Overview sheets must end with "_Overview"'],
    ['- Interventions sheets must end with "_Interventions"'],
    ['- Both sheets must have the same prefix (strategy name)'],
    [],
    ['Tips:'],
    ['- You can create multiple strategies by duplicating the sheets'],
    ['- Change the sheet names to match your strategy names'],
    ['- Use "Yes"/"No" for boolean fields in interventions'],
    ['- All thickness values are in millimeters'],
    ['- All hours are operating hours, not calendar hours'],
    [],
    ['For support, visit: https://github.com/your-repo']
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Write template file
  XLSX.writeFile(workbook, 'TCO_Strategy_Template.xlsx');
};