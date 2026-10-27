import React, { useState } from 'react';
import {
  Moon,
  Coffee,
  Home,
  Film,
  TreePine,
  Gem,
  Cake,
  Heart,
  Flower2,
  Gift,
  Users,
  Mail,
  Sparkles,
  Star,
  PlusCircle,
  MessageCircle
} from 'lucide-react';
import { SurpriseService, BusinessConfig } from '../types';

interface ServicesGridProps {
  services: SurpriseService[];
  config: BusinessConfig;
  onOpenCustomizerForService: (serviceName: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  config,
  onOpenCustomizerForService
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'romantic' | 'celebration' | 'family' | 'unique'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Moon': return <Moon className="w-5 h-5 text-[#D4AF37]" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-[#D4AF37]" />;
      case 'Home': return <Home className="w-5 h-5 text-[#D4AF37]" />;
      case 'Film': return <Film className="w-5 h-5 text-[#D4AF37]" />;
      case 'TreePine': return <TreePine className="w-5 h-5 text-[#D4AF37]" />;
      case 'Gem': return <Gem className="w-5 h-5 text-[#D4AF37]" />;
      case 'Cake': return <Cake className="w-5 h-5 text-[#D4AF37]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#D4AF37]" />;
      case 'Flower2': return <Flower2 className="w-5 h-5 text-[#D4AF37]" />;
      case 'Gift': return <Gift className="w-5 h-5 text-[#D4AF37]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#D4AF37]" />;
      case 'Mail': return <Mail className="w-5 h-5 text-[#D4AF37]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 'Star': return <Star className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  const filteredServices = activeFilter === 'all'
    ? services
    : services.filter(s => s.category === activeFilter);

  return (
    <section id="services" className="py-20 bg-[#080808] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            Booking Available For
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Surprise Services <span className="text-gold-gradient">Menu</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From midnight 12 AM celebrations to private theatre screenings and love letter scrolls — 
            we craft tailor-made surprise experiences for any occasion.
          </p>

          {/* Filter Bar (Functional buttons complying with Frontend Design zero-pill rules) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'romantic', label: 'Romantic & Proposals' },
              { id: 'celebration', label: 'Birthdays & Midnight' },
              { id: 'family', label: 'Family & Milestones' },
              { id: 'unique', label: 'Unique Concepts' }
            ].map((tab) => (
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

        {/* 14+ Services Grid matching Reference 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onOpenCustomizerForService(service.name)}
              className="group p-5 rounded-xl bg-[#12110D] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#1A1710] transition-all duration-300 flex flex-col justify-between cursor-pointer gold-glow-sm"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1E1A11] border border-[#D4AF37]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(service.iconName)}
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white group-hover:text-[#F5D77F] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs text-[#D4AF37] font-medium">
                <span>Plan This</span>
                <span className="text-zinc-500 group-hover:text-[#D4AF37] transition-colors">→</span>
              </div>
            </div>
          ))}

          {/* "And Many More... / Custom Surprise" card */}
          <div
            onClick={() => onOpenCustomizerForService('Custom Surprise')}
            className="p-5 rounded-xl bg-gradient-to-br from-[#1C170B] to-[#12110D] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all flex flex-col justify-between cursor-pointer gold-glow-sm group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#FFF3D1]">
                  And Many More...
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Have a unique dream concept? Tell Kuldeep your vision and we'll engineer the execution.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#F5D77F] font-semibold">
              <span>Custom Blueprint</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Consultation Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17140D] via-[#1F1A10] to-[#17140D] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              Need advice on which surprise suits your moment best?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300">
              Founder Kuldeep Rajput personally consults with you to plan every surprise detail secretly.
            </p>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Kuldeep! I need consultation to pick the best surprise event for my upcoming occasion in Chhatrapati Sambhaji Nagar.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Chat With Kuldeep</span>
          </a>
        </div>

      </div>
    </section>
  );
};
