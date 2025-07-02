import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calculator, Eye } from 'lucide-react';
import { Strategy } from '../types';

interface FormulaDisplayProps {
  strategy: Strategy;
}

interface FormulaStep {
  description: string;
  formula: string;
  calculation: string;
  result: number | string;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ strategy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('wear');

  // Generate wear calculation formulas
  const generateWearFormulas = (): FormulaStep[] => {
    const steps: FormulaStep[] = [];
    
    steps.push({
      description: "Floor Wear Rate",
      formula: "Floor Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.floor} / 1000)`,
      result: `${strategy.wearRates.floor} mm per 1000 hours`
    });

    steps.push({
      description: "Stage 0 Wear Rate",
      formula: "Stage 0 Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.stage0} / 1000)`,
      result: `${strategy.wearRates.stage0} mm per 1000 hours`
    });

    steps.push({
      description: "Stage 1 Wear Rate",
      formula: "Stage 1 Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.stage1} / 1000)`,
      result: `${strategy.wearRates.stage1} mm per 1000 hours`
    });

    steps.push({
      description: "Stage 2 Wear Rate",
      formula: "Stage 2 Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.stage2} / 1000)`,
      result: `${strategy.wearRates.stage2} mm per 1000 hours`
    });

    steps.push({
      description: "Stage 3 Wear Rate",
      formula: "Stage 3 Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.stage3} / 1000)`,
      result: `${strategy.wearRates.stage3} mm per 1000 hours`
    });

    steps.push({
      description: "Stage 4 Wear Rate",
      formula: "Stage 4 Wear = Operating Hours × (Wear Rate / 1000)",
      calculation: `Wear = Hours × (${strategy.wearRates.stage4} / 1000)`,
      result: `${strategy.wearRates.stage4} mm per 1000 hours`
    });

    return steps;
  };

  // Generate cost calculation formulas
  const generateCostFormulas = (): FormulaStep[] => {
    const steps: FormulaStep[] = [];
    
    steps.push({
      description: "Material Cost Calculation",
      formula: "Material Cost = Quantity × Unit Cost",
      calculation: `Stage1 25mm = ${strategy.costs.stage1Qty} × $${strategy.costs.stage1_25mm}`,
      result: `$${strategy.costs.stage1Qty * strategy.costs.stage1_25mm}`
    });

    steps.push({
      description: "Labor Cost Calculation",
      formula: "Labor Cost = (Labor Time × Quantity × Labor Rate) / 60",
      calculation: `Labor = (${strategy.costs.laborWP25mm} min × Qty × $${strategy.costs.laborRate}/hr) / 60`,
      result: `Labor cost per installation`
    });

    steps.push({
      description: "Total Installation Cost",
      formula: "Total Cost = Material Cost + Labor Cost",
      calculation: "Total = Material + Labor",
      result: "Complete intervention cost"
    });

    steps.push({
      description: "Sidewall Replacement Cost",
      formula: "Sidewall Cost = Fixed Cost + (Labor Hours × Labor Rate)",
      calculation: `Sidewall = $${strategy.costs.sidewallCost} + (${strategy.costs.laborSidewall}hrs × $${strategy.costs.laborRate}/hr)`,
      result: `$${strategy.costs.sidewallCost + (strategy.costs.laborSidewall * strategy.costs.laborRate)}`
    });

    steps.push({
      description: "Frontwall Replacement Cost",
      formula: "Frontwall Cost = Fixed Cost + (Labor Hours × Labor Rate)",
      calculation: `Frontwall = $${strategy.costs.frontwallCost} + (${strategy.costs.laborFrontwall}hrs × $${strategy.costs.laborRate}/hr)`,
      result: `$${strategy.costs.frontwallCost + (strategy.costs.laborFrontwall * strategy.costs.laborRate)}`
    });

    return steps;
  };

  // Generate protection hierarchy formulas
  const generateProtectionFormulas = (): FormulaStep[] => {
    const steps: FormulaStep[] = [];
    
    steps.push({
      description: "Protection Hierarchy Logic",
      formula: "IF Stage4 > MinThickness, THEN Wear Stage4, ELSE Wear Stage3",
      calculation: "Hierarchical wear protection system",
      result: "Stage 4 → Stage 3 → Stage 2 → Stage 1 → Stage 0 → Floor"
    });

    steps.push({
      description: "Effective Thickness Calculation",
      formula: "Available Thickness = Current Thickness - Minimum Thickness",
      calculation: "Protection = Current - Minimum",
      result: "Available protection before next stage"
    });

    steps.push({
      description: "Intervention Trigger Logic",
      formula: "IF Available Thickness ≤ 0, THEN Trigger Intervention",
      calculation: "Intervention needed when protection exhausted",
      result: "Maintenance scheduling logic"
    });

    return steps;
  };

  const renderFormulaSteps = (steps: FormulaStep[]) => {
    return steps.map((step, index) => (
      <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-900 mb-2">{step.description}</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Formula: </span>
            <code className="bg-gray-200 px-2 py-1 rounded font-mono text-blue-800">
              {step.formula}
            </code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Calculation: </span>
            <code className="bg-gray-200 px-2 py-1 rounded font-mono text-green-800">
              {step.calculation}
            </code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Result: </span>
            <span className="bg-yellow-100 px-2 py-1 rounded font-semibold text-yellow-800">
              {step.result}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  if (!isExpanded) {
    return (
      <div className="bg-white rounded-lg shadow p-4 border">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <Calculator className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Show Calculation Formulas</span>
          <span className="text-sm text-gray-500 ml-auto">Click to view detailed calculations</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b">
        <button
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
          <Calculator className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Calculation Formulas - {strategy.name}</span>
          <span className="text-sm text-gray-500 ml-auto">Click to hide</span>
        </button>
      </div>

      <div className="p-4">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveSection('wear')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === 'wear'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Wear Calculations
          </button>
          <button
            onClick={() => setActiveSection('cost')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === 'cost'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Cost Calculations
          </button>
          <button
            onClick={() => setActiveSection('protection')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === 'protection'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Protection Logic
          </button>
        </div>

        {/* Formula Content */}
        <div className="space-y-4">
          {activeSection === 'wear' && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wear Rate Formulas</h3>
              <div className="space-y-4">
                {renderFormulaSteps(generateWearFormulas())}
              </div>
            </>
          )}

          {activeSection === 'cost' && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Calculation Formulas</h3>
              <div className="space-y-4">
                {renderFormulaSteps(generateCostFormulas())}
              </div>
            </>
          )}

          {activeSection === 'protection' && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protection Hierarchy Logic</h3>
              <div className="space-y-4">
                {renderFormulaSteps(generateProtectionFormulas())}
              </div>
            </>
          )}
        </div>

        {/* Summary Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Formula Transparency</h4>
              <p className="text-sm text-blue-800">
                These formulas show exactly how the TCO calculations are performed, matching the logic 
                from the original Excel models. All calculations are performed in real-time as you 
                modify parameters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};