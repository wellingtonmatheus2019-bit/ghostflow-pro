import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, Clock, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Security() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const { data: logs } = trpc.activityLogs.getRecent.useQuery({ limit: 50 });

  const riskStats = {
    low: logs?.filter(l => l.riskLevel === "low").length || 0,
    medium: logs?.filter(l => l.riskLevel === "medium").length || 0,
    high: logs?.filter(l => l.riskLevel === "high").length || 0,
    critical: logs?.filter(l => l.riskLevel === "critical").length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Segurança</h1>
          <p className="text-slate-400 mt-2">Monitore riscos e atividades suspeitas</p>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Risco Baixo</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{riskStats.low}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Risco Médio</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{riskStats.medium}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Risco Alto</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">{riskStats.high}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Risco Crítico</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{riskStats.critical}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Security Features */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recursos de Segurança Ativados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Detecção de Comportamento Anômalo", status: true },
              { name: "Limites de Taxa Inteligentes", status: true },
              { name: "Delays Aleatórios", status: true },
              { name: "Fingerprint Protection", status: true },
              { name: "Monitoramento de Bloqueios", status: true },
              { name: "Alertas em Tempo Real", status: true },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${feature.status ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-slate-300">{feature.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Logs */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Logs de Atividade</h2>
            <Button
              variant="outline"
              className="border-slate-600 gap-2"
              onClick={() => alert("Download de logs em desenvolvimento")}
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          <div className="space-y-3">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                >
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    log.riskLevel === "critical" ? "bg-red-500" :
                    log.riskLevel === "high" ? "bg-orange-500" :
                    log.riskLevel === "medium" ? "bg-yellow-500" :
                    "bg-green-500"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium">{log.action}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.riskLevel === "critical" ? "bg-red-500/20 text-red-400" :
                        log.riskLevel === "high" ? "bg-orange-500/20 text-orange-400" :
                        log.riskLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        {log.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">Nenhuma atividade registrada</p>
            )}
          </div>
        </Card>

        {/* Security Recommendations */}
        <Card className="bg-blue-500/10 border-blue-500/50 p-6">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">Recomendações de Segurança</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">Mantenha seus delays entre 5-15 segundos para melhor segurança</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">Não execute mais de 100 ações por hora em uma conta</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">Pause automações se detectar comportamento suspeito</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">Revise regularmente seus logs de atividade</span>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
