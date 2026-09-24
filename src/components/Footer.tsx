import React from 'react';
import { Phone, Mail, Shield, ArrowUp } from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';

interface FooterProps {
  content?: InstitutionalContent | null;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  content,
  onNavigate,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phoneDisplay = content?.phoneFormatted || '(61) 98441-8195';
  const emailDisplay = content?.email || 'adipron@gmail.com';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ADIPRON INFORMÁTICA
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Tecnologia, software de automação comercial e suporte técnico especializado para a organização e crescimento da sua empresa.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Confiabilidade, estabilidade e conformidade fiscal.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navegação
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solucoes')}
                  className="hover:text-white transition-colors"
                >
                  Soluções
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('planos')}
                  className="hover:text-white transition-colors"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('downloads')}
                  className="hover:text-white transition-colors"
                >
                  Downloads
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('suporte')}
                  className="hover:text-white transition-colors"
                >
                  Suporte
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contato')}
                  className="hover:text-white transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Canais de Contato
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://wa.me/5561984418195"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-medium text-slate-200"
                  >
                    {phoneDisplay}
                  </a>
                  <span className="block text-xs text-slate-400">Atendimento WhatsApp & Voz</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`mailto:${emailDisplay}`}
                    className="hover:text-white transition-colors font-medium text-slate-200"
                  >
                    {emailDisplay}
                  </a>
                  <span className="block text-xs text-slate-400">Canal oficial para solicitações</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © Adipron Informática — Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-sky-500 rounded px-1"
            >
              <span>Painel Administrativo</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1"
              aria-label="Voltar ao topo da página"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
