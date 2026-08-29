export interface EcellEvent {
  id: string;
  title: string;
  tagline?: string;
  date: string;
  dateDisplay: string;
  venue: string;
  description: string;
  category: 'flagship' | 'hackathon' | 'competition' | 'pitch' | 'networking' | 'workshop';
  isFlagship: boolean;
  registrationUrl: string;
  highlights?: string[];
  coordinators?: { name: string; phone: string }[];
}

export const events: EcellEvent[] = [
  {
    id: 'esummit-2026',
    title: 'E-Summit 2026 — Igniting The Shift',
    tagline: 'IGNITING THE SHIFT 🔥',
    date: '2026-10-07',
    dateDisplay: '7–8 October 2026',
    venue: 'UIET, Kurukshetra University',
    description: 'A two-day flagship entrepreneurial experience packed with high-stakes hackathons, live simulations, investor pitching, workshops, and premier networking with founders & venture capitalists.',
    category: 'flagship',
    isFlagship: true,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
    highlights: [
      '💻 36-Hour Hackathon',
      '🏏 IPL Auction Simulation',
      '📈 Virtual Stock Market',
      '💡 The Golden Pitch',
      '🎤 Pitch Please',
      '🤝 Network Arena',
      '🧠 Workshop Sessions',
    ],
    coordinators: [
      { name: 'Diksha', phone: '+91 9996839407' },
      { name: 'Riyanshi Varshney', phone: '+91 91936 26076' },
    ],
  },
  {
    id: 'hackathon-36h',
    title: '36-Hour Hackathon',
    date: '2026-10-07',
    dateDisplay: '7–8 Oct 2026',
    venue: 'UIET CS Labs & Innovation Hub',
    description: 'Build, innovate & pitch your technological solutions to real-world industry problems in an intensive 36-hour sprint with guidance from experienced mentors.',
    category: 'hackathon',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
  {
    id: 'ipl-auction',
    title: 'IPL Auction Simulation',
    date: '2026-10-07',
    dateDisplay: '7 Oct 2026',
    venue: 'Seminar Hall 1, UIET KUK',
    description: 'Test your sports business acumen, dynamic bidding strategy, budget allocation, and team management skills under high-stakes simulated pressure.',
    category: 'competition',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
  {
    id: 'virtual-stock-market',
    title: 'Virtual Stock Market',
    date: '2026-10-08',
    dateDisplay: '8 Oct 2026',
    venue: 'Virtual & Computing Labs, UIET',
    description: 'Real-time financial trading simulation to test your market analytics, portfolio balancing, valuation instincts, and decision-making.',
    category: 'competition',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
  {
    id: 'golden-pitch',
    title: 'The Golden Pitch & Pitch Please',
    date: '2026-10-08',
    dateDisplay: '8 Oct 2026',
    venue: 'UIET Main Auditorium',
    description: 'Present breakthrough ideas and prototype demos directly to angel investors, VC funds, and industry veterans to unlock funding, grants, and incubation.',
    category: 'pitch',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
  {
    id: 'network-arena',
    title: 'Network Arena',
    date: '2026-10-08',
    dateDisplay: '8 Oct 2026',
    venue: 'Innovation Hub & Networking Lounge',
    description: 'Curated matchmaking arena connecting student entrepreneurs with seasoned founders, industry executives, angel investors, and cross-campus innovators.',
    category: 'networking',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
  {
    id: 'workshop-session',
    title: 'Executive Workshop Sessions',
    date: '2026-10-07',
    dateDisplay: '7–8 Oct 2026',
    venue: 'Smart Classrooms, UIET',
    description: 'Learn practical execution frameworks, go-to-market strategies, and venture building insights directly from accomplished entrepreneurs.',
    category: 'workshop',
    isFlagship: false,
    registrationUrl: 'https://esummituietkuk.netlify.app/',
  },
];
