import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      let isFirestoreError = false;

      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.operationType) {
          isFirestoreError = true;
          errorMessage = `Database Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
          <div className="max-w-md w-full bg-white border-4 border-[#111111] rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="w-16 h-16 bg-[#FFB84D] border-2 border-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl font-black text-white">!</span>
            </div>
            <h2 className="text-2xl font-black mb-4">Application Error</h2>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-bold text-red-600 break-words">
                {errorMessage}
              </p>
            </div>
            {isFirestoreError && (
              <p className="text-xs text-gray-500 mb-6 italic">
                This appears to be a database permission issue. Please ensure you are logged in and have the correct access.
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#6C3BFF] text-white font-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-[#111111] hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
