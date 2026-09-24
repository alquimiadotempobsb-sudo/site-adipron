import React from 'react';
import { ExternalLink, Handshake } from 'lucide-react';
import type { Partner } from '../types/index.ts';

interface PartnersProps {
  partners: Partner[];
  onOpenAdmin?: () => void;
}

export const Partners: React.FC<PartnersProps> = ({ partners }) => {
  const activePartners = partners.filter(p => p.active !== false);

  return (
    <section id="parceiros" className="py-16 bg-white border-b border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Colaboração & Ecossistema
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Nossos parceiros
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Parcerias comerciais e tecnológicas que fortalecem nossa atuação.
          </p>
        </div>

        {/* Dynamic Partner Listing or Exact Fallback Message */}
        {activePartners.length === 0 ? (
          <div className="max-w-md mx-auto py-10 px-6 rounded-2xl border border-dashed border-emerald-200 text-center bg-emerald-50/30">
            <Handshake className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Em breve apresentaremos nossos parceiros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activePartners.map(partner => (
              <div
                key={partner.id}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-colors flex flex-col justify-between"
              >
                <div>
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      referrerPolicy="no-referrer"
                      className="h-10 object-contain mb-4"
                    />
                  ) : (
                    <div className="h-10 flex items-center mb-4">
                      <span className="text-base font-bold text-slate-800 tracking-tight">
                        {partner.name}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {partner.description}
                  </p>
                </div>

                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors pt-3 border-t border-slate-200/60"
                  >
                    <span>Visitar parceiro</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
