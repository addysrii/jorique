import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

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
    console.error('Uncaught Error in Component Tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F5] dark:bg-[#100E0D] text-[#2E2E2E] dark:text-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-white dark:bg-[#1A1816] rounded-3xl p-8 border border-[#ECE8E4] dark:border-[#2E2925] shadow-xl">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-[#D4AF37] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <AlertTriangle size={28} />
            </div>

            <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#8D867F] dark:text-[#D4AF37] mb-2">
              System Notice
            </p>

            <h1 className="text-2xl font-light tracking-wide text-[#3F3A36] dark:text-white mb-3">
              Something Unexpected Occurred
            </h1>

            <p className="text-xs text-[#8D867F] dark:text-white/60 font-light leading-relaxed mb-6">
              Our sanctuary encountered a temporary disruption. Please refresh the page or return to the main gallery.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#3F3A36] dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-[0.2em] py-3.5 px-5 rounded-xl hover:bg-black dark:hover:bg-[#E5C158] transition-all shadow-md"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F0EDE8] dark:bg-white/10 text-[#3F3A36] dark:text-white text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-5 rounded-xl hover:bg-[#ECE8E4] dark:hover:bg-white/15 transition-all"
              >
                <Home size={14} />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
