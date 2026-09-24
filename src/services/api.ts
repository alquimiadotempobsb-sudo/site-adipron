import type {
  DownloadItem,
  Partner,
  Plan,
  SupportLink,
  ContactMessage,
  InstitutionalContent
} from '../types/index.ts';

// In-memory token storage (NEVER saved to localStorage so password is required on every access)
let inMemoryDownloadsToken: string | null = null;
const ADMIN_TOKEN_KEY = 'adipron_admin_token';

export const api = {
  // Downloads Auth (Session-only, in-memory, never stored in localStorage)
  getDownloadsToken(): string | null {
    return inMemoryDownloadsToken;
  },
  setDownloadsToken(token: string): void {
    inMemoryDownloadsToken = token;
    // Explicitly remove from persistent storage in case any old token existed
    try {
      localStorage.removeItem('adipron_downloads_token');
      sessionStorage.removeItem('adipron_downloads_token');
    } catch {
      // ignore
    }
  },
  clearDownloadsToken(): void {
    inMemoryDownloadsToken = null;
    try {
      localStorage.removeItem('adipron_downloads_token');
      sessionStorage.removeItem('adipron_downloads_token');
    } catch {
      // ignore
    }
  },
  async loginDownloads(password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/downloads/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setDownloadsToken(data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Senha incorreta.' };
    } catch {
      return { success: false, message: 'Erro de conexão com o servidor.' };
    }
  },
  async checkDownloadsAuth(): Promise<boolean> {
    // If no in-memory token, always return false so the user must authenticate
    const token = this.getDownloadsToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/downloads/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.authenticated) {
        this.clearDownloadsToken();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Admin Auth
  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  setAdminToken(token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  clearAdminToken(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
  async loginAdmin(pin: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setAdminToken(data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Credencial inválida.' };
    } catch {
      return { success: false, message: 'Erro de conexão com o servidor.' };
    }
  },
  async checkAdminAuth(): Promise<boolean> {
    const token = this.getAdminToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  },

  // Downloads List
  async getDownloads(): Promise<{ success: boolean; data?: DownloadItem[]; requiresAuth?: boolean; message?: string }> {
    const token = this.getDownloadsToken() || this.getAdminToken();
    try {
      const res = await fetch('/api/downloads', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.status === 401) {
        return { success: false, requiresAuth: true, message: 'Autenticação necessária.' };
      }
      const data = await res.json();
      return { success: true, data };
    } catch {
      return { success: false, message: 'Erro ao carregar arquivos de download.' };
    }
  },

  // Trigger file download
  getDownloadUrl(id: string): string {
    const token = this.getDownloadsToken() || this.getAdminToken() || '';
    return `/api/downloads/${id}/file?token=${encodeURIComponent(token)}`;
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    try {
      const res = await fetch('/api/partners');
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Plans
  async getPlans(): Promise<Plan[]> {
    try {
      const res = await fetch('/api/plans');
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Support Links
  async getSupportLinks(): Promise<SupportLink[]> {
    try {
      const res = await fetch('/api/support');
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Institutional Content
  async getContent(): Promise<InstitutionalContent | null> {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Contact Form Submission
  async sendContactMessage(payload: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    website_check?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return {
        success: res.ok && data.success,
        message: data.message || (res.ok ? 'Mensagem enviada com sucesso.' : 'Erro ao enviar mensagem.')
      };
    } catch {
      return { success: false, message: 'Falha de comunicação com o servidor de envio.' };
    }
  },

  // Upload / Add new download (supports both FormData for native file upload and JSON)
  async uploadDownload(item: (Partial<DownloadItem> & { fileBase64?: string; fileContent?: string }) | FormData): Promise<{ success: boolean; data?: DownloadItem; message?: string }> {
    const token = this.getDownloadsToken() || this.getAdminToken();
    try {
      let headers: HeadersInit = {};
      let body: BodyInit;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (item instanceof FormData) {
        body = item;
        // Do not set Content-Type header manually for FormData - browser sets boundary automatically
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(item);
      }

      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers,
        body
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { message: `Erro HTTP ${res.status}: ${res.statusText}` };
      }

      if (res.ok) {
        return { success: true, data };
      }

      if (res.status === 401) {
        return { success: false, message: 'Sessão expirada ou não autorizada. Por favor, reautentique-se.' };
      }

      return { success: false, message: data.message || `Falha no envio (Código ${res.status}).` };
    } catch (err: any) {
      console.error('[uploadDownload Error]:', err);
      return { success: false, message: 'Erro de comunicação ao enviar arquivo: ' + (err?.message || 'Verifique sua conexão.') };
    }
  },

  // Delete a download item
  async deleteDownload(id: string): Promise<{ success: boolean; message?: string }> {
    const token = this.getDownloadsToken() || this.getAdminToken();
    try {
      const res = await fetch(`/api/downloads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        return { success: true, message: data.message || 'Arquivo excluído com sucesso.' };
      }
      return { success: false, message: data.message || 'Falha ao excluir o arquivo.' };
    } catch {
      return { success: false, message: 'Erro de conexão com o servidor ao excluir.' };
    }
  },

  // Admin Management Endpoints
  async adminAddDownload(item: Partial<DownloadItem>): Promise<boolean> {
    const res = await this.uploadDownload(item);
    return res.success;
  },
  async adminDeleteDownload(id: string): Promise<boolean> {
    const res = await this.deleteDownload(id);
    return res.success;
  },
  async adminAddPartner(partner: Partial<Partner>): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(partner)
    });
    return res.ok;
  },
  async adminDeletePartner(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch(`/api/partners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },
  async adminAddPlan(plan: Partial<Plan>): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(plan)
    });
    return res.ok;
  },
  async adminDeletePlan(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch(`/api/plans/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },
  async adminAddSupportLink(link: Partial<SupportLink>): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(link)
    });
    return res.ok;
  },
  async adminDeleteSupportLink(id: string): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch(`/api/support/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },
  async adminUpdateContent(content: Partial<InstitutionalContent>): Promise<boolean> {
    const token = this.getAdminToken();
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(content)
    });
    return res.ok;
  },
  async adminGetMessages(): Promise<ContactMessage[]> {
    const token = this.getAdminToken();
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
};
