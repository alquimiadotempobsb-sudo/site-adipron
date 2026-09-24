import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react';
import { api } from '../services/api.ts';
import type { InstitutionalContent } from '../types/index.ts';

interface ContactProps {
  content?: InstitutionalContent | null;
}

export const Contact: React.FC<ContactProps> = ({ content }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const phoneDisplay = content?.phoneFormatted || '(61) 98441-8195';
  const emailDisplay = content?.email || 'adipron@gmail.com';
  const whatsappUrl = `https://wa.me/5561984418195?text=${encodeURIComponent(
    'Olá! Gostaria de obter informações sobre as soluções da Adipron Informática.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Por favor, informe um telefone de contato válido com DDD.');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Por favor, escreva uma mensagem detalhando sua solicitação.');
      return;
    }

    setLoading(true);
    const res = await api.sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'Contato através do Site',
      message: message.trim(),
      website_check: honeypot
    });
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Mensagem enviada com sucesso. Em breve entraremos em contato.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } else {
      setErrorMessage(res.message || 'Não foi possível enviar a mensagem no momento.');
    }
  };

  return (
    <section id="contato" className="py-20 bg-white border-b border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 block mb-2">
            Atendimento Direto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Entre em contato
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Fale com nossa equipe para dúvidas técnicas, esclarecimentos sobre automação ou atendimento comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Details & WhatsApp Channel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Highlight Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-7 shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Fale conosco
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight my-2">
                {phoneDisplay}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Nosso canal direto para mensagens rápidas, suporte técnico e informações gerais sobre a Adipron Informática.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-900" />
                <span>Conversar pelo WhatsApp</span>
              </a>
            </div>

            {/* Direct Details List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-5">
              
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    E-mail Institucional
                  </div>
                  <a
                    href={`mailto:${emailDisplay}`}
                    className="text-base font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    {emailDisplay}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Envios de solicitações e encaminhamento de chamados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Telefone & Suporte
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {phoneDisplay}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Número internacional: +55 61 98441-8195
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Horário de Atendimento
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Segunda a Sexta: horário comercial
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Plantão para clientes com contrato de suporte.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Atuação
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Distrito Federal e Região Integrada
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atendimento presencial e suporte remoto em todo o Brasil.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Envie uma mensagem
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Preencha o formulário abaixo. Sua solicitação será encaminhada diretamente para <span className="font-semibold text-slate-800">{emailDisplay}</span>.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-sm">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Sucesso!</strong>
                  <span>{successMessage}</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Atenção</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Anti-spam Honeypot field (hidden from real users) */}
              <input
                type="text"
                name="website_check"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Nome Completo *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome ou da sua empresa"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    E-mail de Retorno *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seuemail@empresa.com.br"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                  >
                    Assunto
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Ex: Suporte, Dúvidas de Automação..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
                >
                  Mensagem *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Descreva detalhadamente como podemos auxiliar o seu negócio..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-70 transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando mensagem...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-900" />
                      <span>Enviar mensagem</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
