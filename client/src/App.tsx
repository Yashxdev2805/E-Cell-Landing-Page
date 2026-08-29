import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EventsSection } from './components/EventsSection';
import { TeamSection } from './components/TeamSection';
import { ApplicationTracker } from './components/ApplicationTracker';
import { PastEventsView } from './components/PastEventsView';
import { GalleryView } from './components/GalleryView';
import { JoinModal } from './components/JoinModal';
import { ContactModal } from './components/ContactModal';
import { AdminOpsDrawer } from './components/AdminOpsDrawer';
import { Footer } from './components/Footer';

export type PageView = 'home' | 'past-events' | 'gallery';

export function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  useEffect(() => {
    const handleToggleAdmin = () => setAdminDrawerOpen((prev) => !prev);
    window.addEventListener('toggle-admin-drawer', handleToggleAdmin);
    return () => window.removeEventListener('toggle-admin-drawer', handleToggleAdmin);
  }, []);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col font-sans relative overflow-x-hidden portal-bg-mesh">
      <Navbar
        onJoinClick={() => setJoinModalOpen(true)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <HeroSection onJoinClick={() => setJoinModalOpen(true)} />
            <AboutSection />
            <EventsSection />
            <TeamSection />
            <ApplicationTracker />
          </>
        )}

        {currentView === 'past-events' && (
          <PastEventsView onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'gallery' && (
          <GalleryView onBack={() => handleNavigate('home')} />
        )}
      </main>

      <Footer
        onContactClick={() => setContactModalOpen(true)}
        onNavigate={handleNavigate}
        onOpenAdminOps={() => setAdminDrawerOpen(true)}
      />

      {/* Modals & Overlays */}
      <JoinModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
      <AdminOpsDrawer isOpen={adminDrawerOpen} onClose={() => setAdminDrawerOpen(false)} />
    </div>
  );
}

export default App;
