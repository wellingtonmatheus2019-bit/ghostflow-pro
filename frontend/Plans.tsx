import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2, Edit2, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  // Redirect non-admins to dashboard
  if (user?.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const { data: auditLogs } = trpc.auditLogs.getAll.useQuery({ limit: 20 });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-slate-400 mt-2">Gestão exclusiva e controle administrativo</p>
          </div>
          <Button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Criar Novo Usuário</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Nome do usuário"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="usuario@empresa.com"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Perfil
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500">
                  <option value="operator">Operador</option>
                  <option value="manager">Gerenciador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Senha Temporária
                </label>
                <input
                  type="password"
                  placeholder="Senha inicial"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Criar Usuário</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddUserForm(false)}
                  className="border-slate-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Users Management */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Usuários da Equipe</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Nome</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Email</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Perfil</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Status</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 text-white font-medium">{user?.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user?.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                      Administrador
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      Ativo
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="outline" size="sm" className="border-slate-600 gap-2">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Audit Logs */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Logs de Auditoria</h2>
          <div className="space-y-3">
            {auditLogs && auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(log.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">Nenhuma atividade registrada</p>
            )}
          </div>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm">Usuários Ativos</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">1</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Contas Conectadas</p>
              <p className="text-3xl font-bold text-green-400 mt-2">0</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Automações Ativas</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">0</p>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-500/10 border-blue-500/50 p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Sistema Privado Corporativo</h3>
              <p className="text-slate-300">
                Este é um sistema privado exclusivo para uso interno da empresa. Todos os acessos são monitorados e registrados nos logs de auditoria. Acesso não autorizado é estritamente proibido.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
