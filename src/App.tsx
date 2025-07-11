import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Copy, Download, Upload, Calculator, FileSpreadsheet, FileDown } from 'lucide-react';
import { Strategy } from './types';
import { defaultStrategies } from './data/defaultStrategies';
import { 
  StrategyEditor, 
  WearProgressionChart, 
  CostAnalysisChart, 
  StrategyComparison,
  ErrorBoundary,
  LoadingOverlay,
  ConfirmDialog,
  FormulaDisplay,
  ValidationStatus
} from './components';
import { 
  calculateWearAccumulation, 
  calculateCostAccumulation,
  formatCurrency,
  formatNumber
} from './utils/calculations';
import { exportToExcel, importFromExcel, createExcelTemplate } from './utils/excelUtils';

function App() {
  const [strategies, setStrategies] = useState<Strategy[]>(defaultStrategies);
  const [activeTab, setActiveTab] = useState<'edit' | 'analysis' | 'comparison'>('edit');
  const [selectedStrategyIndex, setSelectedStrategyIndex] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  
  // Memoize expensive calculations with loading state
  const { wearData, costData } = useMemo(() => {
    setIsCalculating(true);
    try {
      const wear = strategies.map(strategy => calculateWearAccumulation(strategy));
      const cost = strategies.map(strategy => calculateCostAccumulation(strategy));
      return { wearData: wear, costData: cost };
    } finally {
      // Use setTimeout to show loading state briefly for UX feedback
      setTimeout(() => setIsCalculating(false), 100);
    }
  }, [strategies]);

  const addStrategy = () => {
    const newStrategy: Strategy = {
      ...defaultStrategies[0],
      id: `strategy-${Date.now()}`,
      name: `New Strategy ${strategies.length + 1}`
    };
    setStrategies([...strategies, newStrategy]);
    setSelectedStrategyIndex(strategies.length);
  };

  const deleteStrategy = useCallback((index: number) => {
    if (strategies.length <= 1) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Strategy',
      message: `Are you sure you want to delete "${strategies[index].name}"? This action cannot be undone.`,
      onConfirm: () => {
        const newStrategies = strategies.filter((_, i) => i !== index);
        setStrategies(newStrategies);
        if (selectedStrategyIndex >= newStrategies.length) {
          setSelectedStrategyIndex(newStrategies.length - 1);
        }
      }
    });
  }, [strategies, selectedStrategyIndex]);

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
          setConfirmDialog({
            isOpen: true,
            title: 'Import Error',
            message: 'Invalid file format. Please select a valid TCO strategies JSON file. The file should contain an array of strategy objects with the correct structure.',
            onConfirm: () => {}
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToExcelFile = () => {
    try {
      exportToExcel(strategies);
    } catch (error) {
      setConfirmDialog({
        isOpen: true,
        title: 'Export Error',
        message: 'Failed to export to Excel. Please try again.',
        onConfirm: () => {}
      });
    }
  };

  const importFromExcelFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsCalculating(true);
        const importedStrategies = await importFromExcel(file);
        setStrategies(importedStrategies);
        setSelectedStrategyIndex(0);
        setConfirmDialog({
          isOpen: true,
          title: 'Import Successful',
          message: `Successfully imported ${importedStrategies.length} strategy(ies) from Excel file.`,
          onConfirm: () => {}
        });
      } catch (error) {
        setConfirmDialog({
          isOpen: true,
          title: 'Excel Import Error',
          message: `Failed to import Excel file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file follows the correct template format.`,
          onConfirm: () => {}
        });
      } finally {
        setIsCalculating(false);
      }
    }
    // Reset file input
    event.target.value = '';
  };

  const downloadExcelTemplate = () => {
    try {
      createExcelTemplate();
    } catch (error) {
      setConfirmDialog({
        isOpen: true,
        title: 'Template Error',
        message: 'Failed to create Excel template. Please try again.',
        onConfirm: () => {}
      });
    }
  };

  return (
    <ErrorBoundary>
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
                Export JSON
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportToExcelFile}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg cursor-pointer transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
                Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={importFromExcelFile}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadExcelTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Template
              </button>
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
        <LoadingOverlay isLoading={isCalculating} text="Calculating TCO data...">
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

            <ValidationStatus strategy={strategies[selectedStrategyIndex]} />

            <FormulaDisplay strategy={strategies[selectedStrategyIndex]} />

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
        </LoadingOverlay>
      </main>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.title.includes('Delete') ? 'danger' : 'warning'}
      />
    </div>
    </ErrorBoundary>
  );
}

export default App;