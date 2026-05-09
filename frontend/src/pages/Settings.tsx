import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Settings() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-slate-400 mt-2">Gerencie suas preferências e segurança</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
          {[
            { id: "profile", label: "Perfil", icon: User },
            { id: "security", label: "Segurança", icon: Lock },
            { id: "notifications", label: "Notificações", icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === id
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Informações do Perfil</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ""}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Perfil
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.role === "admin" ? "Administrador" : "Usuário"}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-400 cursor-not-allowed"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Segurança</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Atualizar Senha</Button>
              </div>
            </Card>

            <Card className="bg-red-500/10 border-red-500/50 p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h3>
              <p className="text-slate-400 mb-4">
                Deletar sua conta é uma ação permanente e não pode ser desfeita.
              </p>
              <Button variant="destructive">Deletar Conta Permanentemente</Button>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Preferências de Notificação</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Notificações de automação iniciada</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Alertas de risco detectado</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Relatórios diários de desempenho</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Alertas de atividade da equipe</span>
                </label>
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Preferências</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Logout Button */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Desconectar</h3>
              <p className="text-slate-400 text-sm mt-1">Sair da sua conta neste dispositivo</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Desconectar
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
