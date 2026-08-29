import { memo } from 'react';
import {
  Mail,
  MapPin,
  ExternalLink,
  Lock,
} from 'lucide-react';
import type { PageView } from '../App';

interface FooterProps {
  onContactClick: () => void;
  onNavigate: (view: PageView) => void;
  onOpenAdminOps?: () => void;
}

export const Footer = memo(function Footer({ onContactClick, onNavigate, onOpenAdminOps }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05070d] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
                E
              </span>
              <span className="font-heading font-black text-lg text-white">
                E-Cell UIET KUK
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              Entrepreneurship Cell, University Institute of Engineering & Technology, Kurukshetra University.
              Incubating student innovations, hosting flagship hackathons, and fostering venture leadership.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('past-events')} className="hover:text-amber-300 transition-colors cursor-pointer">
                  Past Events Archive (33+)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-blue-300 transition-colors cursor-pointer">
                  Innovation Gallery
                </button>
              </li>
              <li>
                <a
                  href="https://esummituietkuk.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  E-Summit '26 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates & Contacts */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Campus Office</h4>
            <p className="text-xs text-slate-400 flex items-start gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>UIET, Kurukshetra University, Kurukshetra, Haryana — 136119</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>ecell@uietkuk.ac.in</span>
            </p>
            <button
              onClick={onContactClick}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition-colors cursor-pointer"
            >
              Send Inquiries
            </button>
          </div>
        </div>

        {/* Bottom Bar with Admin Ops Trigger */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} E-Cell UIET Kurukshetra University. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdminOps}
              className="text-[11px] text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer font-mono"
            >
              <Lock className="w-3 h-3" /> Admin Ops
            </button>
            <a href="https://ecelluietkuk.web.app/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">
              Legacy Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});
