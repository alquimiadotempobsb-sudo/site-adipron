import React from 'react';
import { Check, Info, MessageSquare } from 'lucide-react';
import type { Plan } from '../types/index.ts';

interface PlansProps {
  plans: Plan[];
  onContactClick: () => void;
}

export const Plans: React.FC<PlansProps> = ({ plans, onContactClick }) => {
  return (
    <section id="planos" className="py-20 bg-white border-b border-emerald-100/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-2">
            Modalidades de Software
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Planos e opções de atendimento
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Conheça as estruturas de atendimento e módulos disponíveis para a realidade do seu estabelecimento.
          </p>
        </div>

        {/* MANDATORY DISCLAIMER BOX - Prominently displayed */}
        <div className="max-w-3xl mx-auto mb-14 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900 block mb-1">
                Observação importante sobre a comercialização:
              </strong>
              A Adipron Informática não realiza a venda do software. As informações apresentadas sobre planos e assinaturas têm caráter informativo. Para contratação, valores e condições comerciais, entre em contato com a empresa responsável pela comercialização.
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map(plan => {
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border p-8 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'border-emerald-400 shadow-md ring-1 ring-emerald-400/30 relative bg-gradient-to-b from-emerald-50/20 to-white'
                    : 'border-slate-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div>
                  {plan.highlighted && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-3">
                      Estrutura Recomendada
                    </span>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="py-4 border-y border-slate-100 mb-6">
                    <div className="text-xl font-bold text-slate-900 tracking-tight">
                      {plan.price}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {plan.period}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Recursos e Módulos:
                    </div>
                    <ul className="space-y-2.5 text-sm text-slate-600">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onContactClick}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      plan.highlighted
                        ? 'bg-emerald-400 hover:bg-emerald-500 text-slate-900 shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{plan.contactButtonText || 'Consultar Informações'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
