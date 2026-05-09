import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getInstagramAuthUrl } from "@/const";

export default function Accounts() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    instagramId: "",
    accessToken: "",
  });

  // Proteger contra renderização sem autenticação
  if (!isAuthenticated || !user) {
    return null;
  }

  // Query com proteção: só executa quando autenticado
  const {
    data: accounts = [],
    isLoading,
    error: queryError,
    isError,
  } = trpc.instagramAccounts.getAll.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.id,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antigo: cacheTime)
  });

  const utils = trpc.useUtils();

  const deleteAccountMutation = trpc.instagramAccounts.delete.useMutation({
    onSuccess: () => {
      toast.success("Conta removida com sucesso");
      // Usar invalidate em vez de refetch
      utils.instagramAccounts.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao remover conta: " + (error.message || "Erro desconhecido"));
    },
  });

  const addAccountMutation = trpc.instagramAccounts.add.useMutation({
    onSuccess: () => {
      toast.success("Conta conectada com sucesso!");
      setShowAddForm(false);
      setFormData({ username: "", instagramId: "", accessToken: "" });
      // Usar invalidate em vez de refetch
      utils.instagramAccounts.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao conectar conta: " + (error.message || "Erro desconhecido"));
    },
  });

  const handleDeleteAccount = (accountId: number) => {
    if (confirm("Tem certeza que deseja remover esta conta?")) {
      deleteAccountMutation.mutate(accountId);
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.instagramId || !formData.accessToken) {
      toast.error("Preencha todos os campos");
      return;
    }

    addAccountMutation.mutate({
      instagramUsername: formData.username,
      instagramId: formData.instagramId,
      accessToken: formData.accessToken,
    });
  };

  const handleOpenInstagramOAuth = () => {
    try {
      const authUrl = getInstagramAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao conectar com Instagram"
      );
    }
  };

  // Memoizar para evitar re-renders desnecessários
  const accountsList = useMemo(() => {
    return Array.isArray(accounts) ? accounts : [];
  }, [accounts]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Contas Conectadas</h1>
            <p className="text-slate-400 mt-2">Gerenciar suas contas do Instagram</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleOpenInstagramOAuth}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              disabled={!import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
            >
              <ExternalLink className="w-4 h-4" />
              Conectar via Instagram
            </Button>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-cyan-600 hover:bg-cyan-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Manual
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && queryError && (
          <Card className="bg-red-500/10 border-red-500/30 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-400 font-semibold">Erro ao carregar contas</h3>
                <p className="text-red-300 text-sm mt-1">
                  {queryError instanceof Error ? queryError.message : "Erro desconhecido. Tente novamente."}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Add Account Form */}
        {showAddForm && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Conectar Conta Manualmente</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome de usuário Instagram
                </label>
                <input
                  type="text"
                  placeholder="@seu_usuario"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ID do Instagram
                </label>
                <input
                  type="text"
                  placeholder="123456789"
                  value={formData.instagramId}
                  onChange={(e) => setFormData({ ...formData, instagramId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  placeholder="Token de acesso"
                  value={formData.accessToken}
                  onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={addAccountMutation.isPending}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {addAccountMutation.isPending ? "Conectando..." : "Conectar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-slate-600"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Carregando contas...</p>
          </Card>
        )}

        {/* Accounts Grid */}
        {!isLoading && accountsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountsList.map((account) => (
              <Card key={account.id} className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-500/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">@{account.instagramUsername}</h3>
                      <p className="text-slate-400 text-sm">ID: {account.instagramId}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      account.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : account.status === "inactive"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {account.status === "active" ? "Ativo" : account.status === "inactive" ? "Inativo" : "Erro"}
                  </span>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seguidores:</span>
                    <span className="text-white font-medium">{(account.followers || 0).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa de Engajamento:</span>
                    <span className="text-white font-medium">{Number(account.engagement || 0).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Última Sincronização:</span>
                    <span className="text-white font-medium text-sm">
                      {account.lastSync ? new Date(account.lastSync).toLocaleDateString("pt-BR") : "Nunca"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-600 gap-2 hover:border-cyan-500">
                    <RefreshCw className="w-4 h-4" />
                    Sincronizar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                    disabled={deleteAccountMutation.isPending}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && accountsList.length === 0 && !isError && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma conta conectada</h3>
            <p className="text-slate-400 mb-6">Conecte sua primeira conta do Instagram para começar</p>
            <Button
              onClick={handleOpenInstagramOAuth}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              disabled={!import.meta.env.VITE_INSTAGRAM_CLIENT_ID}
            >
              <ExternalLink className="w-4 h-4" />
              Conectar via Instagram
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
