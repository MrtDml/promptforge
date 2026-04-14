"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Beklenmeyen bir hata oluştu
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            Bu sayfada bir sorun oluştu. Lütfen tekrar deneyin veya sorun devam ederse destek ekibimizle iletişime geçin.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar dene
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold transition-colors"
            >
              Dashboard&apos;a git
            </Link>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-left max-w-lg w-full">
              <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-400">
                Hata detayları (geliştirme modu)
              </summary>
              <pre className="mt-2 p-3 rounded-lg bg-slate-900 border border-slate-800 text-red-400 text-xs overflow-auto whitespace-pre-wrap">
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
