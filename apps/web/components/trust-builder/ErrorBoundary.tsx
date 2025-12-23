"use client";

import React from "react";
import { eventTaxonomy } from "./analytics.config";
import { useAnalytics } from "./hooks/useAnalytics";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TrustBuilderErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error);
    // eslint-disable-next-line no-console
    console.error("TrustBuilderErrorBoundary caught an error", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="glass rounded-2xl border border-white/30 p-6 text-neutral-900 shadow-glow">
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-neutral-700 mb-4">
              Please retry. If the issue persists, contact support.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-full bg-primary px-4 py-2 text-white font-semibold shadow hover:-translate-y-0.5 transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function TrustBuilderErrorBoundaryWithAnalytics({ children }: Props) {
  const { track } = useAnalytics();

  return (
    <TrustBuilderErrorBoundary
      onError={(error) =>
        track(eventTaxonomy.componentError, { message: error.message, stack: error.stack })
      }
    >
      {children}
    </TrustBuilderErrorBoundary>
  );
}

