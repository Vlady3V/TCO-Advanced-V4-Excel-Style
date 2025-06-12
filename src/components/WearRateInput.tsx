import React from 'react';
import { WearRates } from '../types';
import { getWearRateColor } from '../utils/calculations';

interface WearRateInputProps {
  wearRates: WearRates;
  onChange: (wearRates: WearRates) => void;
}

export const WearRateInput: React.FC<WearRateInputProps> = ({ wearRates, onChange }) => {
  const handleChange = (component: keyof WearRates, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...wearRates,
      [component]: numValue
    });
  };

  const components = [
    { key: 'stage4', label: 'Stage 4', value: wearRates.stage4 },
    { key: 'stage3', label: 'Stage 3', value: wearRates.stage3 },
    { key: 'stage2', label: 'Stage 2', value: wearRates.stage2 },
    { key: 'stage1', label: 'Stage 1', value: wearRates.stage1 },
    { key: 'stage0', label: 'Stage 0', value: wearRates.stage0 },
    { key: 'floor', label: 'Floor', value: wearRates.floor }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Wear Rates (mm per 1000 hours)</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-6 gap-2 text-sm font-medium">
          <div>Component</div>
          <div className="text-center">Front</div>
          <div className="text-center">-</div>
          <div className="text-center">Center</div>
          <div className="text-center">-</div>
          <div className="text-center">Rear</div>
        </div>
        {components.map(({ key, label, value }) => (
          <div key={key} className="grid grid-cols-6 gap-2">
            <div className="text-sm font-medium py-2">{label}</div>
            <div className={`rounded ${getWearRateColor(value)}`}>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => handleChange(key as keyof WearRates, e.target.value)}
                className="w-full px-2 py-1 text-center text-sm bg-transparent"
              />
            </div>
            <div className={`rounded ${getWearRateColor(value)} flex items-center justify-center`}>
              <span className="text-sm">{value.toFixed(2)}</span>
            </div>
            <div className={`rounded ${getWearRateColor(value)}`}>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => handleChange(key as keyof WearRates, e.target.value)}
                className="w-full px-2 py-1 text-center text-sm bg-transparent"
              />
            </div>
            <div className={`rounded ${getWearRateColor(value)} flex items-center justify-center`}>
              <span className="text-sm">{value.toFixed(2)}</span>
            </div>
            <div className={`rounded ${getWearRateColor(value)}`}>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => handleChange(key as keyof WearRates, e.target.value)}
                className="w-full px-2 py-1 text-center text-sm bg-transparent"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>Low (≤0.12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>Medium (≤0.18)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 rounded"></div>
          <span>High (≤0.36)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Very High (&gt;0.36)</span>
        </div>
      </div>
    </div>
  );
};