import { useState, useMemo, memo } from 'react';
import {
  ArrowLeft,
  Image as ImageIcon,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { galleryItems, galleryCategories, type GalleryItem } from '../data/gallery';

interface GalleryViewProps {
  onBack: () => void;
}

// ── O(1) Precomputed Category Map ──
const galleryCategoryMap = new Map<string, GalleryItem[]>();
galleryCategoryMap.set('all', galleryItems);
galleryItems.forEach((item) => {
  if (!galleryCategoryMap.has(item.category)) {
    galleryCategoryMap.set(item.category, []);
  }
  galleryCategoryMap.get(item.category)!.push(item);
});

export const GalleryView = memo(function GalleryView({ onBack }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // O(1) Array slice retrieval
  const filteredItems = useMemo(() => {
    return galleryCategoryMap.get(selectedCategory) || galleryItems;
  }, [selectedCategory]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs font-semibold cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Hub</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Showing <strong className="text-white">{filteredItems.length}</strong> Moments
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-4">
          <ImageIcon className="w-3.5 h-3.5" /> Moments of Innovation
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
          Life & Innovations at E-Cell
        </h1>
        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          From late-night hackathon coding marathons to national stage victory ceremonies — a visual journey of UIET student builders.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {galleryCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="ecell-card overflow-hidden group cursor-pointer bg-[#0c1220] border-slate-800 hover:border-blue-500/40 transition-all duration-300 relative flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="p-3 rounded-full bg-blue-600 text-white shadow-xl scale-75 group-hover:scale-100 transition-transform">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white font-heading mt-1 line-clamp-1">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0a0e18] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black flex items-center justify-center">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-full max-w-full object-contain"
              />

              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 bg-[#0a0e18]">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="text-lg font-bold text-white font-heading">{activeItem.title}</h3>
                <span className="text-xs text-slate-500 font-mono">
                  {(lightboxIndex ?? 0) + 1} / {filteredItems.length}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{activeItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
