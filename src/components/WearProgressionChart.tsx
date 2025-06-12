import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WearAccumulation } from '../types';

interface WearProgressionChartProps {
  data: WearAccumulation[];
  floorMinThickness: number;
}

export const WearProgressionChart: React.FC<WearProgressionChartProps> = ({ data, floorMinThickness }) => {
  // Transform data for Recharts
  const chartData = data.filter((_, index) => index % 10 === 0).map(item => ({
    hours: item.hours,
    floor: item.floor,
    stage0: item.stage0,
    stage1: item.stage1,
    stage2: item.stage2,
    stage3: item.stage3,
    stage4: item.stage4,
    totalProtection: item.stage0 + item.stage1 + item.stage2 + item.stage3 + item.stage4
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Wear Progression</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hours" 
            tickFormatter={(value) => `${value / 1000}k`}
            label={{ value: 'Operating Hours', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Thickness (mm)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)} mm`}
            labelFormatter={(value) => `${value.toLocaleString()} hours`}
          />
          <Legend />
          
          {/* Reference line for minimum floor thickness */}
          <ReferenceLine 
            y={floorMinThickness} 
            stroke="red" 
            strokeDasharray="5 5" 
            label="Min Floor Thickness"
          />
          
          {/* Component lines */}
          <Line 
            type="monotone" 
            dataKey="floor" 
            stroke="#8B4513" 
            strokeWidth={2} 
            name="Floor"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="stage0" 
            stroke="#9333EA" 
            strokeWidth={2} 
            name="Stage 0"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="stage1" 
            stroke="#DC2626" 
            strokeWidth={2} 
            name="Stage 1"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="stage2" 
            stroke="#EA580C" 
            strokeWidth={2} 
            name="Stage 2"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="stage3" 
            stroke="#CA8A04" 
            strokeWidth={2} 
            name="Stage 3"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="stage4" 
            stroke="#16A34A" 
            strokeWidth={2} 
            name="Stage 4"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="totalProtection" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            name="Total Protection"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};