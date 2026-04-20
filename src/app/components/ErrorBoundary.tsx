import { Component, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center p-6">
          <div className="bg-[#EBE4D6] rounded-2xl shadow-sm border border-[rgba(20,18,15,0.13)] p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#0E3B2E] mb-2">Algo deu errado</h1>
            <p className="text-sm text-[#0E3B2E]/60 mb-8">
              Ocorreu um erro inesperado nesta página. Tente recarregar ou volte ao dashboard.
            </p>
            {this.state.error && (
              <details className="text-left bg-[#F4EFE6] rounded-lg p-4 mb-6 text-xs font-mono text-[#0E3B2E]/60 overflow-auto max-h-32">
                <summary className="cursor-pointer font-semibold mb-2 text-[#0E3B2E]/80">Detalhes do erro</summary>
                {this.state.error.message}
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 h-10 border border-[rgba(20,18,15,0.13)] rounded-lg text-sm font-medium text-[#0E3B2E] hover:bg-[#F4EFE6] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
              <a
                href="/#/app/dashboard"
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#0E3B2E] rounded-lg text-sm font-semibold text-white hover:bg-[#002a50] transition-colors"
              >
                <Home className="w-4 h-4" />
                Ir ao Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Route-level error element for React Router errorElement prop */
export function RouteError() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-[#0E3B2E] mb-2">Página com erro</h2>
        <p className="text-sm text-[#0E3B2E]/60 mb-6">
          Esta página encontrou um problema. Verifique os dados e tente novamente.
        </p>
        <a
          href="/#/app/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E3B2E] text-white text-sm font-semibold rounded-lg hover:bg-[#002a50] transition-colors"
        >
          <Home className="w-4 h-4" />
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  );
}
