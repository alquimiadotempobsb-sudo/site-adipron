import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { Plans } from './components/Plans.tsx';
import { Downloads } from './components/Downloads.tsx';
import { Support } from './components/Support.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsapp } from './components/FloatingWhatsapp.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { api } from './services/api.ts';
import type { Plan, SupportLink, InstitutionalContent } from './types/index.ts';

export default function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [isDownloadsAuth, setIsDownloadsAuth] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Dynamic Data
  const [content, setContent] = useState<InstitutionalContent | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      const [cont, planList, supList, authStatus] = await Promise.all([
        api.getContent(),
        api.getPlans(),
        api.getSupportLinks(),
        api.checkDownloadsAuth()
      ]);

      if (cont) setContent(cont);
      setPlans(planList);
      setSupportLinks(supList);
      setIsDownloadsAuth(authStatus);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais da aplicação:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  // Smooth navigation helper
  const navigateTo = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scrollspy active section observer (solucoes removed)
  useEffect(() => {
    const sectionIds = ['inicio', 'sobre', 'planos', 'downloads', 'suporte', 'contato'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 antialiased">
      {/* Top Bar Navigation */}
      <Navbar
        currentSection={currentSection}
        onNavigate={navigateTo}
        isDownloadsAuthenticated={isDownloadsAuth}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <div id="inicio">
          <Hero content={content} onNavigate={navigateTo} />
        </div>

        {/* Section 2: Planos (Single comprehensive plan) */}
        <Plans plans={plans} onContactClick={() => navigateTo('contato')} />

        {/* Section 4: Downloads (Protected) */}
        <Downloads
          isAuthenticated={isDownloadsAuth}
          onAuthenticationChange={setIsDownloadsAuth}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* Section 5: Suporte (Only AnyDesk & TeamViewer downloads, no manuals/printers) */}
        <Support
          supportLinks={supportLinks}
          onNavigateToDownloads={() => navigateTo('downloads')}
          onContactClick={() => navigateTo('contato')}
        />

        {/* Section 6: Contato */}
        <Contact content={content} />
      </main>

      {/* Footer */}
      <Footer
        content={content}
        onNavigate={navigateTo}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Persistent Floating WhatsApp Button */}
      <FloatingWhatsapp />

      {/* Administrative Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onDataChanged={fetchAppData}
        currentContent={content}
      />
    </div>
  );
}
