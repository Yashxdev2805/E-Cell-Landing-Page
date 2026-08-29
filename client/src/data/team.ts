export interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: 'core' | 'tech' | 'marketing' | 'content' | 'design' | 'social' | 'faculty';
  avatarUrl?: string;
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
}

export const domainLabels: Record<TeamMember['domain'], string> = {
  core: 'Core Council',
  tech: 'Web & Tech',
  marketing: 'Marketing & Outreach',
  content: 'Content Writing',
  design: 'Graphic Design',
  social: 'Social & Media',
  faculty: 'Faculty Advisory',
};

export const teamMembers: TeamMember[] = [
  // ── CORE LEADERSHIP ──
  {
    id: 'tanishq-garg',
    name: 'Tanishq Garg',
    role: 'Team Lead',
    domain: 'core',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/tanishq.fef2193cfedd55364389.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/tanishq-garg-a6288822b',
      twitter: 'https://twitter.com/a_GARG_product',
      github: 'https://github.com/tanishqgarg002',
      instagram: 'https://instagram.com/its.me_tanishq.garg',
    },
  },
  {
    id: 'kanishka-mittal',
    name: 'Kanishka Mittal',
    role: 'Co-Lead',
    domain: 'core',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/kanishka.12bba16910b10b21492f.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/kanishka-mittal/',
      twitter: 'https://twitter.com/KanishkaMittal_',
      instagram: 'https://www.instagram.com/kanishkamittal_/',
    },
  },
  {
    id: 'gajender-yadav',
    name: 'Gajender Yadav',
    role: 'Core Executive',
    domain: 'core',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/gajenderyadav.ff619fb25637a418b26c.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/gajender-yadav-0b1a13203',
      instagram: 'https://instagram.com/gajender__yadav__',
    },
  },

  // ── WEB & TECH ──
  {
    id: 'aman-kumar',
    name: 'Aman Kumar',
    role: 'Web Developer Lead',
    domain: 'tech',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/Aman.4a0e8547ae7211c395f8.png',
    socials: {
      linkedin: 'https://linkedin.com/in/aman-kumar-Aman2104',
      github: 'https://github.com/Aman2104',
      twitter: 'https://twitter.com/codeyatri21',
      instagram: 'https://www.instagram.com/codeyatri21/',
    },
  },
  {
    id: 'arvind-yadav',
    name: 'Arvind Yadav',
    role: 'Web Developer Lead',
    domain: 'tech',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/Arjav.a1b5e2569d7e914c8943.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ayarwind',
      github: 'https://www.github.com/ayarvind',
      twitter: 'https://twitter.com/ayarvind_6368',
      instagram: 'https://www.instagram.com/ayarwind',
    },
  },
  {
    id: 'himanshu-sinha',
    name: 'Himanshu Sinha',
    role: 'Web Developer',
    domain: 'tech',
    socials: {
      linkedin: 'https://www.linkedin.com/in/himanshu-sinha-b4a884236/',
      github: 'https://github.com/himanshus1nha',
      twitter: 'https://x.com/Himanshu_S1nha',
    },
  },
  {
    id: 'gaurav-rathour',
    name: 'Gaurav Rathour',
    role: 'Web Developer',
    domain: 'tech',
    socials: {
      linkedin: 'https://www.linkedin.com/in/gaurav-rathour-85b878264/',
      instagram: 'https://www.instagram.com/mr.gaurav_rathour/',
    },
  },
  {
    id: 'shankar-malik',
    name: 'Shankar Malik',
    role: 'Web Developer',
    domain: 'tech',
    socials: {
      linkedin: 'https://www.linkedin.com/in/shankarmalik002',
      github: 'https://github.com/Shankarmalik002',
      instagram: 'https://instagram.com/shankarmalik002',
    },
  },

  // ── MARKETING & PROMOTIONS ──
  {
    id: 'naman-saini',
    name: 'Naman Saini',
    role: 'Marketing & Promotions Lead',
    domain: 'marketing',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/naman.726e441a13f047f7a35c.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/naman-saini-615279225',
      github: 'https://github.com/Naman29saini',
      twitter: 'https://twitter.com/naman29saini',
      instagram: 'https://instagram.com/naman29saini',
    },
  },
  {
    id: 'arjav-verma',
    name: 'Arjav Verma',
    role: 'Marketing & Research Lead',
    domain: 'marketing',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/Arjav.a1b5e2569d7e914c8943.png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/arjav-verma',
      twitter: 'https://twitter.com/verma_arjav',
      instagram: 'https://instagram.com/arjav_verma',
    },
  },
  {
    id: 'priyanshu-joshi',
    name: 'Priyanshu Joshi',
    role: 'Promotions & Outreach Lead',
    domain: 'marketing',
    socials: {
      linkedin: 'https://www.linkedin.com/in/priyanshu-joshi-b49247259',
      github: 'https://github.com/priyanshu9046',
      twitter: 'https://x.com/ArshJoshi152153',
      instagram: 'https://instagram.com/pianistarshjoshi',
    },
  },

  // ── CONTENT WRITING ──
  {
    id: 'prashant-kumar',
    name: 'Prashant Kumar',
    role: 'Content Writer Lead',
    domain: 'content',
    socials: {},
  },
  {
    id: 'khushi-dixit',
    name: 'Khushi Dixit',
    role: 'Content Writer Lead',
    domain: 'content',
    socials: {
      linkedin: 'https://www.linkedin.com/in/khushi-dixit-19257021a',
      instagram: 'https://instagram.com/__khushidixit',
    },
  },
  {
    id: 'umakshi-sharma',
    name: 'Umakshi Sharma',
    role: 'Content Writer',
    domain: 'content',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/umakshi.603fb5598b54865e6e09.png',
    socials: {
      linkedin: 'http://www.linkedin.com/in/umakshi-sharma-163302206',
      github: 'https://github.com/Umakshi12',
    },
  },
  {
    id: 'khushi-gupta',
    name: 'Khushi Gupta',
    role: 'Content Writer',
    domain: 'content',
    socials: {
      linkedin: 'https://www.linkedin.com/in/khushirm',
      github: 'https://github.com/khushirm',
      instagram: 'https://instagram.com/kuhu_gupta001',
    },
  },
  {
    id: 'dipanshu-verma',
    name: 'Dipanshu Verma',
    role: 'Content Writer',
    domain: 'content',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/dipanshu.36d101e6f9619bc02eeb.jpg',
    socials: {
      instagram: 'https://instagram.com/great_dipanshu',
    },
  },

  // ── GRAPHIC DESIGN ──
  {
    id: 'sahil-chandna',
    name: 'Sahil Chandna',
    role: 'Graphic Designer Lead',
    domain: 'design',
    socials: {
      linkedin: 'https://www.linkedin.com/in/sahilchandna/',
      github: 'https://github.com/sahilchandna60/',
      twitter: 'https://twitter.com/SahilChandna_',
      instagram: 'https://www.instagram.com/sahil_chandna_/',
    },
  },
  {
    id: 'jagriti',
    name: 'Jagriti',
    role: 'Graphic Designer Lead',
    domain: 'design',
    socials: {},
  },
  {
    id: 'aditi-kumari',
    name: 'Aditi Kumari',
    role: 'Graphic Designer',
    domain: 'design',
    socials: {},
  },
  {
    id: 'tanuj-kumar',
    name: 'Tanuj Kumar',
    role: 'Graphic Designer',
    domain: 'design',
    socials: {
      instagram: 'https://instagram.com/_tanuj_k',
    },
  },

  // ── SOCIAL & MEDIA ──
  {
    id: 'ansh-kaushik',
    name: 'Ansh Kaushik',
    role: 'Social Media Manager',
    domain: 'social',
    socials: {
      instagram: 'https://instagram.com/anshkaushik625',
    },
  },
  {
    id: 'jay-verma',
    name: 'Jay Verma',
    role: 'Social Media Coordinator',
    domain: 'social',
    socials: {
      linkedin: 'https://www.linkedin.com/in/jay-verma-a24275205',
      github: 'https://github.com/vermajay',
    },
  },
  {
    id: 'ansheka-pandita',
    name: 'Ansheka Pandita',
    role: 'Social Media Coordinator',
    domain: 'social',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ansheka-pandita-353487276',
      instagram: 'https://instagram.com/ansheka_pandita',
    },
  },
  {
    id: 'aayush-saini',
    name: 'Aayush Saini',
    role: 'Social Media Coordinator',
    domain: 'social',
    socials: {
      instagram: 'https://instagram.com/_.aayushsaini_',
    },
  },
  {
    id: 'kaushal-kumar',
    name: 'Kaushal Kumar',
    role: 'Video Editor Lead',
    domain: 'social',
    socials: {
      instagram: 'https://www.instagram.com/i.hardeeppp',
    },
  },
  {
    id: 'shyam-singh',
    name: 'Shyam Singh',
    role: 'Video Editor',
    domain: 'social',
    socials: {
      linkedin: 'https://www.linkedin.com/in/Shyamsingh070703/',
    },
  },

  // ── FACULTY ADVISORY BOARD ──
  {
    id: 'prof-sunil-dhingra',
    name: 'Prof. Sunil Dhingra',
    role: 'Director, UIET & Head, IIC',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/direc.990a53616fac14413f86.png',
    socials: {},
  },
  {
    id: 'dr-vishal-ahlawat',
    name: 'Dr. Vishal Ahlawat',
    role: 'IIC President & Coordinator, CIC',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/teacher-1.e2f140193dae687aea21.png',
    socials: {},
  },
  {
    id: 'dr-kulvinder-singh',
    name: 'Dr. Kulvinder Singh',
    role: 'Nodal Officer, CIC',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/teacher-2.42d5b7b6a71e550293ce.png',
    socials: {},
  },
  {
    id: 'dr-sunil-nain',
    name: 'Dr. Sunil Nain',
    role: 'Vice President, IIC',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/teacher-7.2f5293500bc257c657da.png',
    socials: {},
  },
  {
    id: 'dr-sanjay-kajal',
    name: 'Dr. Sanjay Kajal',
    role: 'Convener, IIC',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/sanjay.3103d538c44c5c790c47.png',
    socials: {},
  },
  {
    id: 'dr-sanjeev-ahuja',
    name: 'Dr. Sanjeev Ahuja',
    role: 'Innovation Activity Coordinator',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/sanjeev.54ec564a9b6d498a5fbe.png',
    socials: {},
  },
  {
    id: 'dr-nikhil-marriwala',
    name: 'Dr. Nikhil Marriwala',
    role: 'Start-up Activity Coordinator',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/nikhil.31b49b04f50c7242e972.png',
    socials: {},
  },
  {
    id: 'dr-deepak-malik',
    name: 'Dr. Deepak Malik',
    role: 'Internship Activity Coordinator',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/DM.7ba07a8014b3c2ecca1a.png',
    socials: {},
  },
  {
    id: 'dr-shivani-chauhan',
    name: 'Dr. Shivani Chauhan',
    role: 'IPR Activity Coordinator',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/SC.e8314df9e5d74bf12be3.png',
    socials: {},
  },
  {
    id: 'dr-seema',
    name: 'Dr. Seema',
    role: 'Social Media Coordinator',
    domain: 'faculty',
    avatarUrl: 'https://ecelluietkuk.web.app/static/media/SS.cf7b59b7d0cc243948d1.png',
    socials: {},
  },
];
