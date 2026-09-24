export type DownloadCategory = 'adipron' | 'pdv_adipron' | 'dll_adipron' | 'schemas' | 'fireboard_20';

export interface DownloadItem {
  id: string;
  name: string;
  category: DownloadCategory;
  description: string;
  type: 'EXE' | 'PDF' | 'ZIP' | 'MSI' | 'DLL' | 'XML' | 'RAR' | 'OUTRO';
  size: string;
  version: string;
  date: string;
  filename: string;
  downloadUrl?: string;
  downloadsCount?: number;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  websiteUrl?: string;
  active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  benefits: string[];
  contactButtonText: string;
  highlighted?: boolean;
}

export interface SupportLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'remoto' | 'manual' | 'ferramenta' | 'tutorial' | 'externo';
  badge?: string;
  buttonText: string;
  isExternal: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface InstitutionalContent {
  heroTitle: string;
  heroTagline: string;
  heroDescription: string;
  aboutTitle: string;
  aboutText1: string;
  aboutText2: string;
  phone: string;
  phoneFormatted: string;
  whatsappInternational: string;
  email: string;
}
