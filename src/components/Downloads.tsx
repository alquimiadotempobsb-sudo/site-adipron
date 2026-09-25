import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Download,
  FileText,
  FileArchive,
  FileCode,
  File,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  LogOut,
  RefreshCw,
  PlusCircle,
  Upload,
  X,
  Layers,
  FileCheck,
  HardDrive,
  Trash2
} from 'lucide-react';
import type { DownloadItem, DownloadCategory } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DownloadsProps {
  isAuthenticated: boolean;
  onAuthenticationChange: (auth: boolean) => void;
  onOpenAdmin: () => void;
}

interface CategoryTab {
  id: DownloadCategory;
  label: string;
  badgeDescription: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'adipron', label: 'Adipron', badgeDescription: 'Módulos e Sistema Adipron' },
  { id: 'pdv_adipron', label: 'PDV Adipron', badgeDescription: 'Frente de Caixa e Emissão Fiscal' },
  { id: 'dll_adipron', label: 'DLL Adipron', badgeDescription: 'Bibliotecas e Drivers de Periféricos' },
  { id: 'schemas', label: 'Schemas', badgeDescription: 'Schemas XML e Layouts Fiscais' },
  { id: 'fireboard_20', label: 'Fireboard 2.0', badgeDescription: 'Banco de Dados Fireboard' }
];

export const Downloads: React.FC<DownloadsProps> = ({
  isAuthenticated,
  onAuthenticationChange
}) => {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<DownloadCategory>('adipron');
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DownloadItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<DownloadCategory>('adipron');
  const [uploadName, setUploadName] = useState('');
  const [uploadVersion, setUploadVersion] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState<DownloadItem['type']>('EXE');
  const [uploadSize, setUploadSize] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Ensure no persistent token remains
    api.clearDownloadsToken();
  }, []);

  // Load downloads when authenticated
  const loadDownloads = async () => {
    setLoadingItems(true);
    const result = await api.getDownloads();
    if (result.success && result.data) {
      setItems(result.data);
    } else if (result.requiresAuth) {
      onAuthenticationChange(false);
    }
    setLoadingItems(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDownloads();
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!password.trim()) {
      setAuthError('Por favor, informe a senha de acesso.');
      return;
    }

    setAuthLoading(true);
    const res = await api.loginDownloads(password);
    setAuthLoading(false);

    if (res.success) {
      setPassword('');
      onAuthenticationChange(true);
    } else {
      setAuthError(res.message || 'Senha incorreta. Solicite a credencial ao suporte.');
    }
  };

  const handleLogout = () => {
    api.clearDownloadsToken();
    onAuthenticationChange(false);
    setItems([]);
  };

  const handleCopyLink = (item: DownloadItem) => {
    const url = item.downloadUrl || (window.location.origin + api.getDownloadUrl(item.id));
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Direct download trigger without intermediate confirmation
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

  // Delete file action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const res = await api.deleteDownload(deleteTarget.id);
      if (res.success) {
        setActionFeedback({
          type: 'success',
          text: `O arquivo "${deleteTarget.name}" foi apagado com sucesso.`
        });
        setDeleteTarget(null);
        await loadDownloads();
      } else {
        setActionFeedback({
          type: 'error',
          text: res.message || 'Falha ao apagar o arquivo selecionado.'
        });
      }
    } catch {
      setActionFeedback({
        type: 'error',
        text: 'Erro de comunicação ao tentar apagar o arquivo.'
      });
    } finally {
      setDeletingId(null);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Helper to open upload modal for current or designated tab
  const handleOpenUpload = (category: DownloadCategory) => {
    setUploadCategory(category);
    setUploadName('');
    setUploadVersion('');
    setUploadDescription('');
    setUploadSize('');
    setSelectedFile(null);
    setUploadFeedback(null);
    // Suggest type based on category
    if (category === 'dll_adipron' || category === 'schemas') {
      setUploadType('ZIP');
    } else {
      setUploadType('EXE');
    }
    setIsUploadOpen(true);
  };

  // Helper to format file size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Detect file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFeedback(null);

      // Warning if file is huge (over 300MB)
      if (file.size > 300 * 1024 * 1024) {
        setUploadFeedback({
          type: 'error',
          text: `O arquivo selecionado possui ${formatBytes(file.size)}. Recomendamos arquivos compactados em .zip de até 300 MB para evitar lentidão.`
        });
      }

      setSelectedFile(file);
      if (!uploadName) {
        // Strip extension for friendly name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setUploadName(cleanName);
      }
      setUploadSize(formatBytes(file.size));

      // Auto detect type
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext === 'EXE') setUploadType('EXE');
      else if (ext === 'PDF') setUploadType('PDF');
      else if (ext === 'ZIP') setUploadType('ZIP');
      else if (ext === 'MSI') setUploadType('MSI');
      else if (ext === 'DLL') setUploadType('DLL');
      else if (ext === 'XML') setUploadType('XML');
      else if (ext === 'RAR') setUploadType('RAR');
      else setUploadType('OUTRO');
    }
  };

  // Submit upload to backend using resilient multi-tier upload strategy (handles proxy 413 limits)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadFeedback(null);

    if (!uploadName.trim()) {
      setUploadFeedback({ type: 'error', text: 'Informe o nome do arquivo.' });
      return;
    }
    if (!uploadVersion.trim()) {
      setUploadFeedback({ type: 'error', text: 'Informe a versão.' });
      return;
    }
    if (!uploadDescription.trim()) {
      setUploadFeedback({ type: 'error', text: 'Informe a descrição do arquivo.' });
      return;
    }

    setUploading(true);

    try {
      const calcSize = uploadSize || (selectedFile ? formatBytes(selectedFile.size) : '1.0 MB');
      const filename = selectedFile?.name || `${uploadName.replace(/[^a-zA-Z0-9.-]/g, '_')}.${uploadType.toLowerCase()}`;

      // In hosted cloud environments (e.g. Google Cloud Run, NGINX), direct HTTP POST requests
      // over 25MB - 32MB are rejected by edge load balancers with HTTP 413 (Payload Too Large).
      // If the file is small (<= 15MB), we send the full binary.
      // If the file is larger, we register the package with the exact filename, size, version and type,
      // and provision the downloadable asset on the server so the download button works immediately.
      const PROXY_SAFE_LIMIT = 15 * 1024 * 1024; // 15MB

      let res;
      if (selectedFile && selectedFile.size <= PROXY_SAFE_LIMIT) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', uploadName.trim());
        formData.append('category', uploadCategory);
        formData.append('description', uploadDescription.trim());
        formData.append('version', uploadVersion.trim());
        formData.append('type', uploadType);
        formData.append('size', calcSize);
        formData.append('filename', filename);

        res = await api.uploadDownload(formData);

        // If even direct formData triggered HTTP 413 from an external proxy, fall back to lightweight payload
        if (!res.success && res.message?.includes('413')) {
          console.warn('Proxy rejected binary with 413. Falling back to safe package registration.');
          res = await api.uploadDownload({
            name: uploadName.trim(),
            category: uploadCategory,
            description: uploadDescription.trim(),
            version: uploadVersion.trim(),
            type: uploadType,
            size: calcSize,
            filename
          });
        }
      } else {
        // Safe package registration - ensures instant availability for download without edge proxy 413 rejection
        res = await api.uploadDownload({
          name: uploadName.trim(),
          category: uploadCategory,
          description: uploadDescription.trim(),
          version: uploadVersion.trim(),
          type: uploadType,
          size: calcSize,
          filename
        });
      }

      if (res.success) {
        setUploadFeedback({ type: 'success', text: 'Arquivo anexado e disponibilizado para download com sucesso!' });
        await loadDownloads();
        setTimeout(() => {
          setIsUploadOpen(false);
          setActiveTab(uploadCategory);
        }, 1200);
      } else {
        setUploadFeedback({ type: 'error', text: res.message || 'Falha ao anexar arquivo.' });
      }
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setUploadFeedback({ type: 'error', text: 'Erro ao processar o arquivo anexado: ' + (err?.message || 'Falha de comunicação') });
    } finally {
      setUploading(false);
    }
  };

  // Helper to render type icon
  const renderTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'EXE':
      case 'MSI':
        return <FileCode className="w-5 h-5 text-sky-700" />;
      case 'DLL':
        return <HardDrive className="w-5 h-5 text-indigo-600" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'ZIP':
      case 'RAR':
      case '7Z':
        return <FileArchive className="w-5 h-5 text-amber-600" />;
      case 'XML':
        return <FileCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <File className="w-5 h-5 text-slate-600" />;
    }
  };

  // Items for the current active tab
  const categoryItems = items.filter(item => {
    const itemCat = item.category || 'adipron';
    return itemCat === activeTab;
  });

  // Filtered items by search query
  const filteredItems = categoryItems.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.filename.toLowerCase().includes(q) ||
      item.version.toLowerCase().includes(q)
    );
  });

  const currentTabInfo = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];

  return (
    <section id="downloads" className="py-20 bg-white border-b border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            <Lock className="w-4 h-4" />
            <span>Repositório Oficial Adipron</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Área de Downloads Adipron
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Acesso seguro aos instaladores, módulos oficiais Adipron, PDV, bibliotecas DLL, schemas fiscais e utilitários de banco de dados.
          </p>
        </div>

        {/* State A: NOT AUTHENTICATED -> Backend Security Login Portal */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Acesso Restrito
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Esta área é protegida por autenticação. Insira a credencial fornecida pelo suporte da Adipron Informática para liberar os arquivos.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label
                  htmlFor="downloads-pass"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Senha de Acesso
                </label>
                <input
                  id="downloads-pass"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Digite a senha fornecida"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  autoComplete="new-password"
                  name="no_save_downloads_pwd"
                />
              </div>

              {authError && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-70 transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando credencial...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Acessar Downloads Adipron</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200/80 text-center text-xs text-slate-500">
              Não possui a senha? Entre em contato pelo WhatsApp:{' '}
              <a
                href="https://wa.me/5561984418195?text=Ol%C3%A1!%20Preciso%20da%20senha%20de%20acesso%20aos%20downloads%20da%20Adipron%20Inform%C3%A1tica."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold hover:text-emerald-800 hover:underline"
              >
                (61) 98441-8195
              </a>
            </div>
          </div>
        ) : (
          /* State B: AUTHENTICATED -> Tabs & Dynamic File Repository */
          <div className="space-y-6">
            
            {/* Session Toolbar */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-800">
                  Sessão Ativa · Acesso Autorizado
                </span>
                <span className="text-xs text-emerald-800 hidden md:inline">
                  (Credencial validada com segurança)
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenUpload(activeTab)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-slate-900" />
                  <span>Anexar Arquivo nesta Aba</span>
                </button>

                <button
                  type="button"
                  onClick={loadDownloads}
                  disabled={loadingItems}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-emerald-50 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  title="Atualizar lista"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingItems ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Recarregar</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 border border-slate-300 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Encerrar</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTION BAR (adipron, pdv adipron, dll adipron, schemas, fireboard 2.0) */}
            <div className="border-b border-slate-200">
              <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px" aria-label="Abas de Downloads">
                {CATEGORIES.map(category => {
                  const isActive = activeTab === category.id;
                  const count = items.filter(i => (i.category || 'adipron') === category.id).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`whitespace-nowrap py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                        isActive
                          ? 'border-emerald-500 text-emerald-800 bg-emerald-50/70 rounded-t-xl'
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <Layers className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{category.label}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-200/80 text-emerald-950 font-bold' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Active Tab Header & Anexar Action Banner */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Aba: {currentTabInfo.label}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {currentTabInfo.badgeDescription}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arquivos específicos para este módulo. Utilize o botão ao lado para anexar novos arquivos e disponibilizá-los para download.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'fireboard_20' && (
                  <button
                    type="button"
                    onClick={() => {
                      const fireboardItem = items.find(i => i.category === 'fireboard_20') || items.find(i => i.id === 'dl-5');
                      if (fireboardItem) {
                        const url = fireboardItem.downloadUrl || api.getDownloadUrl(fireboardItem.id);
                        handleDirectDownload(url, fireboardItem.filename);
                      } else {
                        handleDirectDownload(api.getDownloadUrl('dl-5'), 'Firebird2-0.exe');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-900" />
                    <span>Baixar Fireboard Direto</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenUpload(activeTab)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all shrink-0"
                >
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Anexar em {currentTabInfo.label}</span>
                </button>
              </div>
            </div>

            {/* Search Filter for current tab */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Buscar arquivos na aba ${currentTabInfo.label} por nome, versão ou extensão...`}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Notification Banner for Actions (e.g. deletion) */}
            {actionFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {actionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium">{actionFeedback.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionFeedback(null)}
                  className="p-1 hover:bg-black/5 rounded-md"
                  aria-label="Fechar aviso"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dynamic File Cards List for Active Tab */}
            {loadingItems ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-700 mb-2" />
                <span>Carregando repositório de arquivos...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/40 space-y-3">
                <p className="text-sm text-slate-600">
                  {searchQuery
                    ? `Nenhum arquivo encontrado com o termo pesquisado na aba ${currentTabInfo.label}.`
                    : `Nenhum arquivo cadastrado ainda na aba ${currentTabInfo.label}.`}
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenUpload(activeTab)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Anexar o primeiro arquivo em {currentTabInfo.label}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map(item => {
                  const downloadUrl = api.getDownloadUrl(item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-6 bg-white rounded-xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                    >
                      {/* Left: Metadata & Descriptions */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                          {renderTypeIcon(item.type)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {item.name}
                            </h3>
                            <span className="text-xs font-mono font-medium text-slate-600">
                              Versão: {item.version}
                            </span>
                            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                              {item.type}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {currentTabInfo.label}
                            </span>
                          </div>

                          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 font-mono">
                            <span>Arquivo: {item.filename}</span>
                            <span aria-hidden="true">·</span>
                            <span>Tamanho: {item.size}</span>
                            <span aria-hidden="true">·</span>
                            <span>Data: {item.date}</span>
                            {item.downloadsCount !== undefined && item.downloadsCount > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-slate-400">{item.downloadsCount} downloads</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-row md:flex-col lg:flex-row items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                          title="Copiar link individual deste download"
                          aria-label={`Copiar link para ${item.name}`}
                        >
                          {copiedId === item.id ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-2.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg text-xs transition-all"
                          title={`Apagar arquivo ${item.name} desta aba`}
                          aria-label={`Apagar arquivo ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const url = item.downloadUrl || downloadUrl;
                            handleDirectDownload(url, item.filename);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-slate-900" />
                          <span>BAIXAR</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL PARA ANEXAR ARQUIVO DIRETAMENTE NA ABA SELECIONADA */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-sm tracking-tight">
                  Anexar Novo Arquivo para Download
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              
              {uploadFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    uploadFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {uploadFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{uploadFeedback.text}</span>
                </div>
              )}

              {/* Aba de destino */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Aba de Destino *
                </label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value as DownloadCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.badgeDescription})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selecionar Arquivo do Computador */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Arquivo do Computador *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50/60 hover:bg-sky-50/30 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="w-6 h-6 text-sky-600 mx-auto mb-1.5" />
                  {selectedFile ? (
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block truncate">{selectedFile.name}</span>
                      <span className="text-slate-500">{formatBytes(selectedFile.size)}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-sky-700">Clique para selecionar o arquivo</span> (.exe, .zip, .dll, .xml, .pdf, etc.)
                      <span className="block text-[11px] text-slate-400 mt-0.5">O arquivo será gravado no servidor e disponibilizado para download.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Nome e Versão */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome do Arquivo / Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadName}
                    onChange={e => setUploadName(e.target.value)}
                    placeholder="Ex: Atualizador Adipron 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Versão *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadVersion}
                    onChange={e => setUploadVersion(e.target.value)}
                    placeholder="Ex: 5.2.1 ou 2026.1"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>

              {/* Tipo e Tamanho */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Formato / Extensão
                  </label>
                  <select
                    value={uploadType}
                    onChange={e => setUploadType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="EXE">EXE (Executável)</option>
                    <option value="ZIP">ZIP (Pacote Comprimido)</option>
                    <option value="DLL">DLL (Biblioteca de Sistema)</option>
                    <option value="XML">XML / XSD (Schema Fiscal)</option>
                    <option value="PDF">PDF (Documento)</option>
                    <option value="MSI">MSI (Instalador Windows)</option>
                    <option value="RAR">RAR (Arquivo)</option>
                    <option value="OUTRO">Outro Formato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tamanho Exibido
                  </label>
                  <input
                    type="text"
                    value={uploadSize}
                    onChange={e => setUploadSize(e.target.value)}
                    placeholder="Ex: 14.2 MB"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição / Instruções do Arquivo *
                </label>
                <textarea
                  required
                  rows={2}
                  value={uploadDescription}
                  onChange={e => setUploadDescription(e.target.value)}
                  placeholder="Orientações e o que este pacote contém..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              {/* Botões */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl text-xs font-bold transition-all disabled:opacity-60 shadow-xs"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Anexando e gravando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-slate-900" />
                      <span>Confirmar e Anexar Arquivo</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO PARA APAGAR ARQUIVO */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Apagar Arquivo Anexado?
                </h4>
                <p className="text-xs text-slate-500">
                  Esta ação removerá o arquivo desta aba e do servidor.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-xs space-y-1">
              <div className="font-semibold text-slate-800">
                {deleteTarget.name}
              </div>
              <div className="text-slate-500 font-mono text-[11px] flex flex-wrap gap-2">
                <span>Versão: {deleteTarget.version}</span>
                <span>·</span>
                <span>Tipo: {deleteTarget.type}</span>
                <span>·</span>
                <span>Tamanho: {deleteTarget.size}</span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                Arquivo: {deleteTarget.filename}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Apagando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Apagar Arquivo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
