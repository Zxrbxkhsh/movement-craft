import React, { useState } from 'react';
import { Camera, ZoomIn, X, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'proposal' | 'birthday' | 'theatre' | 'midnight'>('all');

  const galleryItems = [
    {
      id: "gal-1",
      title: "Rooftop Starlight Proposal Arch",
      category: "proposal",
      tag: "Proposal",
      image: "/assets/images/surprise_romantic_proposal_1793027122863.jpg",
      location: "Beed Bypass Rooftop"
    },
    {
      id: "gal-2",
      title: "Grand Birthday with Cold Pyros & Fog",
      category: "birthday",
      tag: "Birthday",
      image: "/assets/images/surprise_birthday_celebration_1793027120311.jpg",
      location: "Private Villa, Connaught Place"
    },
    {
      id: "gal-3",
      title: "Silver Screen Theatre Tribute & Sparklers",
      category: "theatre",
      tag: "Theatre",
      image: "/assets/images/surprise_theatre_midnight_1793027123086.jpg",
      location: "Private Auditorium, Jalna Road"
    },
    {
      id: "gal-4",
      title: "Intimate Candlelight Courtyard Surprise",
      category: "midnight",
      tag: "Midnight / Cafe",
      image: "/assets/images/hero_luxury_surprise_setup_1793027122212.jpg",
      location: "Open Terrace, CIDCO"
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-[#080808] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            Visual Portfolio
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Moments <span className="text-gold-gradient">Crafted With Love</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Real setups and atmospheres designed for birthdays, anniversaries, proposals, 
            and midnight doorstep celebrations across Chhatrapati Sambhaji Nagar.
          </p>

          {/* Filter Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Setups' },
              { id: 'proposal', label: 'Romantic Proposals' },
              { id: 'birthday', label: 'Birthday Fireworks' },
              { id: 'theatre', label: 'Theatre Screenings' },
              { id: 'midnight', label: 'Midnight & Cafes' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#14130F] text-zinc-300 hover:text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item.image)}
              className="group relative rounded-2xl overflow-hidden bg-[#12110D] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag unboxed text */}
              <div className="absolute top-3 left-3 text-[11px] font-semibold text-[#F5D77F] tracking-wider uppercase drop-shadow">
                {item.tag}
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-white leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-[#D4AF37]/60 shadow-2xl bg-black">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:text-[#D4AF37] z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedPhoto}
                alt="Enlarged setup view"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
