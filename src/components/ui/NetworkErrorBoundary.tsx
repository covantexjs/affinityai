import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
}

class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isOnline: navigator.onLine
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOnline: navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Network Error Boundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
    if (this.state.hasError) {
      // Auto-retry when coming back online
      setTimeout(() => {
        this.handleRetry();
      }, 1000);
    }
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error?.message?.includes('Failed to fetch') ||
                            this.state.error?.message?.includes('Network error') ||
                            this.state.error?.message?.includes('timeout') ||
                            !this.state.isOnline;

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              {isNetworkError ? (
                <WifiOff className="w-8 h-8 text-red-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {isNetworkError 
                ? 'Unable to connect to our servers. Please check your internet connection and try again.'
                : 'An unexpected error occurred. Please try refreshing the page.'
              }
            </p>

            {!this.state.isOnline && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">You appear to be offline</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Please check your internet connection
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mb-4">
              {this.state.isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600">
                {this.state.isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
                disabled={!this.state.isOnline}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return Home
              </Button>
            </div>

            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Technical Details
                </summary>
                <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NetworkErrorBoundary;