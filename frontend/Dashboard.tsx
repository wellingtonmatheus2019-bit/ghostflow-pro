import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Zap, Activity, BarChart3, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Queries com proteção contra loops
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    error: accountsError,
  } = trpc.instagramAccounts.getAll.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: automations = [],
    isLoading: automationsLoading,
    error: automationsError,
  } = trpc.automations.getAll.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
  } = trpc.activityLogs.getRecent.useQuery(
    { limit: 10 },
    {
      enabled: isAuthenticated && !!user?.id,
      retry: 2,
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    }
  );

  // Memoizar cálculos para evitar re-renders
  const stats = useMemo(
    () => ({
      totalAccounts: Array.isArray(accounts) ? accounts.length : 0,
      activeAutomations: Array.isArray(automations)
        ? automations.filter((a: any) => a.isActive).length
        : 0,
      totalActions: Array.isArray(logs) ? logs.length : 0,
    }),
    [accounts, automations, logs]
  );

  const isLoading = accountsLoading || automationsLoading || logsLoading;
  const hasError = accountsError || automationsError || logsError;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Bem-vindo, {user?.name}!</h1>
          <p className="text-slate-400 mt-2">Aqui está um resumo do seu desempenho</p>
        </div>

        {/* Error Alert */}
        {hasError && (
          <Card className="bg-red-500/10 border-red-500/30 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">Erro ao carregar dados. Tente recarregar a página.</p>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Accounts */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Contas Conectadas</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {isLoading ? (
                    <span className="text-lg text-slate-500">Carregando...</span>
                  ) : (
                    stats.totalAccounts
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Total Automations */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Automações Ativas</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {isLoading ? (
                    <span className="text-lg text-slate-500">Carregando...</span>
                  ) : (
                    stats.activeAutomations
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>

          {/* Actions Executed */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ações Executadas</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {isLoading ? (
                    <span className="text-lg text-slate-500">Carregando...</span>
                  ) : (
                    stats.totalActions
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </Card>

          {/* Engagement Rate */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Taxa de Engajamento</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {isLoading ? (
                    <span className="text-lg text-slate-500">Carregando...</span>
                  ) : (
                    "2.4%"
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Atividade Recente</h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-700/50 rounded animate-pulse" />
                ))}
              </div>
            ) : Array.isArray(logs) && logs.length > 0 ? (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded bg-slate-700/30">
                    <div>
                      <p className="text-sm text-white font-medium">{log.action || "Ação"}</p>
                      <p className="text-xs text-slate-400">
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleDateString("pt-BR")
                          : "Data desconhecida"}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                      {log.status || "Concluído"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Nenhuma atividade recente</p>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Ações Rápidas</h2>
            <div className="space-y-3">
              <button
                onClick={() => setLocation("/accounts")}
                className="w-full p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium transition"
              >
                + Conectar Conta
              </button>
              <button
                onClick={() => setLocation("/automations")}
                className="w-full p-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-sm font-medium transition"
              >
                + Nova Automação
              </button>
              <button
                onClick={() => setLocation("/segmentation")}
                className="w-full p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm font-medium transition"
              >
                + Segmentar Público
              </button>
              <button
                onClick={() => setLocation("/analytics")}
                className="w-full p-3 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-sm font-medium transition"
              >
                Ver Analytics
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
