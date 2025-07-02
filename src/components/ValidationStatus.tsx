import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Play, Download } from 'lucide-react';
import { Strategy } from '../types';
import { runQuickValidation, generateValidationReport } from '../utils/testValidation';

interface ValidationStatusProps {
  strategy: Strategy;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ strategy }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const quickValidation = useMemo(() => {
    return runQuickValidation(strategy);
  }, [strategy]);

  const downloadValidationReport = async () => {
    setIsRunningTests(true);
    try {
      // Run comprehensive validation
      const report = generateValidationReport();
      
      // Create and download file
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TCO_Validation_Report_${new Date().toISOString().split('T')[0]}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = () => {
    if (quickValidation.success) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    } else if (quickValidation.passed > 0) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    if (quickValidation.success) {
      return 'bg-green-50 border-green-200 text-green-800';
    } else if (quickValidation.passed > 0) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    } else {
      return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getStatusText = () => {
    if (quickValidation.success) {
      return 'All validations passed';
    } else if (quickValidation.passed > 0) {
      return `${quickValidation.passed}/${quickValidation.total} validations passed`;
    } else {
      return 'Validation issues detected';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold">Excel Validation Status</h3>
            <p className="text-sm">{getStatusText()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          
          <button
            onClick={downloadValidationReport}
            disabled={isRunningTests}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors disabled:opacity-50"
          >
            {isRunningTests ? (
              <Play className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
            {isRunningTests ? 'Running...' : 'Full Report'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <h4 className="font-medium mb-2">Quick Validation Results:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Wear Rates vs Excel:</span>
              <span className={quickValidation.success ? 'text-green-700' : 'text-red-700'}>
                {quickValidation.success ? '✓ Match' : '✗ Mismatch'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cost Calculations:</span>
              <span className={quickValidation.success ? 'text-green-700' : 'text-yellow-700'}>
                {quickValidation.success ? '✓ Validated' : '? Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Overall Accuracy:</span>
              <span className="font-medium">
                {((quickValidation.passed / quickValidation.total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white bg-opacity-30 rounded text-xs">
            <strong>Note:</strong> This shows quick validation against known Excel results. 
            Download the full report for comprehensive testing including wear progression, 
            maintenance scheduling, and detailed formula validation.
          </div>
        </div>
      )}
    </div>
  );
};