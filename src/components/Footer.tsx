import React from 'react';
import { Shield, ArrowUp, PhoneCall, Mail } from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';
import { LogoAdipron } from './LogoAdipron.tsx';

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
          
          {/* Brand & Purpose with Logo */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('inicio')}
              className="text-left group"
              aria-label="Adipron Informática"
            >
              <LogoAdipron size={40} showText={true} lightText={true} />
            </button>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Tecnologia, software de automação comercial e suporte técnico especializado para a organização e crescimento da sua empresa.
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Confiabilidade, estabilidade e conformidade fiscal.</span>
            </div>
          </div>

          {/* Quick Links (solucoes removed) */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navegação
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('planos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Planos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('downloads')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Downloads Adipron
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('suporte')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Suporte
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contato')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Operating Hours */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Horário do Suporte
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="block font-bold text-white">Segunda a Sexta:</span>
                <span>08:00 às 18:00</span>
              </div>
              <div>
                <span className="block font-bold text-white">Sábado:</span>
                <span>08:00 às 12:00</span>
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                Sem funcionamento aos domingos e feriados.
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Atendimento
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href={`tel:${phoneDisplay.replace(/\D/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href={`mailto:${emailDisplay}`}
                  className="hover:text-white transition-colors"
                >
                  {emailDisplay}
                </a>
              </li>
              <li className="text-slate-400 pt-1">
                Brasília - DF
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Adipron Informática. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
            >
              Acesso Administrativo
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
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
