import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, TrendingUp, Users, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Analytics() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const { data: accounts } = trpc.instagramAccounts.getAll.useQuery();
  const { data: analytics } = trpc.analytics.getByAccount.useQuery(selectedAccount || 0, {
    enabled: !!selectedAccount,
  });

  const handleExportData = (format: "csv" | "pdf") => {
    alert(`Exportar dados em ${format.toUpperCase()} - Funcionalidade em desenvolvimento`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics e Relatórios</h1>
            <p className="text-slate-400 mt-2">Acompanhe seu desempenho em detalhes</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleExportData("csv")}
              variant="outline"
              className="border-slate-600 gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              onClick={() => handleExportData("pdf")}
              variant="outline"
              className="border-slate-600 gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Account Selector */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Selecione uma Conta
          </label>
          <select
            value={selectedAccount || ""}
            onChange={(e) => setSelectedAccount(Number(e.target.value) || null)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Escolha uma conta</option>
            {accounts?.map((acc) => (
              <option key={acc.id} value={acc.id}>
                @{acc.instagramUsername}
              </option>
            ))}
          </select>
        </Card>

        {selectedAccount && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Seguidores Ganhos</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics?.[0]?.followersGained || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Seguidores Perdidos</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics?.[0]?.followersLost || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Taxa de Engajamento</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics?.[0]?.engagementRate ? Number(analytics[0].engagementRate).toFixed(2) : "0"}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Taxa de Conversão</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {analytics?.[0]?.conversionRate ? Number(analytics[0].conversionRate).toFixed(2) : "0"}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Histórico Detalhado</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Data</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Seg. Ganhos</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Seg. Perdidos</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Engajamento</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Ações</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics && analytics.length > 0 ? (
                      analytics.map((record) => (
                        <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                          <td className="px-4 py-3 text-white text-sm">
                            {new Date(record.date).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 text-green-400 text-sm font-medium">
                            +{record.followersGained}
                          </td>
                          <td className="px-4 py-3 text-red-400 text-sm font-medium">
                            -{record.followersLost}
                          </td>
                          <td className="px-4 py-3 text-blue-400 text-sm font-medium">
                            {Number(record.engagementRate).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-purple-400 text-sm font-medium">
                            {record.actionsExecuted}
                          </td>
                          <td className="px-4 py-3 text-orange-400 text-sm font-medium">
                            {Number(record.conversionRate).toFixed(2)}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          Nenhum dado disponível para esta conta
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Growth Chart Placeholder */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Gráfico de Crescimento</h2>
              <div className="h-80 bg-slate-700/30 rounded-lg flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Gráfico interativo em desenvolvimento</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {!selectedAccount && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Selecione uma Conta</h3>
            <p className="text-slate-400">Escolha uma conta acima para visualizar seus analytics</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
