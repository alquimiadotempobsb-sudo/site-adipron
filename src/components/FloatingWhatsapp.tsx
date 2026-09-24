import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsapp: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const phone = '5561984418195';
  const text = encodeURIComponent('Olá! Gostaria de obter informações sobre as soluções da Adipron Informática.');
  const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

  return (
    <aside aria-label="Atendimento via WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Speech Bubble / Tooltip */}
      {!tooltipDismissed && (
        <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
          <span>Precisa de suporte ou informações?</span>
          <button
            type="button"
            onClick={() => setTooltipDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Fechar dica de WhatsApp"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp da Adipron Informática"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus-visible:ring-4 focus-visible:ring-emerald-400/50 group"
      >
        <MessageCircle className="w-7 h-7 fill-white/10 group-hover:scale-110 transition-transform" />
      </a>
    </aside>
  );
};
