import { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Code2,
  Share2,
  PenTool,
  Palette,
  Video,
  GraduationCap,
  Link2,
} from 'lucide-react';
import { teamMembers, type TeamMember } from '../data/team';

type DomainTab = TeamMember['domain'];

const TABS: { key: DomainTab; label: string; icon: React.ElementType }[] = [
  { key: 'core', label: 'Core Leadership', icon: ShieldCheck },
  { key: 'tech', label: 'Web & Tech', icon: Code2 },
  { key: 'marketing', label: 'Marketing & Outreach', icon: Share2 },
  { key: 'content', label: 'Content Writing', icon: PenTool },
  { key: 'design', label: 'Graphic Design', icon: Palette },
  { key: 'social', label: 'Social & Media', icon: Video },
  { key: 'faculty', label: 'Faculty Advisory', icon: GraduationCap },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function MemberCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="ecell-card p-6 flex flex-col items-center text-center group hover:border-blue-400/60 bg-[#070b16]/80 hover:bg-[#070b16]/90 backdrop-blur-lg transition-all duration-300 shadow-2xl border border-white/15">
      {/* Avatar Container with fixed 1:1 aspect ratio to guarantee CLS = 0 */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600/80 group-hover:border-blue-400/80 transition-all flex items-center justify-center shadow-lg relative">
        {member.avatarUrl && !imgError ? (
          <img
            src={member.avatarUrl}
            alt={member.name}
            width={112}
            height={112}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xl sm:text-2xl font-extrabold text-blue-400 font-heading tracking-wider">
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <h4 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-blue-300 transition-colors">
        {member.name}
      </h4>

      <p className="text-xs font-semibold text-amber-400 font-mono mt-1 mb-3">
        {member.role}
      </p>

      {/* Social Links */}
      <div className="mt-auto pt-3 flex items-center gap-2 border-t border-white/10 w-full justify-center">
        {member.socials.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-blue-500/25 text-slate-300 hover:text-blue-400 transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <Link2 className="w-3.5 h-3.5" />
          </a>
        )}
        {member.socials.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label={`${member.name} GitHub`}
          >
            <Code2 className="w-3.5 h-3.5" />
          </a>
        )}
        {member.socials.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-pink-500/25 text-slate-300 hover:text-pink-400 transition-colors"
            aria-label={`${member.name} Instagram`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </a>
        )}
        {!member.socials.linkedin && !member.socials.github && !member.socials.instagram && (
          <span className="text-[11px] text-slate-400 font-mono">UIET KUK</span>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const [activeTab, setActiveTab] = useState<DomainTab>('core');

  const membersByDomain = useMemo(() => {
    return teamMembers.filter((m) => m.domain === activeTab);
  }, [activeTab]);

  return (
    <section id="team" className="relative py-28 overflow-hidden w-full content-auto">
      {/* ── UIET Kurukshetra Building Photo Background Layer (Section-Only & Clearly Visible) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/uiet-building.jpg"
          alt="UIET Kurukshetra Campus Building"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] saturate-[1.15]"
          loading="lazy"
        />
        {/* Subtle dark tint to ensure crisp text contrast while keeping the campus building clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/90 via-[#060913]/40 to-[#060913]/90" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ── Section Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060913]/85 border border-blue-400/40 text-xs font-bold text-blue-300 mb-4 backdrop-blur-md shadow-lg">
            <Users className="w-3.5 h-3.5" /> Executive Board & Council
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading mt-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Meet the E-Cell Team
          </h2>
          <p className="mt-4 text-slate-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
            The passionate student leaders, developers, designers, and faculty mentors behind E-Cell UIET,
            Kurukshetra University.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TABS.map(({ key, label, icon: Icon }) => {
            const count = teamMembers.filter((m) => m.domain === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-md shadow-md ${
                  activeTab === key
                    ? 'bg-amber-500/35 text-amber-200 border border-amber-400/60 shadow-amber-500/20'
                    : 'bg-[#060913]/75 text-slate-200 border border-white/15 hover:bg-[#060913]/90 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/60 text-slate-300 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {membersByDomain.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
