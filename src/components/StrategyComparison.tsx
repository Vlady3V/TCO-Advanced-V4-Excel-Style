import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Strategy, CostAccumulation } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface StrategyComparisonProps {
  strategies: Strategy[];
  costData: CostAccumulation[][];
}

export const StrategyComparison: React.FC<StrategyComparisonProps> = ({ strategies, costData }) => {
  // Combine data for comparison chart
  const combinedData = costData[0]?.map((item, index) => {
    const dataPoint: any = { hours: item.hours };
    strategies.forEach((strategy, strategyIndex) => {
      if (costData[strategyIndex] && costData[strategyIndex][index]) {
        dataPoint[`strategy${strategyIndex}`] = costData[strategyIndex][index].costPerHour;
      }
    });
    return dataPoint;
  }) || [];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate savings
  const getFinalCosts = () => {
    return strategies.map((strategy, index) => {
      const finalData = costData[index]?.[costData[index].length - 1];
      return {
        name: strategy.name,
        totalCost: finalData?.cumulativeCost || 0,
        costPerHour: finalData?.costPerHour || 0
      };
    });
  };

  const finalCosts = getFinalCosts();
  const baseCost = finalCosts[0]?.totalCost || 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Strategy Comparison</h3>

      {/* Summary comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {finalCosts.map((cost, index) => {
          const savings = baseCost - cost.totalCost;
          const savingsPercent = baseCost > 0 ? (savings / baseCost) * 100 : 0;
          
          return (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2" style={{ color: colors[index] }}>
                {cost.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(cost.totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost/Hour:</span>
                  <span className="font-medium">{formatCurrency(cost.costPerHour)}</span>
                </div>
                {index > 0 && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Savings:</span>
                    <span className={`font-medium ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(savings))} ({savingsPercent.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost per hour comparison chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Cost per Hour Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hours" 
              tickFormatter={(value) => `${value / 1000}k`}
              label={{ value: 'Operating Hours', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              label={{ value: 'Cost per Hour', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(value) => `${formatNumber(value)} hours`}
            />
            <Legend />
            
            {strategies.map((strategy, index) => (
              <Line 
                key={index}
                type="stepAfter" 
                dataKey={`strategy${index}`} 
                stroke={colors[index]} 
                strokeWidth={2}
                name={strategy.name}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key metrics comparison table */}
      <div>
        <h4 className="text-sm font-medium mb-2">Key Metrics Comparison</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Strategy</th>
                <th className="text-right py-2">Total Hours</th>
                <th className="text-right py-2">Total Cost</th>
                <th className="text-right py-2">Cost/Hour</th>
                <th className="text-right py-2">Maintenance Events</th>
                <th className="text-right py-2">First Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy, index) => {
                const maintenanceEvents = strategy.interventions.filter(i => 
                  i.stage0Thickness > 0 || i.stage1Thickness > 0 || 
                  i.stage2Thickness > 0 || i.stage3Thickness > 0 || 
                  i.stage4Thickness > 0 || i.sidewallReplacement || 
                  i.frontwallReplacement || i.rebuild
                ).length;
                
                const firstMaintenance = strategy.interventions.find(i => 
                  i.operatingHours > 0 && (
                    i.stage0Thickness > 0 || i.stage1Thickness > 0 || 
                    i.stage2Thickness > 0 || i.stage3Thickness > 0 || 
                    i.stage4Thickness > 0
                  )
                );

                return (
                  <tr key={index} className="border-b">
                    <td className="py-2" style={{ color: colors[index] }}>{strategy.name}</td>
                    <td className="text-right py-2">{formatNumber(strategy.totalHours)}</td>
                    <td className="text-right py-2">{formatCurrency(finalCosts[index]?.totalCost || 0)}</td>
                    <td className="text-right py-2">{formatCurrency(finalCosts[index]?.costPerHour || 0)}</td>
                    <td className="text-right py-2">{maintenanceEvents}</td>
                    <td className="text-right py-2">
                      {firstMaintenance ? formatNumber(firstMaintenance.operatingHours) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};