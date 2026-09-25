import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import type { InstitutionalContent } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ContactProps {
  content?: InstitutionalContent | null;
}

export const Contact: React.FC<ContactProps> = ({ content }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const phoneDisplay = content?.phoneFormatted || '(61) 98441-8195';
  const emailDisplay = content?.email || 'adipron@gmail.com';
  const whatsappUrl = `https://wa.me/5561984418195?text=Ol%C3%A1!%20Gostaria%20de%20obter%20informa%C3%A7%C3%B5es%20sobre%20o%20sistema%20da%20Adipron%20Inform%C3%A1tica.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">
            Atendimento Direto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Entre em contato com a Adipron
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Fale com nossa equipe para contratação do sistema, parametrizações e suporte técnico especializado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Details & WhatsApp Channel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Highlight Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-7 shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                Fale conosco via WhatsApp
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight my-2">
                {phoneDisplay}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Nosso canal direto para mensagens rápidas, suporte técnico e informações comerciais sobre a contratação do sistema.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-xs"
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

              {/* Exact Support Hours as Requested */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Horário de Funcionamento do Suporte
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Segunda a Sexta: 08:00 às 18:00
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Sábado: 08:00 às 12:00
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Sem funcionamento aos domingos e feriados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Localização & Atendimento
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    Brasília / DF
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atendimento e suporte remoto via AnyDesk e TeamViewer nos horários estabelecidos.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Envie uma mensagem direta
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Preencha o formulário abaixo para tirar dúvidas comerciais ou solicitar informações sobre o sistema.
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Sucesso!</strong>
                    <span>{successMessage}</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Atenção:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field for spam prevention */}
                <input
                  type="text"
                  name="website_check"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Carlos Oliveira"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Ex: (61) 98888-7777"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Endereço de E-mail *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Assunto
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Ex: Contratação do Sistema"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Descreva seu estabelecimento, quantos caixas ou terminais possui e como podemos ajudar..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-500 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Enviando mensagem...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-900" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Seus dados são transmitidos de forma segura e não compartilhados.</span>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
