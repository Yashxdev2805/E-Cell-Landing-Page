# E-Cell UIET KUK — Official Web Portal & E-Summit '26 Hub

Welcome to the official repository for the **Entrepreneurship Cell (E-Cell)** at the **University Institute of Engineering & Technology (UIET), Kurukshetra University**.

This web portal serves as our central hub for fostering campus startups, announcing hackathons and speaker sessions, showcasing student innovations, and managing registrations for our flagship annual festival — **E-Summit 2026: “IGNITING THE SHIFT”**.

---

## 🌟 What's Inside

- **E-Summit 2026 Spotlight:** Dedicated showcase for our upcoming flagship summit (Oct 7–8, 2026 at UIET KUK). Includes countdown timer, direct access to the [official registration portal](https://esummituietkuk.netlify.app/), track details (36-Hour Hackathon, IPL Auction, Virtual Stock Market, The Golden Pitch, and more), and direct coordinator contact chips.
- **In-Page Past Events Archive:** Browse through 33+ real past events (Smart India Hackathons, Innovate-A-Thon, Kavach, IPR & Patent Filing sessions, Shark Tank UIET) with search and year filters (2019–2023).
- **Interactive Innovation Gallery:** 18 documented projects and event photos from the Online Innovation Contest (OIC), SIH mentorship rounds, and founder bootcamps with a full-screen lightbox preview.
- **Council Recruitment Wizard:** Multi-step application modal for UIET students to join the E-Cell team with branch selection, 9-digit roll number validation, domain preferences, and multi-link portfolio inputs (GitHub, LinkedIn, Behance, Drive).
- **Application Status Tracker:** Instant lookup tool for applicants to track recruitment or event submission status with debounced queries and real-time tab sync.
- **Meet the Team:** Real roster featuring our Faculty Advisory Board (Prof. Sunil Dhingra, Dr. Vishal Ahlawat, Dr. Kulvinder Singh) and student leads across Web & Tech, Marketing, Content, Graphic Design, and Media.

---

## 🛠️ Tech Stack

We built this portal focusing on high performance, zero layout shift (CLS = 0), and clean vanilla styling:

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS + custom CSS design tokens (`index.css`)
- **Icons:** Lucide React
- **Tab-to-Tab Synchronization:** Custom `BroadcastChannel` bus (`crossAppEvents.ts`) with `localStorage` fallback
- **CI/CD:** GitHub Actions workflow for automated typechecking, builds, and GitHub Pages deployment

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine:
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ecell-uiet-kuk/ecell-landing-page.git
   cd ecell-landing-page
   ```

2. **Navigate to the client directory and install dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```text
   http://localhost:5174/
   ```

---

## 📦 Project Structure

```text
E-Cell Landing Page/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated TypeScript & build checks
│       ├── deploy-pages.yml     # Automated deployment to GitHub Pages
│       └── security-audit.yml   # Dependency vulnerability scanner
├── client/
│   ├── public/
│   │   ├── ecell-logo.png       # Official E-Cell UIET KUK insignia
│   │   └── uiet-building.jpg    # UIET Kurukshetra campus facade
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Sticky navigation with active scroll tracking
│   │   │   ├── HeroSection.tsx        # Hero banner with live counters & E-Summit pill
│   │   │   ├── AboutSection.tsx       # Mission, vision, and animated KPI metrics
│   │   │   ├── EventsSection.tsx      # Upcoming events & flagship E-Summit card
│   │   │   ├── PastEventsView.tsx     # In-page searchable archive of 33 past events
│   │   │   ├── GalleryView.tsx        # In-page photo gallery with lightbox viewer
│   │   │   ├── ApplicationTracker.tsx # Status search with masked results
│   │   │   ├── TeamSection.tsx        # Council & faculty board tabs with photo backdrop
│   │   │   ├── JoinModal.tsx          # 3-step council recruitment wizard
│   │   │   ├── ContactModal.tsx       # General queries & sponsorship popup
│   │   │   └── Footer.tsx             # Collegiate footer with coordinator contacts
│   │   ├── data/
│   │   │   ├── events.ts              # E-Summit 2026 tracks & upcoming calendar
│   │   │   ├── pastEvents.ts          # Archive records (2019-2023)
│   │   │   ├── gallery.ts             # Innovation photos and descriptions
│   │   │   └── team.ts                # Council leads and faculty mentors
│   │   ├── hooks/
│   │   │   ├── useIntersectionObserver.ts
│   │   │   └── useLocalStorageDraft.ts
│   │   ├── utils/
│   │   │   └── crossAppEvents.ts      # Real-time BroadcastChannel sync
│   │   ├── App.tsx                    # Main portal view orchestrator
│   │   ├── index.css                  # Color variables, ambient mesh, glassmorphism
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 🏗️ Building for Production

To create an optimized production build:

```bash
cd client
npm run build
```

The compiled static assets will be output to `client/dist/`, ready to be hosted on any static provider (GitHub Pages, Netlify, Vercel, Firebase Hosting).

To preview the production bundle locally:
```bash
npm run preview
```

---

## 🤝 Contributing

We welcome contributions from UIET students and open-source enthusiasts!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code passes TypeScript checks (`npm run build`) before opening a PR.

---

## 📞 Contact & Coordinators

If you have questions regarding events, council recruitment, or sponsorships:

- **E-Cell Official Email:** [ecell@uietkuk.ac.in](mailto:ecell@uietkuk.ac.in)
- **E-Summit '26 Coordinators:**
  - Diksha: [+91 99968 39407](tel:9996839407)
  - Riyanshi Varshney: [+91 91936 26076](tel:9193626076)
- **Campus Address:** University Institute of Engineering & Technology (UIET), Kurukshetra University, Kurukshetra, Haryana — 136119
- **Socials:** [Instagram](https://instagram.com/ecell_uiet_kuk) • [LinkedIn](https://www.linkedin.com/company/ecell-uiet-kuk/) • [Twitter / X](https://twitter.com/ecelluietkuk)

---

*Crafted with ❤️ by the E-Cell Tech Team, UIET Kurukshetra University.*
