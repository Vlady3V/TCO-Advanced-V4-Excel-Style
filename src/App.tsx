import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Download, Upload, Calculator } from 'lucide-react';
import { Strategy } from './types';
import { defaultStrategies } from './data/defaultStrategies';
import { 
  StrategyEditor, 
  WearProgressionChart, 
  CostAnalysisChart, 
  StrategyComparison 
} from './components';
import { 
  calculateWearAccumulation, 
  calculateCostAccumulation,
  formatCurrency,
  formatNumber
} from './utils/calculations';

function App() {
  const [strategies, setStrategies] = useState<Strategy[]>(defaultStrategies);
  const [activeTab, setActiveTab] = useState<'edit' | 'analysis' | 'comparison'>('edit');
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  
  // Calculate data for all strategies
  const wearData = strategies.map(strategy => calculateWearAccumulation(strategy));
  const costData = strategies.map(strategy => calculateCostAccumulation(strategy));

  const addStrategy = () => {
    const newStrategy: Strategy = {
      ...defaultStrategies[0],
      id: `strategy-${Date.now()}`,
      name: `New Strategy ${strategies.length + 1}`
    };
    setStrategies([...strategies, newStrategy]);
    setSelectedStrategyIndex(strategies.length);
  };

  const deleteStrategy = (index: number) => {
    if (strategies.length > 1) {
      const newStrategies = strategies.filter((_, i) => i !== index);
      setStrategies(newStrategies);
      if (selectedStrategyIndex >= newStrategies.length) {
        setSelectedStrategyIndex(newStrategies.length - 1);
      }
    }
  };

  const duplicateStrategy = (index: number) => {
    const strategyToDuplicate = strategies[index];
    const newStrategy: Strategy = {
      ...strategyToDuplicate,
      id: `strategy-${Date.now()}`,
      name: `${strategyToDuplicate.name} (Copy)`
    };
    setStrategies([...strategies, newStrategy]);
    setSelectedStrategyIndex(strategies.length);
  };

  const updateStrategy = (index: number, updatedStrategy: Strategy) => {
    const newStrategies = [...strategies];
    newStrategies[index] = updatedStrategy;
    setStrategies(newStrategies);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(strategies, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tco-strategies-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedStrategies = JSON.parse(e.target?.result as string);
          setStrategies(importedStrategies);
          setSelectedStrategyIndex(0);
        } catch (error) {
          alert('Invalid file format. Please select a valid TCO strategies JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TCO Advanced V4</h1>
                <p className="text-sm text-gray-500">Total Cost of Ownership Analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Strategy Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            {strategies.map((strategy, index) => (
              <div
                key={strategy.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors ${
                  selectedStrategyIndex === index
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <button
                  onClick={() => setSelectedStrategyIndex(index)}
                  className="font-medium whitespace-nowrap"
                >
                  {strategy.name}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => duplicateStrategy(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Duplicate strategy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {strategies.length > 1 && (
                    <button
                      onClick={() => deleteStrategy(index)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                      title="Delete strategy"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={addStrategy}
              className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Strategy
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'edit'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analysis'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'comparison'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Comparison
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'edit' && (
          <StrategyEditor
            strategy={strategies[selectedStrategyIndex]}
            onChange={(updatedStrategy) => updateStrategy(selectedStrategyIndex, updatedStrategy)}
          />
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Quick Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Analysis: {strategies[selectedStrategyIndex].name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Operating Hours</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatNumber(strategies[selectedStrategyIndex].totalHours)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(costData[selectedStrategyIndex][costData[selectedStrategyIndex].length - 1]?.cumulativeCost || 0)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Cost per Hour</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(costData[selectedStrategyIndex][costData[selectedStrategyIndex].length - 1]?.costPerHour || 0)}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Maintenance Events</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {strategies[selectedStrategyIndex].interventions.filter(i => 
                      i.stage0Thickness > 0 || i.stage1Thickness > 0 || 
                      i.stage2Thickness > 0 || i.stage3Thickness > 0 || 
                      i.stage4Thickness > 0 || i.sidewallReplacement || 
                      i.frontwallReplacement || i.rebuild
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <WearProgressionChart
              data={wearData[selectedStrategyIndex]}
              floorMinThickness={strategies[selectedStrategyIndex].floorMinThickness}
            />
            
            <CostAnalysisChart
              data={costData[selectedStrategyIndex]}
              title={`Cost Analysis - ${strategies[selectedStrategyIndex].name}`}
              color="#3B82F6"
            />
          </div>
        )}

        {activeTab === 'comparison' && (
          <StrategyComparison
            strategies={strategies}
            costData={costData}
          />
        )}
      </main>
    </div>
  );
}

export default App;