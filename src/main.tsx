import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-bold mb-4">
            🍽️
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Something went wrong loading the dining menu</h1>
          <p className="text-xs text-zinc-400 max-w-md mb-6">
            An unexpected error occurred. Please click below to refresh and load the restaurant.
          </p>
          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch {
                // ignore
              }
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Refresh & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
