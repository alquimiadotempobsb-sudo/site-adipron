import React from 'react';
import { ArrowRight, MessageSquare, Monitor, CheckCircle2, ShieldCheck, Download, Users, FolderDown, Headphones, Globe } from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';

interface HeroProps {
  content: InstitutionalContent | null;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ content, onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-white border-b border-emerald-100">
      {/* Subtle light-green organic ambient aura on pure white canvas */}
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
          
          {/* Left Column: Client-Focused Presentation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Elegant light-green badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Portal de Atendimento & Software para Clientes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              <span className="block text-slate-900">{content?.heroTitle || 'ADIPRON INFORMÁTICA'}</span>
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-700">
                {content?.heroTagline || 'Tecnologia ágil para impulsionar a gestão da sua empresa.'}
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              {content?.heroDescription || 
                'Ambiente exclusivo para clientes: acesse com segurança os instaladores, pacotes de atualização, manuais, suporte técnico e canais diretos de atendimento da Adipron Informática.'
              }
            </p>

            {/* CTAs with light green theme */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('downloads')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-xs hover:shadow transition-all group focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Download className="w-4 h-4 text-slate-900" />
                <span>Acessar Downloads do Cliente</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('suporte')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Headphones className="w-4 h-4 text-emerald-700" />
                <span>Central de Suporte</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('contato')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Fale Conosco</span>
              </button>
            </div>

            {/* Quick Benefits Pills */}
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

          {/* Right Column: Portal do Cliente Card */}
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
                        Portal do Cliente
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

                  {/* Customer Portal Options */}
                  <div className="space-y-2.5">
                    
                    <button
                      type="button"
                      onClick={() => onNavigate('downloads')}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <FolderDown className="w-5 h-5" />
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
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group"
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
                            Atendimento via AnyDesk, TeamViewer e WhatsApp
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('solucoes')}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            Soluções & Manuais
                          </div>
                          <div className="text-xs text-slate-500">
                            Orientações sobre automação comercial e retaguarda
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
                      Acesso Exclusivo para Clientes
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
