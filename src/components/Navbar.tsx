import React, { useState } from 'react';
import { Menu, X, Lock, Unlock, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  isDownloadsAuthenticated: boolean;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  isDownloadsAuthenticated
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'solucoes', label: 'Soluções' },
    { id: 'planos', label: 'Planos' },
    {
      id: 'downloads',
      label: 'Downloads',
      hasLock: true
    },
    { id: 'suporte', label: 'Suporte' },
    { id: 'contato', label: 'Contato' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <button
            onClick={() => handleLinkClick('inicio')}
            className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition-colors">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                ADIPRON INFORMÁTICA
              </span>
              <span className="text-[11px] font-medium tracking-wide text-emerald-800 uppercase">
                Automação Comercial & Suporte
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Clean Text with subtle indicators) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
            {navLinks.map(link => {
              const isActive = currentSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 relative ${
                    isActive
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hasLock && (
                    <span
                      title={isDownloadsAuthenticated ? 'Acesso liberado aos downloads' : 'Área protegida por senha'}
                      className="inline-flex items-center text-xs"
                    >
                      {isDownloadsAuthenticated ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/5561984418195?text=Ol%C3%A1!%20Gostaria%20de%20obter%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Adipron%20Inform%C3%A1tica."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 text-emerald-800" />
              <span>(61) 98441-8195</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Abrir menu principal"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map(link => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-900'
                }`}
              >
                <span>{link.label}</span>
                {link.hasLock && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-normal">
                    {isDownloadsAuthenticated ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Liberado</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Protegido</span>
                      </>
                    )}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-slate-100 mt-2">
            <a
              href="https://wa.me/5561984418195?text=Ol%C3%A1!%20Gostaria%20de%20obter%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%20da%20Adipron%20Inform%C3%A1tica."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white bg-sky-700 hover:bg-sky-800 text-sm font-semibold transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp: (61) 98441-8195</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
