export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: 'oic' | 'sih' | 'workshop' | 'mystory' | 'technoxian';
  image: string;
}

export const galleryCategories: { key: GalleryItem['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All Photos (18)' },
  { key: 'oic', label: 'OIC Innovation Projects' },
  { key: 'sih', label: 'Smart India Hackathon' },
  { key: 'workshop', label: 'Workshops & Masterclasses' },
  { key: 'mystory', label: 'Founder Story Sessions' },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'OIC 2020 — Smart Farmgain System',
    description: 'IoT-enabled automated crop monitoring and precision irrigation system.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-1.f6e43ad4cae0ddfd19b8.png',
  },
  {
    id: 2,
    title: 'OIC 2020 — Sarvsahyak',
    description: 'Assistive tech platform connecting local service providers with rural citizens.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-2.0a8560838bd23e7c2179.png',
  },
  {
    id: 3,
    title: 'OIC 2020 — Vegetable Washing Machine',
    description: 'Mechanical sanitization unit designed for hygienic agricultural post-harvest cleaning.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-3.2fe6750fc8ad417dfee9.png',
  },
  {
    id: 4,
    title: 'OIC 2020 — Atenmal System',
    description: 'Smart touchless biometric attendance tracker developed during COVID pandemic period.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-4.067a62eea45eda578c70.png',
  },
  {
    id: 5,
    title: 'OIC 2020 — Fika Consult',
    description: 'Digital tele-consultation platform for student mental wellness and peer guidance.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-5.dcc6c6ef28852480e542.png',
  },
  {
    id: 6,
    title: 'OIC 2020 — Atenmal Hardware Unit',
    description: 'Embedded prototype demonstrating contactless temperature screening and log capture.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-6.ea8e689a0048c9ee43ec.png',
  },
  {
    id: 7,
    title: 'OIC 2020 — Smart Parking System',
    description: 'Sensor-based real-time slot booking and parking guidance platform for urban complexes.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-7.587aed8fb1b32f37d1f1.png',
  },
  {
    id: 8,
    title: 'OIC 2020 — Press & Media Coverage',
    description: 'UIET Kurukshetra students featured in national dailies for breakthrough innovations.',
    category: 'oic',
    image: 'https://ecelluietkuk.web.app/static/media/oic-8.6157d017c8829089cda7.png',
  },
  {
    id: 9,
    title: 'Executive Workshop in Progress',
    description: 'Interactive session on business model validation and prototype testing.',
    category: 'workshop',
    image: 'https://ecelluietkuk.web.app/static/media/gallery.730c3503c54c037c18e5.png',
  },
  {
    id: 10,
    title: 'Smart India Hackathon — Team Mentorship',
    description: 'Faculty mentors guiding hackathon participants during 36-hour sprint.',
    category: 'sih',
    image: 'https://ecelluietkuk.web.app/static/media/gallery-1.54438f89b733a42d46b6.png',
  },
  {
    id: 11,
    title: 'Smart India Hackathon — Live Coding',
    description: 'Teams building AI and web solutions under competitive hackathon conditions.',
    category: 'sih',
    image: 'https://ecelluietkuk.web.app/static/media/gallery-2.b149b927afd0bebac7c9.png',
  },
  {
    id: 12,
    title: 'Smart India Hackathon — Presentation',
    description: 'Final project demonstration in front of senior industry judges and jury.',
    category: 'sih',
    image: 'https://ecelluietkuk.web.app/static/media/gallery-3.cfca7227b983e3d8a724.png',
  },
  {
    id: 13,
    title: 'My Story: Fireside Chat Session',
    description: 'Invited founder sharing transparent experiences on startup failures and triumphs.',
    category: 'mystory',
    image: 'https://ecelluietkuk.web.app/static/media/mystory-1.fee3b570d8745d1f5eaa.png',
  },
  {
    id: 14,
    title: 'My Story: Q&A with Students',
    description: 'Engaged student innovators asking candid questions on raising pre-seed venture capital.',
    category: 'mystory',
    image: 'https://ecelluietkuk.web.app/static/media/mystory-3.b9fce59d7985b1340aa2.png',
  },
  {
    id: 15,
    title: 'Hands-on Bootcamp Session 1',
    description: 'Technical deep-dive on product management and MVP creation frameworks.',
    category: 'workshop',
    image: 'https://ecelluietkuk.web.app/static/media/workshop-1.c57b46da0fce25b1b008.png',
  },
  {
    id: 16,
    title: 'Hands-on Bootcamp Session 2',
    description: 'Design thinking workshop exploring user persona mapping and wireframing.',
    category: 'workshop',
    image: 'https://ecelluietkuk.web.app/static/media/workshop-2.7b3b05287b4164913f8f.png',
  },
  {
    id: 17,
    title: 'Hands-on Bootcamp Session 3',
    description: 'Financial modeling, revenue streams, and unit economics masterclass.',
    category: 'workshop',
    image: 'https://ecelluietkuk.web.app/static/media/workshop-3.e556e24ab08d2fc69be6.png',
  },
  {
    id: 18,
    title: 'Hands-on Bootcamp Session 4',
    description: 'Pitch deck clinic: live feedback on slide design and storytelling.',
    category: 'workshop',
    image: 'https://ecelluietkuk.web.app/static/media/workshop-4.4561943dbf146429cffd.png',
  },
];
