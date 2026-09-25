import React from 'react';
import {
  Check,
  ShieldCheck,
  Building2,
  Clock,
  MessageSquare,
  HelpCircle,
  Headphones,
  Laptop
} from 'lucide-react';
import type { Plan } from '../types/index.ts';

interface PlansProps {
  plans: Plan[];
  onContactClick: () => void;
}

export const Plans: React.FC<PlansProps> = ({ onContactClick }) => {
  return (
    <section id="planos" className="py-20 bg-slate-50/60 border-b border-emerald-100/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full inline-block mb-3">
            Plano Único e Transparente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Nosso Plano de Sistema
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Estrutura simplificada com sistema completo, sem cobrança por quantidade de computadores. Você paga por loja com suporte técnico já incluso.
          </p>
        </div>

        {/* Highlighted Master Plan Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-emerald-400 shadow-xl overflow-hidden relative">
            
            {/* Top Badge Strip */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 px-6 text-center text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Plano Sistema Completo Adipron • Cobrança por Loja</span>
            </div>

            <div className="p-8 sm:p-10">
              
              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                
                {/* Taxa de Instalacao */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Instalação do Sistema
                  </div>
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="text-3xl sm:text-4xl font-extrabold">R$ 600</span>
                    <span className="text-sm font-semibold text-slate-600">,00</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Taxa única de implantação e parametrização
                  </div>
                </div>

                {/* Mensalidade com Suporte */}
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-left relative">
                  <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Suporte Incluso
                  </span>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                    Mensalidade do Sistema
                  </div>
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-800">R$ 305</span>
                    <span className="text-sm font-semibold text-emerald-800">,00</span>
                    <span className="text-xs text-slate-500 font-medium">/ mês</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-1">
                    Cobrado por loja (não por computador)
                  </div>
                </div>

              </div>

              {/* What is Included */}
              <div className="py-8 space-y-4">
                <div className="text-sm font-bold text-slate-900 uppercase tracking-wider text-left">
                  O que está incluso neste plano:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">
                      Módulo do sistema completo
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">
                      Cobrança por loja <span className="font-normal text-slate-600">(não por computador)</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Headphones className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Suporte do sistema incluso</strong> na mensalidade
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Laptop className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Atendimento e auxílio via conexão remota (AnyDesk / TeamViewer)
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Frente de Caixa (PDV), Estoque, Vendas e Gestão Comercial
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Conformidade e atualizações de layout fiscal
                    </span>
                  </div>
                </div>
              </div>

              {/* Support Operating Hours Table */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Horários de Atendimento do Nosso Suporte:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60">
                    <span className="text-slate-600 font-medium">Segunda a Sexta-feira:</span>
                    <span className="font-bold text-slate-900">08:00 às 18:00</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60">
                    <span className="text-slate-600 font-medium">Sábado:</span>
                    <span className="font-bold text-slate-900">08:00 às 12:00</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Sem funcionamento aos domingos e feriados.</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onContactClick}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-base font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-all shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Contratar ou Tirar Dúvidas com a Adipron</span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
