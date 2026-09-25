import React, { useState } from 'react';
import {
  Download,
  Copy,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Clock,
  Laptop
} from 'lucide-react';
import type { SupportLink } from '../types/index.ts';

interface SupportProps {
  supportLinks: SupportLink[];
  onNavigateToDownloads: () => void;
  onContactClick: () => void;
}

export const Support: React.FC<SupportProps> = ({
  supportLinks,
  onContactClick
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDirectDownload = (url: string, filename?: string) => {
    const a = document.createElement('a');
    a.href = url;
    if (filename) {
      a.setAttribute('download', filename);
    }
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = (link: SupportLink) => {
    const fullUrl = link.url.startsWith('http')
      ? link.url
      : `${window.location.origin}${link.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Only remote support executable downloads (AnyDesk and TeamViewer)
  const remoteTools = supportLinks.filter(
    l => l.category === 'remoto' || l.title.toUpperCase().includes('BAIXAR')
  );

  return (
    <section id="suporte" className="py-20 bg-white border-b border-emerald-100/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block mb-2">
              Atendimento Técnico
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Suporte Remoto Imediato
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Baixe os programas oficiais para conexão remota direta com os analistas da Adipron Informática.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-medium text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Executáveis Oficiais Verificados</span>
          </div>
        </div>

        {/* Operating Hours Alert Card */}
        <div className="mb-10 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Horários de Funcionamento do Suporte do Sistema:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                <strong>Segunda a Sexta:</strong> das 08h às 18h | <strong>Sábado:</strong> das 08h às 12h | <em>Sem funcionamento aos domingos e feriados.</em>
              </p>
            </div>
            <button
              type="button"
              onClick={onContactClick}
              className="shrink-0 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-200 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
            >
              Falar com o Suporte
            </button>
          </div>
        </div>

        {/* Direct Download Remote Support Cards */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-emerald-600" />
            <span>Opções para Conexão Remota:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remoteTools.map(item => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 p-6 shadow-xs hover:shadow transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Suporte Remoto
                        </span>
                        {item.version && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            v{item.version}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        {item.fileType || 'EXE'}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* File Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{item.filename || 'executavel.exe'}</span>
                      </span>
                      {item.size && (
                        <span>
                          Tamanho: <strong className="text-slate-700">{item.size}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Copy Link & Direct Download */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Copiar link direto"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectDownload(item.url, item.filename)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-900" />
                      <span>BAIXAR</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Remote Support Guideline Banner */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-900">
              Instrução para Atendimento Remoto
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Baixe o AnyDesk ou o TeamViewer acima, execute o programa e informe o ID gerado na tela ao técnico da Adipron Informática para iniciar o suporte.
            </p>
          </div>
          <button
            type="button"
            onClick={onContactClick}
            className="shrink-0 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer"
          >
            Dúvidas sobre o suporte? Fale conosco
          </button>
        </div>

      </div>
    </section>
  );
};
