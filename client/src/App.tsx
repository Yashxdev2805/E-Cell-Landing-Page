import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EventsSection } from './components/EventsSection';
import { ApplicationTracker } from './components/ApplicationTracker';
import { TeamSection } from './components/TeamSection';
import { PastEventsView } from './components/PastEventsView';
import { GalleryView } from './components/GalleryView';
import { JoinModal } from './components/JoinModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';

export type AppView = 'home' | 'past-events' | 'gallery';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [joinOpen, setJoinOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const handleNavigate = useCallback((view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-slate-100 relative selection:bg-blue-600 selection:text-white">
      {/* ── Fixed Page-Wide Ambient Radiant Background Mesh & Dot Grid (Seamless across all views) ── */}
      <div className="fixed inset-0 portal-bg-mesh pointer-events-none opacity-90 z-0" />

      {/* Navigation */}
      <Navbar
        onJoinClick={openJoin}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="relative z-10">
        {/* VIEW 1: HOME MAIN PORTAL */}
        {currentView === 'home' && (
          <>
            {/* Hero */}
            <HeroSection onJoinClick={openJoin} />

            <div className="section-divider" />

            {/* About & KPI Counters */}
            <AboutSection />

            <div className="section-divider" />

            {/* Events Showcase */}
            <EventsSection />

            <div className="section-divider" />

            {/* Application Tracker */}
            <ApplicationTracker />

            <div className="section-divider" />

            {/* Executive Board */}
            <TeamSection />

            <div className="section-divider" />

            {/* Contact Section CTA */}
            <section id="contact" className="section-container">
              <div className="ecell-card p-8 sm:p-12 text-center bg-gradient-to-br from-[#0d111a] via-[#0f1520] to-[#0d111a]">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-4">
                  Have Questions or Want to Sponsor?
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-8">
                  Whether you're a student looking to get involved, a startup seeking mentorship,
                  or an organization interested in sponsoring our events — we'd love to hear from you.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button onClick={openJoin} className="btn-primary text-sm py-3 px-6">
                    Join E-Cell
                  </button>
                  <button onClick={openContact} className="btn-secondary text-sm py-3 px-6">
                    Contact Us
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: PAST EVENTS ARCHIVE (In-Page View) */}
        {currentView === 'past-events' && (
          <PastEventsView onBack={() => handleNavigate('home')} />
        )}

        {/* VIEW 3: PHOTO GALLERY (In-Page View) */}
        {currentView === 'gallery' && (
          <GalleryView onBack={() => handleNavigate('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals — focus-trapped <dialog> elements */}
      <JoinModal isOpen={joinOpen} onClose={closeJoin} />
      <ContactModal isOpen={contactOpen} onClose={closeContact} />
    </div>
  );
}
