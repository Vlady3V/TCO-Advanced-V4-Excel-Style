import React from 'react';
import { Strategy } from '../types';
import { WearRateInput } from './WearRateInput';
import { MaintenanceSchedule } from './MaintenanceSchedule';
import { Settings, DollarSign, Clock } from 'lucide-react';

interface StrategyEditorProps {
  strategy: Strategy;
  onChange: (strategy: Strategy) => void;
}

export const StrategyEditor: React.FC<StrategyEditorProps> = ({ strategy, onChange }) => {
  const handleBasicChange = (field: string, value: string | number) => {
    onChange({
      ...strategy,
      [field]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    });
  };

  const handleCostChange = (field: string, value: string) => {
    onChange({
      ...strategy,
      costs: {
        ...strategy.costs,
        [field]: parseFloat(value) || 0
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Basic Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategy Name
            </label>
            <input
              type="text"
              value={strategy.name}
              onChange={(e) => handleBasicChange('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operating Hours per Period
            </label>
            <input
              type="number"
              value={strategy.operatingHoursPerPeriod}
              onChange={(e) => handleBasicChange('operatingHoursPerPeriod', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Operating Hours
            </label>
            <input
              type="number"
              value={strategy.totalHours}
              onChange={(e) => handleBasicChange('totalHours', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Floor Thickness (mm)
            </label>
            <input
              type="number"
              value={strategy.initialFloorThickness}
              onChange={(e) => handleBasicChange('initialFloorThickness', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor Minimum Thickness (mm)
            </label>
            <input
              type="number"
              value={strategy.floorMinThickness}
              onChange={(e) => handleBasicChange('floorMinThickness', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Wear Rates */}
      <WearRateInput 
        wearRates={strategy.wearRates}
        onChange={(wearRates) => onChange({ ...strategy, wearRates })}
      />

      {/* Maintenance Schedule */}
      <MaintenanceSchedule
        interventions={strategy.interventions}
        totalHours={strategy.totalHours}
        onChange={(interventions) => onChange({ ...strategy, interventions })}
      />

      {/* Cost Structure */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Cost Structure</h3>
        </div>
        
        {/* Wear plate costs */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Wear Plate Costs (per tile)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['stage0', 'stage1', 'stage2', 'stage3', 'stage4'].map(stage => (
              <React.Fragment key={stage}>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)} - 20mm
                  </label>
                  <input
                    type="number"
                    value={(strategy.costs as any)[`${stage}_20mm`]}
                    onChange={(e) => handleCostChange(`${stage}_20mm`, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)} - 25mm
                  </label>
                  <input
                    type="number"
                    value={(strategy.costs as any)[`${stage}_25mm`]}
                    onChange={(e) => handleCostChange(`${stage}_25mm`, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Quantities */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Quantities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['stage0Qty', 'stage1Qty', 'stage2Qty', 'stage3Qty', 'stage4Qty', 'sidewallQty', 'frontwallQty'].map(field => (
              <div key={field}>
                <label className="block text-xs text-gray-600 mb-1">
                  {field.replace('Qty', ' Qty').replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={(strategy.costs as any)[field]}
                  onChange={(e) => handleCostChange(field, e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fixed costs */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Fixed Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sidewall Cost</label>
              <input
                type="number"
                value={strategy.costs.sidewallCost}
                onChange={(e) => handleCostChange('sidewallCost', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Frontwall Cost</label>
              <input
                type="number"
                value={strategy.costs.frontwallCost}
                onChange={(e) => handleCostChange('frontwallCost', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rebuild Cost</label>
              <input
                type="number"
                value={strategy.costs.rebuildCost}
                onChange={(e) => handleCostChange('rebuildCost', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>

        {/* Labor rates */}
        <div>
          <h4 className="font-medium mb-3">Labor</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Labor Rate ($/hr)</label>
              <input
                type="number"
                value={strategy.costs.laborRate}
                onChange={(e) => handleCostChange('laborRate', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">WP 20mm (min)</label>
              <input
                type="number"
                value={strategy.costs.laborWP20mm}
                onChange={(e) => handleCostChange('laborWP20mm', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">WP 25mm (min)</label>
              <input
                type="number"
                value={strategy.costs.laborWP25mm}
                onChange={(e) => handleCostChange('laborWP25mm', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Sidewall (hr)</label>
              <input
                type="number"
                value={strategy.costs.laborSidewall}
                onChange={(e) => handleCostChange('laborSidewall', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Frontwall (hr)</label>
              <input
                type="number"
                value={strategy.costs.laborFrontwall}
                onChange={(e) => handleCostChange('laborFrontwall', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rebuild (hr)</label>
              <input
                type="number"
                value={strategy.costs.laborRebuild}
                onChange={(e) => handleCostChange('laborRebuild', e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};