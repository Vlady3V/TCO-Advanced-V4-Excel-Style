import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  error?: string;
  warning?: string;
  success?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  error,
  warning,
  success,
  required = false,
  placeholder,
  min,
  max,
  step,
  disabled = false,
  className = ''
}) => {
  const hasError = !!error;
  const hasWarning = !!warning && !hasError;
  const hasSuccess = !!success && !hasError && !hasWarning;

  const getInputClasses = () => {
    let classes = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ';
    
    if (hasError) {
      classes += 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50';
    } else if (hasWarning) {
      classes += 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50';
    } else if (hasSuccess) {
      classes += 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50';
    } else {
      classes += 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    }
    
    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    }
    
    return classes;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={getInputClasses()}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${label}-error` : 
            hasWarning ? `${label}-warning` : 
            hasSuccess ? `${label}-success` : undefined
          }
        />
        
        {(hasError || hasWarning || hasSuccess) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
            {hasWarning && <AlertCircle className="w-5 h-5 text-yellow-500" />}
            {hasSuccess && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
        )}
      </div>
      
      {hasError && (
        <p id={`${label}-error`} className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {hasWarning && (
        <p id={`${label}-warning`} className="mt-1 text-sm text-yellow-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {warning}
        </p>
      )}
      
      {hasSuccess && (
        <p id={`${label}-success`} className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
        </p>
      )}
    </div>
  );
};