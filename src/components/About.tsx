import React from 'react';
import { Shield, Layers, Headphones } from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';

interface AboutProps {
  content?: InstitutionalContent | null;
}

export const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section id="sobre" className="py-20 bg-white border-b border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Institucional
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {content?.aboutTitle || 'Quem somos'}
          </h2>
          <div className="mt-4 space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            <p>
              {content?.aboutText1 ||
                'A Adipron Informática é uma empresa voltada à tecnologia e soluções de automação comercial. Nosso foco é oferecer suporte técnico capacitado e viabilizar ferramentas de software que facilitam o dia a dia de estabelecimentos empresariais.'
              }
            </p>
            <p>
              {content?.aboutText2 ||
                'Trabalhamos para garantir que a gestão das vendas, o controle operacional e o cumprimento das obrigações fiscais ocorram de forma simplificada, segura e com atendimento prestativo quando você mais precisa.'
              }
            </p>
          </div>
        </div>

        {/* Core Pillars (Focused strictly on stated competencies, no hallucinated stats) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Automação Comercial
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Estruturação e suporte para rotinas de frente de caixa, cadastro mercadológico, entradas de notas e relatórios essenciais para a rotina do seu comércio.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-5">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Suporte Tecnológico
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Atendimento técnico orientado a solucionar dúvidas operacionais, parametrizações e auxílio via conexão remota para manter seu ponto de venda em funcionamento.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Confiabilidade & Segurança
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Processos estruturados com integridade dos dados, backups regulares de banco e atualizações periódicas de compatibilidade com as exigências fiscais vigentes.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
