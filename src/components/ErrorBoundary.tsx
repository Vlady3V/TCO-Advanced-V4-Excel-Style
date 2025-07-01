import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TCO Application Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
                <p className="text-gray-600">The TCO application encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
              <p className="text-red-700 text-sm font-mono mb-2">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
              {this.state.error?.stack && (
                <details className="text-xs text-red-600">
                  <summary className="cursor-pointer hover:text-red-800">Stack trace</summary>
                  <pre className="mt-2 whitespace-pre-wrap bg-red-100 p-2 rounded">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Troubleshooting Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try refreshing the page</li>
                <li>• Check if your data contains invalid values</li>
                <li>• Ensure all required fields are filled</li>
                <li>• Export your strategies before making changes</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}