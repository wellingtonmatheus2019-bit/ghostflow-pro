import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Zap, Lock, Shield, Users, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GhostFlow</span>
          </div>
          <a href={getLoginUrl()} className="text-sm font-medium text-slate-300 hover:text-white transition">
            Acessar Sistema
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-sm font-medium text-cyan-400">Sistema Privado Corporativo</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            GhostFlow: Automação <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Invisível</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Plataforma privada de automação para Instagram com comportamento 100% humanizado. Segurança operacional de nível enterprise, sem risco de detecção. Exclusivo para uso interno corporativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                Acessar GhostFlow
              </Button>
            </a>
          </div>

          {/* Security Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-cyan-400">100%</div>
              <div className="text-sm text-slate-400">Privado</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-blue-400">0%</div>
              <div className="text-sm text-slate-400">Risco Detectado</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-sm text-slate-400">Escalabilidade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Tecnologia de Ponta</h2>
            <p className="text-slate-400">Infraestrutura corporativa para automação segura e invisível</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Comportamento Humanizado</h3>
              <p className="text-slate-400">Delays aleatórios, padrões naturais e detecção de risco em tempo real para máxima segurança operacional.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacidade Total</h3>
              <p className="text-slate-400">Sistema 100% privado e corporativo. Sem acesso externo, sem monetização, sem dados compartilhados.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gestão de Equipe</h3>
              <p className="text-slate-400">Controle administrativo completo com permissões granulares, auditoria de acesso e logs detalhados.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics Avançado</h3>
              <p className="text-slate-400">Dashboard em tempo real com métricas de crescimento, taxa de conversão e histórico completo de ações.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automações Inteligentes</h3>
              <p className="text-slate-400">Segmentação avançada, agendamento flexível e controle total sobre limites de segurança e comportamento.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Monitoramento 24/7</h3>
              <p className="text-slate-400">Detecção automática de anomalias, alertas de risco e pausa inteligente de operações suspeitas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-12 border border-cyan-500/30">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Sistema Privado Corporativo</h3>
              <p className="text-slate-300 mb-4">
                GhostFlow é uma plataforma de automação privada, exclusiva para uso interno corporativo. Todos os acessos são monitorados, registrados e auditados. Acesso não autorizado é estritamente proibido.
              </p>
              <p className="text-slate-400 text-sm">
                Desenvolvido com padrões de segurança enterprise, comportamento humanizado avançado e infraestrutura corporativa de ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p className="mb-2">© 2026 GhostFlow. Sistema Privado Corporativo.</p>
          <p className="text-sm">Todos os direitos reservados. Uso exclusivamente interno.</p>
        </div>
      </footer>
    </div>
  );
}
