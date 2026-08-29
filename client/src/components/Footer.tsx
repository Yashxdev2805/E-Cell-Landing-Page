import { Link2, Globe, Share2, Mail, ExternalLink, Heart, Phone, History, Image as ImageIcon } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'past-events' | 'gallery') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollTo = (id: string) => {
    if (onNavigate) onNavigate('home');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="w-full border-t border-slate-800 bg-[#04060C] relative z-10 content-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/ecell-logo.png" alt="E-Cell UIET KUK Logo" width={44} height={44}
                className="h-11 w-auto object-contain rounded-md" />
              <div>
                <p className="font-bold text-sm text-white font-heading">E-Cell UIET KUK</p>
                <p className="text-xs text-slate-400">Entrepreneurship Cell • UIET Kurukshetra</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Fostering student entrepreneurship, venture creation, and tech innovation at UIET, Kurukshetra University.
              Organizers of <strong>E-Summit 2026 — “IGNITING THE SHIFT”</strong>.
            </p>

            <div className="mt-2 pt-3 border-t border-slate-800/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">E-Summit 2026 Coordinators:</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300 font-mono">
                <a href="tel:9996839407" className="hover:text-amber-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" /> Diksha: 9996839407
                </a>
                <span className="text-slate-600">|</span>
                <a href="tel:9193626076" className="hover:text-amber-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" /> Riyanshi: 91936 26076
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
            {[
              { id: 'about', label: 'About E-Cell' },
              { id: 'events', label: 'E-Summit 2026' },
              { id: 'team', label: 'Executive Board' },
              { id: 'tracker', label: 'Track Application' },
            ].map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="text-xs text-slate-400 hover:text-white transition-colors text-left cursor-pointer">
                {link.label}
              </button>
            ))}

            {/* In-page page links */}
            {onNavigate && (
              <>
                <button
                  onClick={() => { onNavigate('past-events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs text-amber-400 hover:underline text-left cursor-pointer flex items-center gap-1 mt-1"
                >
                  <History className="w-3 h-3" /> Past Events Archive (33)
                </button>
                <button
                  onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs text-blue-400 hover:underline text-left cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3" /> Photo Gallery (18)
                </button>
              </>
            )}

            <a
              href="https://esummituietkuk.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 mt-1 font-semibold"
            >
              E-Summit Registration Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Connect</p>
            <div className="flex items-center gap-2">
              {[
                { icon: Link2, href: 'https://www.linkedin.com/company/ecell-uiet-kuk/', label: 'LinkedIn', hover: 'hover:text-blue-400 hover:bg-blue-500/10' },
                { icon: Globe, href: 'https://instagram.com/ecell_uiet_kuk', label: 'Instagram', hover: 'hover:text-pink-400 hover:bg-pink-500/10' },
                { icon: Share2, href: 'https://twitter.com/ecelluietkuk', label: 'Twitter', hover: 'hover:text-sky-400 hover:bg-sky-500/10' },
                { icon: Mail, href: 'mailto:ecell@uietkuk.ac.in', label: 'Email', hover: 'hover:text-amber-400 hover:bg-amber-500/10' },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 ${social.hover} transition-all`}
                  aria-label={social.label}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <a href="mailto:ecell@uietkuk.ac.in" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-2">
              ecell@uietkuk.ac.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-mono">&copy; 2026 Entrepreneurship Cell, UIET KUK. All rights reserved.</p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500" /> by E-Cell Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
}
