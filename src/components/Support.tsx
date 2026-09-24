import React from 'react';
import {
  Headphones,
  Laptop,
  BookOpen,
  Wrench,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import type { SupportLink } from '../types/index.ts';

interface SupportProps {
  supportLinks: SupportLink[];
  onNavigateToDownloads: () => void;
  onContactClick: () => void;
}

export const Support: React.FC<SupportProps> = ({
  supportLinks,
  onNavigateToDownloads,
  onContactClick
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'remoto':
        return <Laptop className="w-6 h-6 text-emerald-700" />;
      case 'manual':
        return <BookOpen className="w-6 h-6 text-emerald-700" />;
      case 'ferramenta':
        return <Wrench className="w-6 h-6 text-emerald-700" />;
      default:
        return <LifeBuoy className="w-6 h-6 text-emerald-700" />;
    }
  };

  const handleActionClick = (link: SupportLink) => {
    if (link.url === '#downloads') {
      onNavigateToDownloads();
    } else if (link.url === '#contato') {
      onContactClick();
    } else if (link.isExternal || link.url.startsWith('http')) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link.url;
    }
  };

  return (
    <section id="suporte" className="py-20 bg-white border-b border-emerald-100/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-2">
              Atendimento & Central de Recursos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Suporte e ferramentas úteis
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Acesse utilitários de suporte remoto, manuais de operação e ferramentas técnicas para o seu sistema.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <a
              href="https://wa.me/5561984418195?text=Ol%C3%A1!%20Preciso%20de%20suporte%20t%C3%A9cnico%20da%20Adipron%20Inform%C3%A1tica."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-all shadow-xs"
            >
              <Headphones className="w-4 h-4 text-slate-900" />
              <span>Chamar Suporte no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportLinks.map(link => {
            return (
              <div
                key={link.id}
                className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      {getCategoryIcon(link.category)}
                    </div>
                    {link.badge && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {link.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {link.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleActionClick(link)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span>{link.buttonText || 'ACESSAR'}</span>
                    {link.isExternal && <ExternalLink className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Remote Support Guideline Banner */}
        <div className="mt-12 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-900">
              Instrução para Atendimento Remoto
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Abra a ferramenta de suporte remoto, informe o ID gerado na tela ao técnico da Adipron Informática e aguarde a autorização da conexão.
            </p>
          </div>
          <button
            type="button"
            onClick={onContactClick}
            className="shrink-0 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
          >
            Dúvidas sobre o suporte? Fale conosco
          </button>
        </div>

      </div>
    </section>
  );
};
