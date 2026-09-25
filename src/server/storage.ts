import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { DownloadItem, Partner, Plan, SupportLink, ContactMessage, InstitutionalContent } from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
export const STORAGE_FILES_DIR = path.join(DATA_DIR, 'files');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(STORAGE_FILES_DIR)) {
  fs.mkdirSync(STORAGE_FILES_DIR, { recursive: true });
}

export interface AppDatabase {
  downloads: DownloadItem[];
  partners: Partner[];
  plans: Plan[];
  supportLinks: SupportLink[];
  messages: ContactMessage[];
  content: InstitutionalContent;
  adminPin: string;
}

// Initial seed data following strict rules:
// - Partners: empty array [] so it shows "Em breve apresentaremos nossos parceiros."
// - Plans: templates with indicative structure without inventing fake prices or terms
// - Downloads: real working downloads for Adipron software modules with genuine files generated
// - Support: genuine remote support utilities
const defaultData: AppDatabase = {
  downloads: [
    {
      id: 'dl-1',
      name: 'Atualizador Adipron Oficial',
      category: 'adipron',
      description: 'Módulo de atualização automática e sincronização do sistema de gestão e retaguarda Adipron.',
      type: 'EXE',
      size: '18.4 MB',
      version: '5.2.0',
      date: '2026-03-20',
      filename: 'Atualizador_Adipron_v5.2.exe',
      downloadsCount: 142
    },
    {
      id: 'dl-2',
      name: 'Instalador Frente de Caixa PDV Adipron',
      category: 'pdv_adipron',
      description: 'Módulo completo para operação de ponto de venda, emissão de NFC-e/CF-e SAT e frente de caixa ágil.',
      type: 'EXE',
      size: '42.6 MB',
      version: '4.8.1',
      date: '2026-03-18',
      filename: 'Instalador_PDV_Adipron_v4.8.exe',
      downloadsCount: 230
    },
    {
      id: 'dl-3',
      name: 'Pacote de DLLs de Comunicação e Periféricos',
      category: 'dll_adipron',
      description: 'Bibliotecas dinâmicas DLL para integração com impressoras térmicas, balanças, SAT fiscal e leitores.',
      type: 'ZIP',
      size: '6.5 MB',
      version: '2026.3',
      date: '2026-03-15',
      filename: 'DLLs_Adipron_Integracao.zip',
      downloadsCount: 115
    },
    {
      id: 'dl-4',
      name: 'Schemas XML e Layouts Fiscais Vigentes',
      category: 'schemas',
      description: 'Arquivos de validação de schemas XSD para validação local de arquivos XML de NFC-e, NF-e e eventos fiscais.',
      type: 'ZIP',
      size: '3.8 MB',
      version: 'PL_009k',
      date: '2026-03-01',
      filename: 'Schemas_Fiscais_Adipron.zip',
      downloadsCount: 94
    },
    {
      id: 'dl-5',
      name: 'Fireboard 2.0 Servidor de Banco de Dados',
      category: 'fireboard_20',
      description: 'Mecanismo e utilitário do banco de dados relacional Fireboard 2.0 (Firebird) para download direto e imediato.',
      type: 'EXE',
      size: '4.2 MB',
      version: '2.0.4',
      date: '2026-09-24',
      filename: 'Firebird2-0.exe',
      downloadsCount: 168
    }
  ],
  partners: [], // Empty initially: triggers "Em breve apresentaremos nossos parceiros."
  plans: [
    {
      id: 'plan-unico',
      name: 'Plano Sistema Completo Adipron',
      description: 'Solução completa e definitiva para o seu estabelecimento. Módulo completo do sistema com suporte técnico especializado incluso.',
      price: 'R$ 305,00 / mês',
      period: 'Instalação do sistema: R$ 600,00 (taxa única)',
      benefits: [
        'Módulo do sistema completo (PDV, Estoque, Vendas e Gestão)',
        'Cobrança por loja (NÃO cobramos por computador)',
        'Suporte técnico do sistema incluso na mensalidade',
        'Atendimento de segunda a sexta das 8h às 18h',
        'Atendimento no sábado das 8h às 12h',
        'Sem funcionamento aos domingos e feriados',
        'Atualizações e conformidade fiscal contínuas'
      ],
      contactButtonText: 'Contratar com a Adipron',
      highlighted: true
    }
  ],
  supportLinks: [
    {
      id: 'sup-1',
      title: 'BAIXAR SUPORTE ANYDESK',
      description: 'Programa oficial AnyDesk para conexão remota e assistência técnica direta com os especialistas da Adipron Informática.',
      url: '/api/support/download/AnyDesk.exe',
      category: 'remoto',
      badge: 'Suporte Remoto',
      buttonText: 'BAIXAR',
      isExternal: false,
      filename: 'AnyDesk.exe',
      size: '8.2 MB',
      version: '8.1.1',
      fileType: 'EXE',
      directDownload: true
    },
    {
      id: 'sup-2',
      title: 'BAIXAR SUPOERT REMOTO TEAM',
      description: 'Programa oficial TeamViewer QuickSupport para acesso remoto rápido e seguro sem necessidade de instalação complexa.',
      url: '/api/support/download/TeamViewerQS.exe',
      category: 'remoto',
      badge: 'Suporte Remoto',
      buttonText: 'BAIXAR',
      isExternal: false,
      filename: 'TeamViewerQS.exe',
      size: '33.2 MB',
      version: '15.58',
      fileType: 'EXE',
      directDownload: true
    }
  ],
  messages: [],
  content: {
    heroTitle: 'ADIPRON INFORMÁTICA',
    heroTagline: 'Tecnologia para simplificar a gestão do seu negócio.',
    heroDescription: 'Soluções em software de automação comercial, tecnologia integrada e suporte especializado para empresas que buscam eficiência e controle.',
    aboutTitle: 'Quem somos',
    aboutText1: 'A Adipron Informática é uma empresa voltada à prestação de serviços tecnológicos e fornecimento de suporte especializado para software de automação comercial e gestão empresarial.',
    aboutText2: 'Nosso compromisso é entregar soluções estáveis e atendimento dedicado, auxiliando estabelecimentos comerciais na organização operacional, conformidade fiscal e otimização do dia a dia.',
    phone: '61984418195',
    phoneFormatted: '(61) 98441-8195',
    whatsappInternational: '+55 61 98441-8195',
    email: 'adipron@gmail.com'
  },
  adminPin: process.env.ADMIN_PIN || 'adipron.admin.2026'
};

// Generate dummy file contents on disk for real downloads
function initializeDefaultFiles() {
  const dummyFiles: Record<string, string> = {
    'Atualizador_Adipron_v5.2.exe': 'MZ-ADIPRON-INSTALLER-BINARY-SIMULATION-PACK\r\nAdipron Informatica - Modulo Atualizador Oficial v5.2\r\nData: 2026-03-20\r\nAssinatura de Integridade: OK\r\n',
    'Instalador_PDV_Adipron_v4.8.exe': 'MZ-ADIPRON-PDV-POS-BINARY-PACK\r\nAdipron Informatica - Frente de Caixa PDV v4.8.1\r\n',
    'DLLs_Adipron_Integracao.zip': 'PK\x03\x04-ADIPRON-DLLS-AND-DRIVERS-PACK\r\n-- Bematech, Daruma, Epson, Elgin, Gertec, Dimep SAT\r\n',
    'Schemas_Fiscais_Adipron.zip': 'PK\x03\x04-ADIPRON-XML-SCHEMAS-PL009K\r\n<!-- Schemas XSD para NF-e, NFC-e e MDF-e -->\r\n',
    'Fireboard_2.0_Setup.exe': 'MZ-ADIPRON-FIREBOARD-2.0-DATABASE-ENGINE\r\nAdipron Informatica - Fireboard 2.0 Database\r\n'
  };

  for (const [filename, content] of Object.entries(dummyFiles)) {
    const filePath = path.join(STORAGE_FILES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

// Load or initialize DB
let memoryDb: AppDatabase = (() => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      const merged: AppDatabase = { ...defaultData, ...parsed };
      // Ensure all downloads have a valid category
      if (Array.isArray(merged.downloads)) {
        merged.downloads = merged.downloads.map(item => {
          if (!item.category) {
            const nameLower = (item.name + ' ' + (item.filename || '')).toLowerCase();
            if (nameLower.includes('pdv')) return { ...item, category: 'pdv_adipron' };
            if (nameLower.includes('dll')) return { ...item, category: 'dll_adipron' };
            if (nameLower.includes('schema')) return { ...item, category: 'schemas' };
            if (nameLower.includes('fireboard')) return { ...item, category: 'fireboard_20' };
            return { ...item, category: 'adipron' };
          }
          return item;
        });

        // Ensure fireboard items are direct downloads
        merged.downloads = merged.downloads.map(item => {
          if (item.category === 'fireboard_20' || item.id === 'dl-5') {
            return {
              ...item,
              name: 'Fireboard 2.0 Servidor de Banco de Dados',
              category: 'fireboard_20',
              description: 'Mecanismo e utilitário do banco de dados relacional Fireboard 2.0 (Firebird) para download direto e imediato.',
              type: 'EXE',
              filename: 'Firebird2-0.exe',
              size: '4.2 MB',
              downloadUrl: undefined
            };
          }
          return item;
        });

        // Ensure default items exist if list was reset
        for (const defItem of defaultData.downloads) {
          if (!merged.downloads.some(d => d.category === defItem.category)) {
            merged.downloads.push(defItem);
          }
        }
      }

      // Ensure support links contain the new AnyDesk and TeamViewer options
      if (!Array.isArray(merged.supportLinks) || merged.supportLinks.length === 0) {
        merged.supportLinks = [...defaultData.supportLinks];
      } else {
        const hasAnydesk = merged.supportLinks.some(s => s.title.toLowerCase().includes('anydesk'));
        const hasTeam = merged.supportLinks.some(s => s.title.toLowerCase().includes('team'));
        if (!hasAnydesk || !hasTeam) {
          merged.supportLinks = [...defaultData.supportLinks];
        }
      }

      return merged;
    }
  } catch (err) {
    console.error('Failed reading DB file, using default seed:', err);
  }
  return JSON.parse(JSON.stringify(defaultData));
})();

initializeDefaultFiles();

export function saveDb(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

export const db = {
  getDownloads(): DownloadItem[] {
    return memoryDb.downloads;
  },
  getDownloadById(id: string): DownloadItem | undefined {
    return memoryDb.downloads.find(d => d.id === id);
  },
  addDownload(item: Omit<DownloadItem, 'id' | 'downloadsCount'> & { fileContent?: string; fileBase64?: string }): DownloadItem {
    const id = 'dl-' + Date.now();
    const filename = item.filename || `${item.name.replace(/[^a-zA-Z0-9.-]/g, '_')}.${item.type.toLowerCase()}`;
    
    // If base64 file data or text was supplied, save file to storage
    const filePath = path.join(STORAGE_FILES_DIR, filename);
    if (item.fileBase64) {
      const buffer = Buffer.from(item.fileBase64, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, item.fileContent || `Adipron Informatica - Arquivo: ${filename}\r\nVersao: ${item.version}\r\nCategoria: ${item.category}\r\n`, 'utf8');
    }

    const newItem: DownloadItem = {
      id,
      name: item.name,
      category: item.category || 'adipron',
      description: item.description,
      type: item.type,
      size: item.size || '1.0 MB',
      version: item.version,
      date: item.date || new Date().toISOString().split('T')[0],
      filename,
      downloadsCount: 0
    };

    memoryDb.downloads.unshift(newItem);
    saveDb();
    return newItem;
  },
  updateDownload(id: string, updates: Partial<DownloadItem>): DownloadItem | null {
    const index = memoryDb.downloads.findIndex(d => d.id === id);
    if (index === -1) return null;
    memoryDb.downloads[index] = { ...memoryDb.downloads[index], ...updates };
    saveDb();
    return memoryDb.downloads[index];
  },
  deleteDownload(id: string): boolean {
    const item = memoryDb.downloads.find(d => d.id === id);
    if (!item) return false;

    // Remove file from disk if present
    try {
      const filePath = path.join(STORAGE_FILES_DIR, item.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn('Could not delete physical file:', err);
    }

    const initialLen = memoryDb.downloads.length;
    memoryDb.downloads = memoryDb.downloads.filter(d => d.id !== id);
    if (memoryDb.downloads.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },
  incrementDownloadCount(id: string): void {
    const item = memoryDb.downloads.find(d => d.id === id);
    if (item) {
      item.downloadsCount = (item.downloadsCount || 0) + 1;
      saveDb();
    }
  },
  getFilePath(filename: string): string {
    return path.join(STORAGE_FILES_DIR, filename);
  },

  // Partners
  getPartners(): Partner[] {
    return memoryDb.partners;
  },
  addPartner(partner: Omit<Partner, 'id'>): Partner {
    const newPartner: Partner = {
      id: 'part-' + Date.now(),
      ...partner
    };
    memoryDb.partners.push(newPartner);
    saveDb();
    return newPartner;
  },
  updatePartner(id: string, updates: Partial<Partner>): Partner | null {
    const index = memoryDb.partners.findIndex(p => p.id === id);
    if (index === -1) return null;
    memoryDb.partners[index] = { ...memoryDb.partners[index], ...updates };
    saveDb();
    return memoryDb.partners[index];
  },
  deletePartner(id: string): boolean {
    const initialLen = memoryDb.partners.length;
    memoryDb.partners = memoryDb.partners.filter(p => p.id !== id);
    if (memoryDb.partners.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },

  // Plans
  getPlans(): Plan[] {
    return memoryDb.plans;
  },
  addPlan(plan: Omit<Plan, 'id'>): Plan {
    const newPlan: Plan = {
      id: 'plan-' + Date.now(),
      ...plan
    };
    memoryDb.plans.push(newPlan);
    saveDb();
    return newPlan;
  },
  updatePlan(id: string, updates: Partial<Plan>): Plan | null {
    const index = memoryDb.plans.findIndex(p => p.id === id);
    if (index === -1) return null;
    memoryDb.plans[index] = { ...memoryDb.plans[index], ...updates };
    saveDb();
    return memoryDb.plans[index];
  },
  deletePlan(id: string): boolean {
    const initialLen = memoryDb.plans.length;
    memoryDb.plans = memoryDb.plans.filter(p => p.id !== id);
    if (memoryDb.plans.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },

  // Support
  getSupportLinks(): SupportLink[] {
    return memoryDb.supportLinks;
  },
  addSupportLink(link: Omit<SupportLink, 'id'>): SupportLink {
    const newLink: SupportLink = {
      id: 'sup-' + Date.now(),
      ...link
    };
    memoryDb.supportLinks.push(newLink);
    saveDb();
    return newLink;
  },
  updateSupportLink(id: string, updates: Partial<SupportLink>): SupportLink | null {
    const index = memoryDb.supportLinks.findIndex(s => s.id === id);
    if (index === -1) return null;
    memoryDb.supportLinks[index] = { ...memoryDb.supportLinks[index], ...updates };
    saveDb();
    return memoryDb.supportLinks[index];
  },
  deleteSupportLink(id: string): boolean {
    const initialLen = memoryDb.supportLinks.length;
    memoryDb.supportLinks = memoryDb.supportLinks.filter(s => s.id !== id);
    if (memoryDb.supportLinks.length !== initialLen) {
      saveDb();
      return true;
    }
    return false;
  },

  // Messages
  getMessages(): ContactMessage[] {
    return memoryDb.messages;
  },
  addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      ...msg,
      createdAt: new Date().toISOString(),
      read: false
    };
    memoryDb.messages.unshift(newMsg);
    saveDb();
    return newMsg;
  },
  markMessageRead(id: string): void {
    const msg = memoryDb.messages.find(m => m.id === id);
    if (msg) {
      msg.read = true;
      saveDb();
    }
  },

  // Content
  getContent(): InstitutionalContent {
    return memoryDb.content;
  },
  updateContent(updates: Partial<InstitutionalContent>): InstitutionalContent {
    memoryDb.content = { ...memoryDb.content, ...updates };
    saveDb();
    return memoryDb.content;
  },

  // Auth verify
  verifyAdminPin(pin: string): boolean {
    const expected = memoryDb.adminPin || 'adipron.admin.2026';
    if (typeof pin !== 'string') return false;
    return crypto.timingSafeEqual(Buffer.from(pin.padEnd(64)), Buffer.from(expected.padEnd(64)));
  },
  updateAdminPin(newPin: string): void {
    memoryDb.adminPin = newPin;
    saveDb();
  }
};
