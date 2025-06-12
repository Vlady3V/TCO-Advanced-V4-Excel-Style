import React from 'react';
import { MaintenanceIntervention } from '../types';
import { formatNumber } from '../utils/calculations';

interface MaintenanceScheduleProps {
  interventions: MaintenanceIntervention[];
  totalHours: number;
  onChange: (interventions: MaintenanceIntervention[]) => void;
}

export const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ 
  interventions, 
  totalHours,
  onChange 
}) => {
  const getInterventionColor = (intervention: MaintenanceIntervention): string => {
    if (intervention.stage4Thickness > 0) return 'bg-green-600';
    if (intervention.stage3Thickness > 0) return 'bg-yellow-600';
    if (intervention.stage2Thickness > 0) return 'bg-orange-600';
    if (intervention.stage1Thickness > 0) return 'bg-red-600';
    if (intervention.stage0Thickness > 0) return 'bg-purple-600';
    if (intervention.sidewallReplacement) return 'bg-gray-600';
    return 'bg-gray-300';
  };

  const getInterventionLabel = (intervention: MaintenanceIntervention): string => {
    const parts = [];
    if (intervention.stage0Thickness > 0) parts.push(`Stage 0: ${intervention.stage0Thickness}mm`);
    if (intervention.stage1Thickness > 0) parts.push(`Stage 1: ${intervention.stage1Thickness}mm`);
    if (intervention.stage2Thickness > 0) parts.push(`Stage 2: ${intervention.stage2Thickness}mm`);
    if (intervention.stage3Thickness > 0) parts.push(`Stage 3: ${intervention.stage3Thickness}mm`);
    if (intervention.stage4Thickness > 0) parts.push(`Stage 4: ${intervention.stage4Thickness}mm`);
    if (intervention.sidewallReplacement) parts.push('Sidewall');
    if (intervention.frontwallReplacement) parts.push('Frontwall');
    if (intervention.rebuild) parts.push('Rebuild');
    return parts.join(', ') || 'No Action';
  };

  const handleThicknessChange = (index: number, stage: string, value: string) => {
    const newInterventions = [...interventions];
    const numValue = parseFloat(value) || 0;
    (newInterventions[index] as any)[`${stage}Thickness`] = numValue;
    onChange(newInterventions);
  };

  const handleCheckboxChange = (index: number, field: string, checked: boolean) => {
    const newInterventions = [...interventions];
    (newInterventions[index] as any)[field] = checked;
    onChange(newInterventions);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Maintenance Schedule</h3>
      
      {/* Timeline visualization */}
      <div className="mb-6">
        <div className="relative h-20">
          <div className="absolute inset-0 bg-gray-100 rounded"></div>
          {interventions.map((intervention, index) => {
            const position = (intervention.operatingHours / totalHours) * 100;
            return (
              <div
                key={index}
                className="absolute top-0 bottom-0 w-1"
                style={{ left: `${position}%` }}
              >
                <div className={`h-full ${getInterventionColor(intervention)}`}></div>
                <div className="absolute -top-6 -left-6 text-xs whitespace-nowrap">
                  {formatNumber(intervention.operatingHours)}h
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span>{formatNumber(totalHours)} hours</span>
        </div>
      </div>

      {/* Intervention details */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {interventions.map((intervention, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">
                Period {index + 1} - {formatNumber(intervention.operatingHours)} hours
              </h4>
              <div 
                className={`w-4 h-4 rounded ${getInterventionColor(intervention)}`}
                title={getInterventionLabel(intervention)}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* Stage inputs */}
              {['stage0', 'stage1', 'stage2', 'stage3', 'stage4'].map((stage) => (
                <div key={stage} className="flex items-center gap-2">
                  <label className="capitalize">{stage}:</label>
                  <input
                    type="number"
                    value={(intervention as any)[`${stage}Thickness`]}
                    onChange={(e) => handleThicknessChange(index, stage, e.target.value)}
                    className="w-16 px-2 py-1 border rounded text-center"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-500">mm</span>
                </div>
              ))}
              
              {/* Checkboxes */}
              <div className="col-span-2 flex gap-4 mt-2">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={intervention.sidewallReplacement}
                    onChange={(e) => handleCheckboxChange(index, 'sidewallReplacement', e.target.checked)}
                  />
                  <span className="text-sm">Sidewall</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={intervention.frontwallReplacement}
                    onChange={(e) => handleCheckboxChange(index, 'frontwallReplacement', e.target.checked)}
                  />
                  <span className="text-sm">Frontwall</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={intervention.rebuild}
                    onChange={(e) => handleCheckboxChange(index, 'rebuild', e.target.checked)}
                  />
                  <span className="text-sm">Rebuild</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};