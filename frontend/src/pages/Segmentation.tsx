import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2, Filter } from "lucide-react";
import { useState } from "react";

export default function Segmentation() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const segments = [
    {
      id: 1,
      name: "Influenciadores Tech",
      filters: {
        hashtags: ["#tech", "#startup", "#innovation"],
        location: "Brasil",
        minFollowers: 10000,
        maxFollowers: 1000000,
      },
      audienceSize: 2543,
      createdAt: new Date("2026-01-15"),
    },
    {
      id: 2,
      name: "Fitness Enthusiasts",
      filters: {
        hashtags: ["#fitness", "#gym", "#workout"],
        location: "São Paulo",
        minFollowers: 1000,
        maxFollowers: 100000,
      },
      audienceSize: 5234,
      createdAt: new Date("2026-01-10"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Segmentação de Público</h1>
            <p className="text-slate-400 mt-2">Crie segmentos personalizados para suas automações</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Segmento
          </Button>
        </div>

        {/* Add Segment Form */}
        {showAddForm && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Criar Novo Segmento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome do Segmento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Influenciadores Tech"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hashtags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="#tech, #startup, #innovation"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="Brasil"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seguidores Mínimos
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seguidores Máximos
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nicho
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500">
                  <option>Selecione um nicho</option>
                  <option>Tech</option>
                  <option>Fitness</option>
                  <option>Moda</option>
                  <option>Beleza</option>
                  <option>Viagem</option>
                  <option>Comida</option>
                  <option>Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Taxa de Engajamento Mínima (%)
                </label>
                <input
                  type="number"
                  placeholder="1"
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Criar Segmento</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-slate-600"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Segments Grid */}
        {segments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{segment.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Criado em {segment.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-slate-600 gap-2">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Hashtags</p>
                    <div className="flex flex-wrap gap-2">
                      {segment.filters.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Localização</p>
                      <p className="text-white font-medium mt-1">{segment.filters.location}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Seguidores</p>
                      <p className="text-white font-medium mt-1">
                        {segment.filters.minFollowers.toLocaleString("pt-BR")} - {segment.filters.maxFollowers.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Tamanho da Audiência</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                      {segment.audienceSize.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Users className="w-4 h-4" />
                    Usar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum segmento criado</h3>
            <p className="text-slate-400 mb-6">Crie seu primeiro segmento para começar a segmentar seu público</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Segmento
            </Button>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Dicas de Segmentação</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <span>Use hashtags específicas para encontrar seu público-alvo ideal</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <span>Defina limites de seguidores para evitar contas muito grandes ou pequenas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <span>Crie múltiplos segmentos para diferentes estratégias de crescimento</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-0.5">•</span>
              <span>Monitore o desempenho de cada segmento e ajuste conforme necessário</span>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
