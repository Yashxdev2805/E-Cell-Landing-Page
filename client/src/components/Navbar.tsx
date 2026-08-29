import { useState, useEffect, memo } from 'react';
import { Menu, X, ArrowRight, Flame } from 'lucide-react';
import { useSectionObserver } from '../hooks/useIntersectionObserver';

interface NavbarProps {
  onJoinClick: () => void;
  currentView: 'home' | 'past-events' | 'gallery';
  onNavigate: (view: 'home' | 'past-events' | 'gallery') => void;
}

const NAV_SECTIONS = ['hero', 'about', 'events', 'tracker', 'team', 'contact'];

export const Navbar = memo(function Navbar({ onJoinClick, currentView, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useSectionObserver(NAV_SECTIONS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSectionClick = (id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleHomeClick = () => {
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#060913]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleHomeClick}
          >
            <img
              src="/ecell-logo.png"
              alt="E-Cell UIET KUK Logo"
              width={44}
              height={44}
              className="h-10 sm:h-11 w-auto object-contain rounded-md transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block pl-2 border-l border-slate-700">
              <p className="text-sm font-bold text-white font-heading">E-Cell UIET KUK</p>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                Entrepreneurship Cell
              </p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={handleHomeClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home' && activeSection === 'hero'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleSectionClick('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home' && activeSection === 'about'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleSectionClick('events')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home' && activeSection === 'events'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              E-Summit '26
            </button>

            {/* In-Page View: Past Events */}
            <button
              onClick={() => { onNavigate('past-events'); setMobileOpen(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'past-events'
                  ? 'text-amber-400 bg-amber-500/15'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Past Events
            </button>

            {/* In-Page View: Gallery */}
            <button
              onClick={() => { onNavigate('gallery'); setMobileOpen(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'gallery'
                  ? 'text-blue-400 bg-blue-500/15'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => handleSectionClick('team')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home' && activeSection === 'team'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Team
            </button>

            <button
              onClick={() => handleSectionClick('tracker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'home' && activeSection === 'tracker'
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Track Status
            </button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://esummituietkuk.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              E-Summit '26
            </a>
            <button onClick={onJoinClick} className="btn-primary text-xs py-2 px-4">
              <span>Join E-Cell</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-[#0a0e18] border-l border-slate-800 p-6 pt-20 flex flex-col gap-2 animate-fade-in-up">
            <button
              onClick={handleHomeClick}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'home' ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleSectionClick('about')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleSectionClick('events')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
            >
              E-Summit '26
            </button>
            <button
              onClick={() => { onNavigate('past-events'); setMobileOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'past-events' ? 'text-amber-400 bg-amber-500/15' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Past Events
            </button>
            <button
              onClick={() => { onNavigate('gallery'); setMobileOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'gallery' ? 'text-blue-400 bg-blue-500/15' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => handleSectionClick('team')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
            >
              Team
            </button>
            <button
              onClick={() => handleSectionClick('tracker')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
            >
              Track Status
            </button>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3">
              <a
                href="https://esummituietkuk.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                E-Summit '26 Portal
              </a>
              <button
                onClick={() => { onJoinClick(); setMobileOpen(false); }}
                className="btn-primary text-sm py-3 justify-center"
              >
                <span>Join E-Cell</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
