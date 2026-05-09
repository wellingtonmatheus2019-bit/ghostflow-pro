import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Trash2, Edit2, Play, Pause, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function Automations() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Queries com proteção
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
    data: accounts = [],
    isLoading: accountsLoading,
  } = trpc.instagramAccounts.getAll.useQuery(undefined, {
    enabled: isAuthenticated && !!user?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const utils = trpc.useUtils();

  const deleteAutomationMutation = trpc.automations.delete.useMutation({
    onSuccess: () => {
      toast.success("Automação removida com sucesso");
      utils.automations.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao remover automação: " + (error.message || "Erro desconhecido"));
    },
  });

  const updateAutomationMutation = trpc.automations.update.useMutation({
    onSuccess: () => {
      toast.success("Automação atualizada com sucesso");
      utils.automations.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar automação: " + (error.message || "Erro desconhecido"));
    },
  });

  const handleToggleAutomation = (automationId: number, isActive: boolean) => {
    updateAutomationMutation.mutate({
      id: automationId,
      data: { isActive: !isActive },
    });
  };

  const handleDeleteAutomation = (automationId: number) => {
    if (confirm("Tem certeza que deseja remover esta automação?")) {
      deleteAutomationMutation.mutate(automationId);
    }
  };

  const automationTypes: Record<string, string> = {
    follow: "Seguir",
    unfollow: "Deixar de Seguir",
    like: "Curtir",
    comment: "Comentar",
    story_view: "Visualizar Stories",
    story_reaction: "Reagir em Stories",
  };

  // Memoizar lista
  const automationsList = useMemo(() => {
    return Array.isArray(automations) ? automations : [];
  }, [automations]);

  const isLoading = automationsLoading || accountsLoading;
  const hasError = automationsError;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Automações</h1>
            <p className="text-slate-400 mt-2">Gerenciar suas automações de Instagram</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Automação
          </Button>
        </div>

        {/* Error Alert */}
        {hasError && (
          <Card className="bg-red-500/10 border-red-500/30 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">Erro ao carregar automações. Tente novamente.</p>
            </div>
          </Card>
        )}

        {/* Add Form */}
        {showAddForm && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Criar Nova Automação</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Conta</label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-cyan-500">
                  <option value="">Selecione uma conta</option>
                  {Array.isArray(accounts) &&
                    accounts.map((account: any) => (
                      <option key={account.id} value={account.id}>
                        @{account.instagramUsername}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Ação</label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-cyan-500">
                  <option value="">Selecione o tipo</option>
                  {Object.entries(automationTypes).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Criar</Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Carregando automações...</p>
          </Card>
        )}

        {/* Automations List */}
        {!isLoading && automationsList.length > 0 && (
          <div className="space-y-4">
            {automationsList.map((automation: any) => (
              <Card key={automation.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{automation.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {automationTypes[automation.type] || automation.type}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-slate-500">
                          Limite: {automation.dailyLimit}/dia
                        </span>
                        <span className="text-xs text-slate-500">
                          Delay: {automation.delayMin}s - {automation.delayMax}s
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        automation.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {automation.isActive ? "Ativa" : "Inativa"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAutomation(automation.id, automation.isActive)}
                      className="border-slate-600 gap-2"
                    >
                      {automation.isActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAutomation(automation.id)}
                      disabled={deleteAutomationMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && automationsList.length === 0 && !hasError && (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma automação criada</h3>
            <p className="text-slate-400 mb-6">Crie sua primeira automação para começar</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Automação
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
