import React from 'react';
import {
  Download,
  Headphones,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Monitor
} from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';

interface HeroProps {
  content?: InstitutionalContent | null;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white py-16 lg:py-24 border-b border-emerald-100/60">
      {/* Soft light-green ambient highlights */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 -left-32 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Presentation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Elegant light-green badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Portal de Atendimento & Software de Automação Comercial</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              <span className="block text-slate-900">{content?.heroTitle || 'ADIPRON INFORMÁTICA'}</span>
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-700">
                {content?.heroTagline || 'Tecnologia ágil para impulsionar a gestão da sua empresa.'}
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {content?.heroDescription || 
                'Ambiente oficial da Adipron Informática: acesse com segurança os instaladores, pacotes de atualização, suporte técnico e canais diretos de atendimento.'
              }
            </p>

            {/* CTAs with light green theme */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('downloads')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-xs hover:shadow transition-all group focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-900" />
                <span>Acessar Downloads Adipron</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('suporte')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-emerald-700" />
                <span>Central de Suporte</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('planos')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
              >
                <span>Conhecer Plano</span>
              </button>
            </div>

            {/* Reassurance points */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-sm text-slate-700">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold">Repositório de Arquivos</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold">Acesso Autenticado</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
                <Monitor className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold">Suporte Remoto Imediato</span>
              </div>
            </div>

          </div>

          {/* Right Column: Downloads Adipron Hub Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Client Hub Card */}
              <div className="bg-white rounded-2xl border-2 border-emerald-100 shadow-xl overflow-hidden">
                
                {/* Header Topbar */}
                <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                      A
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">
                        Downloads Adipron
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        Adipron Informática
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-700">
                    PORTAL ATIVO
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4 bg-white">
                  
                  {/* Status header with light-green accent */}
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                        Ambiente do Usuário
                      </div>
                      <div className="text-base font-bold text-slate-900">
                        Área de Recursos e Arquivos
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Disponível
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Baixe executáveis de apoio, arquivos de atualização do sistema e utilize as ferramentas de suporte remoto com agilidade.
                  </p>

                  {/* Fast Action Options */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate('downloads')}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            Central de Downloads
                          </div>
                          <div className="text-xs text-slate-500">
                            Módulos Adipron, PDV, DLLs, Schemas e Fireboard
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('suporte')}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            Suporte Técnico Remoto
                          </div>
                          <div className="text-xs text-slate-500">
                            Atendimento via AnyDesk e TeamViewer
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('planos')}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            Plano Completo por Loja
                          </div>
                          <div className="text-xs text-slate-500">
                            R$ 600 instalação / R$ 305 mensalidade com suporte
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Acesso Direto para Clientes
                    </span>
                    <span className="font-semibold text-slate-600">Brasília / DF</span>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
