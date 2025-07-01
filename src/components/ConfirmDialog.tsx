import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: Trash2,
      iconColor: 'text-red-500',
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
      background: 'bg-red-50 border-red-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      background: 'bg-yellow-50 border-yellow-200'
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-500',
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      background: 'bg-blue-50 border-blue-200'
    }
  };

  const style = variantStyles[variant];
  const IconComponent = style.icon;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${style.background} border`}>
              <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${style.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};