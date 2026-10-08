import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-text">
          <div className="max-w-md w-full bg-surface rounded-2xl p-8 border border-border/60 shadow-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="font-display text-2xl font-bold mb-2">
              Something went wrong
            </h1>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              An unexpected error occurred while rendering this page. Our team has been notified.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-left text-xs text-text-secondary overflow-x-auto font-mono max-h-28">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-border/60 text-text px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all text-sm"
              >
                <Home className="w-4 h-4" /> Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
