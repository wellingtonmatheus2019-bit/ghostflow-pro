import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, RefreshCw } from "lucide-react";
import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6 selection:bg-cyan-500/30">
          <div className="relative w-full max-w-lg">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

            <div className="relative bg-[#111] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight mb-2">Ops! Algo deu errado</h1>
                <p className="text-zinc-400 mb-8 max-w-xs">
                  Ocorreu um erro inesperado no sistema. Nossa equipe técnica já foi notificada.
                </p>

                {this.state.error && (
                  <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 mb-8 text-left overflow-hidden">
                    <p className="text-xs font-mono text-red-400/80 break-all line-clamp-3">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={this.handleReset}
                    className={cn(
                      "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
                      "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
                    )}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Tentar Novamente
                  </button>
                  <button
                    onClick={this.handleReload}
                    className={cn(
                      "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
                      "bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-[0.98]"
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Recarregar
                  </button>
                </div>

                <button
                  onClick={this.handleGoHome}
                  className="mt-6 text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Voltar para o Início
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-zinc-600 text-xs tracking-widest uppercase">
              GhostFlow &copy; 2026 Enterprise Security
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
