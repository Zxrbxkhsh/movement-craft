import React from 'react';
import { Flame, CloudFog, Sparkles, Heart, Music, Video, Scroll, Gift } from 'lucide-react';
import { AddonItem } from '../types';

interface AddonsSectionProps {
  addons: AddonItem[];
  onOpenCustomizer: () => void;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({ addons, onOpenCustomizer }) => {
  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAddonIcon = (name: string) => {
    if (name.includes('Pyro')) return <Flame className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Smoke') || name.includes('Ice')) return <CloudFog className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Neon')) return <Sparkles className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Roses')) return <Heart className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Guitarist')) return <Music className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Drone')) return <Video className="w-5 h-5 text-[#F5D77F]" />;
    if (name.includes('Love') || name.includes('Scroll')) return <Scroll className="w-5 h-5 text-[#F5D77F]" />;
    return <Gift className="w-5 h-5 text-[#F5D77F]" />;
  };

  return (
    <section id="addons" className="py-20 bg-[#0A0A0A] border-b border-[#D4AF37]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-[#F5D77F] uppercase tracking-widest font-semibold">
            Elevate Any Package
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Grand <span className="text-gold-gradient">Special Add-Ons</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Enhance your celebration with cold pyrotechnics, dreamy dry-ice fog entries, 
            live acoustic serenades, or drone cinematography.
          </p>
        </div>

        {/* Addons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="p-5 rounded-xl bg-[#12110D] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#1D1910] border border-[#D4AF37]/30 flex items-center justify-center">
                  {getAddonIcon(addon.name)}
                </div>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white">
                    {addon.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#D4AF37]/15 flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">Add-on cost</span>
                <span className="text-base font-bold text-[#F5D77F] font-sans tabular-nums">
                  +{formatInr(addon.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout action to open Customizer */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenCustomizer}
            className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#AA820A] text-black font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-98 transition-all shadow-lg gold-glow cursor-pointer"
          >
            Open Interactive Package Customizer
          </button>
        </div>

      </div>
    </section>
  );
};
