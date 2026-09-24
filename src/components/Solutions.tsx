import React from 'react';
import { ShoppingCart, BarChart3, Settings2, Headphones, Building2, ArrowUpRight } from 'lucide-react';

interface SolutionsProps {
  onContactClick: () => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onContactClick }) => {
  const solutions = [
    {
      id: 'automacao-comercial',
      category: 'Frente de Caixa',
      title: 'Automação Comercial',
      description:
        'Solução voltada à agilidade nas vendas no balcão, registro de itens, atendimento ao cliente e sincronização fiscal com estabilidade operacional.',
      icon: ShoppingCart,
      highlights: ['Operação de PDV ágil', 'Emissão fiscal integrada', 'Facilidade de treinamento da equipe']
    },
    {
      id: 'gestao-empresarial',
      category: 'Administração',
      title: 'Gestão Empresarial',
      description:
        'Recursos estruturados para organização da retaguarda empresarial, acompanhamento de estoque, cadastro de itens e controle financeiro diário.',
      icon: BarChart3,
      highlights: ['Controle de estoque e entradas', 'Gestão de contas a pagar e receber', 'Relatórios operacionais']
    },
    {
      id: 'controle-operacional',
      category: 'Processos',
      title: 'Controle Operacional',
      description:
        'Ferramentas para padronização de procedimentos, controle de acesso por usuários, abertura e fechamento de turnos e integridade das rotinas.',
      icon: Settings2,
      highlights: ['Fechamento cego de caixa', 'Controle de permissões', 'Histórico de operações']
    },
    {
      id: 'suporte-tecnologico',
      category: 'Assistência Técnica',
      title: 'Suporte Tecnológico',
      description:
        'Atendimento capacitado e ágil para diagnósticos, esclarecimento de dúvidas e auxílio em manutenções preventivas ou corretivas via acesso remoto.',
      icon: Headphones,
      highlights: ['Atendimento direto e humano', 'Conexão remota assistida', 'Orientação em rotinas fiscais']
    },
    {
      id: 'solucoes-empresas',
      category: 'Personalizado',
      title: 'Soluções para Empresas',
      description:
        'Adaptação de soluções de tecnologia ao perfil do seu estabelecimento comercial, assegurando simplicidade e foco no crescimento do negócio.',
      icon: Building2,
      highlights: ['Adequação ao porte da empresa', 'Fluxos simplificados', 'Acompanhamento dedicado']
    }
  ];

  return (
    <section id="solucoes" className="py-20 bg-white border-b border-emerald-100/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-2">
              Soluções Tecnológicas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Soluções de software e tecnologia para o seu comércio
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Desenvolvidas para oferecer rapidez, segurança e facilidade de operação na rotina comercial.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={onContactClick}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>Deseja tirar dúvidas sobre as soluções?</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item, index) => {
            const Icon = item.icon;
            const isFeatured = index === 0;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border border-slate-200 p-7 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white via-white to-emerald-50/30 border-emerald-200' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Principais recursos:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
