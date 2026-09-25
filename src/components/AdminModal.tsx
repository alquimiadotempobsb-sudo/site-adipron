import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Trash2,
  FileCode,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  FileEdit,
  CheckCircle,
  AlertCircle,
  Save,
  Download
} from 'lucide-react';
import { api } from '../services/api.ts';
import type {
  DownloadItem,
  DownloadCategory,
  Plan,
  SupportLink,
  ContactMessage,
  InstitutionalContent
} from '../types/index.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  currentContent?: InstitutionalContent | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  currentContent
}) => {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'downloads' | 'plans' | 'support' | 'messages' | 'content'>('downloads');

  // Admin Data states
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [contentForm, setContentForm] = useState<Partial<InstitutionalContent>>({});

  // Form states for adding items
  const [newDl, setNewDl] = useState({
    name: '',
    category: 'adipron' as DownloadCategory,
    description: '',
    type: 'EXE' as DownloadItem['type'],
    size: '15.0 MB',
    version: '1.0.0',
    filename: ''
  });

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 'Consulte valores',
    period: 'Comercialização externa',
    benefits: '',
    contactButtonText: 'Consultar com a Representante',
    highlighted: false
  });

  const [newSupport, setNewSupport] = useState({
    title: '',
    description: '',
    url: '',
    category: 'remoto' as const,
    badge: 'Ferramenta',
    buttonText: 'Acessar'
  });

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentContent) {
      setContentForm(currentContent);
    }
  }, [currentContent]);

  const checkAuth = async () => {
    const ok = await api.checkAdminAuth();
    setIsAdminAuth(ok);
    if (ok) {
      loadAllAdminData();
    }
  };

  const loadAllAdminData = async () => {
    const [dlRes, planList, supList, msgList] = await Promise.all([
      api.getDownloads(),
      api.getPlans(),
      api.getSupportLinks(),
      api.adminGetMessages()
    ]);

    if (dlRes.data) setDownloads(dlRes.data);
    setPlans(planList);
    setSupportLinks(supList);
    setMessages(msgList);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await api.loginAdmin(pin);
    if (res.success) {
      setIsAdminAuth(true);
      setPin('');
      loadAllAdminData();
    } else {
      setAuthError(res.message || 'Senha ou PIN administrativo incorreto.');
    }
  };

  const handleLogout = () => {
    api.clearAdminToken();
    setIsAdminAuth(false);
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Handlers for Add / Delete
  const handleAddDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDl.name || !newDl.description) return;
    const ok = await api.adminAddDownload(newDl);
    if (ok) {
      showStatus('success', 'Arquivo adicionado aos downloads.');
      setNewDl({
        name: '',
        category: 'adipron',
        description: '',
        type: 'EXE',
        size: '15.0 MB',
        version: '1.0.0',
        filename: ''
      });
      loadAllAdminData();
      onDataChanged();
    } else {
      showStatus('error', 'Falha ao adicionar arquivo.');
    }
  };

  const handleDeleteDownload = async (id: string) => {
    if (!window.confirm('Confirma a exclusão deste arquivo?')) return;
    const ok = await api.adminDeleteDownload(id);
    if (ok) {
      showStatus('success', 'Arquivo excluído.');
      loadAllAdminData();
      onDataChanged();
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.description) return;
    const benefitsArray = newPlan.benefits
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);

    const ok = await api.adminAddPlan({
      name: newPlan.name,
      description: newPlan.description,
      price: newPlan.price,
      period: newPlan.period,
      benefits: benefitsArray,
      contactButtonText: newPlan.contactButtonText,
      highlighted: newPlan.highlighted
    });

    if (ok) {
      showStatus('success', 'Plano adicionado.');
      setNewPlan({
        name: '',
        description: '',
        price: 'Consulte valores',
        period: 'Comercialização externa',
        benefits: '',
        contactButtonText: 'Consultar com a Representante',
        highlighted: false
      });
      loadAllAdminData();
      onDataChanged();
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Confirma a exclusão deste plano?')) return;
    const ok = await api.adminDeletePlan(id);
    if (ok) {
      showStatus('success', 'Plano excluído.');
      loadAllAdminData();
      onDataChanged();
    }
  };

  const handleAddSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupport.title || !newSupport.url) return;
    const ok = await api.adminAddSupportLink(newSupport);
    if (ok) {
      showStatus('success', 'Link de suporte cadastrado.');
      setNewSupport({
        title: '',
        description: '',
        url: '',
        category: 'remoto',
        badge: 'Ferramenta',
        buttonText: 'Acessar'
      });
      loadAllAdminData();
      onDataChanged();
    }
  };

  const handleDeleteSupport = async (id: string) => {
    if (!window.confirm('Confirma a exclusão deste link de suporte?')) return;
    const ok = await api.adminDeleteSupportLink(id);
    if (ok) {
      showStatus('success', 'Link de suporte excluído.');
      loadAllAdminData();
      onDataChanged();
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await api.adminUpdateContent(contentForm);
    if (ok) {
      showStatus('success', 'Conteúdo institucional atualizado com sucesso.');
      onDataChanged();
    } else {
      showStatus('error', 'Falha ao salvar conteúdo institucional.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-sky-600 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">
                Painel Administrativo
              </span>
              <span className="text-[11px] text-slate-400 block">
                Adipron Informática · Gerenciamento de Conteúdo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuth && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Fechar painel administrativo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notification */}
        {statusMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAdminAuth ? (
            /* Admin Login Gate */
            <div className="max-w-sm mx-auto my-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-700">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Autenticação de Administrador
              </h3>
              <p className="text-xs text-slate-600 mb-6">
                Informe a credencial mestra para gerenciar downloads, parceiros, planos, suporte e textos institucionais.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="Credencial / Senha de Administrador"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    autoComplete="current-password"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Entrar no Painel
                </button>
              </form>

              <div className="mt-4 text-[11px] text-slate-400">
                Credencial padrão inicial: <code>151621</code> ou <code>adipron.admin.2026</code>
              </div>
            </div>
          ) : (
            /* Admin Dashboard with Tabs */
            <div>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-3 mb-6 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'downloads'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Downloads ({downloads.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('plans')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'plans'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Planos ({plans.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('support')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'support'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>Suporte ({supportLinks.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'messages'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Mensagens ({messages.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'content'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Conteúdo Textual</span>
                </button>
              </div>

              {/* TAB 1: DOWNLOADS MANAGEMENT */}
              {activeTab === 'downloads' && (
                <div className="space-y-6">
                  {/* Add form */}
                  <form onSubmit={handleAddDownload} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-700" />
                      <span>Adicionar Novo Arquivo de Download</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aba / Categoria *</label>
                        <select
                          value={newDl.category}
                          onChange={e => setNewDl({ ...newDl, category: e.target.value as DownloadCategory })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium"
                        >
                          <option value="adipron">Adipron</option>
                          <option value="pdv_adipron">PDV Adipron</option>
                          <option value="dll_adipron">DLL Adipron</option>
                          <option value="schemas">Schemas</option>
                          <option value="fireboard_20">Fireboard 2.0</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome do Arquivo *</label>
                        <input
                          type="text"
                          required
                          value={newDl.name}
                          onChange={e => setNewDl({ ...newDl, name: e.target.value })}
                          placeholder="Ex: Atualizador Adipron"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Versão *</label>
                        <input
                          type="text"
                          required
                          value={newDl.version}
                          onChange={e => setNewDl({ ...newDl, version: e.target.value })}
                          placeholder="Ex: 5.2.1"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tipo de Arquivo</label>
                        <select
                          value={newDl.type}
                          onChange={e => setNewDl({ ...newDl, type: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        >
                          <option value="EXE">EXE (Executável)</option>
                          <option value="ZIP">ZIP (Arquivo Comprimido)</option>
                          <option value="DLL">DLL (Biblioteca)</option>
                          <option value="XML">XML (Schema Fiscal)</option>
                          <option value="PDF">PDF (Documento)</option>
                          <option value="MSI">MSI (Instalador Windows)</option>
                          <option value="RAR">RAR (Arquivo)</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tamanho Estimado</label>
                        <input
                          type="text"
                          value={newDl.size}
                          onChange={e => setNewDl({ ...newDl, size: e.target.value })}
                          placeholder="Ex: 18.4 MB"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome Físico do Arquivo</label>
                        <input
                          type="text"
                          value={newDl.filename}
                          onChange={e => setNewDl({ ...newDl, filename: e.target.value })}
                          placeholder="Ex: Atualizador_Adipron_v5.2.exe (opcional)"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Descrição Detalhada *</label>
                      <textarea
                        required
                        rows={2}
                        value={newDl.description}
                        onChange={e => setNewDl({ ...newDl, description: e.target.value })}
                        placeholder="Orientações e o que este pacote atualiza..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Cadastrar Arquivo
                    </button>
                  </form>

                  {/* Existing list */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Arquivos Cadastrados ({downloads.length})
                    </div>
                    {downloads.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <FileCode className="w-5 h-5 text-sky-700 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{item.name}</span>
                              <span className="bg-sky-50 text-sky-700 text-[10px] px-1.5 py-0.5 rounded font-medium border border-sky-200">
                                {item.category === 'adipron' && 'Adipron'}
                                {item.category === 'pdv_adipron' && 'PDV Adipron'}
                                {item.category === 'dll_adipron' && 'DLL Adipron'}
                                {item.category === 'schemas' && 'Schemas'}
                                {item.category === 'fireboard_20' && 'Fireboard 2.0'}
                                {!item.category && 'Adipron'}
                              </span>
                            </div>
                            <span className="text-slate-500 font-mono">({item.version}) · {item.type} · {item.size}</span>
                            <div className="text-slate-500 text-[11px] mt-0.5">{item.description}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteDownload(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                          title="Excluir arquivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PLANS MANAGEMENT */}
              {activeTab === 'plans' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddPlan} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-700" />
                      <span>Cadastrar Novo Plano</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome do Plano *</label>
                        <input
                          type="text"
                          required
                          value={newPlan.name}
                          onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                          placeholder="Ex: Plano Corporativo"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Preço Informativo</label>
                        <input
                          type="text"
                          value={newPlan.price}
                          onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
                          placeholder="Ex: Consulte valores"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Descrição Resumida *</label>
                      <input
                        type="text"
                        required
                        value={newPlan.description}
                        onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                        placeholder="Para quem este plano é indicado..."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Benefícios / Recursos (um por linha)
                      </label>
                      <textarea
                        rows={3}
                        value={newPlan.benefits}
                        onChange={e => setNewPlan({ ...newPlan, benefits: e.target.value })}
                        placeholder="Módulo de Frente de Caixa&#10;Emissão de NFC-e&#10;Controle de estoque"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="plan-highlight"
                        checked={newPlan.highlighted}
                        onChange={e => setNewPlan({ ...newPlan, highlighted: e.target.checked })}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <label htmlFor="plan-highlight" className="text-xs text-slate-700">
                        Destacar como plano recomendado
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Cadastrar Plano
                    </button>
                  </form>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Planos Cadastrados ({plans.length})
                    </div>
                    {plans.map(p => (
                      <div
                        key={p.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.name}</span>
                            {p.highlighted && (
                              <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                Destacado
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">{p.description}</div>
                          <div className="text-slate-400 text-[10px] mt-1">Preço: {p.price} ({p.period})</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeletePlan(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SUPPORT MANAGEMENT */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddSupport} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-700" />
                      <span>Cadastrar Recurso de Suporte</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Título *</label>
                        <input
                          type="text"
                          required
                          value={newSupport.title}
                          onChange={e => setNewSupport({ ...newSupport, title: e.target.value })}
                          placeholder="Ex: Ferramenta de Suporte Remoto"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Categoria</label>
                        <select
                          value={newSupport.category}
                          onChange={e => setNewSupport({ ...newSupport, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        >
                          <option value="remoto">Remoto</option>
                          <option value="manual">Manual / Guia</option>
                          <option value="ferramenta">Ferramenta</option>
                          <option value="tutorial">Tutorial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Link / Destino *</label>
                        <input
                          type="text"
                          required
                          value={newSupport.url}
                          onChange={e => setNewSupport({ ...newSupport, url: e.target.value })}
                          placeholder="Ex: https://... ou #downloads"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={newSupport.description}
                        onChange={e => setNewSupport({ ...newSupport, description: e.target.value })}
                        placeholder="Ex: Utilize esta ferramenta quando solicitado pelo suporte técnico."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Cadastrar Link de Suporte
                    </button>
                  </form>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Recursos de Suporte Atuais ({supportLinks.length})
                    </div>
                    {supportLinks.map(s => (
                      <div
                        key={s.id}
                        className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{s.title}</span>
                          <span className="text-slate-400 ml-2">({s.category})</span>
                          <div className="text-slate-500 text-[11px] mt-0.5">{s.description}</div>
                          <div className="text-sky-700 text-[10px] mt-1 font-mono">{s.url}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteSupport(s.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mensagens Recebidas ({messages.length})
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                      Nenhuma mensagem enviada até o momento.
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-900">{msg.name}</span>
                          <span className="text-slate-400 text-[11px]">
                            {new Date(msg.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                          <div><strong>E-mail:</strong> {msg.email}</div>
                          <div><strong>Telefone:</strong> {msg.phone}</div>
                          <div className="sm:col-span-2"><strong>Assunto:</strong> {msg.subject}</div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded text-slate-800 mt-2 whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: INSTITUTIONAL CONTENT EDITING */}
              {activeTab === 'content' && (
                <form onSubmit={handleSaveContent} className="space-y-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Textos e Dados Institucionais
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Título Principal (Hero)</label>
                      <input
                        type="text"
                        value={contentForm.heroTitle || ''}
                        onChange={e => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Slogan (Hero Tagline)</label>
                      <input
                        type="text"
                        value={contentForm.heroTagline || ''}
                        onChange={e => setContentForm({ ...contentForm, heroTagline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Texto Institucional Inicial (Hero)</label>
                    <textarea
                      rows={2}
                      value={contentForm.heroDescription || ''}
                      onChange={e => setContentForm({ ...contentForm, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone Exibido</label>
                      <input
                        type="text"
                        value={contentForm.phoneFormatted || ''}
                        onChange={e => setContentForm({ ...contentForm, phoneFormatted: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail de Contato</label>
                      <input
                        type="email"
                        value={contentForm.email || ''}
                        onChange={e => setContentForm({ ...contentForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações Institucionais</span>
                  </button>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
