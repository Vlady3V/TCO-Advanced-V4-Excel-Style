import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CostAccumulation } from '../types';
import { formatCurrency } from '../utils/calculations';

interface CostAnalysisChartProps {
  data: CostAccumulation[];
  title: string;
  color: string;
}

export const CostAnalysisChart: React.FC<CostAnalysisChartProps> = ({ data, title, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">Total Cost</p>
          <p className="text-xl font-bold">{formatCurrency(data[data.length - 1]?.cumulativeCost || 0)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">Cost per Hour</p>
          <p className="text-xl font-bold">{formatCurrency(data[data.length - 1]?.costPerHour || 0)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-sm text-gray-600">Interventions</p>
          <p className="text-xl font-bold">{data.length - 1}</p>
        </div>
      </div>

      {/* Cumulative cost chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Cumulative Cost</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hours" 
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(value) => `${value.toLocaleString()} hours`}
            />
            <Line 
              type="stepAfter" 
              dataKey="cumulativeCost" 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Period cost bar chart */}
      <div>
        <h4 className="text-sm font-medium mb-2">Period Costs</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.filter(d => d.periodCost > 0)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hours" 
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis 
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(value) => `${value.toLocaleString()} hours`}
            />
            <Bar dataKey="periodCost" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost breakdown table */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Hours</th>
                <th className="text-right py-2">Period Cost</th>
                <th className="text-right py-2">Cumulative</th>
                <th className="text-right py-2">$/Hour</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.hours.toLocaleString()}</td>
                  <td className="text-right py-2">{formatCurrency(item.periodCost)}</td>
                  <td className="text-right py-2">{formatCurrency(item.cumulativeCost)}</td>
                  <td className="text-right py-2">{formatCurrency(item.costPerHour)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};